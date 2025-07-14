import React from 'react';
import { motion } from 'framer-motion';
import { Check, Camera, Heart, Star, Clock, Users } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      id: '1',
      name: 'Portrait Session',
      price: '$150',
      duration: '1 hour',
      description: 'Individual or family portrait sessions in beautiful outdoor locations or studio.',
      includes: [
        '1 hour photography session',
        'Professional editing of 20+ images',
        'Online gallery with 10 high-resolution downloads',
        'Print release for personal use',
        'Location consultation'
      ],
      icon: Camera
    },
    {
      id: '2',
      name: 'Couple Session',
      price: '$200',
      duration: '1.5 hours',
      description: 'Romantic couple sessions perfect for engagements, anniversaries, or just because.',
      includes: [
        '1.5 hour photography session',
        'Professional editing of 25+ images',
        'Online gallery with 15 high-resolution downloads',
        'Print release for personal use',
        'Location consultation',
        'Outfit guidance'
      ],
      icon: Heart
    },
    {
      id: '3',
      name: 'Family Session',
      price: '$250',
      duration: '2 hours',
      description: 'Comprehensive family photography sessions capturing your family\'s unique story.',
      includes: [
        '2 hour photography session',
        'Professional editing of 30+ images',
        'Online gallery with 20 high-resolution downloads',
        'Print release for personal use',
        'Location consultation',
        'Outfit guidance',
        'Family posing guidance'
      ],
      icon: Users
    },
    {
      id: '4',
      name: 'Engagement Session',
      price: '$300',
      duration: '2 hours',
      description: 'Special engagement sessions to celebrate your love story and upcoming wedding.',
      includes: [
        '2 hour photography session',
        'Professional editing of 35+ images',
        'Online gallery with 25 high-resolution downloads',
        'Print release for personal use',
        'Location consultation',
        'Outfit guidance',
        'Engagement announcement design'
      ],
      icon: Star
    }
  ];

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
            <h1 className="text-5xl font-serif font-bold mb-6">Services & Pricing</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Professional photography sessions tailored to capture your unique story
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif font-semibold text-sage-800 mb-6">
              Photography Services
            </h2>
            <p className="text-lg text-sage-600 max-w-3xl mx-auto">
              Choose the perfect session type for your needs. Each package is designed to capture your unique story with care and artistry.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-cream-50 rounded-lg p-10 border border-sage-200 card-hover"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                      <service.icon className="w-8 h-8 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-serif font-semibold text-sage-800 mb-2">
                        {service.name}
                      </h3>
                      <div className="flex items-center space-x-6 text-sage-600">
                        <span className="text-3xl font-bold text-sage-700">{service.price}</span>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5" />
                          <span className="text-lg">{service.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sage-700 mb-8 text-lg leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-6">
                  <h4 className="font-semibold text-sage-800 text-xl">What's Included:</h4>
                  <ul className="space-y-4">
                    {service.includes.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-4">
                        <Check className="w-6 h-6 text-sage-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sage-700 text-lg leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-12">
                  <a href="/booking" className="btn-primary w-full inline-block text-center text-lg py-4">
                    Book This Session
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
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
            {[
              {
                title: 'Additional Images',
                price: '$25 each',
                description: 'Add more high-resolution images to your gallery'
              },
              {
                title: 'Rush Editing',
                price: '$50',
                description: 'Get your images within 48 hours instead of 1-2 weeks'
              },
              {
                title: 'Print Products',
                price: 'Starting at $15',
                description: 'Professional prints, canvases, and albums available'
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-cream-200 p-8 rounded-lg shadow-lg text-center card-hover"
              >
                <h3 className="text-2xl font-semibold text-sage-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-3xl font-bold text-sage-600 mb-6">
                  {service.price}
                </p>
                <p className="text-sage-700 text-lg leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="section-padding bg-sage-800 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif font-semibold mb-6">
              Ready to Book Your Session?
            </h2>
            <p className="text-xl text-sage-200 mb-8 max-w-2xl mx-auto">
              Let's discuss your vision and create a custom photography experience just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="btn-primary bg-white text-sage-800 hover:bg-sage-100">
                Contact Me
              </a>
              <a href="/portfolio" className="btn-secondary border-white text-white hover:bg-white hover:text-sage-800">
                View Portfolio
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services; 