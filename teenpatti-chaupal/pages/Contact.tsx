import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Twitter, Youtube, MessageCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const FAQ_ITEMS = [
    { q: "How do I get chips?", a: "You get free chips daily as a login bonus. You can also win chips by playing games or participating in tournaments." },
    { q: "Is this a real money app?", a: "No, Chaupal App is a social gaming platform. The chips used are virtual currency and have no real money value." },
    { q: "Can I withdraw my winnings?", a: "Since the chips are virtual and for gameplay only, they cannot be withdrawn or exchanged for real money." },
    { q: "How do I create a private table?", a: "Go to the game of your choice, select 'Private Table', choose your settings, and invite your friends using the room code." },
  ];

  return (
    <div className="min-h-screen bg-surface">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-rose-600 text-white py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
            <h1 className="text-4xl md:text-5xl font-black mb-4">Get in Touch</h1>
            <p className="text-xl text-rose-100 font-medium">Have questions? We are here to help you 24/7.</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Contact Info Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 reveal">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" /> Contact Information
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="bg-violet-100 p-3 rounded-xl text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Support Email</p>
                  <p className="text-slate-600">support@chaupalapp.com</p>
                  <p className="text-slate-600">partners@chaupalapp.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="bg-amber-100 p-3 rounded-xl text-secondary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Phone Number</p>
                  <p className="text-slate-600">+91 98765 43210</p>
                  <p className="text-sm text-slate-500 font-bold">(Mon-Sat, 9 AM - 6 PM)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="bg-cyan-100 p-3 rounded-xl text-cyan-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Support Timings</p>
                  <p className="text-slate-600">In-App Chat: 24/7</p>
                  <p className="text-slate-600">Email Response: Within 24 Hours</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-8 border-t border-slate-100">
               <h3 className="font-bold text-slate-900 mb-4">Follow Us</h3>
               <div className="flex gap-4">
                 <a href="#" className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"><Facebook className="h-5 w-5" /></a>
                 <a href="#" className="p-3 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-all"><Instagram className="h-5 w-5" /></a>
                 <a href="#" className="p-3 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-500 hover:text-white transition-all"><Twitter className="h-5 w-5" /></a>
                 <a href="#" className="p-3 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"><Youtube className="h-5 w-5" /></a>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 reveal" style={{transitionDelay: '100ms'}}>
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
               <Send className="h-6 w-6 text-accent" /> Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-accent focus:ring-0 outline-none transition-all bg-slate-50"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-accent focus:ring-0 outline-none transition-all bg-slate-50"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-100 focus:border-accent focus:ring-0 outline-none transition-all resize-none bg-slate-50"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-accent to-rose-600 text-white py-4 rounded-xl font-bold hover:shadow-lg hover:from-rose-600 hover:to-accent transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section with Accordion */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 reveal">
            <div className="inline-flex p-3 bg-purple-100 text-primary rounded-full mb-4">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openFaqIndex === idx ? 'border-primary shadow-md' : 'border-slate-200 shadow-sm hover:border-primary/30'}`}
                style={{transitionDelay: `${idx * 100}ms`}}
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="font-bold text-slate-900 text-lg pr-4">{item.q}</h3>
                  {openFaqIndex === idx ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                <div 
                  className={`px-6 text-slate-600 font-medium transition-all duration-300 ease-in-out ${openFaqIndex === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;