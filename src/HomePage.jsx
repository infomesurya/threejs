import React, { useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Scene } from './Scene';
import TrackStatusHUD from './systems/TrackStatusHUD';
import ProfileHUD from './systems/ProfileHUD';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const HomePageMenu = ({ onStartGame }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000
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
          RACING GAME
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
          onClick={onStartGame}
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
};

const CarDisplay = () => {
  const carModel = useLoader(GLTFLoader, process.env.PUBLIC_URL + '/models/car.glb');

  return (
    <>
      {/* Platform */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3, 0.5, 32]} />
        <meshStandardMaterial
          color="#222222"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Car Model */}
      <group position={[0, 0, 0]}>
        <primitive object={carModel.scene} scale={[1.5, 1.5, 1.5]} castShadow />
      </group>

      {/* Lighting for showcase */}
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.8} color="#00ffff" />
    </>
  );
};

const CarShowcase = () => {
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [0, 3, 5], fov: 50 }}
        >
          <color attach="background" args={['#1a1a2e']} />
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.5}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            castShadow
          />

          <OrbitControls autoRotate autoRotateSpeed={3} />

          <CarDisplay />
        </Canvas>

        <HomePageMenu onStartGame={handleStartGame} />
      </>
    );
  }

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
          <Scene />
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
};

export default CarShowcase;
