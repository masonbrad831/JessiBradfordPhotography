import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, Check } from 'lucide-react';

interface BookingCalendarProps {
  onDateSelect: (date: Date, timeSlot: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onDateSelect,
  selectedDate,
  selectedTime
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateState, setSelectedDateState] = useState<Date | undefined>(selectedDate);
  const [selectedTimeState, setSelectedTimeState] = useState<string | undefined>(selectedTime);

  // For testing, make all future dates available
  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDateState && date.toDateString() === selectedDateState.toDateString();
  };

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date.toISOString().split('T')[0]);
    if (isDateAvailable(date)) {
      setSelectedDateState(date);
      setSelectedTimeState(undefined);
      console.log('Date selected:', date.toISOString().split('T')[0]);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTimeState(time);
    if (selectedDateState) {
      onDateSelect(selectedDateState, time);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-semibold text-sage-800">Select Your Date</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-sage-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-sage-600" />
          </button>
          <span className="text-lg font-medium text-sage-700 min-w-[120px] text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-sage-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-sage-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-sage-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day ? (
                <button
                  onClick={() => handleDateClick(day)}
                  disabled={!isDateAvailable(day)}
                  className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 ${
                    isSelected(day)
                      ? 'bg-sage-600 text-white'
                      : isDateAvailable(day)
                      ? 'hover:bg-sage-100 text-sage-800 border border-sage-200 cursor-pointer'
                      : 'text-sage-400 cursor-not-allowed bg-gray-50'
                  } ${isToday(day) ? 'ring-2 ring-sage-400' : ''}`}
                >
                  {day.getDate()}
                  {isDateAvailable(day) && (
                    <div className="w-1 h-1 bg-sage-400 rounded-full mx-auto mt-1"></div>
                  )}
                </button>
              ) : (
                <div className="w-full h-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDateState && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-sage-200 pt-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-sage-600" />
            <h4 className="text-lg font-semibold text-sage-800">
              Available Times for {selectedDateState.toLocaleDateString()}
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedTimeState === time
                    ? 'bg-sage-600 text-white'
                    : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {selectedTimeState && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-sage-50 rounded-lg border border-sage-200"
            >
              <div className="flex items-center space-x-2 text-sage-700">
                <Check className="w-5 h-5 text-sage-600" />
                <span className="font-medium">
                  Selected: {selectedDateState.toLocaleDateString()} at {selectedTimeState}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-sage-200">
        <div className="flex items-center justify-center space-x-6 text-sm text-sage-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-sage-200 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-sage-600 rounded-full"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-sage-100 rounded-full ring-2 ring-sage-400"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar; 