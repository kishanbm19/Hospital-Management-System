import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.css';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    hospital_id: '',
    reason: '',
    appt_date: '',
    appt_time: ''
  });

  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hRes, dRes, docRes] = await Promise.all([
          fetch('http://https://hospital-management-system-8qmy.vercel.app/api/hospitals/'),
          fetch('http://https://hospital-management-system-8qmy.vercel.app/api/departments/'),
          fetch('http://https://hospital-management-system-8qmy.vercel.app/api/doctors/')
        ]);

        if (!hRes.ok || !dRes.ok || !docRes.ok) {
          throw new Error('Failed to fetch required data');
        }

        setHospitals(await hRes.json());
        setDepartments(await dRes.json());
        setDoctors(await docRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Get available specialities for the selected hospital
  const getAvailableSpecialities = () => {
    if (!formData.hospital_id) return [];
    
    // Find departments in this hospital
    const hospitalDepts = departments
      .filter(d => String(d.hospital) === String(formData.hospital_id))
      .map(d => d.dept_id);
      
    // Find doctors in these departments
    const hospitalDoctors = doctors.filter(doc => hospitalDepts.includes(doc.dept));
    
    // Get unique specialities
    const specialities = [...new Set(hospitalDoctors.map(doc => doc.speciality).filter(Boolean))];
    
    // If no specific specialities, return a fallback
    return specialities.length > 0 ? specialities : ['General'];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Allocate a doctor based on hospital and reason (speciality)
      const hospitalDepts = departments
        .filter(d => String(d.hospital) === String(formData.hospital_id))
        .map(d => d.dept_id);
        
      const matchingDoctors = doctors.filter(doc => 
        hospitalDepts.includes(doc.dept) && 
        (doc.speciality === formData.reason || !formData.reason || doc.speciality === null)
      );

      if (matchingDoctors.length === 0) {
        throw new Error('No available doctors found for this hospital and reason. Please try another combination.');
      }

      const allocatedDoctor = matchingDoctors[0];

      // 2. Create Patient Record
      const patientRes = await fetch('http://https://hospital-management-system-8qmy.vercel.app/api/patients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          hospital: formData.hospital_id,
          priority: 'Normal' // default priority
        })
      });

      if (!patientRes.ok) {
        throw new Error('Failed to register patient details.');
      }

      const patientData = await patientRes.json();

      // 3. Create Appointment
      const apptRes = await fetch('http://https://hospital-management-system-8qmy.vercel.app/api/appointments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appt_date: formData.appt_date,
          appt_time: formData.appt_time,
          reason: `Auto-assigned based on need: ${formData.reason}`,
          status: 'Scheduled',
          doctor: allocatedDoctor.doctor_id,
          patient: patientData.patient_id,
        })
      });

      if (!apptRes.ok) {
        throw new Error('Failed to book the appointment.');
      }

      setSuccess(`Appointment booked successfully with Dr. ${allocatedDoctor.name} (${allocatedDoctor.speciality || 'General'})!`);
      setFormData({
        name: '', phone: '', hospital_id: '', reason: '', appt_date: '', appt_time: ''
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Loading booking system...</div>;

  const specialities = getAvailableSpecialities();

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="page-header center-text">
        <h2>Book an Appointment</h2>
        <p>Register and book an appointment with our specialists in one step.</p>
      </div>

      <div className="data-card" style={{ padding: '2.5rem' }}>
        {error && <div className="badge danger" style={{ marginBottom: '1rem', display: 'block', textAlign: 'center', padding: '1rem' }}>{error}</div>}
        {success && <div className="badge success" style={{ marginBottom: '1rem', display: 'block', textAlign: 'center', padding: '1rem' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-h)', fontWeight: '600' }}>Full Name *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-h)', fontWeight: '600' }}>Phone Number *</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
              placeholder="e.g. +1 234 567 8900"
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ color: 'var(--text-h)', fontWeight: '600' }}>Select Hospital *</label>
            <select 
              name="hospital_id" 
              value={formData.hospital_id} 
              onChange={handleChange} 
              required
              style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
            >
              <option value="">-- Choose a Facility --</option>
              {hospitals.map(h => (
                <option key={h.hospital_id} value={h.hospital_id}>{h.name} - {h.city}</option>
              ))}
            </select>
          </div>

          {formData.hospital_id && (
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-h)', fontWeight: '600' }}>Reason for Visit (Required Speciality) *</label>
              <select 
                name="reason" 
                value={formData.reason} 
                onChange={handleChange} 
                required
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
              >
                <option value="">-- Describe your need --</option>
                {specialities.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-h)', fontWeight: '600' }}>Date *</label>
              <input 
                type="date" 
                name="appt_date" 
                value={formData.appt_date} 
                onChange={handleChange} 
                required 
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-h)', fontWeight: '600' }}>Time *</label>
              <input 
                type="time" 
                name="appt_time" 
                value={formData.appt_time} 
                onChange={handleChange} 
                required 
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-h)' }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="attractive-btn purple-btn" 
            disabled={submitting}
            style={{ marginTop: '1rem' }}
          >
            {submitting ? 'Registering & Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
