import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Star, Clock, Users } from 'lucide-react';
import { fetchResource } from '../api';

const ICON_MAP: Record<string, any> = {
  Camera,
  Heart,
  Star,
  Users,
  Clock,
};

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [additional, setAdditional] = useState<any[]>([]);
  const [loadingAdditional, setLoadingAdditional] = useState(true);

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      try {
        const sessionTypes = await fetchResource('SessionTypes');
        setServices(Array.isArray(sessionTypes) ? sessionTypes : []);
      } catch (e) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  useEffect(() => {
    async function loadAdditional() {
      setLoadingAdditional(true);
      try {
        const data = await fetchResource('AdditionalServices');
        setAdditional(Array.isArray(data) ? data : []);
      } catch {
        setAdditional([]);
      } finally {
        setLoadingAdditional(false);
      }
    }
    loadAdditional();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-serif font-bold mb-6">Photography Services</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Professional photography sessions tailored to capture your unique story
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-wood-50 wood-texture">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center text-wood-600">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="col-span-full text-center text-wood-600">No services available.</div>
            ) : services.map((service: any, index: number) => {
              const Icon = ICON_MAP[service.icon] || Camera;
              return (
                <motion.div
                  key={service.id || service.name}
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
                      {service.includes.map((inc: string, i: number) => (
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
            {loadingAdditional ? (
              <div className="col-span-full text-center text-sage-600">Loading additional services...</div>
            ) : additional.length === 0 ? (
              <div className="col-span-full text-center text-sage-600">No additional services available.</div>
            ) : additional.map((service: any, index: number) => (
              <motion.div
                key={service.id}
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
    </div>
  );
};

export default Services; 