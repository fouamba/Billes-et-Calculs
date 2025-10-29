import '@testing-library/jest-dom';

const { ThreeFiberMocks, DreiMocks } = require('./__mocks__/react-three-mocks');
const React = require('react');

const clientInternals =
  React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE || {
    H: null,
    A: null,
    T: null,
    S: null,
    V: null,
    actQueue: null,
    isBatchingLegacy: false,
    didScheduleLegacyUpdate: false,
    didUsePromise: false,
    thrownErrors: [],
    getCurrentStack: null,
    recentlyCreatedOwnerStacks: 0
  };

if (!React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE) {
  Object.defineProperty(React, '__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE', {
    value: clientInternals,
    configurable: true,
    writable: true
  });
}

if (!React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  Object.defineProperty(React, '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED', {
    value: clientInternals,
    configurable: true,
    writable: true
  });
}

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
  randomUUID: () => '00000000-0000-0000-0000-000000000000'
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

// Mocks supplémentaires pour Three.js et WebGL
const mockWebGLContext = {
  getParameter: jest.fn(),
  getExtension: jest.fn(),
  createBuffer: jest.fn(),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
} as unknown as WebGLRenderingContext;

const getContextMock = jest
  .fn((contextId: string) => {
    if (contextId === 'webgl' || contextId === 'webgl2') {
      return mockWebGLContext;
    }
    return null;
  });

HTMLCanvasElement.prototype.getContext = getContextMock as unknown as typeof HTMLCanvasElement.prototype.getContext;

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
