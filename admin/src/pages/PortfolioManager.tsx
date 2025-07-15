import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, Trash2, Edit, Eye, X, Star, StarOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';
import { useNavigate } from 'react-router-dom';

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  description?: string;
  isActive?: boolean;
  isStarred?: boolean;
}

interface Portfolio {
  id: string;
  title: string;
  description: string;
  photos: Photo[];
  showOnClient?: boolean;
}

const PortfolioManager: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);
  const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', showOnClient: true });
  const navigate = useNavigate();

  const categories = [
    'family',
    'couple',
    'portrait',
    'engagement',
    'wedding',
    'event'
  ];

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    setLoading(true);
    try {
      const data = await fetchResource('Portfolio');
      setPortfolios(Array.isArray(data) ? data : []);
    } catch (e) {
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPortfolio = async () => {
    if (!newPortfolio.title) {
      toast.error('Portfolio title is required');
      return;
    }
    const newId = Date.now().toString();
    const updated = [
      ...portfolios,
      { id: newId, title: newPortfolio.title, description: newPortfolio.description, photos: [], showOnClient: newPortfolio.showOnClient }
    ];
    await saveResource('Portfolio', updated);
    setPortfolios(updated);
    setNewPortfolio({ title: '', description: '', showOnClient: true });
    setShowAddPortfolio(false);
    toast.success('Portfolio added');
  };

  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete) return;
    const updated = portfolios.filter(p => p.id !== portfolioToDelete.id);
    await saveResource('Portfolio', updated);
    setPortfolios(updated);
    setPortfolioToDelete(null);
    setShowDeleteModal(false);
    toast.success('Portfolio deleted');
  };

  const handleRemovePortfolio = (portfolio: Portfolio) => {
    setPortfolioToDelete(portfolio);
    setShowDeleteModal(true);
  };

  const handleToggleShowOnClient = async (id: string) => {
    const updated = portfolios.map(p => p.id === id ? { ...p, showOnClient: !p.showOnClient } : p);
    await saveResource('Portfolio', updated);
    setPortfolios(updated);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Manager</h1>
        <button
          onClick={() => setShowAddPortfolio(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Portfolio
        </button>
      </div>
      {/* List of Portfolios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading portfolios...</p>
        ) : portfolios.length === 0 ? (
          <p>No portfolios found. Add one!</p>
        ) : (
          portfolios.map((portfolio) => (
            <motion.div
              key={portfolio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col cursor-pointer hover:shadow-xl transition"
              onClick={() => navigate(`/portfolio-manager/${portfolio.id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-xl font-semibold text-wood-800 flex items-center gap-2">
                    <Image className="w-6 h-6 text-sage-600" />
                    {portfolio.title}
                  </h2>
                  <p className="text-wood-600 text-sm mb-1">{portfolio.description}</p>
                  <p className="text-xs text-wood-500">{portfolio.photos.length} photo(s)</p>
                  {/* Replace the checkbox with a styled toggle switch in the portfolio list */}
                  <div className="flex items-center gap-2 mt-1">
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <span>Show on Client Site</span>
                      <button
                        type="button"
                        aria-pressed={portfolio.showOnClient !== false}
                        onClick={e => { e.stopPropagation(); handleToggleShowOnClient(portfolio.id); }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${portfolio.showOnClient !== false ? 'bg-sage-600' : 'bg-gray-300'}`}
                        tabIndex={0}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${portfolio.showOnClient !== false ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </label>
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleRemovePortfolio(portfolio); }}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
      {/* Add Portfolio Modal */}
      <AnimatePresence>
        {showAddPortfolio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddPortfolio(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-900">Add Portfolio</h2>
                <button
                  onClick={() => setShowAddPortfolio(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleAddPortfolio();
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPortfolio.title}
                    onChange={e => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    className="input-field"
                    placeholder="Portfolio title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newPortfolio.description}
                    onChange={e => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                    className="input-field"
                    placeholder="Portfolio description"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <input
                      type="checkbox"
                      checked={newPortfolio.showOnClient}
                      onChange={e => setNewPortfolio({ ...newPortfolio, showOnClient: e.target.checked })}
                    />
                    Show on Client Site
                  </label>
                </div>
                <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPortfolio(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Delete Portfolio Modal */}
      <AnimatePresence>
        {showDeleteModal && portfolioToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-red-700">Delete Portfolio</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-lg text-red-700 font-semibold">Are you sure you want to delete this portfolio?</p>
                <p className="text-wood-700">This will permanently delete <span className="font-bold">{portfolioToDelete.title}</span> and all <span className="font-bold">{portfolioToDelete.photos.length}</span> photos inside it. This action cannot be undone.</p>
                <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeletePortfolio}
                    className="flex-1 btn-danger"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioManager; 