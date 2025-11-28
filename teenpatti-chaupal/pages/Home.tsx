import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, Play, Star, Dices, Users, Trophy, Zap, Gift, ShieldCheck } from 'lucide-react';
import { GAMES_DATA, FEATURES, WHY_CHOOSE_US, TESTIMONIALS } from '../constants';
import callbreakimage from '../assets/call-break.png';
import ludoimage from '../assets/ludo.png';
import pokerimage from '../assets/poker.png';
import rummyimage from '../assets/rummy.png';
import teenpattiimage from '../assets/teen-patti.png';
import platformimage from '../assets/platform.png';

const Home: React.FC = () => {
  const [onlinePlayers, setOnlinePlayers] = useState(0);

  useEffect(() => {
    // Random number between 9840 and 11794
    const count = Math.floor(Math.random() * (11794 - 9840 + 1)) + 9840;
    setOnlinePlayers(count);

    // Simple reveal animation on scroll
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

  // Helper for cycling colors
  const getCardColor = (index: number) => {
    const colors = [
      'border-violet-100 hover:border-violet-300 hover:shadow-violet-200',
      'border-amber-100 hover:border-amber-300 hover:shadow-amber-200',
      'border-rose-100 hover:border-rose-300 hover:shadow-rose-200',
      'border-cyan-100 hover:border-cyan-300 hover:shadow-cyan-200',
      'border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-200',
    ];
    return colors[index % colors.length];
  };

  const getIconBg = (index: number) => {
    const bgs = [
      'bg-violet-50 text-violet-600',
      'bg-amber-50 text-amber-600',
      'bg-rose-50 text-rose-500',
      'bg-cyan-50 text-cyan-600',
      'bg-emerald-50 text-emerald-600',
    ];
    return bgs[index % bgs.length];
  };

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-20"></div>
        
        {/* Decorative Shapes */}
        <div className="absolute top-20 right-0 w-72 h-72 bg-accent opacity-20 rounded-full blur-3xl -z-0 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl -z-0" style={{animationDelay: '1.5s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="text-center max-w-4xl mx-auto reveal">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 shadow-lg mb-8 animate-fade-in-up">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-white tracking-wide">{onlinePlayers.toLocaleString()} Players Online</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 drop-shadow-lg leading-tight">
              Play. Compete. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">Win Big.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-violet-100 mb-10 max-w-2xl mx-auto font-medium">
              Play Your Favorite Games in One Place. Join the ultimate social gaming community today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/games" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-slate-900 bg-white hover:bg-slate-50 hover:scale-105 transition-all shadow-xl shadow-purple-900/30">
                <Play className="mr-2 h-6 w-6 fill-slate-900" /> Play Now
              </Link>
              <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/30">
                <Download className="mr-2 h-6 w-6" /> Download App
              </button>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute left-0 right-0" style={{ bottom: '-100px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto text-surface fill-current">
            <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Game Showcase Section */}
      <section className="py-24 bg-surface relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl mb-6 shadow-xl text-black transform -rotate-3 hover:rotate-0 transition-transform border border-slate-100">
              <Dices className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Game Showcase</h2>
            <p className="text-lg text-slate-600 font-medium">Choose your arena and show your skills.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GAMES_DATA.map((game, idx) => (
              <div key={game.id} className={`reveal group bg-white rounded-3xl shadow-lg border-2 ${getCardColor(idx)} overflow-hidden transition-all duration-300 transform hover:-translate-y-2`} style={{transitionDelay: `${idx * 100}ms`}}>
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                  <img 
                    src={game.id === 'callbreak' ? callbreakimage : game.id === 'ludo' ? ludoimage : game.id === 'poker' ? pokerimage : game.id === 'rummy' ? rummyimage : game.id === 'teen-patti' ? teenpattiimage : ''} 
                    alt={game.title} 
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Floating badge */}
                  <div className={`absolute top-4 right-4 ${getIconBg(idx)} p-2 rounded-xl shadow-lg z-20`}>
                    <game.icon className="h-6 w-6" />
                  </div>
                  <div className="absolute bottom-4 left-4 z-20">
                     <span className="bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                       {game.variants.length} Variants
                     </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{game.title}</h3>
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed line-clamp-2 font-medium">{game.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {game.variants.slice(0, 3).map((v, vIdx) => (
                      <span key={v.name} className={`px-2 py-1 text-xs rounded-lg font-bold border bg-slate-50 text-slate-600 border-slate-100`}>
                        {v.name}
                      </span>
                    ))}
                  </div>
                  
                  <Link to="/games" className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-white font-bold transition-all shadow-md bg-gradient-to-r from-slate-800 to-slate-900 group-hover:from-primary group-hover:to-accent`}>
                    Play Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Colorful blobs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-cyan-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-50 rounded-full blur-3xl opacity-60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="reveal">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Everything you need for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Ultimate Gaming Experience</span>
              </h2>
              <div className="space-y-6 mt-10">
                {FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex gap-6 group p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center justify-center h-16 w-16 rounded-2xl ${getIconBg(idx)} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative reveal">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary via-accent to-secondary rounded-[2.5rem] opacity-30 blur-2xl animate-pulse-slow"></div>
              <div className="relative bg-gradient-to-br from-white to-slate-50 p-3 rounded-[2rem] shadow-2xl border border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={platformimage} 
                  alt="App Interface" 
                  className="rounded-[1.5rem] shadow-inner w-full"
                />
                
                {/* Floating Stats */}
                <div className="absolute -left-8 top-40 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Active Players</p>
                    <p className="font-extrabold text-slate-900 text-lg">10K+</p>
                  </div>
                </div>

                <div className="absolute -right-8 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow" style={{animationDelay: '1.5s'}}>
                  <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase">Daily Winners</p>
                    <p className="font-extrabold text-slate-900 text-lg">500+</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Chaupal App?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div key={idx} className="reveal text-center p-8 rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100" style={{transitionDelay: `${idx * 100}ms`}}>
                <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full ${getIconBg(idx + 2)} mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                  <item.icon className="h-9 w-9" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">What Players Say</h2>
            <p className="text-slate-400 mt-4">Join the community that loves to play.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="reveal bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-1 text-secondary mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-slate-300 mb-8 italic leading-relaxed font-medium">"{t.content}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover ring-2 ring-primary" />
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-primary uppercase tracking-wide font-bold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent opacity-20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-6 py-2 mb-8 border border-white/30">
                <span className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                  <Gift className="h-4 w-4" /> Welcome Offer
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Start Your Winning Streak!</h2>
              <p className="text-indigo-100 text-xl font-medium mb-10 max-w-2xl mx-auto">
                Download now and claim <span className="text-white font-bold underline decoration-wavy decoration-accent">5,000 Free Chips</span>.
              </p>
              <button className="bg-white text-violet-700 px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-slate-50 hover:scale-105 transition-all">
                Download App Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;