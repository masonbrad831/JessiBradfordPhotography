import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Star, Clock, Users } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Camera,
  Heart,
  Star,
  Users,
  Clock,
};

const servicesData = [
  {
    id: 1,
    name: 'Portrait Session',
    icon: 'Camera',
    price: 250,
    duration: '1 hr',
    photoCount: 20,
    description: 'Capture your personality with a professional portrait session.',
    includes: ['Edited images', 'High-resolution downloads', 'Online gallery'],
  },
  {
    id: 2,
    name: 'Couples Session',
    icon: 'Heart',
    price: 300,
    duration: '1.5 hr',
    photoCount: 30,
    description: 'Celebrate your love with timeless couple photos.',
    includes: ['Multiple locations', 'Edited images', 'Online gallery'],
  },
  {
    id: 3,
    name: 'Family & Lifestyle',
    icon: 'Users',
    price: 350,
    duration: '2 hr',
    photoCount: 40,
    description: 'Document your family’s precious moments naturally.',
    includes: ['Outdoor session', 'Edited images', 'Online gallery'],
  },
];

const additionalServicesData = [
  {
    id: 1,
    title: 'Photo Prints',
    price: '$50+',
    description: 'High-quality prints of your favorite photos delivered to your home.',
  },
  {
    id: 2,
    title: 'Extra Hour',
    price: '$75',
    description: 'Extend any session by an additional hour for more coverage.',
  },
  {
    id: 3,
    title: 'Special Editing',
    price: '$100',
    description: 'Custom retouching and artistic edits for selected images.',
  },
];

const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-serif font-bold mb-6">Photography Services</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Professional photography sessions tailored to capture your unique story
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-wood-50 wood-texture">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => {
              const Icon = ICON_MAP[service.icon] || Camera;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="farmhouse-card text-center card-hover"
                >
                  <div className="w-16 h-16 bg-wood-200 rounded-full flex items-center justify-center mx-auto mb-6 border border-wood-300">
                    <Icon className="w-8 h-8 text-wood-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-wood-800 mb-2">{service.name}</h3>
                  <div className="flex items-center justify-center space-x-4 text-sage-600 mb-2">
                    <span className="text-xl font-bold text-sage-700">${service.price}</span>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-base">{service.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span className="text-base">{service.photoCount} photos</span>
                    </div>
                  </div>
                  <p className="text-wood-600 mb-4">{service.description}</p>
                  {Array.isArray(service.includes) && service.includes.length > 0 && (
                    <ul className="text-left text-wood-700 text-sm mb-4 mx-auto max-w-xs list-disc list-inside">
                      {service.includes.map((inc, i) => (
                        <li key={i}>{inc}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-sage-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">
              Additional Services
            </h2>
            <p className="text-lg text-sage-600 max-w-2xl mx-auto">
              Customize your experience with these additional options
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {additionalServicesData.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-cream-200 p-8 rounded-lg shadow-lg text-center card-hover"
              >
                <h3 className="text-2xl font-semibold text-sage-800 mb-4">{service.title}</h3>
                <p className="text-3xl font-bold text-sage-600 mb-6">{service.price}</p>
                <p className="text-sage-700 text-lg leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;