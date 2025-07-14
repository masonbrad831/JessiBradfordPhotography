import React, { useEffect, useState } from 'react';
import { fetchResource, saveResource } from '../api';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';

interface AdditionalService {
  id: string;
  title: string;
  price: string;
  description: string;
}

const defaultService: AdditionalService = {
  id: '',
  title: '',
  price: '',
  description: '',
};

const AdditionalServicesManager: React.FC = () => {
  const [services, setServices] = useState<AdditionalService[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<AdditionalService | null>(null);
  const [newService, setNewService] = useState<AdditionalService>(defaultService);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      try {
        const data = await fetchResource('AdditionalServices');
        setServices(Array.isArray(data) ? data : []);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const handleSave = async () => {
    if (!newService.title || !newService.price || !newService.description) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      let updated;
      if (editingService) {
        updated = services.map(s => s.id === editingService.id ? { ...editingService, ...newService } : s);
      } else {
        updated = [...services, { ...newService, id: Date.now().toString() }];
      }
      await saveResource('AdditionalServices', updated);
      setServices(updated);
      setShowModal(false);
      setEditingService(null);
      setNewService(defaultService);
      toast.success('Service saved');
    } catch {
      toast.error('Failed to save service');
    }
  };

  const handleEdit = (service: AdditionalService) => {
    setEditingService(service);
    setNewService(service);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const updated = services.filter(s => s.id !== id);
      await saveResource('AdditionalServices', updated);
      setServices(updated);
      toast.success('Service deleted');
    } catch {
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6">Additional Services</h1>
      <button
        className="btn-primary flex items-center space-x-2 mb-6"
        onClick={() => {
          setEditingService(null);
          setNewService(defaultService);
          setShowModal(true);
        }}
      >
        <Plus className="w-4 h-4" />
        <span>Add Service</span>
      </button>
      <div className="divide-y divide-gray-200">
        {services.length === 0 ? (
          <div className="text-gray-500 py-8 text-center">No additional services yet.</div>
        ) : services.map(service => (
          <div key={service.id} className="py-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg text-gray-900">{service.title}</div>
              <div className="text-gray-600">{service.price}</div>
              <div className="text-gray-700 text-sm mt-1">{service.description}</div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-blue-500 hover:text-blue-700" onClick={() => handleEdit(service)}>
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 text-red-500 hover:text-red-700" onClick={() => handleDelete(service.id)}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{editingService ? 'Edit' : 'Add'} Service</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  className="input-field w-full"
                  value={newService.title}
                  onChange={e => setNewService({ ...newService, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  className="input-field w-full"
                  value={newService.price}
                  onChange={e => setNewService({ ...newService, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="input-field w-full"
                  value={newService.description}
                  onChange={e => setNewService({ ...newService, description: e.target.value })}
                  rows={3}
                />
              </div>
              <button className="btn-primary w-full mt-2" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalServicesManager; 