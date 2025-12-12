import React from 'react';

const CarSelector = ({ onCarSelected }) => {
  const cars = [
    { name: 'Default Car', path: '/models/car.glb' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a4a 100%)',
        border: '3px solid #00ffff',
        borderRadius: '20px',
        padding: '60px 80px',
        textAlign: 'center',
        boxShadow: '0 0 40px rgba(0, 255, 255, 0.5)',
        maxWidth: '600px'
      }}>
        <h1 style={{
          color: '#00ffff',
          fontSize: '48px',
          margin: '0 0 20px 0',
          textShadow: '0 0 20px rgba(0, 255, 255, 0.8)',
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '3px'
        }}>
          SELECT YOUR CAR
        </h1>

        <p style={{
          color: '#ffffff',
          fontSize: '18px',
          margin: '0 0 40px 0',
          fontFamily: 'Arial, sans-serif'
        }}>
          Choose your racing machine
        </p>

        {cars.map((car, index) => (
          <button
            key={index}
            onClick={() => onCarSelected(car.path, car.name)}
            style={{
              background: 'linear-gradient(135deg, #00ffff 0%, #00ccff 100%)',
              color: '#000',
              border: 'none',
              padding: '15px 60px',
              fontSize: '20px',
              fontWeight: 'bold',
              borderRadius: '10px',
              cursor: 'pointer',
              marginBottom: '20px',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              display: 'block',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
            }}
          >
            {car.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarSelector;