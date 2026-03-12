import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Star, Clock, Users, UserIcon, Baby, GraduationCap, Flame, Paintbrush } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Camera,
  Heart,
  Star,
  Users,
  Clock,
  UserIcon,
  Baby,
  GraduationCap,
  Flame,
  LucidePaintbrush2: Paintbrush // Cleaned up the name reference
};

// Cleaned up redundancy: Define standard includes once
const STANDARD_INCLUDES = ['Edited images', 'High-resolution downloads', 'Online gallery', 'Payment Plan'];

const servicesData = [
  {
    id: 1,
    name: 'Portrait Session',
    icon: 'UserIcon',
    price: 100,
    duration: '30 mins',
    photoCount: 10,
    description: 'Capture your personality with a professional portrait session.',
    includes: STANDARD_INCLUDES,
  },
  {
    id: 2,
    name: 'Couples Session',
    icon: 'Heart',
    price: 150,
    duration: '45 mins',
    photoCount: 10,
    description: 'Celebrate your love with timeless couple photos.',
    includes: STANDARD_INCLUDES,
  },
  {
    id: 3,
    name: 'Family & Lifestyle',
    icon: 'Users',
    price: 250,
    duration: '1 - 2 hours',
    photoCount: 20,
    description: 'Document your family’s precious moments naturally.',
    includes: STANDARD_INCLUDES,
  },
  {
    id: 4,
    name: 'Newborn Session',
    icon: 'Baby',
    price: 100,
    duration: '2 hours',
    photoCount: 10,
    description: 'Capture the precious first days of life',
    includes: STANDARD_INCLUDES,
  },
  {
    id: 5,
    name: 'Seniors Session',
    icon: 'GraduationCap',
    price: 100,
    duration: '30 mins',
    photoCount: 10,
    description: 'Celebrate your graduation milestone with photos that showcase your unique style.',
    includes: STANDARD_INCLUDES,
  },
  {
    id: 6,
    name: 'Boudoir Session',
    icon: 'Flame',
    price: 100,
    duration: '1 hour',
    photoCount: 10,
    description: 'An intimate, empowering experience to celebrate your confidence and beauty.',
    includes: STANDARD_INCLUDES,
  },
  {
    id: 7,
    name: 'Custom Session',
    icon: 'LucidePaintbrush2',
    price: 'TBD',
    duration: 'TBD',
    photoCount: 'TBD',
    description: 'Something you want not offered? Reach out and we can discuss pricing',
    includes: STANDARD_INCLUDES,
  },
];

const additionalServicesData = [
  { id: 1, title: 'Extra Photos', price: '$10+', description: 'Want more photos than the package offers? $10 per photo.' },
  { id: 2, title: 'Illustrated Portraits', price: '$25+', description: 'Want one of your photos to look like your favorite cartoon or other styles? Starts at 25 and add $10 per person.' },
  { id: 3, title: 'Studio Sessions', price: '$100', description: 'Take your session indoors for a clean, editorial look. This covers the studio fee and professional lighting setup for a timeless finish.' },
];

const Services: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-serif font-bold mb-6">Photography Services</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto italic">
              Professional photography sessions tailored to capture your unique story
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-wood-50 wood-texture">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-8">
            {servicesData.map((service, index) => {
              const Icon = ICON_MAP[service.icon] || Camera;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  // 'w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2rem)]' 
                  // maintains the 3-column look but allows for centering
                  className="farmhouse-card text-center card-hover w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] flex flex-col"
                >
                  <div className="w-16 h-16 bg-wood-200 rounded-full flex items-center justify-center mx-auto mb-6 border border-wood-300">
                    <Icon className="w-8 h-8 text-wood-700" />
                  </div>
                  
                  <h3 className="text-2xl font-serif font-semibold text-wood-800 mb-3">{service.name}</h3>
                  
                  <div className="flex flex-col items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-sage-700">
                      {typeof service.price === 'number' ? `$${service.price}` : service.price}
                    </span>
                    <div className="flex items-center gap-4 text-sm text-wood-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{service.photoCount} photos</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-wood-600 mb-6 flex-grow">{service.description}</p>
                  
                  <div className="pt-4 border-t border-wood-200">
                    <ul className="text-left text-wood-700 text-sm space-y-2 inline-block">
                      {service.includes.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Star className="w-3 h-3 text-sage-500" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-sage-50 border-t border-sage-100">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-4">Add-Ons</h2>
            <p className="text-lg text-sage-600">Customize your session to fit your needs</p>
            <p className="text-lg text-sage-600">(Discounts may apply)</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {additionalServicesData.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-sage-100 text-center w-full md:w-80"
              >
                <h3 className="text-xl font-semibold text-sage-800 mb-2">{service.title}</h3>
                <p className="text-2xl font-bold text-sage-600 mb-4">{service.price}</p>
                <p className="text-sage-700 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;