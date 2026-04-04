import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUsers, FiGitMerge, FiArrowRight, FiPlusCircle, FiUser, FiMapPin, FiPhone } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('family_tree_user');
    if (userStr) setUser(JSON.parse(userStr));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, treeRes] = await Promise.all([
        api.get('/api/user/profile'),
        api.get('/api/family-tree')
      ]);
      const userData = profileRes.data.user;
      setUser(userData);
      localStorage.setItem('family_tree_user', JSON.stringify(userData));
      setTree(treeRes.data.tree);
    } catch (err) {
      toast.error(t.failedToLoadData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border" style={{ color: '#6C3FC5', width: 50, height: 50 }} role="status" />
            <p className="mt-3" style={{ color: '#6C3FC5' }}>{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-main">
        <div className="container">

          {/* Welcome Hero */}
          <div className="welcome-hero mb-4">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <h2 className="fw-bold mb-1">
                  {t.welcomeBack} {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}!
                </h2>
                <p style={{ opacity: 0.85, margin: 0 }}>
                  {t.dashboardSubtitle}
                </p>
              </div>
              <div style={{ fontSize: 50, opacity: 0.3 }}>
                <FiGitMerge />
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Family Tree Card */}
            <div className="col-lg-7">
              <div className="card-custom h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #6C3FC5, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiGitMerge size={22} color="#fff" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold" style={{ color: '#333' }}>{t.myFamilyTree}</h5>
                    <small style={{ color: '#888' }}>{t.familyTreeSub}</small>
                  </div>
                </div>

                {tree && tree.nodes && tree.nodes.length > 0 ? (
                  <>
                    <div className="d-flex gap-3 mb-4">
                      <div style={{ background: '#f8f4ff', borderRadius: 12, padding: '16px 20px', flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#6C3FC5' }}>{tree.nodes.length}</div>
                        <div style={{ fontSize: 13, color: '#888' }}>{t.totalMembers}</div>
                      </div>
                      <div style={{ background: '#f0fff4', borderRadius: 12, padding: '16px 20px', flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#198754' }}>
                          {tree.nodes.filter(n => n.gender === 'male').length}
                        </div>
                        <div style={{ fontSize: 13, color: '#888' }}>{t.male}</div>
                      </div>
                      <div style={{ background: '#fff0f8', borderRadius: 12, padding: '16px 20px', flex: 1, textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#be185d' }}>
                          {tree.nodes.filter(n => n.gender === 'female').length}
                        </div>
                        <div style={{ fontSize: 13, color: '#888' }}>{t.female}</div>
                      </div>
                    </div>
                    <button
                      className="btn w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                      style={{ background: '#6C3FC5', color: '#fff', borderRadius: 10, padding: '12px' }}
                      onClick={() => navigate('/family-tree')}
                    >
                      {t.viewEditTree} <FiArrowRight />
                    </button>
                  </>
                ) : (
                  <div className="tree-empty-state">
                    <div className="icon">🌳</div>
                    <h6 style={{ color: '#555', fontWeight: 600 }}>{t.noFamilyTree}</h6>
                    <p style={{ fontSize: 14 }}>{t.noFamilyTreeSub}</p>
                    <button
                      className="btn fw-semibold d-inline-flex align-items-center gap-2"
                      style={{ background: '#6C3FC5', color: '#fff', borderRadius: 10, padding: '10px 24px' }}
                      onClick={() => navigate('/family-tree')}
                    >
                      <FiPlusCircle /> {t.createFamilyTree}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Card */}
            <div className="col-lg-5">
              <div className="card-custom h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #F4C430, #e8a800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiUser size={22} color="#fff" />
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold" style={{ color: '#333' }}>{t.myProfile}</h5>
                    <small style={{ color: '#888' }}>{t.myProfileSub}</small>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
                    <FiUser size={16} style={{ color: '#6C3FC5', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#888', fontSize: 12 }}>{t.fullName}</div>
                      <div style={{ fontWeight: 600 }}>{user?.firstName} {user?.lastName}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
                    <FiMapPin size={16} style={{ color: '#6C3FC5', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#888', fontSize: 12 }}>{t.city}</div>
                      <div style={{ fontWeight: 600 }}>{user?.city || '—'}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>🕉️</span>
                    <div>
                      <div style={{ color: '#888', fontSize: 12 }}>{t.kuldevi}</div>
                      <div style={{ fontWeight: 600 }}>{user?.kuldeviName || '—'}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>🏘️</span>
                    <div>
                      <div style={{ color: '#888', fontSize: 12 }}>{t.surapuraLabel}</div>
                      <div style={{ fontWeight: 600 }}>{user?.surapura || '—'}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
                    <FiPhone size={16} style={{ color: '#6C3FC5', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#888', fontSize: 12 }}>{t.contact}</div>
                      <div style={{ fontWeight: 600 }}>{user?.contactNumber || '—'}</div>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-3 d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill"
                  style={{
                    background: user?.profileCompleted ? '#d1fae5' : '#fef3c7',
                    color: user?.profileCompleted ? '#065f46' : '#92400e',
                    fontSize: 12,
                    fontWeight: 600
                  }}
                >
                  {user?.profileCompleted ? t.profileComplete : t.profileIncomplete}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
