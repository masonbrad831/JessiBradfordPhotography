import React, { useEffect, useState } from 'react';
import { fetchResource, saveResource } from '../api';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';
import { useRef } from 'react';

const defaultIntro = {
  heading: '',
  description: '',
  location: '',
  imageUrl: '',
  buttonText: '',
  // buttonLink removed from form
};

const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_API_KEY = process.env.REACT_APP_CLOUDINARY_API_KEY || '';
declare global {
  interface Window {
    cloudinary: any;
  }
}

const HomeIntroManager: React.FC = () => {
  const [intro, setIntro] = useState<any>(defaultIntro);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [multiImages, setMultiImages] = useState<any[]>([]); // {file, uploading, url, public_id, progress}
  const [cloudinaryReady, setCloudinaryReady] = useState(false);
  const [selectingFromCloudinary, setSelectingFromCloudinary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    // Dynamically load Cloudinary Media Library Widget if not present
    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://media-library.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => setCloudinaryReady(true);
      script.onerror = () => toast.error('Failed to load Cloudinary Media Library Widget');
      document.body.appendChild(script);
    } else {
      setCloudinaryReady(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIntro({ ...intro, [e.target.name]: e.target.value });
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setMultiImages(files.map(file => ({ file, uploading: true, url: '', public_id: '', progress: 0 })));
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setMultiImages(prev => prev.map((img, idx) => idx === i ? { ...img, progress: percent } : img));
          }
        };
        xhr.onload = () => {
          const data = JSON.parse(xhr.responseText);
          setMultiImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: false, url: data.secure_url, public_id: data.public_id, progress: 100 } : img));
          resolve();
        };
        xhr.onerror = () => {
          setMultiImages(prev => prev.map((img, idx) => idx === i ? { ...img, uploading: false, progress: 0 } : img));
          resolve();
        };
        xhr.send(formData);
      });
    }
  };
  const openCloudinaryMediaLibrary = () => {
    if (!window.cloudinary) {
      toast.error('Cloudinary Media Library Widget not loaded yet. Please try again in a moment.');
      return;
    }
    setSelectingFromCloudinary(true);
    const ml = window.cloudinary.createMediaLibrary(
      {
        cloud_name: CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        multiple: false,
        max_files: 1,
        insert_caption: 'Select',
      },
      {
        insertHandler: (data: any) => {
          if (data.assets && data.assets.length > 0) {
            setMultiImages([
              {
                file: null,
                uploading: false,
                url: data.assets[0].secure_url,
                public_id: data.assets[0].public_id,
                progress: 100,
              },
            ]);
          }
          setSelectingFromCloudinary(false);
        },
      }
    );
    ml.show();
  };
  const handleAddPhoto = () => {
    if (multiImages.length > 0 && multiImages[0].url) {
      setIntro((prev: any) => ({ ...prev, imageUrl: multiImages[0].url }));
      setShowUploadModal(false);
      setMultiImages([]);
    } else {
      toast.error('Please upload or select an image');
    }
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
                <button
                  className="btn-primary flex items-center space-x-2 w-full"
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {intro.imageUrl ? 'Change Image' : 'Add Image'}
                </button>
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
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => { setShowUploadModal(false); setMultiImages([]); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-sage-700 flex items-center gap-2">
                <Camera className="w-6 h-6" /> Select Home Intro Image
              </h2>
              <button onClick={() => { setShowUploadModal(false); setMultiImages([]); }} className="text-gray-400 hover:text-gray-600 rounded-full p-2 transition">
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <button type="button" className="btn-primary flex-1" onClick={() => fileInputRef.current?.click()}>
                  Upload Image
                </button>
                <input type="file" accept="image/*" multiple={false} ref={fileInputRef} style={{ display: 'none' }} onChange={handleFiles} />
                <button type="button" className="btn-secondary flex-1" onClick={openCloudinaryMediaLibrary} disabled={!cloudinaryReady || selectingFromCloudinary}>
                  Select from Cloudinary
                </button>
              </div>
              {multiImages.length > 0 && (
                <div className="grid grid-cols-1 gap-6 mt-4">
                  {multiImages.map((img, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row gap-4 p-4 items-center">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200">
                        {img.uploading ? (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mb-2"></div>
                            <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div className="bg-sage-500 h-2 rounded-full transition-all duration-300" style={{ width: `${img.progress || 0}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{img.progress || 0}%</span>
                          </div>
                        ) : img.url ? (
                          <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white border-t border-gray-100 -mx-8 px-8 py-6 rounded-b-2xl">
                <button type="button" onClick={() => { setShowUploadModal(false); setMultiImages([]); }} className="flex-1 btn-secondary text-lg">
                  Cancel
                </button>
                <button type="button" onClick={handleAddPhoto} className="flex-1 btn-primary text-lg" disabled={multiImages.length === 0 || multiImages.some(img => img.uploading)}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeIntroManager; 