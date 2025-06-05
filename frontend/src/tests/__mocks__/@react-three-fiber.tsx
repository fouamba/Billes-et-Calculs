import React from 'react';

const mockComponent = (name: string) => 
  jest.fn(({ children, ...props }) => 
    React.createElement('div', { 
      'data-testid': `mock-${name}`,
      ...props
    }, children)
  );

export const Canvas = mockComponent('canvas');
export const OrbitControls = mockComponent('orbit-controls');
export const useFrame = jest.fn();
export const useThree = jest.fn(() => ({
  camera: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  scene: {},
  gl: {
    setSize: jest.fn(),
    render: jest.fn(),
    domElement: document.createElement('canvas')
  }
}));
