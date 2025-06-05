// Typescript types pour les utilisateurs
export type UserRole = 'STUDENT' | 'TEACHER' | 'RESEARCHER' | 'ADMIN';
export type UserGrade = 'CP' | 'CE1' | 'CE2';

export interface User {
  id: string;
  email?: string;
  name?: string;
  role: UserRole;
  grade?: UserGrade;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
}
