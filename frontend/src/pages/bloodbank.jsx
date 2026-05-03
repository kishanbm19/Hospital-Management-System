import { useState, useEffect } from 'react';
import './pages.css';

const BloodBank = () => {
  const [bloodbank, setBloodbank] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBloodType, setSelectedBloodType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bloodRes, hospRes, donorRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/blood/'),
          fetch('http://127.0.0.1:8000/api/hospitals/'),
          fetch('http://127.0.0.1:8000/api/donors/')
        ]);

        if (!bloodRes.ok || !hospRes.ok || !donorRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const bloodData = await bloodRes.json();
        const hospData = await hospRes.json();
        const donorData = await donorRes.json();

        setBloodbank(bloodData);
        setHospitals(hospData);
        setDonors(donorData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getHospitalName = (id) => {
    const hospital = hospitals.find(h => h.hospital_id === id);
    return hospital ? hospital.name : `Hospital #${id}`;
  };

  const getHospitalDetails = (id) => {
    return hospitals.find(h => h.hospital_id === id) || {};
  };

  if (loading) return <div className="loading-state">Loading blood bank data...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  // Group by blood type
  const groupedData = bloodbank.reduce((acc, record) => {
    if (!acc[record.blood_type]) {
      acc[record.blood_type] = [];
    }
    acc[record.blood_type].push(record);
    return acc;
  }, {});

  const bloodTypes = Object.keys(groupedData).sort();

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Blood Bank</h2>
        <p>Monitor available blood units across hospitals.</p>
      </div>

      {!selectedBloodType ? (
        <div className="grid-container">
          {bloodTypes.length === 0 ? (
            <p className="no-data">No blood records found.</p>
          ) : (
            bloodTypes.map((type) => {
              const totalUnits = groupedData[type].reduce((sum, r) => sum + r.units_available, 0);
              return (
                <div 
                  key={type} 
                  className="data-card blood-card interactive-card"
                  onClick={() => setSelectedBloodType(type)}
                >
                  <div className="blood-type-display">
                    <h1>{type}</h1>
                  </div>
                  <div className="card-body center-text">
                    <p><strong>Total Units:</strong> {totalUnits}</p>
                    <p><strong>Available in:</strong> {groupedData[type].length} Hospital(s)</p>
                    <button className="attractive-btn red-btn small" style={{marginTop: '1.5rem'}}>View Details</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="details-view">
          <div className="details-header">
            <button className="back-btn" onClick={() => setSelectedBloodType(null)}>
              ← Back to Overview
            </button>
            <div className="blood-type-display small-display">
              <h1>{selectedBloodType}</h1>
            </div>
            <h3>Hospitals with {selectedBloodType} Blood</h3>
          </div>

          <div className="list-container">
            {groupedData[selectedBloodType].map((record) => {
              const hospital = getHospitalDetails(record.hospital);
              const relatedDonors = donors.filter(d => d.blood_type === selectedBloodType);
              
              return (
                <div key={record.bank_id} className="data-card row-card" style={{flexDirection: 'column', alignItems: 'stretch', padding: '1.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                    <div className="row-info">
                      <h4>{hospital.name || `Hospital #${record.hospital}`}</h4>
                      <p><strong>Phone:</strong> {hospital.phone || 'N/A'}</p>
                      <p><strong>Address:</strong> {hospital.city}, {hospital.state}</p>
                    </div>
                    <div className="row-stats">
                      <div className="units-badge">
                        <span className="units-number">{record.units_available}</span>
                        <span className="units-label">Units</span>
                      </div>
                    </div>
                  </div>
                  
                  {relatedDonors.length > 0 && (
                    <div className="donors-section" style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)'}}>
                      <h5 style={{marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Recent Donors</h5>
                      <div className="donors-list" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem'}}>
                        {relatedDonors.map(donor => {
                          return (
                            <div key={donor.donor_id} className="donor-card" style={{background: 'var(--bg-card)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)'}}>
                              <p style={{margin: '0 0 0.2rem 0', fontWeight: 'bold'}}>{donor.name || 'Unknown Donor'}</p>
                              <p style={{margin: '0', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>📱 {donor.phone || 'N/A'}</p>
                              <p style={{margin: '0', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>📅 Donated: {donor.last_donated ? new Date(donor.last_donated).toLocaleDateString() : 'Unknown'}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBank;
