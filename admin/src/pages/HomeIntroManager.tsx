import React, { useEffect, useState } from 'react';
import { fetchResource, saveResource } from '../api';
import toast from 'react-hot-toast';

const defaultIntro = {
  heading: '',
  description: '',
  location: '',
  imageUrl: '',
  buttonText: '',
  // buttonLink removed from form
};

const HomeIntroManager: React.FC = () => {
  const [intro, setIntro] = useState<any>(defaultIntro);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIntro() {
      setLoading(true);
      try {
        const data = await fetchResource('HomeIntro');
        setIntro({ ...defaultIntro, ...data });
      } catch {
        setIntro(defaultIntro);
      } finally {
        setLoading(false);
      }
    }
    loadIntro();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIntro({ ...intro, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const { buttonLink, ...toSave } = intro;
      await saveResource('HomeIntro', toSave);
      toast.success('Homepage intro updated!');
    } catch {
      toast.error('Failed to save.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6">Homepage Intro Content</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Form */}
        <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div>
                <label className="block font-medium mb-1">Heading</label>
                <input name="heading" value={intro.heading} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea name="description" value={intro.description} onChange={handleChange} className="input-field w-full" rows={3} />
              </div>
              <div>
                <label className="block font-medium mb-1">Location</label>
                <input name="location" value={intro.location} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="block font-medium mb-1">Image URL</label>
                <input name="imageUrl" value={intro.imageUrl} onChange={handleChange} className="input-field w-full" />
              </div>
              <div>
                <label className="block font-medium mb-1">Button Text</label>
                <input name="buttonText" value={intro.buttonText} onChange={handleChange} className="input-field w-full" />
              </div>
              <button type="submit" className="btn-primary mt-4">Save</button>
            </form>
          )}
        </div>
        {/* Live Preview */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <div className="section-padding bg-wood-50 wood-texture rounded-lg shadow p-6">
            <div className="container-custom">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-vintage font-semibold text-wood-800 mb-6">
                    {intro.heading || 'Based in Salina, Utah'}
                  </h2>
                  <p className="text-lg text-wood-700 mb-6">
                    {intro.description || 'I specialize in capturing authentic moments through portrait, couple, and family photography. My warm, rustic style brings out the natural beauty and emotion in every session.'}
                  </p>
                  <div className="flex items-center space-x-4 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-wood-600"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span className="text-wood-700">{intro.location || 'Serving Sevier County'}</span>
                  </div>
                  <a
                    className="btn-primary inline-block px-6 py-3 text-base font-semibold rounded-lg shadow transition hover:bg-wood-700 focus:outline-none focus:ring-2 focus:ring-wood-400"
                    href="/about"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {intro.buttonText || 'Learn More About Me'}
                  </a>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-wood-200 rounded-lg overflow-hidden rustic-border">
                    <img
                      src={intro.imageUrl || '/api/placeholder/600/600'}
                      alt="Jessi Bradford"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeIntroManager; 