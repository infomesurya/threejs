import { useRef } from "react";

export const useWheels = (width, height, front, radius) => {
  const wheels = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const wheelInfo = {
    radius,
    directionLocal: [0, -1, 0],
    axleLocal: [1, 0, 0],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    frictionSlip: 10,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    maxSuspensionForce: 6000,
    rollInfluence: 0.01,
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,
  };

  const wheelInfos = [
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [-width * 0.5, -height * 0.1, front * 0.8],
      isFrontWheel: true,
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [width * 0.5, -height * 0.1, front * 0.8],
      isFrontWheel: true,
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [-width * 0.5, -height * 0.1, -front * 0.8],
      isFrontWheel: false,
    },
    {
      ...wheelInfo,
      chassisConnectionPointLocal: [width * 0.5, -height * 0.1, -front * 0.8],
      isFrontWheel: false,
    },
  ];

  return [wheels, wheelInfos];
};
