import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Camera, Heart, Star, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';
import { AnimatePresence } from 'framer-motion';

interface SessionType {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  includes: string[];
  photoCount: number;
  icon: string;
}

const ICON_OPTIONS = [
  { name: 'Camera', icon: Camera },
  { name: 'Heart', icon: Heart },
  { name: 'Star', icon: Star },
  { name: 'Users', icon: Users },
  { name: 'Clock', icon: Clock },
];

const SessionTypeManager: React.FC = () => {
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingType, setEditingType] = useState<SessionType | null>(null);
  const [newType, setNewType] = useState({ name: '', price: 0, duration: '', description: '', includes: [''], photoCount: 0, icon: 'Camera' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessionTypes() {
      setLoading(true);
      try {
        const types = await fetchResource('SessionTypes');
        setSessionTypes(Array.isArray(types) ? types : []);
      } catch (e) {
        setSessionTypes([]);
      } finally {
        setLoading(false);
      }
    }
    loadSessionTypes();
  }, []);

  const handleSave = async () => {
    if (!newType.name || newType.price < 0 || !newType.duration || !newType.description || newType.includes.length === 0 || newType.includes.some(i => !i.trim()) || newType.photoCount < 0) {
      toast.error('Please fill in all fields with valid values');
      return;
    }
    try {
      let updatedTypes;
      if (editingType) {
        updatedTypes = sessionTypes.map(type =>
          type.id === editingType.id ? { ...editingType, ...newType } : type
        );
      } else {
        updatedTypes = [
          ...sessionTypes,
          { id: Date.now().toString(), ...newType }
        ];
      }
      await saveResource('SessionTypes', updatedTypes);
      setSessionTypes(updatedTypes);
      setShowModal(false);
      setEditingType(null);
      setNewType({ name: '', price: 0, duration: '', description: '', includes: [''], photoCount: 0, icon: 'Camera' });
      toast.success('Session type saved');
    } catch (e) {
      toast.error('Failed to save session type');
    }
  };

  const handleEdit = (type: SessionType) => {
    setEditingType(type);
    setNewType({
      name: type.name,
      price: type.price,
      duration: type.duration,
      description: type.description,
      includes: Array.isArray(type.includes) && type.includes.length ? type.includes : [''],
      photoCount: typeof type.photoCount === 'number' ? type.photoCount : 0,
      icon: type.icon || 'Camera' // Assuming 'Camera' is the default if icon is not set
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedTypes = sessionTypes.filter(type => type.id !== id);
      await saveResource('SessionTypes', updatedTypes);
      setSessionTypes(updatedTypes);
      toast.success('Session type deleted');
    } catch (e) {
      toast.error('Failed to delete session type');
    }
  };

  // Helper to generate 30-minute intervals up to 6 hours
  const durationOptions = [];
  for (let mins = 30; mins <= 360; mins += 30) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    durationOptions.push(
      `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm' : ''}`.trim()
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session Types</h1>
          <p className="text-gray-600">Manage session types, costs, and photo counts</p>
        </div>
        <button
          className="btn-primary flex items-center space-x-2"
          onClick={() => {
            setEditingType(null);
            setNewType({ name: '', price: 0, duration: '', description: '', includes: [''], photoCount: 0, icon: 'Camera' });
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Session Type</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div>Loading session types...</div>
        ) : sessionTypes.length === 0 ? (
          <div>No session types found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessionTypes.map(type => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Cost: ${type.price}</p>
                  <p className="text-sm text-gray-600 mb-1">Duration: {type.duration}</p>
                  <p className="text-sm text-gray-600 mb-1">Description: {type.description}</p>
                  <p className="text-sm text-gray-600 mb-1">Includes: {(type.includes || []).join(', ')}</p>
                  <p className="text-sm text-gray-600 mb-1">Photos Included: {typeof type.photoCount === 'number' ? type.photoCount : 0}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    className="btn-secondary flex-1 flex items-center justify-center"
                    onClick={() => handleEdit(type)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    className="btn-danger flex-1 flex items-center justify-center"
                    onClick={() => handleDelete(type.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingType ? 'Edit Session Type' : 'Add Session Type'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSave();
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newType.name}
                    onChange={e => setNewType({ ...newType, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={newType.price}
                    onChange={e => setNewType({ ...newType, price: Number(e.target.value) })}
                    className="input-field"
                    min={0}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select
                    value={newType.duration}
                    onChange={e => setNewType({ ...newType, duration: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newType.description}
                    onChange={e => setNewType({ ...newType, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                  {newType.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => {
                          const updated = [...newType.includes];
                          updated[idx] = e.target.value;
                          setNewType({ ...newType, includes: updated });
                        }}
                        className="input-field flex-1"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setNewType({ ...newType, includes: newType.includes.filter((_, i) => i !== idx) })}
                        className="btn-danger px-2 py-1"
                        disabled={newType.includes.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewType({ ...newType, includes: [...newType.includes, ''] })}
                    className="btn-secondary mt-2"
                  >
                    Add Item
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Photos Included</label>
                  <input
                    type="number"
                    value={newType.photoCount}
                    onChange={e => setNewType({ ...newType, photoCount: Number(e.target.value) })}
                    className="input-field"
                    min={0}
                    required
                  />
                </div>
                {/* Icon Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                  <div className="flex space-x-3 mb-2">
                    {ICON_OPTIONS.map(opt => (
                      <button
                        key={opt.name}
                        type="button"
                        className={`p-2 rounded-lg border ${newType.icon === opt.name ? 'border-sage-500 bg-sage-100' : 'border-gray-200 bg-white'} transition`}
                        onClick={() => setNewType({ ...newType, icon: opt.name })}
                        title={opt.name}
                      >
                        <opt.icon className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    <Save className="w-4 h-4 mr-1" /> Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SessionTypeManager; 