import React, { useEffect, useState } from 'react';
import { GAMES_DATA, FEATURES } from '../constants';
import { Play, BookOpen, LayoutGrid, CheckCircle } from 'lucide-react';
import callbreakimage from '../assets/call-break.png';
import ludoimage from '../assets/ludo.png';
import pokerimage from '../assets/poker.png';
import rummyimage from '../assets/rummy.png';
import teenpattiimage from '../assets/teen-patti.png';

const Games: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'how-to-play'>('all');

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
  }, [activeTab]);

  return (
    <div className="bg-surface min-h-screen pb-20">
      
      {/* Colorful Header */}
      <div className="bg-gradient-to-r from-primary to-purple-800 text-white py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal">
           <h1 className="text-4xl md:text-6xl font-black mb-6">Our Games Collection</h1>
           <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            From classic card games to exciting board adventures. Pick your favorite and start playing for free.
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* Tabs */}
        <div className="flex justify-center mb-16 reveal">
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 inline-flex">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex items-center px-8 py-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'all' ? 'bg-gradient-to-r from-primary to-primaryDark text-white shadow-lg' : 'text-slate-600 hover:text-primary hover:bg-slate-50'}`}
            >
              <LayoutGrid className="mr-2 h-4 w-4" /> All Games
            </button>
            <button 
              onClick={() => setActiveTab('how-to-play')}
              className={`flex items-center px-8 py-4 rounded-xl font-bold text-sm transition-all ${activeTab === 'how-to-play' ? 'bg-gradient-to-r from-secondary to-orange-600 text-white shadow-lg' : 'text-slate-600 hover:text-secondary hover:bg-slate-50'}`}
            >
              <BookOpen className="mr-2 h-4 w-4" /> How to Play
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'all' ? (
          <div className="space-y-12 animate-fade-in-up">
            {GAMES_DATA.map((game, index) => {
              // Alternate colors based on index
              const colorClass = index % 2 === 0 ? 'from-primary/5 to-purple-50' : 'from-accent/5 to-pink-50';
              const btnGradient = index % 2 === 0 ? 'from-primary to-purple-700' : 'from-accent to-rose-600';
              const iconColor = index % 2 === 0 ? 'text-primary' : 'text-accent';

              return (
                <div key={game.id} className={`reveal flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 bg-white rounded-[2rem] p-4 shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300`}>
                  
                  {/* Image Side */}
                  <div className="w-full md:w-1/2 relative group rounded-[1.5rem] overflow-hidden h-80 md:h-auto">
                    <img 
                      src={game.id === 'callbreak' ? callbreakimage : game.id === 'ludo' ? ludoimage : game.id === 'poker' ? pokerimage : game.id === 'rummy' ? rummyimage : game.id === 'teen-patti' ? teenpattiimage : ''} 
                      alt={game.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>

                  {/* Content Side */}
                  <div className={`w-full md:w-1/2 flex flex-col justify-center p-4 md:p-8 bg-gradient-to-br ${colorClass} rounded-[1.5rem]`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 bg-white rounded-2xl ${iconColor} shadow-sm`}>
                        <game.icon className="h-8 w-8" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900">{game.title}</h2>
                    </div>
                    
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">{game.description}</p>
                    
                    <div className="mb-8 bg-white/60 p-6 rounded-2xl backdrop-blur-sm border border-white/50">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Available Variants</h3>
                      <div className="flex flex-wrap gap-2">
                        {game.variants.map((variant) => (
                          <div key={variant.name} className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">
                            {variant.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button className={`flex-1 inline-flex justify-center items-center bg-gradient-to-r ${btnGradient} text-white px-8 py-4 rounded-xl font-bold shadow-lg transform hover:-translate-y-1 transition-all`}>
                        <Play className="mr-2 h-5 w-5" /> Play Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up">
            {GAMES_DATA.map((game, idx) => (
              <div key={game.id} className="reveal bg-white rounded-3xl p-8 shadow-md border border-slate-100 hover:border-slate-300 transition-colors">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className={`p-5 rounded-2xl ${idx % 2 === 0 ? 'bg-purple-100 text-primary' : 'bg-orange-100 text-secondary'}`}>
                    <game.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      How to Play <span className={`${idx % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>{game.title}</span>
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {game.rules.map((rule, i) => (
                        <div key={i} className="flex gap-4">
                          <CheckCircle className={`h-6 w-6 flex-shrink-0 ${idx % 2 === 0 ? 'text-emerald-500' : 'text-blue-500'}`} />
                          <p className="text-slate-700 font-medium leading-relaxed">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Games;