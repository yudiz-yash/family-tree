import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiSave, FiDollarSign, FiImage, FiTrash2, FiTool } from 'react-icons/fi';
import api from '../api/axios';

function PaymentSettings() {
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    api.get('/api/admin/settings')
      .then(res => {
        setQrCodeImage(res.data.qrCodeImage || '');
        setPaymentAmount(res.data.paymentAmount || '');
        setMaintenanceMode(res.data.maintenanceMode ?? false);
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleMaintenanceToggle = async () => {
    const newVal = !maintenanceMode;
    setTogglingMaintenance(true);
    try {
      await api.put('/api/admin/settings', { maintenanceMode: newVal });
      setMaintenanceMode(newVal);
      toast.success(newVal ? 'Maintenance mode enabled' : 'Maintenance mode disabled');
    } catch {
      toast.error('Failed to update maintenance mode');
    } finally {
      setTogglingMaintenance(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setQrCodeImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/admin/settings', { qrCodeImage, paymentAmount });
      toast.success('Payment settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" style={{ color: '#6C3FC5', width: 48, height: 48 }} role="status" />
      </div>
    );
  }

  return (
    <div>
      <h4 className="page-title">Settings</h4>
      <p className="page-subtitle">Manage site maintenance mode and payment settings.</p>

      {/* Maintenance Mode */}
      <div className="admin-table-card" style={{ padding: 24, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48,
              background: maintenanceMode ? 'linear-gradient(135deg, #6C3FC5, #8B5CF6)' : '#f1f5f9',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s',
            }}>
              <FiTool size={20} color={maintenanceMode ? '#fff' : '#94a3b8'} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>Maintenance Mode</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                {maintenanceMode
                  ? 'Website is currently offline for users'
                  : 'Website is live and accessible to users'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
              color: maintenanceMode ? '#dc2626' : '#16a34a',
              background: maintenanceMode ? '#fff0f0' : '#f0fdf4',
              border: `1px solid ${maintenanceMode ? '#fecaca' : '#bbf7d0'}`,
              borderRadius: 20, padding: '3px 12px',
            }}>
              {maintenanceMode ? 'ON' : 'OFF'}
            </span>

            {/* Toggle switch */}
            <button
              onClick={handleMaintenanceToggle}
              disabled={togglingMaintenance}
              style={{
                width: 52, height: 28,
                borderRadius: 14,
                background: maintenanceMode ? '#6C3FC5' : '#cbd5e1',
                border: 'none',
                cursor: togglingMaintenance ? 'not-allowed' : 'pointer',
                position: 'relative',
                transition: 'background 0.3s',
                flexShrink: 0,
                opacity: togglingMaintenance ? 0.7 : 1,
              }}
              title={maintenanceMode ? 'Disable maintenance mode' : 'Enable maintenance mode'}
            >
              <span style={{
                position: 'absolute',
                top: 3, left: maintenanceMode ? 26 : 3,
                width: 22, height: 22,
                background: '#fff',
                borderRadius: '50%',
                transition: 'left 0.3s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        </div>

        {maintenanceMode && (
          <div style={{
            marginTop: 16,
            background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
            border: '1px solid #fde68a',
            borderRadius: 10,
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: '#92400e', fontWeight: 500,
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            Maintenance mode is active — users will see the maintenance page instead of the website.
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* QR Code upload */}
        <div className="col-lg-6">
          <div className="admin-table-card" style={{ padding: 24 }}>
            <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiImage size={16} color="#6C3FC5" /> QR Code Image
            </h6>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
              Upload a QR code image (UPI / any payment QR). Max 2MB.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />

            {qrCodeImage ? (
              <div style={{ textAlign: 'center' }}>
                <img
                  src={qrCodeImage}
                  alt="QR Code"
                  style={{
                    width: 200, height: 200, objectFit: 'contain',
                    border: '2px solid #e0d5ff', borderRadius: 14,
                    padding: 10, background: '#fff', marginBottom: 16
                  }}
                />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    className="btn btn-sm d-inline-flex align-items-center gap-1"
                    style={{
                      background: '#f1eeff', color: '#6C3FC5',
                      border: '1.5px solid #e0d5ff', borderRadius: 8,
                      fontSize: 13, fontWeight: 600, padding: '6px 16px'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiUpload size={13} /> Change Image
                  </button>
                  <button
                    className="btn btn-sm d-inline-flex align-items-center gap-1"
                    style={{
                      background: '#fff0f0', color: '#dc2626',
                      border: '1px solid #fecaca', borderRadius: 8,
                      fontSize: 13, fontWeight: 600, padding: '6px 16px'
                    }}
                    onClick={() => setQrCodeImage('')}
                  >
                    <FiTrash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  border: '2px dashed #d1d5db', borderRadius: 14,
                  padding: '40px 20px', textAlign: 'center', cursor: 'pointer',
                  background: '#fafafa', transition: 'border-color 0.2s'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload size={32} color="#94a3b8" style={{ marginBottom: 12 }} />
                <p style={{ color: '#64748b', fontSize: 14, margin: 0, fontWeight: 500 }}>
                  Click to upload QR code
                </p>
                <p style={{ color: '#94a3b8', fontSize: 12, margin: '4px 0 0' }}>
                  PNG, JPG, SVG — Max 2MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Amount + Save */}
        <div className="col-lg-6">
          <div className="admin-table-card" style={{ padding: 24 }}>
            <h6 style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiDollarSign size={16} color="#6C3FC5" /> Payment Amount
            </h6>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
              This amount is shown to the user below the QR code.
            </p>

            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>
                Amount (₹)
              </label>
              <div className="input-group">
                <span className="input-group-text" style={{ background: '#f8f4ff', border: '1.5px solid #e0d5ff', color: '#6C3FC5', fontWeight: 700 }}>
                  ₹
                </span>
                <input
                  type="number"
                  className="form-control"
                  style={{ border: '1.5px solid #e0d5ff', fontSize: 15, fontWeight: 600 }}
                  placeholder="e.g. 500"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  min="0"
                />
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                Leave blank to hide the amount on the payment page.
              </div>
            </div>

            {/* Preview */}
            {(qrCodeImage || paymentAmount) && (
              <div style={{
                background: 'linear-gradient(135deg, #f8f4ff, #ede9fe)',
                border: '1px solid #e0d5ff', borderRadius: 14,
                padding: '16px', marginBottom: 20
              }}>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  User Preview
                </div>
                <div style={{ textAlign: 'center' }}>
                  {qrCodeImage && (
                    <img src={qrCodeImage} alt="QR" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, border: '1px solid #e0d5ff', background: '#fff', padding: 4, marginBottom: 8 }} />
                  )}
                  {paymentAmount && (
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#6C3FC5' }}>₹{paymentAmount}</div>
                  )}
                </div>
              </div>
            )}

            <button
              className="btn w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
              style={{ background: '#6C3FC5', color: '#fff', borderRadius: 10, padding: '12px', fontSize: 14 }}
              onClick={handleSave}
              disabled={saving}
            >
              <FiSave size={15} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSettings;
