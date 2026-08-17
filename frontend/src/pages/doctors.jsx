import { useState, useEffect } from 'react';
import './pages.css';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://https://hospital-management-system-8qmy.vercel.app/api/doctors/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div className="loading-state">Loading doctors...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Doctors</h2>
        <p>Manage and view doctor profiles.</p>
      </div>
      
      <div className="grid-container">
        {doctors.length === 0 ? (
          <p className="no-data">No doctors found.</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.doctor_id} className="data-card">
              <div className="card-header">
                <h3>{doctor.name}</h3>
                <span className="badge accent">{doctor.speciality || 'General'}</span>
              </div>
              <div className="card-body">
                <p><strong>Qualification:</strong> {doctor.qualification || 'N/A'}</p>
                <p><strong>Phone:</strong> {doctor.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {doctor.email || 'N/A'}</p>
                <p><strong>Days Available:</strong> {doctor.available_days || 'N/A'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Doctors;
