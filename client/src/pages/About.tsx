import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, MapPin } from 'lucide-react';

const LOCATION_ICON_MAP: Record<string, any> = {
  MapPin,
  Camera,
  Heart,
}

const aboutMeContent = {
  text: `I’m Jessi, the photographer behind Jessi Bradford Photography. I’m a lifestyle photographer based in Sevier County who loves capturing the real, meaningful moments that make your story yours. My style is natural, warm, and relaxed. I focus on genuine connection rather than stiff poses, so your photos feel authentic and timeless. As a mom myself, I know how quickly the little moments pass. Those are the moments I love preserving most. My goal during every session is to make you feel comfortable, have fun, and walk away with images that truly feel like you. Whether it’s families, couples, seniors, or everyday life moments, I’m here to capture memories you’ll want to look back on for years.`,
  imageUrl: '/images/portrait/012.jpg',
  locationImageUrl: '/images/location.jpg',
};


const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-serif font-bold mb-6">About Me</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Capturing life's beautiful moments with an artistic approach
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream-100">
        <div className="container-custom flex flex-col items-center justify-center text-center">
          <img
            src={aboutMeContent.imageUrl}
            alt="About Me"
            className="w-60 h-60 object-cover rounded-lg shadow mb-8"
          />
          
          <div className="max-w-3xl">
            <p className="text-lg text-sage-700 mb-6">
              {aboutMeContent.text}
            </p>
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