'use client';

import { useRef, useEffect, useState } from 'react';

interface StudentInputProps {
  onStudentChange: (name: string) => void;
}

export default function StudentInput({ onStudentChange }: StudentInputProps) {
  const [studentName, setStudentName] = useState('');
  const studentInputRef = useRef<HTMLInputElement>(null);

  const handleStudentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudentName(value);
    onStudentChange(value);
  };

  // Focus auto sur l'input au chargement
  useEffect(() => {
    setTimeout(() => {
      studentInputRef.current?.focus();
    }, 800);
  }, []);

  return (
    <input
      type="text"
      className="student-input"
      ref={studentInputRef}
      placeholder="Tape ton prénom ici..."
      value={studentName}
      onChange={handleStudentInput}
      maxLength={30}
      autoComplete="off"
      spellCheck={false}
    />
  );
}