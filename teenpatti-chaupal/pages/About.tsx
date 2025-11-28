import React, { useEffect } from 'react';
import { Shield, Target, Heart, Award, Cpu, Globe, Rocket } from 'lucide-react';

const About: React.FC = () => {
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

  return (
    <div className="bg-surface min-h-screen">
      
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-primary to-purple-800 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 text-center reveal relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-6">About Chaupal App</h1>
          <p className="text-xl md:text-2xl text-indigo-100 leading-relaxed font-medium">
            Building the future of online community gaming where fun comes first.
          </p>
        </div>
      </section>

      {/* Mission & Vision - Zig Zag Style */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Mission */}
          <div className="reveal flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 relative">
               <div className="absolute inset-0 bg-amber-100 rounded-[2rem] transform rotate-3"></div>
               <div className="relative bg-white p-10 rounded-[2rem] border border-amber-100 shadow-xl flex items-center justify-center min-h-[300px]">
                 <Target className="h-32 w-32 text-secondary opacity-90" />
               </div>
            </div>
            <div className="w-full md:w-1/2">
               <span className="text-secondary font-bold tracking-widest uppercase mb-2 block">What Drives Us</span>
               <h2 className="text-4xl font-black text-slate-900 mb-6">Our Mission</h2>
               <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                 To deliver secure, entertaining, and competitive gaming experiences that bring people together through skill and strategy. We believe in creating a platform where every hand dealt creates a memory.
               </p>
            </div>
          </div>

          {/* Vision */}
          <div className="reveal flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="w-full md:w-1/2 relative">
               <div className="absolute inset-0 bg-violet-100 rounded-[2rem] transform -rotate-3"></div>
               <div className="relative bg-white p-10 rounded-[2rem] border border-violet-100 shadow-xl flex items-center justify-center min-h-[300px]">
                 <Globe className="h-32 w-32 text-primary opacity-90" />
               </div>
            </div>
            <div className="w-full md:w-1/2 md:text-right">
               <span className="text-primary font-bold tracking-widest uppercase mb-2 block">Where We Are Going</span>
               <h2 className="text-4xl font-black text-slate-900 mb-6">Our Vision</h2>
               <p className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">
                 To become India’s most trusted and feature-rich social gaming platform, creating a virtual 'Chaupal' for everyone. We envision a community of millions playing, chatting, and winning together.
               </p>
            </div>
          </div>

          {/* Values */}
          <div className="reveal flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 relative">
               <div className="absolute inset-0 bg-rose-100 rounded-[2rem] transform rotate-2"></div>
               <div className="relative bg-white p-10 rounded-[2rem] border border-rose-100 shadow-xl flex items-center justify-center min-h-[300px]">
                 <Heart className="h-32 w-32 text-accent opacity-90" />
               </div>
            </div>
            <div className="w-full md:w-1/2">
               <span className="text-accent font-bold tracking-widest uppercase mb-2 block">Our Core DNA</span>
               <h2 className="text-4xl font-black text-slate-900 mb-6">Our Values</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-accent">
                   <h4 className="font-bold text-slate-900">Community First</h4>
                   <p className="text-sm text-slate-600">Players are our priority.</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-accent">
                   <h4 className="font-bold text-slate-900">Fair Play</h4>
                   <p className="text-sm text-slate-600">Randomness.</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-accent">
                   <h4 className="font-bold text-slate-900">Innovation</h4>
                   <p className="text-sm text-slate-600">Always improving.</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-accent">
                   <h4 className="font-bold text-slate-900">Responsibility</h4>
                   <p className="text-sm text-slate-600">Safe gaming environment.</p>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* Tech & Stats */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <span className="text-primary font-bold tracking-wider uppercase">Technology</span>
              <h2 className="text-4xl font-black text-slate-900 mb-6 mt-2">Powered by Cutting-Edge Tech</h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Our platform handles millions of concurrent connections with sub-millisecond latency. 
                We use advanced RNG (Random Number Generator) algorithms certified by international labs.
              </p>
              <div className="inline-flex items-center gap-4 bg-slate-50 px-6 py-4 rounded-xl border border-slate-200">
                <Cpu className="h-8 w-8 text-secondary" />
                <span className="font-bold text-slate-900">Certified RNG Tech Stack</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 reveal">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-3xl text-center shadow-lg shadow-purple-200 text-white transform hover:-translate-y-2 transition-transform">
                <div className="text-4xl font-black mb-2">1M+</div>
                <div className="text-sm font-bold opacity-90">Happy Players</div>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-3xl text-center shadow-lg shadow-orange-200 text-white transform hover:-translate-y-2 transition-transform">
                <div className="text-4xl font-black mb-2">24/7</div>
                <div className="text-sm font-bold opacity-90">Live Support</div>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-red-600 p-6 rounded-3xl text-center shadow-lg shadow-green-200 text-white transform hover:-translate-y-2 transition-transform">
                <div className="text-4xl font-black mb-2">100%</div>
                <div className="text-sm font-bold opacity-90">Fair Play</div>
              </div>
              <div className="bg-gradient-to-br from-violet-400 to-blue-500 p-6 rounded-3xl text-center shadow-lg shadow-cyan-200 text-white transform hover:-translate-y-2 transition-transform">
                <div className="text-4xl font-black mb-2">4.8</div>
                <div className="text-sm font-bold opacity-90">App Store Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Responsible Gaming */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[3rem] p-12 reveal shadow-2xl relative overflow-hidden">
             {/* Decor */}
             <div className="absolute top-0 left-0 w-64 h-64 bg-primary opacity-20 rounded-full blur-3xl"></div>
             
             <div className="relative z-10">
               <Shield className="h-16 w-16 text-emerald-400 mx-auto mb-8" />
               <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Commitment to Responsible Gaming</h2>
               <p className="max-w-3xl mx-auto text-slate-300 mb-10 text-lg leading-relaxed">
                 Chaupal App is a social gaming platform. We do not offer real money gambling. 
                 We are committed to providing a fun and safe environment for our players to enjoy their favorite games.
               </p>
               <div className="flex justify-center gap-4 flex-wrap">
                 <span className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-sm font-bold text-white border border-white/20">18+ Only</span>
                 <span className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-sm font-bold text-white border border-white/20">No Real Money</span>
                 <span className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-sm font-bold text-white border border-white/20">RNG Certified</span>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;