import React, { useState, useEffect } from 'react';
import { Save, Heart, Camera, Star, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchResource, saveResource } from '../api';

const defaultIntro = {
  heading: '',
  description: '',
  location: '',
  imageUrl: '',
  buttonText: '',
};

const PHILOSOPHY_ICONS = [
  { name: 'Heart', icon: Heart },
  { name: 'Camera', icon: Camera },
  { name: 'Star', icon: Star },
];

const LOCATION_ICONS = [
  { name: 'MapPin', icon: MapPin },
  { name: 'Camera', icon: Camera },
  { name: 'Heart', icon: Heart },
];

const AboutMeManager: React.FC = () => {
  const [aboutMe, setAboutMe] = useState('');
  const [aboutMeImage, setAboutMeImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [intro, setIntro] = useState<any>(defaultIntro);
  const [introLoading, setIntroLoading] = useState(true);
  const [introSaving, setIntroSaving] = useState(false);
  const [philosophy, setPhilosophy] = useState<any>({ heading: '', description: '', cards: [] });
  const [philosophyLoading, setPhilosophyLoading] = useState(true);
  const [philosophySaving, setPhilosophySaving] = useState(false);
  const [locationImageUrl, setLocationImageUrl] = useState('');
  const [locationHeading, setLocationHeading] = useState('');
  const [locationParagraph, setLocationParagraph] = useState('');
  const [locationFeatures, setLocationFeatures] = useState([
    { icon: 'MapPin', text: '' },
    { icon: 'Camera', text: '' },
    { icon: 'Heart', text: '' },
  ]);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationSaving, setLocationSaving] = useState(false);

  useEffect(() => {
    async function loadAboutMe() {
      setLoading(true);
      try {
        const data = await fetchResource('AboutMe');
        if (typeof data === 'object' && data !== null) {
          setAboutMe(data.content || '');
          setAboutMeImage(data.imageUrl || '');
        } else {
          setAboutMe(typeof data === 'string' ? data : '');
          setAboutMeImage('');
        }
      } catch (e) {
        setAboutMe('');
        setAboutMeImage('');
      } finally {
        setLoading(false);
      }
    }
    async function loadIntro() {
      setIntroLoading(true);
      try {
        const data = await fetchResource('HomeIntro');
        setIntro({ ...defaultIntro, ...data });
      } catch {
        setIntro(defaultIntro);
      } finally {
        setIntroLoading(false);
      }
    }
    async function loadPhilosophy() {
      setPhilosophyLoading(true);
      try {
        const data = await fetchResource('Philosophy');
        setPhilosophy(data);
      } catch {
        setPhilosophy({ heading: '', description: '', cards: [] });
      } finally {
        setPhilosophyLoading(false);
      }
    }
    async function loadLocation() {
      setLocationLoading(true);
      try {
        const data = await fetchResource('AboutMe');
        setLocationImageUrl(data.locationImageUrl || '');
        setLocationHeading(data.locationHeading || '');
        setLocationParagraph(data.locationParagraph || '');
        setLocationFeatures(data.locationFeatures || [
          { icon: 'MapPin', text: '' },
          { icon: 'Camera', text: '' },
          { icon: 'Heart', text: '' },
        ]);
      } catch {
        setLocationImageUrl('');
        setLocationHeading('');
        setLocationParagraph('');
        setLocationFeatures([
          { icon: 'MapPin', text: '' },
          { icon: 'Camera', text: '' },
          { icon: 'Heart', text: '' },
        ]);
      } finally {
        setLocationLoading(false);
      }
    }
    loadAboutMe();
    loadIntro();
    loadPhilosophy();
    loadLocation();
  }, []);

  const handleAboutMeSave = async () => {
    setSaving(true);
    try {
      await saveResource('AboutMe', { content: aboutMe, imageUrl: aboutMeImage });
      toast.success('About Me updated');
    } catch (e) {
      toast.error('Failed to save About Me');
    } finally {
      setSaving(false);
    }
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIntro({ ...intro, [e.target.name]: e.target.value });
  };

  const handleIntroSave = async () => {
    setIntroSaving(true);
    try {
      const { buttonLink, ...toSave } = intro;
      await saveResource('HomeIntro', toSave);
      toast.success('Homepage intro updated!');
    } catch {
      toast.error('Failed to save homepage intro.');
    } finally {
      setIntroSaving(false);
    }
  };

  const handlePhilosophyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPhilosophy({ ...philosophy, [e.target.name]: e.target.value });
  };
  const handlePhilosophyCardChange = (idx: number, field: string, value: string) => {
    const cards = [...philosophy.cards];
    cards[idx] = { ...cards[idx], [field]: value };
    setPhilosophy({ ...philosophy, cards });
  };
  const handlePhilosophyCardIcon = (idx: number, icon: string) => {
    const cards = [...philosophy.cards];
    cards[idx] = { ...cards[idx], icon };
    setPhilosophy({ ...philosophy, cards });
  };
  const handleAddPhilosophyCard = () => {
    setPhilosophy({ ...philosophy, cards: [...(philosophy.cards || []), { icon: 'Heart', title: '', description: '' }] });
  };
  const handleRemovePhilosophyCard = (idx: number) => {
    const cards = [...philosophy.cards];
    cards.splice(idx, 1);
    setPhilosophy({ ...philosophy, cards });
  };
  const handlePhilosophySave = async () => {
    setPhilosophySaving(true);
    try {
      await saveResource('Philosophy', philosophy);
      toast.success('Philosophy section updated!');
    } catch {
      toast.error('Failed to save philosophy section.');
    } finally {
      setPhilosophySaving(false);
    }
  };

  const handleLocationFeatureChange = (idx: number, field: string, value: string) => {
    const features = [...locationFeatures];
    features[idx] = { ...features[idx], [field]: value };
    setLocationFeatures(features);
  };
  const handleLocationSave = async () => {
    setLocationSaving(true);
    try {
      const data = await fetchResource('AboutMe');
      await saveResource('AboutMe', {
        ...data,
        locationImageUrl,
        locationHeading,
        locationParagraph,
        locationFeatures,
      });
      toast.success('Location section updated!');
    } catch {
      toast.error('Failed to save location section.');
    } finally {
      setLocationSaving(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* About Me Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit About Me</h1>
        <p className="text-gray-600 mb-4">Update the About Me section shown on the client site.</p>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <textarea
              className="w-full min-h-[120px] border border-gray-300 rounded-lg p-4 text-lg mb-4"
              value={aboutMe}
              onChange={e => setAboutMe(e.target.value)}
              placeholder="Write something about yourself..."
            />
            <div className="mb-4">
              <label className="block font-medium mb-1">Image URL</label>
              <input
                className="input-field w-full"
                value={aboutMeImage}
                onChange={e => setAboutMeImage(e.target.value)}
                placeholder="Enter image URL for About Me section"
              />
            </div>
            <button
              className="btn-primary flex items-center space-x-2 mt-2"
              onClick={handleAboutMeSave}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            {/* About Me Preview */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">About Me Preview</h2>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {aboutMeImage && (
                  <img src={aboutMeImage} alt="About Me" className="w-48 h-48 object-cover rounded-lg shadow" />
                )}
                <p className="text-lg text-gray-800 whitespace-pre-line">{aboutMe}</p>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Philosophy Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Philosophy Section</h1>
        {philosophyLoading ? (
          <div>Loading...</div>
        ) : (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handlePhilosophySave(); }}>
            <div>
              <label className="block font-medium mb-1">Heading</label>
              <input name="heading" value={philosophy.heading} onChange={handlePhilosophyChange} className="input-field w-full" />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea name="description" value={philosophy.description} onChange={handlePhilosophyChange} className="input-field w-full" rows={2} />
            </div>
            <div>
              <label className="block font-medium mb-1">Cards</label>
              <div className="space-y-4">
                {(philosophy.cards || []).map((card: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-4 border p-4 rounded-lg">
                    <div className="flex space-x-2 mb-2 md:mb-0">
                      {PHILOSOPHY_ICONS.map(opt => (
                        <button
                          key={opt.name}
                          type="button"
                          className={`p-2 rounded-lg border ${card.icon === opt.name ? 'border-sage-500 bg-sage-100' : 'border-gray-200 bg-white'} transition`}
                          onClick={() => handlePhilosophyCardIcon(idx, opt.name)}
                          title={opt.name}
                        >
                          <opt.icon className="w-6 h-6" />
                        </button>
                      ))}
                    </div>
                    <input
                      className="input-field w-full md:w-48"
                      value={card.title}
                      onChange={e => handlePhilosophyCardChange(idx, 'title', e.target.value)}
                      placeholder="Card Title"
                    />
                    <input
                      className="input-field w-full"
                      value={card.description}
                      onChange={e => handlePhilosophyCardChange(idx, 'description', e.target.value)}
                      placeholder="Card Description"
                    />
                    <button type="button" className="text-red-500 ml-2" onClick={() => handleRemovePhilosophyCard(idx)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-secondary mt-2" onClick={handleAddPhilosophyCard}>Add Card</button>
              </div>
            </div>
            <button type="submit" className="btn-primary mt-4">{philosophySaving ? 'Saving...' : 'Save'}</button>
            {/* Philosophy Preview */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Philosophy Preview</h2>
              <div className="container-custom">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">{philosophy.heading}</h2>
                  <p className="text-lg text-sage-600 max-w-3xl mx-auto">{philosophy.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {(philosophy.cards || []).map((card: any, idx: number) => {
                    const Icon = PHILOSOPHY_ICONS.find(i => i.name === card.icon)?.icon || Heart;
                    return (
                      <div key={idx} className="bg-cream-200 p-8 rounded-lg shadow-lg text-center card-hover">
                        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Icon className="w-8 h-8 text-sage-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-sage-800 mb-4">{card.title}</h3>
                        <p className="text-sage-600">{card.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
      {/* Location Section */}
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Location Section</h1>
        {locationLoading ? (
          <div>Loading...</div>
        ) : (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleLocationSave(); }}>
            <div>
              <label className="block font-medium mb-1">Image URL</label>
              <input
                className="input-field w-full"
                value={locationImageUrl}
                onChange={e => setLocationImageUrl(e.target.value)}
                placeholder="Enter image URL for Location section"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Heading</label>
              <input
                className="input-field w-full"
                value={locationHeading}
                onChange={e => setLocationHeading(e.target.value)}
                placeholder="Location heading"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Paragraph</label>
              <textarea
                className="input-field w-full"
                value={locationParagraph}
                onChange={e => setLocationParagraph(e.target.value)}
                placeholder="Location paragraph"
                rows={3}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Feature Lines</label>
              <div className="space-y-4">
                {locationFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex space-x-2">
                      {LOCATION_ICONS.map(opt => (
                        <button
                          key={opt.name}
                          type="button"
                          className={`p-2 rounded-lg border ${feature.icon === opt.name ? 'border-sage-500 bg-sage-100' : 'border-gray-200 bg-white'} transition`}
                          onClick={() => handleLocationFeatureChange(idx, 'icon', opt.name)}
                          title={opt.name}
                        >
                          <opt.icon className="w-6 h-6" />
                        </button>
                      ))}
                    </div>
                    <input
                      className="input-field w-full"
                      value={feature.text}
                      onChange={e => handleLocationFeatureChange(idx, 'text', e.target.value)}
                      placeholder={`Feature ${idx + 1} text`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary mt-4">{locationSaving ? 'Saving...' : 'Save'}</button>
            {/* Location Preview */}
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Location Preview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="aspect-[4/3] bg-sage-200 rounded-lg overflow-hidden">
                  <img
                    src={locationImageUrl || '/api/placeholder/600/450'}
                    alt="Location"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">
                    {locationHeading}
                  </h2>
                  <p className="text-lg text-sage-700 mb-6">
                    {locationParagraph}
                  </p>
                  <div className="space-y-4">
                    {locationFeatures.map((feature, idx) => {
                      const Icon = LOCATION_ICONS.find(i => i.name === feature.icon)?.icon || MapPin;
                      return (
                        <div key={idx} className="flex items-center space-x-3">
                          <Icon className="w-6 h-6 text-sage-600" />
                          <span className="text-sage-700">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AboutMeManager; 