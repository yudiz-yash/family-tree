import React from 'react';
import { FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

export default function LangSwitcher() {
  const { t, lang, switchLang } = useLanguage();

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'rgba(108,63,197,0.15)',
      border: '1px solid rgba(108,63,197,0.35)',
      borderRadius: 10, padding: '6px 12px',
      backdropFilter: 'blur(8px)',
    }}>
      <FiGlobe size={14} style={{ color: '#6C3FC5' }} />
      <select
        value={lang}
        onChange={e => switchLang(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#6C3FC5',
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
        <option value="gu">{t.gujarati}</option>
        <option value="en">{t.english}</option>
      </select>
      <span style={{ fontSize: 10, color: '#6C3FC5', pointerEvents: 'none' }}>▼</span>
    </div>
  );
}
