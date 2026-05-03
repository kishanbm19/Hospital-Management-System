import { useState, useEffect } from 'react';
import './pages.css';

const Hospitals = () => {
  const [data, setData] = useState({
    hospitals: [],
    departments: [],
    doctors: [],
    appointments: [],
    patients: [],
    bedSummaries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [activeTab, setActiveTab] = useState('doctors'); // doctors, appointments, patients

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hRes, deptRes, docRes, apptRes, patRes, bedsRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/hospitals/'),
          fetch('http://127.0.0.1:8000/api/departments/'),
          fetch('http://127.0.0.1:8000/api/doctors/'),
          fetch('http://127.0.0.1:8000/api/appointments/'),
          fetch('http://127.0.0.1:8000/api/patients/'),
          fetch('http://127.0.0.1:8000/api/hospital_beds/')
        ]);

        if (!hRes.ok) throw new Error('Failed to fetch data');

        setData({
          hospitals: await hRes.json(),
          departments: await deptRes.json(),
          doctors: await docRes.json(),
          appointments: await apptRes.json(),
          patients: await patRes.json(),
          bedSummaries: await bedsRes.json()
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRelatedData = (hospitalId) => {
    const hospitalDepts = data.departments.filter(d => d.hospital === hospitalId).map(d => d.dept_id);
    const hospitalDocs = data.doctors.filter(d => hospitalDepts.includes(d.dept));
    const docIds = hospitalDocs.map(d => d.doctor_id);
    const hospitalAppts = data.appointments.filter(a => docIds.includes(a.doctor));
    const patIds = [...new Set(hospitalAppts.map(a => a.patient))];
    const hospitalPatients = data.patients.filter(p => patIds.includes(p.patient_id));

    return { docs: hospitalDocs, appts: hospitalAppts, pats: hospitalPatients };
  };

  const getPatientName = (id) => {
    const p = data.patients.find(pat => pat.patient_id === id);
    return p ? p.name : `Patient #${id}`;
  };

  const getDoctorName = (id) => {
    const d = data.doctors.find(doc => doc.doctor_id === id);
    return d ? d.name : `Doctor #${id}`;
  };

  if (loading) return <div className="loading-state">Loading hospital dashboards...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="page-container">
      {!selectedHospital ? (
        <>
          <div className="page-header">
            <h2>Hospitals Dashboard</h2>
            <p>Select a hospital to view its doctors, appointments, and patients.</p>
          </div>
          <div className="grid-container">
            {data.hospitals.length === 0 ? (
              <p className="no-data">No hospitals found.</p>
            ) : (
              data.hospitals.map((hospital) => (
                <div 
                  key={hospital.hospital_id} 
                  className="data-card interactive-card"
                  onClick={() => setSelectedHospital(hospital)}
                >
                  <div className="card-header">
                    <h3>{hospital.name}</h3>
                  </div>
                  <div className="card-body">
                    <p><strong>City:</strong> {hospital.city}</p>
                    <p><strong>State:</strong> {hospital.state}</p>
                    <p><strong>Phone:</strong> {hospital.phone || 'N/A'}</p>
                    <button className="attractive-btn blue-btn small" style={{marginTop: '1.5rem'}}>Open Dashboard</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="details-view">
          <div className="details-header">
            <button className="back-btn" onClick={() => setSelectedHospital(null)}>
              ← Back to Hospitals List
            </button>
            <div className="dashboard-title-row">
              <h2>{selectedHospital.name} Dashboard</h2>
            </div>
            <p>{selectedHospital.address}, {selectedHospital.city}, {selectedHospital.state}</p>
            
            <div className="tabs-container">
              <button 
                className={`tab-btn ${activeTab === 'doctors' ? 'active' : ''}`}
                onClick={() => setActiveTab('doctors')}
              >
                Doctors
              </button>
              <button 
                className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                Appointments
              </button>
              <button 
                className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`}
                onClick={() => setActiveTab('patients')}
              >
                Patients
              </button>
            </div>
          </div>

          <div className="tab-content">
            {(() => {
              const related = getRelatedData(selectedHospital.hospital_id);
              
              if (activeTab === 'doctors') {
                return (
                  <div className="grid-container">
                    {related.docs.length === 0 ? <p className="no-data">No doctors found for this hospital.</p> : 
                      related.docs.map(doctor => (
                        <div key={doctor.doctor_id} className="data-card">
                          <div className="card-header">
                            <h3>{doctor.name}</h3>
                            <span className="badge accent">{doctor.speciality || 'General'}</span>
                          </div>
                          <div className="card-body">
                            <p><strong>Qualification:</strong> {doctor.qualification || 'N/A'}</p>
                            <p><strong>Phone:</strong> {doctor.phone || 'N/A'}</p>
                            <p><strong>Email:</strong> {doctor.email || 'N/A'}</p>
                            <p><strong>Available:</strong> {doctor.available_days || 'N/A'}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                );
              }

              if (activeTab === 'appointments') {
                return (
                  <div className="grid-container">
                    {related.appts.length === 0 ? <p className="no-data">No appointments found for this hospital.</p> : 
                      related.appts.map(appt => (
                        <div key={appt.appt_id} className="data-card">
                          <div className="card-header">
                            <h3>{new Date(appt.appt_date).toLocaleDateString()}</h3>
                            <span className={`badge ${appt.status?.toLowerCase() === 'completed' ? 'success' : 'primary'}`}>
                              {appt.status || 'Pending'}
                            </span>
                          </div>
                          <div className="card-body">
                            <p><strong>Time:</strong> {appt.appt_time}</p>
                            <p><strong>Doctor:</strong> {getDoctorName(appt.doctor)}</p>
                            <p><strong>Patient:</strong> {getPatientName(appt.patient)}</p>
                            <p><strong>Reason:</strong> {appt.reason || 'N/A'}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                );
              }

              if (activeTab === 'patients') {
                return (
                  <div className="grid-container">
                    {related.pats.length === 0 ? <p className="no-data">No patients found for this hospital.</p> : 
                      related.pats.map(patient => {
                        const patAppts = related.appts.filter(a => a.patient === patient.patient_id);
                        const latestAppt = patAppts[patAppts.length - 1]; // or just the first one
                        const isEmergency = patient.priority === 'emergency' || 
                                            patient.priority === 'critical' || 
                                            latestAppt?.reason?.toLowerCase().includes('emergency') || 
                                            latestAppt?.reason?.toLowerCase().includes('urgent') ||
                                            latestAppt?.reason?.toLowerCase().includes('critical');

                        return (
                          <div key={patient.patient_id} className="data-card">
                            <div className="card-header">
                              <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                                <h3>{patient.name}</h3>
                                {isEmergency && <span className="badge danger">🚨 Emergency</span>}
                              </div>
                              <span className="badge warning">Blood: {patient.blood_type || 'Unknown'}</span>
                            </div>
                            <div className="card-body">
                              <p><strong>Reason:</strong> {latestAppt?.reason || 'Routine Checkup'}</p>
                              <p><strong>Allotted Doctor:</strong> {latestAppt ? getDoctorName(latestAppt.doctor) : 'None'}</p>
                              <p><strong>Status:</strong> <span style={{fontWeight: 600, color: isEmergency ? '#ef4444' : '#22c55e'}}>{isEmergency ? 'Emergency' : 'Standard'}</span></p>
                              <hr style={{margin: '0.8rem 0', border: 'none', borderTop: '1px solid var(--border)'}} />
                              <p><strong>Gender:</strong> {patient.gender || 'N/A'}</p>
                              <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
