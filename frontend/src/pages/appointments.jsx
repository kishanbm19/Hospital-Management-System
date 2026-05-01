import { useState, useEffect } from 'react';
import './pages.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, docsRes, patRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/appointments/'),
          fetch('http://127.0.0.1:8000/api/doctors/'),
          fetch('http://127.0.0.1:8000/api/patients/')
        ]);

        if (!apptRes.ok || !docsRes.ok || !patRes.ok) {
          throw new Error('Failed to fetch data from the server');
        }

        const apptData = await apptRes.json();
        const docsData = await docsRes.json();
        const patData = await patRes.json();

        setAppointments(apptData);
        setDoctors(docsData);
        setPatients(patData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDoctorName = (id) => {
    const doctor = doctors.find(d => d.doctor_id === id);
    return doctor ? doctor.name : `Doctor #${id}`;
  };

  const getPatientName = (id) => {
    const patient = patients.find(p => p.patient_id === id);
    return patient ? patient.name : `Patient #${id}`;
  };

  if (loading) return <div className="loading-state">Loading appointments...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Appointments</h2>
        <p>Manage and view scheduled appointments.</p>
      </div>
      
      <div className="grid-container">
        {appointments.length === 0 ? (
          <p className="no-data">No appointments found.</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt.appt_id} className="data-card">
              <div className="card-header">
                <h3>{new Date(appt.appt_date).toLocaleDateString()}</h3>
                <span className={`badge ${appt.status?.toLowerCase() === 'completed' ? 'success' : 'primary'}`}>
                  {appt.status || 'Pending'}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Time:</strong> {appt.appt_time}</p>
                <p><strong>Reason:</strong> {appt.reason || 'N/A'}</p>
                <p><strong>Doctor:</strong> {getDoctorName(appt.doctor)}</p>
                <p><strong>Patient:</strong> {getPatientName(appt.patient)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;

