import React, { useEffect, useState } from 'react';
import logo from '/logo.png';

const gears = [
  { size: 90, top: '10%', left: '5%', duration: 8, delay: 0 },
  { size: 55, top: '70%', left: '2%', duration: 6, delay: 1 },
  { size: 70, top: '15%', right: '6%', duration: 10, delay: 0.5 },
  { size: 40, top: '75%', right: '4%', duration: 5, delay: 2 },
];

function Gear({ size, style, duration, delay, reverse }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: 'absolute',
        opacity: 0.12,
        animation: `${reverse ? 'gear-spin-reverse' : 'gear-spin'} ${duration}s linear ${delay}s infinite`,
        ...style,
      }}
    >
      <path
        d="M43.3 5.6l-2.6 8.1A35.5 35.5 0 0 0 32 17.4L23.5 14 14 23.5l3.4 8.5a35.5 35.5 0 0 0-3.7 8.7L5.6 43.3v13.4l8.1 2.6a35.5 35.5 0 0 0 3.7 8.7L14 76.5 23.5 86l8.5-3.4a35.5 35.5 0 0 0 8.7 3.7l2.6 8.1h13.4l2.6-8.1a35.5 35.5 0 0 0 8.7-3.7L76.5 86 86 76.5l-3.4-8.5a35.5 35.5 0 0 0 3.7-8.7l8.1-2.6V43.3l-8.1-2.6a35.5 35.5 0 0 0-3.7-8.7L86 23.5 76.5 14l-8.5 3.4a35.5 35.5 0 0 0-8.7-3.7L56.7 5.6H43.3zM50 33a17 17 0 1 1 0 34A17 17 0 0 1 50 33z"
        fill="#F4C430"
      />
    </svg>
  );
}

function MaintenancePage() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes gear-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes gear-spin-reverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244,196,48,0.5); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 18px rgba(244,196,48,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(244,196,48,0); }
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .maint-card { animation: fade-in-up 0.7s ease both; }
        .maint-logo { animation: float-up 3.5s ease-in-out infinite; }
        .maint-icon-wrap { animation: pulse-ring 2s ease-out infinite; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4a2d8a 50%, #6C3FC5 100%)',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      }}>
        {/* decorative blobs */}
        <div style={{
          position: 'absolute', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(244,196,48,0.10) 0%, transparent 70%)',
          top: '-180px', right: '-180px', borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
          bottom: '-120px', left: '-120px', borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* floating gears */}
        {gears.map((g, i) => (
          <Gear key={i} size={g.size} duration={g.duration} delay={g.delay} reverse={i % 2 === 1}
            style={{ top: g.top, left: g.left, right: g.right, bottom: g.bottom }} />
        ))}

        {/* card */}
        <div className="maint-card" style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 28,
          padding: '52px 44px 44px',
          width: '100%',
          maxWidth: 460,
          boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(255,255,255,0.5)',
        }}>
          {/* logo */}
          <div className="maint-logo" style={{ marginBottom: 28 }}>
            <img src={logo} alt="logo" style={{ width: 110, height: 110, objectFit: 'contain' }} />
          </div>

          {/* icon badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <div className="maint-icon-wrap" style={{
              width: 72, height: 72,
              background: 'linear-gradient(135deg, #6C3FC5 0%, #8B5CF6 100%)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
          </div>

          {/* headings */}
          <h1 style={{
            fontSize: 30,
            fontWeight: 800,
            color: '#1e1b4b',
            margin: '0 0 6px',
            letterSpacing: '-0.5px',
          }}>
            Under Maintenance
          </h1>
          <div style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#6C3FC5',
            marginBottom: 18,
            fontFamily: "'Noto Sans Gujarati', sans-serif",
          }}>
            સુધારા કાર્ય ચાલુ છે
          </div>

          {/* divider */}
          <div style={{
            width: 60, height: 3,
            background: 'linear-gradient(90deg, #6C3FC5, #F4C430)',
            borderRadius: 4,
            margin: '0 auto 22px',
          }} />

          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: '0 0 10px' }}>
            We're working hard to improve your experience. Our site will be back online shortly.
          </p>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 32px' }}>
            અમે ટૂંક સમયમાં પાછા આવીશું. અસુવિધા બદલ માફ કરશો.
          </p>

          {/* animated status */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f4ff, #ede9fe)',
            border: '1.5px solid #e0d5ff',
            borderRadius: 14,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
            <span style={{
              width: 10, height: 10,
              background: '#F4C430',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'pulse-ring 1.5s ease-out infinite',
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#6C3FC5' }}>
              Working on it{dots}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default MaintenancePage;
