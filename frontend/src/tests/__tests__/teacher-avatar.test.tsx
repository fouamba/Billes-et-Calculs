// Test unitaire pour le composant TeacherAvatar
import { render } from '@testing-library/react';
import { TeacherAvatar } from '@/components/three/TeacherAvatar';

describe('TeacherAvatar', () => {
  it('doit se rendre sans crash', () => {
    const { container } = render(<TeacherAvatar />);
    expect(container).toBeTruthy();
  });
});
