// Mock React
const React = {
  createElement: jest.fn((type, props) => ({
    type,
    props: props || {}
  }))
};

// Mock Three.js components
const ThreeFiberMocks = {
  Canvas: jest.fn(({ children }) => ({
    type: 'div',
    props: {
      'data-testid': 'three-canvas',
      children
    }
  })),
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    camera: {},
    scene: {},
    gl: {}
  }))
};

// Mock Drei components
const DreiMocks = {
  useGLTF: jest.fn().mockReturnValue({
    nodes: {},
    materials: {},
    animations: [],
    scene: { clone: jest.fn() }
  }),
  Html: jest.fn(({ children }) => children),
  OrbitControls: jest.fn(() => null)
};

module.exports = {
  React,
  ThreeFiberMocks,
  DreiMocks
};
