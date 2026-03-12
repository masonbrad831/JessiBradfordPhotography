import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, MapPin, Star } from 'lucide-react';

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

const aboutMeContent = {
  text: `Hi, I'm Jessi. I capture life's beautiful moments with a moody, artistic approach. 
Every session is about telling your story in a way that feels natural and timeless.`,
  imageUrl: '/images/about-me.jpg',
  locationImageUrl: '/images/location.jpg',
  locationHeading: 'My Studio Location',
  locationParagraph: 'Based in Salt Lake City, I shoot both in-studio and on-location sessions.',
  locationFeatures: [
    { icon: 'MapPin', text: 'Easy parking nearby' },
    { icon: 'Camera', text: 'Professional studio setup' },
    { icon: 'Heart', text: 'Comfortable, welcoming environment' },
  ],
};

const philosophyContent = {
  heading: 'My Photography Philosophy',
  description: 'I aim to create images that evoke emotion and tell your unique story.',
  cards: [
    { icon: 'Heart', title: 'Emotion First', description: 'Capturing real connections and feelings.' },
    { icon: 'Camera', title: 'Artistic Vision', description: 'Every photo is crafted with intention.' },
    { icon: 'Star', title: 'Quality Focus', description: 'High-quality images you’ll treasure forever.' },
  ],
};

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-serif font-bold mb-6">About Me</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Capturing life's beautiful moments with a moody, artistic approach
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <img
              src={aboutMeContent.imageUrl}
              alt="About Me"
              className="w-64 h-64 object-cover rounded-lg shadow mb-6 md:mb-0"
            />
            <div>
              <p className="text-lg text-sage-700 mb-6 whitespace-pre-line">{aboutMeContent.text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-sage-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">{philosophyContent.heading}</h2>
            <p className="text-lg text-sage-600 max-w-3xl mx-auto">{philosophyContent.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophyContent.cards.map((card, idx) => {
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
                  src={aboutMeContent.locationImageUrl}
                  alt={aboutMeContent.locationHeading}
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
              <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">
                {aboutMeContent.locationHeading}
              </h2>
              <p className="text-lg text-sage-700 mb-6">{aboutMeContent.locationParagraph}</p>
              <div className="space-y-4">
                {aboutMeContent.locationFeatures.map((feature, idx) => {
                  const Icon = LOCATION_ICON_MAP[feature.icon] || MapPin;
                  return (
                    <div key={idx} className="flex items-center space-x-3">
                      <Icon className="w-6 h-6 text-sage-600" />
                      <span className="text-sage-700">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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