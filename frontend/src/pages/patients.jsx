import { useState, useEffect } from 'react';
import './pages.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/patients/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div className="loading-state">Loading patients...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Patients</h2>
        <p>Manage patient records.</p>
      </div>
      
      <div className="grid-container">
        {patients.length === 0 ? (
          <p className="no-data">No patients found.</p>
        ) : (
          patients.map((patient) => (
            <div key={patient.patient_id} className="data-card">
              <div className="card-header">
                <h3>{patient.name}</h3>
                <span className="badge warning">Blood: {patient.blood_type || 'Unknown'}</span>
              </div>
              <div className="card-body">
                <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
                <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                <p><strong>Emergency:</strong> {patient.emergency_contact || 'N/A'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Patients;
