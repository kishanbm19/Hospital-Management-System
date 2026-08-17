import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

const Home = () => {
  const [stats, setStats] = useState({ hospitals: 0, bloodUnits: 0, bloodTypes: 0, totalBeds: 0, availableBeds: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [hRes, bRes, bedRes] = await Promise.all([
          fetch('http://https://hospital-management-system-8qmy.vercel.app/api/hospitals/'),
          fetch('http://https://hospital-management-system-8qmy.vercel.app/api/blood/'),
          fetch('http://https://hospital-management-system-8qmy.vercel.app/api/hospital_beds/')
        ]);

        if (!hRes.ok || !bRes.ok || !bedRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const hospitals = await hRes.json();
        const blood = await bRes.json();
        const beds = await bedRes.json();

        const totalUnits = blood.reduce((sum, item) => sum + item.units_available, 0);
        const uniqueTypes = new Set(blood.map(item => item.blood_type)).size;

        const totalBeds = beds.reduce((sum, item) => sum + item.total_beds, 0);
        const availableBeds = beds.reduce((sum, item) => sum + item.available, 0);

        setStats({
          hospitals: hospitals.length,
          bloodUnits: totalUnits,
          bloodTypes: uniqueTypes,
          totalBeds,
          availableBeds
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Medicore <span>Central</span></h1>
        <p className="home-subtitle">Select a module to manage your healthcare infrastructure</p>
      </div>

      <div className="home-columns-layout">
        {/* COLUMN 1: HOSPITALS */}
        <div className="home-col">
          <div className="box-card">
            <div className="box-icon blue-gradient">🏥</div>
            <h2>Hospital Network</h2>
            <p className="box-desc">Manage doctors, appointments, and patient flow across all affiliated facilities.</p>
            
            <div className="box-metrics">
              <div className="box-metric">
                <span className="b-value">{stats.hospitals}</span>
                <span className="b-label">Hospitals</span>
              </div>
              <div className="box-metric">
                <span className="b-value">{stats.totalBeds}</span>
                <span className="b-label">Total Beds</span>
              </div>
              <div className="box-metric">
                <span className="b-value" style={{color: '#22c55e'}}>{stats.availableBeds}</span>
                <span className="b-label">Available Beds</span>
              </div>
            </div>

            <button 
              className="attractive-btn blue-btn"
              onClick={() => navigate('/hospitals')}
            >
              Access Hospitals Overview
            </button>

            <button 
              className="attractive-btn purple-btn"
              onClick={() => navigate('/book-appointment')}
              style={{ marginTop: '1rem' }}
            >
              Book an Appointment
            </button>
          </div>
        </div>

        {/* COLUMN 2: BLOOD BANK */}
        <div className="home-col">
          <div className="box-card">
            <div className="box-icon red-gradient">🩸</div>
            <h2>Blood Directory</h2>
            <p className="box-desc">Real-time inventory of blood types and unit availability across the network.</p>
            
            <div className="box-metrics">
              <div className="box-metric">
                <span className="b-value">{stats.bloodUnits}</span>
                <span className="b-label">Total Units</span>
              </div>
              <div className="box-metric">
                <span className="b-value">{stats.bloodTypes}</span>
                <span className="b-label">Blood Types</span>
              </div>
            </div>

            <button 
              className="attractive-btn red-btn"
              onClick={() => navigate('/bloodbank')}
            >
              Access Blood Directory
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;

