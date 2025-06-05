import '@testing-library/jest-dom';

const { React, ThreeFiberMocks, DreiMocks } = require('./__mocks__/react-three-mocks');

// Mock React
jest.mock('react', () => React);

// Étendre les attentes de Jest
expect.extend({
  toHaveBeenCalledWithMatch(received: jest.Mock, ...expectedArgs: any[]) {
    const pass = expectedArgs.every((expected, index) => {
      const actual = received.mock.calls[0]?.[index];
      return JSON.stringify(actual) === JSON.stringify(expected);
    });

    return {
      pass,
      message: () => `expected ${received.getMockName()} to have been called with ${JSON.stringify(expectedArgs)}`
    };
  }
});

// Configuration globale pour Jest
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.fetch = jest.fn();

// Mocks pour Three.js
jest.mock('three', () => ({
  Vector3: jest.fn().mockImplementation((x, y, z) => ({ x, y, z })),
  Mesh: jest.fn(),
  WebGLRenderer: jest.fn(),
}));

// Mock pour crypto.randomUUID
global.crypto = {
  ...global.crypto,
  randomUUID: () => 'test-uuid'
};

// Mock des stores
jest.mock('@/stores/userStore', () => ({
  useUserStore: () => ({
    currentUser: {
      id: 'test-user-id',
      name: 'Test User'
    }
  })
}));

// Mock du service xAPI
jest.mock('@/services/xapi.service', () => {
  return {
    XAPIService: jest.fn().mockImplementation(() => ({
      trackMarbleManipulation: jest.fn().mockResolvedValue(undefined),
      trackConceptualization: jest.fn().mockResolvedValue(undefined),
      trackActivity: jest.fn().mockResolvedValue(undefined)
    }))
  };
});

// Mocks supplémentaires pour Three.js et WebGL
const mockWebGLContext = {
  getParameter: jest.fn(),
  getExtension: jest.fn(),
  createBuffer: jest.fn(),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
};

HTMLCanvasElement.prototype.getContext = jest.fn(() => mockWebGLContext);

// Mock pour les modèles 3D
jest.mock('@react-three/drei', () => ({
  useGLTF: jest.fn().mockReturnValue({
    nodes: {},
    materials: {},
    animations: [],
    scene: { clone: jest.fn() }
  }),
  Html: jest.fn(({ children }) => children),
  OrbitControls: jest.fn(() => null)
}));

// Mock @react-three/fiber
jest.mock('@react-three/fiber', () => ThreeFiberMocks);

// Mock @react-three/drei
jest.mock('@react-three/drei', () => DreiMocks);
