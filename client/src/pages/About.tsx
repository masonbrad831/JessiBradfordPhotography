import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, MapPin, Award } from 'lucide-react';

const About: React.FC = () => {
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

      {/* Story Section */}
      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">
                My Story
              </h2>
              <p className="text-lg text-sage-700 mb-6">
                Hi, I'm Jessi Bradford, a passionate photographer based in Salina, Utah. 
                I fell in love with photography as a way to capture the authentic moments 
                that make life truly beautiful.
              </p>
              <p className="text-lg text-sage-700 mb-6">
                My journey began with a simple camera and a desire to tell stories through images. 
                Over the years, I've developed a signature moody, artistic style that brings out 
                the natural beauty and emotion in every subject.
              </p>
              <p className="text-lg text-sage-700">
                I specialize in portrait, couple, and family photography, creating timeless images 
                that families will treasure for generations. Every session is an opportunity to 
                capture genuine moments and create lasting memories.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-sage-200 rounded-lg overflow-hidden">
                <img
                  src="/api/placeholder/600/600"
                  alt="Jessi Bradford"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-sage-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">
              My Photography Philosophy
            </h2>
            <p className="text-lg text-sage-600 max-w-3xl mx-auto">
              I believe that the best photographs are those that capture genuine emotion and tell a story. 
              My moody, artistic approach emphasizes natural beauty and authentic moments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Authentic Moments',
                description: 'I focus on capturing real emotions and genuine interactions rather than posed perfection.'
              },
              {
                icon: Camera,
                title: 'Artistic Vision',
                description: 'My moody, artistic style creates images that are both beautiful and emotionally compelling.'
              },
              {
                icon: Award,
                title: 'Quality & Care',
                description: 'Every image is carefully crafted and edited to ensure the highest quality for my clients.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-cream-200 p-8 rounded-lg shadow-lg text-center card-hover"
              >
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-sage-600" />
                </div>
                <h3 className="text-xl font-semibold text-sage-800 mb-4">
                  {item.title}
                </h3>
                <p className="text-sage-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
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
                  src="/api/placeholder/600/450"
                  alt="Salina, Utah"
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
                Based in Salina, Utah
              </h2>
              <p className="text-lg text-sage-700 mb-6">
                I'm proud to call Salina, Utah my home and serve the beautiful Sevier County area. 
                The stunning landscapes and natural beauty of Southern Utah provide the perfect backdrop 
                for creating memorable photography sessions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-sage-600" />
                  <span className="text-sage-700">Serving Sevier County and surrounding areas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Camera className="w-6 h-6 text-sage-600" />
                  <span className="text-sage-700">Outdoor and studio sessions available</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-sage-600" />
                  <span className="text-sage-700">Travel to your preferred location</span>
                </div>
              </div>
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