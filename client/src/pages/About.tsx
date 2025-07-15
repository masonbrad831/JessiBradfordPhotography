import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, MapPin, Star } from 'lucide-react';
import { fetchResource } from '../api';

const LOCATION_ICON_MAP: Record<string, any> = {
  MapPin,
  Camera,
  Heart,
};

const ICON_MAP: Record<string, any> = {
  Heart,
  Camera,
  Star,
};

const About: React.FC = () => {
  const [aboutMe, setAboutMe] = useState('');
  const [aboutMeImage, setAboutMeImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [homeIntro, setHomeIntro] = useState<any>(null);
  const [introLoading, setIntroLoading] = useState(true);
  const [philosophy, setPhilosophy] = useState<any>(null);
  const [philosophyLoading, setPhilosophyLoading] = useState(true);
  const [locationImageUrl, setLocationImageUrl] = useState('');
  const [locationHeading, setLocationHeading] = useState('');
  const [locationParagraph, setLocationParagraph] = useState('');
  const [locationFeatures, setLocationFeatures] = useState<any[]>([]);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    async function loadAboutMe() {
      setLoading(true);
      setLocationLoading(true);
      try {
        const data = await fetchResource('AboutMe');
        if (typeof data === 'object' && data !== null) {
          setAboutMe(data.content || '');
          setAboutMeImage(data.imageUrl || '');
          setLocationImageUrl(data.locationImageUrl || '');
          setLocationHeading(data.locationHeading || '');
          setLocationParagraph(data.locationParagraph || '');
          setLocationFeatures(data.locationFeatures || []);
        } else {
          setAboutMe(typeof data === 'string' ? data : '');
          setAboutMeImage('');
          setLocationImageUrl('');
          setLocationHeading('');
          setLocationParagraph('');
          setLocationFeatures([]);
        }
      } catch (e) {
        setAboutMe('');
        setAboutMeImage('');
        setLocationImageUrl('');
        setLocationHeading('');
        setLocationParagraph('');
        setLocationFeatures([]);
      } finally {
        setLoading(false);
        setLocationLoading(false);
      }
    }
    async function loadIntro() {
      setIntroLoading(true);
      try {
        const data = await fetchResource('HomeIntro');
        setHomeIntro(data);
      } catch {
        setHomeIntro(null);
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
        setPhilosophy(null);
      } finally {
        setPhilosophyLoading(false);
      }
    }
    loadAboutMe();
    loadIntro();
    loadPhilosophy();
  }, []);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-serif font-bold mb-6">About Me</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Capturing life's beautiful moments with a moody, artistic approach
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {aboutMeImage && (
              <img src={aboutMeImage} alt="About Me" className="w-64 h-64 object-cover rounded-lg shadow mb-6 md:mb-0" />
            )}
            <div>
              {loading ? (
                <p className="text-lg text-sage-700 mb-6">Loading...</p>
              ) : (
                <p className="text-lg text-sage-700 mb-6 whitespace-pre-line">{aboutMe || 'No About Me content set yet.'}</p>
              )}
              </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-sage-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">{philosophy?.heading || 'My Photography Philosophy'}</h2>
            <p className="text-lg text-sage-600 max-w-3xl mx-auto">{philosophy?.description || ''}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyLoading ? (
              <div className="col-span-full text-center text-sage-600">Loading...</div>
            ) : (philosophy?.cards || []).map((card: any, idx: number) => {
              const Icon = ICON_MAP[card.icon] || Heart;
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
      </section>

      {/* Location Section */}
      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-sage-200 rounded-lg overflow-hidden">
                <img
                  src={locationImageUrl || '/api/placeholder/600/450'}
                  alt={locationHeading || 'Location'}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {locationLoading ? (
                <p className="text-lg text-sage-700 mb-6">Loading...</p>
              ) : (
                <>
              <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">
                    {locationHeading}
              </h2>
              <p className="text-lg text-sage-700 mb-6">
                    {locationParagraph}
              </p>
              <div className="space-y-4">
                    {(locationFeatures || []).map((feature, idx) => {
                      const Icon = LOCATION_ICON_MAP[feature.icon] || MapPin;
                      return (
                        <div key={idx} className="flex items-center space-x-3">
                          <Icon className="w-6 h-6 text-sage-600" />
                          <span className="text-sage-700">{feature.text}</span>
                </div>
                      );
                    })}
                </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-sage-800 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-semibold mb-6">
              Let's Create Something Beautiful Together
            </h2>
            <p className="text-xl text-sage-200 mb-8 max-w-2xl mx-auto">
              I'd love to capture your story and create timeless images that you'll treasure forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary bg-white text-sage-800 hover:bg-sage-100">
                Book Your Session
              </a>
              <a href="/portfolio" className="btn-secondary border-white text-white hover:bg-white hover:text-sage-800">
                View My Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About; 