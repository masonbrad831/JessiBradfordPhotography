import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';

interface Promotion {
  id: string;
  code: string;
  description: string;
  usageLimit: number;
  usedBy: string[]; // emails that have used this promotion
  allowedSessionTypes: string[];
  discountType: 'percent' | 'amount' | 'fixed';
  discountValue: number;
}

const PromotionsManager: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [sessionTypes, setSessionTypes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [newPromotion, setNewPromotion] = useState({
    code: '',
    description: '',
    usageLimit: 1,
    allowedSessionTypes: [] as string[],
    discountType: 'percent' as 'percent' | 'amount' | 'fixed',
    discountValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const promos = await fetchResource('Promotions');
        setPromotions(Array.isArray(promos) ? promos : []);
        const types = await fetchResource('SessionTypes');
        setSessionTypes(Array.isArray(types) ? types : []);
        console.log('Session types loaded:', types);
      } catch (e) {
        setPromotions([]);
        setSessionTypes([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!newPromotion.code || newPromotion.usageLimit < 1 || newPromotion.allowedSessionTypes.length === 0) {
      toast.error('Please fill in all fields and select at least one session type');
      return;
    }
    try {
      let updatedPromos;
      if (editingPromotion) {
        updatedPromos = promotions.map(p =>
          p.id === editingPromotion.id ? { ...editingPromotion, ...newPromotion } : p
        );
      } else {
        updatedPromos = [
          ...promotions,
          { id: Date.now().toString(), ...newPromotion, usedBy: [] }
        ];
      }
      await saveResource('Promotions', updatedPromos);
      setPromotions(updatedPromos);
      setShowModal(false);
      setEditingPromotion(null);
      setNewPromotion({ code: '', description: '', usageLimit: 1, allowedSessionTypes: [], discountType: 'percent', discountValue: 0 });
      toast.success('Promotion saved');
    } catch (e) {
      toast.error('Failed to save promotion');
    }
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    setNewPromotion({
      code: promo.code,
      description: promo.description,
      usageLimit: promo.usageLimit,
      allowedSessionTypes: promo.allowedSessionTypes,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedPromos = promotions.filter(p => p.id !== id);
      await saveResource('Promotions', updatedPromos);
      setPromotions(updatedPromos);
      toast.success('Promotion deleted');
    } catch (e) {
      toast.error('Failed to delete promotion');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-600">Manage promotion codes, usage limits, and allowed session types</p>
        </div>
        <button
          className="btn-primary flex items-center space-x-2"
          onClick={() => {
            setEditingPromotion(null);
            setNewPromotion({ code: '', description: '', usageLimit: 1, allowedSessionTypes: [], discountType: 'percent', discountValue: 0 });
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Promotion</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div>Loading promotions...</div>
        ) : promotions.length === 0 ? (
          <div>No promotions found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map(promo => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{promo.code}</h3>
                  <p className="text-sm text-gray-600 mb-1">{promo.description}</p>
                  <p className="text-sm text-gray-600 mb-1">Usage Limit: {promo.usageLimit}</p>
                  <p className="text-sm text-gray-600 mb-1">Used: {promo.usedBy?.length || 0}</p>
                  <p className="text-sm text-gray-600 mb-1">Allowed Sessions: {promo.allowedSessionTypes.join(', ')}</p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    className="btn-secondary flex-1 flex items-center justify-center"
                    onClick={() => handleEdit(promo)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    className="btn-danger flex-1 flex items-center justify-center"
                    onClick={() => handleDelete(promo.id)}
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
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPromotion ? 'Edit Promotion' : 'Add Promotion'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                  <input
                    type="text"
                    value={newPromotion.code}
                    onChange={e => setNewPromotion({ ...newPromotion, code: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={newPromotion.description}
                    onChange={e => setNewPromotion({ ...newPromotion, description: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    value={newPromotion.usageLimit}
                    onChange={e => setNewPromotion({ ...newPromotion, usageLimit: Number(e.target.value) })}
                    className="input-field"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Session Types</label>
                  <select
                    multiple
                    value={newPromotion.allowedSessionTypes}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setNewPromotion({ ...newPromotion, allowedSessionTypes: selected });
                    }}
                    className="input-field"
                  >
                    {sessionTypes.map((type: any) => (
                      <option key={type.id || type.name} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                  <select
                    value={newPromotion.discountType}
                    onChange={e => setNewPromotion({ ...newPromotion, discountType: e.target.value as 'percent' | 'amount' | 'fixed' })}
                    className="input-field"
                  >
                    <option value="percent">Percent Off (%)</option>
                    <option value="amount">Amount Off ($)</option>
                    <option value="fixed">Fixed Price ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Value</label>
                  <input
                    type="number"
                    value={newPromotion.discountValue}
                    onChange={e => setNewPromotion({ ...newPromotion, discountValue: Number(e.target.value) })}
                    className="input-field"
                    min={0}
                    required
                  />
                </div>
                {/* Live Preview */}
                <div className="bg-gray-50 rounded p-3 mt-2 text-gray-700 text-sm">
                  {newPromotion.discountType === 'percent' && newPromotion.discountValue > 0 && (
                    <>This promotion gives <b>{newPromotion.discountValue}% off</b> the selected session(s).</>
                  )}
                  {newPromotion.discountType === 'amount' && newPromotion.discountValue > 0 && (
                    <>This promotion gives <b>${newPromotion.discountValue} off</b> the selected session(s).</>
                  )}
                  {newPromotion.discountType === 'fixed' && newPromotion.discountValue > 0 && (
                    <>This promotion makes the selected session(s) <b>${newPromotion.discountValue}</b> for the customer.</>
                  )}
                  {(!newPromotion.discountValue || newPromotion.discountValue <= 0) && (
                    <>Set a discount value above to see the effect.</>
                  )}
                  <br />
                  <span>Only one promotion can be used per customer. Usage limit: {newPromotion.usageLimit}.</span>
                </div>
                <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4">
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

export default PromotionsManager; 