import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, Facebook, Instagram } from 'lucide-react';

const Contact: React.FC = () => {
  const settings = {
    businessInfo: {
      businessName: "Jessi Bradford Photography",
      email: "bradford.j.photots@gmail.com",
      phone: "(385) 457-6487",
      location: "Salina, Utah",
      website: "https://jessibradfordphotography.com",
      social: {
        facebook: "https://www.facebook.com/profile.php?id=61578237507323",
      instagram: "https://www.instagram.com/jessibradfordphotography"
      }
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="bg-sage-800 text-white py-20">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl font-serif font-bold mb-6">Contact Me</h1>
            <p className="text-xl text-sage-200 max-w-2xl mx-auto">
              Let's discuss your photography needs and create something beautiful together
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-cream-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-serif font-semibold text-sage-800 mb-8">Send Me a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-sage-700 mb-2">Name *</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">Email *</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-sage-700 mb-2">Phone</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-sage-700 mb-2">Service Type</label>
                    <select id="service" name="service" value={formData.service} onChange={handleChange}
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent">
                      <option value="">Select a service</option>
                      <option value="portrait">Portrait Session</option>
                      <option value="couple">Couple Session</option>
                      <option value="family">Family & Lifestyle</option>
                      <option value="newborn">Newborn Session</option>
                      <option value="boudoir">Boudoir Session</option>
                      <option value="other">Custom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-sage-700 mb-2">Preferred Date</label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}
                    className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-sage-700 mb-2">Message *</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5}
                    className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Tell me about your vision for the session..." />
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center">
                  <Send className="w-5 h-5 mr-2" /> Send Message
                </button>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-serif font-semibold text-sage-800 mb-8">Get in Touch</h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sage-800 mb-2">Email</h3>
                    <a href={`mailto:${settings.businessInfo.email}`} className="text-sage-600 hover:text-sage-700 transition-colors">
                      {settings.businessInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sage-800 mb-2">Phone</h3>
                    <a href={`tel:${settings.businessInfo.phone.replace(/\s/g, '')}`} className="text-sage-600 hover:text-sage-700 transition-colors">
                      {settings.businessInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sage-800 mb-2">Location</h3>
                    <p className="text-sage-600">
                      {settings.businessInfo.location}<br />
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sage-800 mb-2">Facebook</h3>
                    <a href={settings.businessInfo.social.facebook} className="text-sage-600 hover:text-sage-700 transition-colors" target="_blank" rel="noopener noreferrer">
                      @jessibradfordphotography
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sage-800 mb-2">Instagram</h3>
                    <a href={settings.businessInfo.social.instagram} className="text-sage-600 hover:text-sage-700 transition-colors" target="_blank" rel="noopener noreferrer">
                      @jessibradfordphotography
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;