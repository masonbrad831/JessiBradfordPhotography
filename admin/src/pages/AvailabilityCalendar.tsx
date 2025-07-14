import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Plus, Trash2, Edit, X, Save, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface DayAvailability {
  date: string;
  isAvailable: boolean;
  timeSlots: TimeSlot[];
}

interface Preset {
  id: string;
  name: string;
  timeSlots: string[];
  isAvailable: boolean;
}

const generate30MinIntervals = (start: string, end: string) => {
  // start/end in 'HH:MM' 24hr format
  const intervals: string[] = [];
  let [h, m] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  while (h < endH || (h === endH && m <= endM)) {
    const ampm = h < 12 ? 'AM' : 'PM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m.toString().padStart(2, '0');
    intervals.push(`${displayH}:${displayM} ${ampm}`);
    m += 30;
    if (m >= 60) {
      m = 0;
      h++;
    }
  }
  return intervals;
};

const defaultTimeSlots = generate30MinIntervals('06:00', '20:00');

const AvailabilityCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<{ [key: string]: DayAvailability }>({});
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState({ time: '', isAvailable: true });
  const [presets, setPresets] = useState<Preset[]>([]);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [newPreset, setNewPreset] = useState({ name: '', start: '18:00', end: '20:00', isAvailable: true });
  const [applyPresetId, setApplyPresetId] = useState<string>('');

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const getCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    return days;
  };
  const getDayAvailability = (date: Date) => {
    const dateStr = formatDate(date);
    return availability[dateStr] || { date: dateStr, isAvailable: false, timeSlots: [] };
  };
  const handleDateClick = (date: Date) => setSelectedDate(formatDate(date));
  const handleToggleDayAvailability = (dateStr: string) => {
    const current = availability[dateStr] || { date: dateStr, isAvailable: false, timeSlots: [] };
    setAvailability({ ...availability, [dateStr]: { ...current, isAvailable: !current.isAvailable } });
  };
  const handleToggleTimeSlot = (dateStr: string, timeSlotIndex: number) => {
    const current = availability[dateStr];
    if (!current) return;
    const newTimeSlots = [...current.timeSlots];
    newTimeSlots[timeSlotIndex] = { ...newTimeSlots[timeSlotIndex], isAvailable: !newTimeSlots[timeSlotIndex].isAvailable };
    setAvailability({ ...availability, [dateStr]: { ...current, timeSlots: newTimeSlots } });
  };
  const handleAddTimeSlot = () => {
    if (!selectedDate || !newTimeSlot.time) {
      toast.error('Please select a date and time');
      return;
    }
    const current = availability[selectedDate] || { date: selectedDate, isAvailable: false, timeSlots: [] };
    if (current.timeSlots.some((slot: any) => slot.time === newTimeSlot.time)) {
      toast.error('This time slot already exists');
      return;
    }
    setAvailability({ ...availability, [selectedDate]: { ...current, timeSlots: [...current.timeSlots, newTimeSlot] } });
    setNewTimeSlot({ time: '', isAvailable: true });
    setShowTimeSlotModal(false);
    toast.success('Time slot added');
  };
  const handleRemoveTimeSlot = (dateStr: string, timeSlotIndex: number) => {
    const current = availability[dateStr];
    if (!current) return;
    const newTimeSlots = current.timeSlots.filter((_, index) => index !== timeSlotIndex);
    setAvailability({ ...availability, [dateStr]: { ...current, timeSlots: newTimeSlots } });
    toast.success('Time slot removed');
  };
  const handleSaveAvailability = () => {
    // TODO: Send to API
    console.log('Saving availability:', availability);
    toast.success('Availability settings saved');
  };
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };
  const selectedDayAvailability = selectedDate ? availability[selectedDate] || { date: selectedDate, isAvailable: false, timeSlots: [] } : null;

  // Preset logic
  const handleCreatePreset = () => {
    if (!newPreset.name || !newPreset.start || !newPreset.end) {
      toast.error('Please fill in all fields');
      return;
    }
    const times = generate30MinIntervals(newPreset.start, newPreset.end);
    setPresets([...presets, { id: Date.now().toString(), name: newPreset.name, timeSlots: times, isAvailable: newPreset.isAvailable }]);
    setNewPreset({ name: '', start: '18:00', end: '20:00', isAvailable: true });
    setShowPresetModal(false);
    toast.success('Preset created');
  };
  const handleApplyPreset = () => {
    if (!selectedDate || !applyPresetId) return;
    const preset = presets.find(p => p.id === applyPresetId);
    if (!preset) return;
    setAvailability({
      ...availability,
      [selectedDate]: {
        date: selectedDate,
        isAvailable: preset.isAvailable,
        timeSlots: preset.timeSlots.map(time => ({ time, isAvailable: true }))
      }
    });
    setApplyPresetId('');
    toast.success('Preset applied');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Availability Calendar</h1>
          <p className="text-gray-600">Manage your booking availability by date</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => setShowPresetModal(true)} className="btn-secondary flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Presets</span>
          </button>
          <button onClick={handleSaveAvailability} className="btn-primary flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigateMonth('prev')} className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => navigateMonth('next')} className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {getCalendarDays().map((date, index) => (
              <div
                key={index}
                className={`p-4 text-center text-sm border border-gray-100 min-h-[80px] cursor-pointer transition-colors rounded-lg ${
                  !date ? 'bg-gray-50' : ''
                } ${
                  date && selectedDate === formatDate(date)
                    ? 'bg-sage-100 border-sage-300'
                    : date
                    ? 'hover:bg-gray-50'
                    : ''
                }`}
                style={{ height: 80 }}
                onClick={() => date && handleDateClick(date)}
              >
                {date && (
                  <>
                    <div className="text-gray-900 mb-1 text-lg font-semibold">{date.getDate()}</div>
                    {getDayAvailability(date).isAvailable && (
                      <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Selected Date Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a Date'}
          </h2>
          {selectedDate && (
            <div className="space-y-4">
              {/* Preset Application */}
              {presets.length > 0 && (
                <div className="flex items-center space-x-2 mb-2">
                  <select value={applyPresetId} onChange={e => setApplyPresetId(e.target.value)} className="input-field">
                    <option value="">Apply a preset...</option>
                    {presets.map(preset => (
                      <option key={preset.id} value={preset.id}>{preset.name}</option>
                    ))}
                  </select>
                  <button onClick={handleApplyPreset} className="btn-secondary text-xs py-1 px-2">Apply</button>
                </div>
              )}
              {/* Day Availability Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Available for bookings</span>
                <button
                  onClick={() => handleToggleDayAvailability(selectedDate)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedDayAvailability?.isAvailable ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                >
                  {selectedDayAvailability?.isAvailable ? 'Available' : 'Unavailable'}
                </button>
              </div>
              {/* Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Time Slots</span>
                  <button onClick={() => setShowTimeSlotModal(true)} className="btn-secondary text-xs py-1 px-2">
                    <Plus className="w-3 h-3 inline mr-1" />
                    Add Time
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedDayAvailability?.timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{slot.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleToggleTimeSlot(selectedDate, slotIndex)} className={`w-4 h-4 rounded-full border-2 transition-colors ${slot.isAvailable ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'}`} />
                        <button onClick={() => handleRemoveTimeSlot(selectedDate, slotIndex)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {selectedDayAvailability?.timeSlots.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No time slots added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {!selectedDate && (
            <div className="text-center text-gray-500 py-8">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Click on a date to manage availability</p>
            </div>
          )}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => {
            const newAvailability = { ...availability };
            Object.keys(newAvailability).forEach(dateStr => {
              newAvailability[dateStr] = {
                ...newAvailability[dateStr],
                isAvailable: true,
                timeSlots: newAvailability[dateStr].timeSlots.map(slot => ({ ...slot, isAvailable: true }))
              };
            });
            setAvailability(newAvailability);
            toast.success('All dates set to available');
          }} className="btn-primary text-sm py-2">Make All Dates Available</button>
          <button onClick={() => {
            const newAvailability = { ...availability };
            Object.keys(newAvailability).forEach(dateStr => {
              newAvailability[dateStr] = {
                ...newAvailability[dateStr],
                isAvailable: false,
                timeSlots: newAvailability[dateStr].timeSlots.map(slot => ({ ...slot, isAvailable: false }))
              };
            });
            setAvailability(newAvailability);
            toast.success('All dates set to unavailable');
          }} className="btn-secondary text-sm py-2">Make All Dates Unavailable</button>
          <button onClick={() => {
            setAvailability({});
            toast.success('Availability cleared');
          }} className="btn-secondary text-sm py-2">Clear All Availability</button>
        </div>
      </div>
      {/* Add Time Slot Modal */}
      <AnimatePresence>
        {showTimeSlotModal && selectedDate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowTimeSlotModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Add Time Slot for {new Date(selectedDate).toLocaleDateString()}</h2>
                <button onClick={() => setShowTimeSlotModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select value={newTimeSlot.time} onChange={e => setNewTimeSlot({ ...newTimeSlot, time: e.target.value })} className="input-field">
                    <option value="">Select time</option>
                    {defaultTimeSlots.filter(time => !selectedDayAvailability?.timeSlots.some((slot: any) => slot.time === time)).map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={newTimeSlot.isAvailable} onChange={e => setNewTimeSlot({ ...newTimeSlot, isAvailable: e.target.checked })} className="rounded text-sage-600" />
                  <span className="text-sm text-gray-700">Available</span>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setShowTimeSlotModal(false)} className="flex-1 btn-secondary">Cancel</button>
                  <button onClick={handleAddTimeSlot} className="flex-1 btn-primary">Add Time Slot</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Preset Modal */}
      <AnimatePresence>
        {showPresetModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowPresetModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Create Preset</h2>
                <button onClick={() => setShowPresetModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preset Name</label>
                  <input type="text" value={newPreset.name} onChange={e => setNewPreset({ ...newPreset, name: e.target.value })} className="input-field" placeholder="e.g. Weekday Evenings" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input type="time" value={newPreset.start} onChange={e => setNewPreset({ ...newPreset, start: e.target.value })} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input type="time" value={newPreset.end} onChange={e => setNewPreset({ ...newPreset, end: e.target.value })} className="input-field" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={newPreset.isAvailable} onChange={e => setNewPreset({ ...newPreset, isAvailable: e.target.checked })} className="rounded text-sage-600" />
                  <span className="text-sm text-gray-700">Available</span>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setShowPresetModal(false)} className="flex-1 btn-secondary">Cancel</button>
                  <button onClick={handleCreatePreset} className="flex-1 btn-primary">Create Preset</button>
                </div>
              </div>
              {presets.length > 0 && (
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-md font-semibold mb-2">Your Presets</h3>
                  <ul className="space-y-2">
                    {presets.map(preset => (
                      <li key={preset.id} className="flex items-center justify-between">
                        <span>{preset.name} ({preset.timeSlots[0]} - {preset.timeSlots[preset.timeSlots.length-1]})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvailabilityCalendar; 