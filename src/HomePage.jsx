import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Scene } from './Scene';
import CarSelector from './CarSelector';
import TrackStatusHUD from './systems/TrackStatusHUD';
import ProfileHUD from './systems/ProfileHUD';

export default function HomePage() {
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'selector' | 'game'
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCarName, setSelectedCarName] = useState(null);

  const handleStartGame = () => {
    setGameState('selector');
  };

  const handleCarSelected = (carPath, carName) => {
    setSelectedCar(carPath);
    setSelectedCarName(carName);
    setGameState('game');
  };

  // Game Screen
  if (gameState === 'game') {
    return (
      <>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 5, 15], fov: 45 }}
        >
          <color attach="background" args={['#87CEEB']} />
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[100, 50, 100]}
            intensity={1.2}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            castShadow
          />

          <Physics broadphase="SAP" gravity={[0, -2.6, 0]}>
            <Scene selectedCarPath={selectedCar} selectedCarName={selectedCarName} />
          </Physics>
        </Canvas>

        <ProfileHUD />
        <TrackStatusHUD />

        <div className="controls">
          <p>W A S D - Move | K - Camera | R - Reset</p>
          <p>Arrow Keys - Flip | L - Lights</p>
        </div>
      </>
    );
  }

  // Car Selector Screen
  if (gameState === 'selector') {
    return <CarSelector onCarSelected={handleCarSelected} />;
  }

  // Home Menu Screen
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
          🏎️ RACING GAME
        </h1>

        <p style={{
          color: '#ffffff',
          fontSize: '18px',
          margin: '0 0 40px 0',
          fontFamily: 'Arial, sans-serif'
        }}>
          Drive Your Dream Car
        </p>

        <button
          onClick={handleStartGame}
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
            letterSpacing: '2px'
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
          START RACE
        </button>

        <div style={{
          color: '#00ffff',
          fontSize: '14px',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '2px solid #00ffff',
          textAlign: 'left'
        }}>
          <p><strong>CONTROLS:</strong></p>
          <p>W - Forward | S - Reverse</p>
          <p>A/D - Steering | Arrow Keys - Flip</p>
          <p>R - Reset | K - Camera Toggle</p>
          <p>L - Headlights</p>
        </div>
      </div>
    </div>
  );
}
