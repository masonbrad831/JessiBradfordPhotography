import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Facebook, Instagram, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch("https://formspree.io/f/meergbdy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', service: '', date: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className="section-padding bg-cream-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Form Side */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-serif font-semibold text-sage-800 mb-8">Send Me a Message</h2>
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 rounded-lg shadow-md text-center border border-sage-200"
                >
                  <CheckCircle className="w-16 h-16 text-sage-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-serif text-sage-800 mb-2">Message Sent!</h3>
                  <p className="text-sage-600 mb-6">Thanks for reaching out! I'll get back to you as soon as I can.</p>
                  <button onClick={() => setStatus('idle')} className="text-sage-600 font-medium hover:text-sage-800 underline transition-colors">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-sage-700 mb-2">Name *</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-sage-700 mb-2">Email *</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-sage-700 mb-2">Phone</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none" />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-sage-700 mb-2">Service Type</label>
                      <select id="service" name="service" value={formData.service} onChange={handleChange}
                        className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none bg-white">
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
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-sage-700 mb-2">Message *</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5}
                      className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none"
                      placeholder="Tell me about your vision for the session..." />
                  </div>

                  <button type="submit" disabled={status === 'submitting'}
                    className={`btn-primary w-full flex items-center justify-center transition-all py-4 bg-sage-800 text-white rounded-lg hover:bg-sage-900 ${status === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {status === 'submitting' ? "Sending..." : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
                  </button>
                  {status === 'error' && <p className="text-red-500 text-sm text-center">Error sending message. Please try again.</p>}
                </form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info Side */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-serif font-semibold text-sage-800 mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sage-800 mb-2">Email</h3>
                  <a href="mailto:bradford.j.photos@gmail.com" className="text-sage-600 hover:text-sage-700 transition-colors">
                    bradford.j.photos@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sage-800 mb-2">Phone</h3>
                  <a href="tel:3854576487" className="text-sage-600 hover:text-sage-700 transition-colors">
                    (385) 457-6487
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sage-800 mb-2">Location</h3>
                  <p className="text-sage-600">Salina, UT and surrounding areas</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center shrink-0">
                  <Facebook className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sage-800 mb-2">Facebook</h3>
                  <a href="https://www.facebook.com/profile.php?id=61578237507323" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:text-sage-700 transition-colors">
                    @jessibradfordphotography
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sage-800 mb-2">Instagram</h3>
                  <a href="https://instagram.com/jessibradfordphotography" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:text-sage-700 transition-colors">
                    @jessibradfordphotography
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;