import React from 'react';

export const MarbleManipulationActivity = jest.fn(({ children }) => (
  <div data-testid="marble-manipulation">{children}</div>
));

export const TeacherAvatar = jest.fn(({ children }) => (
  <div data-testid="teacher-avatar">{children}</div>
));

export const XAPIProvider = jest.fn(({ children }) => (
  <div data-testid="xapi-provider">{children}</div>
));
