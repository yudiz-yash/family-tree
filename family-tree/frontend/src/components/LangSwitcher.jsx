import React from 'react';
import { FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function LangSwitcher() {
  const { t, lang, switchLang } = useLanguage();

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.4)',
      borderRadius: 10, padding: '6px 12px',
      backdropFilter: 'blur(8px)',
    }}>
      <FiGlobe size={14} style={{ color: '#fff' }} />
      <select
        value={lang}
        onChange={e => switchLang(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'Poppins, sans-serif',
          appearance: 'none',
          WebkitAppearance: 'none',
          paddingRight: 16,
        }}
      >
        <option value="gu" style={{ color: '#1e1b4b' }}>{t.gujarati}</option>
        <option value="en" style={{ color: '#1e1b4b' }}>{t.english}</option>
      </select>
      <span style={{ fontSize: 10, color: '#fff', pointerEvents: 'none' }}>▼</span>
    </div>
  );
}
