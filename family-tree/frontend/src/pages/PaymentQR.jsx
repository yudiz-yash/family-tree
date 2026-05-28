import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiLogOut } from 'react-icons/fi';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import LangSwitcher from '../components/LangSwitcher';

function PaymentQR() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('family_tree_user') || 'null');
    if (user?.status === 'approved') {
      navigate('/dashboard', { replace: true });
      return;
    }
    api.get('/api/settings')
      .then(res => {
        setQrCodeImage(res.data.qrCodeImage || '');
        setPaymentAmount(res.data.paymentAmount || '');
      })
      .catch(() => {})
      .finally(() => setLoadingSettings(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('family_tree_token');
    localStorage.removeItem('family_tree_user');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <LangSwitcher />
      <div className="profile-card" style={{ maxWidth: 460 }}>
        <div className="text-center mb-4">
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <FiCheckCircle size={30} color="#fff" />
          </div>
          <h3 style={{ color: '#6C3FC5', fontWeight: 700, marginBottom: 4 }}>{t.paymentTitle}</h3>
          <p style={{ color: '#888', fontSize: 14 }}>{t.paymentSub}</p>
        </div>

        <div className="step-indicator">
          <div className="step-dot"></div>
          <div className="step-dot"></div>
          <div className="step-dot active"></div>
        </div>

        {loadingSettings ? (
          <div className="text-center py-4">
            <div className="spinner-border" style={{ color: '#6C3FC5', width: 36, height: 36 }} role="status" />
          </div>
        ) : (
          <>
            {paymentAmount && (
              <div style={{
                textAlign: 'center', marginBottom: 20,
                padding: '14px 20px',
                background: 'linear-gradient(135deg, #f8f4ff, #ede9fe)',
                borderRadius: 14, border: '1px solid #e0d5ff'
              }}>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{t.paymentAmount}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#6C3FC5' }}>
                  ₹{paymentAmount}
                </div>
              </div>
            )}

            {qrCodeImage ? (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <img
                  src={qrCodeImage}
                  alt="Payment QR Code"
                  style={{
                    width: 220, height: 220, objectFit: 'contain',
                    borderRadius: 14, border: '2px solid #e0d5ff',
                    padding: 10, background: '#fff'
                  }}
                />
              </div>
            ) : (
              <div style={{
                textAlign: 'center', marginBottom: 12, padding: '30px 20px',
                background: '#f9fafb', borderRadius: 14, border: '2px dashed #e2e8f0'
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📲</div>
                <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>{t.noQrCode}</p>
              </div>
            )}

            <div style={{
              textAlign: 'center', marginBottom: 20,
              fontSize: 14, color: '#6C3FC5', fontWeight: 600,
              lineHeight: 1.6
            }}>
              ચુકવણી પૂર્ણ કર્યા પછી, લુહાર ડોડીયા પરીવાર ગ્રુપમા સ્ક્રીનશોટ મોલકવો
            </div>

            <div style={{
              background: '#fef9ec', border: '1px solid #fde68a',
              borderRadius: 12, padding: '12px 16px',
              fontSize: 13, color: '#92400e', marginBottom: 24
            }}>
              {t.paymentInstruction}
            </div>

            <button
              onClick={handleLogout}
              className="btn w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
              style={{ background: '#f1eeff', color: '#6C3FC5', border: '1.5px solid #e0d5ff', borderRadius: 10, padding: '12px' }}
            >
              <FiLogOut size={16} /> {t.navLogout}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentQR;
