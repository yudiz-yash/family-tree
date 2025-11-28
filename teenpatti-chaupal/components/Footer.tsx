import React from 'react';
import { Link } from 'react-router-dom';
import { Dices, Facebook, Twitter, Instagram, Youtube, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-lg">
                <Dices className="h-6 w-6 text-primary" />
              </div>
              <span className="font-bold text-xl text-white">Chaupal App</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              India's favorite social gaming platform. Play for fun, compete with friends, and enjoy a safe gaming environment.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="bg-slate-800 p-2 rounded-full text-slate-400 hover:bg-primary hover:text-white transition-all"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full text-slate-400 hover:bg-cyan hover:text-white transition-all"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full text-slate-400 hover:bg-accent hover:text-white transition-all"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full text-slate-400 hover:bg-red-500 hover:text-white transition-all"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-secondary transition-colors">Home</Link></li>
              <li><Link to="/games" className="text-slate-400 hover:text-secondary transition-colors">Games</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-secondary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Features</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-slate-400">Private Tables</li>
              <li className="text-slate-400">Refer & Earn</li>
              <li className="text-slate-400">Daily Coin Bonanza</li>
              <li className="text-slate-400">Social Chat</li>
            </ul>
          </div>

          {/* Popular Games */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Popular Games</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/games" className="text-slate-400 hover:text-accent transition-colors">Teen Patti AK47</Link></li>
              <li><Link to="/games" className="text-slate-400 hover:text-accent transition-colors">Texas Hold'em</Link></li>
              <li><Link to="/games" className="text-slate-400 hover:text-accent transition-colors">Point Rummy</Link></li>
              <li><Link to="/games" className="text-slate-400 hover:text-accent transition-colors">Ludo Rush</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Chaupal App. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 md:justify-end text-sm">
              <Link to="/disclaimer" className="text-slate-500 hover:text-white transition-colors">Disclaimer</Link>
              <Link to="/privacy-policy" className="text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="text-slate-500 hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
          </div>
          
          <div className="mt-8 bg-slate-800/50 rounded-xl p-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center border border-slate-700">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <p className="text-xs text-slate-400 font-medium max-w-2xl">
              PLAY RESPONSIBLY. 18+ ONLY. This game uses virtual currency only. No real money gambling is involved. Success in this game does not imply future success at real money gambling.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;