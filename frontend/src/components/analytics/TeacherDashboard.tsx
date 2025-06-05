import { useState, useEffect } from 'react';
import { CognitiveLoadChart } from './CognitiveLoadChart';
import { useXAPITracking } from '@/hooks/useXAPITracking';

interface StudentProgress {
  studentId: string;
  studentName: string;
  level: number;
  cognitiveLoad: number;
  conceptualization: {
    addition: boolean;
    subtraction: boolean;
    confidence: number;
  };
  lastActivity: Date;
}

export function TeacherDashboard() {
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const { trackActivity } = useXAPITracking();

  useEffect(() => {
    // Simuler la récupération des données depuis Learning Locker
    // TODO: Implémenter la vraie requête GraphQL
    const mockData: StudentProgress[] = [
      {
        studentId: '1',
        studentName: 'Alice',
        level: 2,
        cognitiveLoad: 0.4,
        conceptualization: {
          addition: true,
          subtraction: false,
          confidence: 0.7
        },
        lastActivity: new Date()
      },
      {
        studentId: '2',
        studentName: 'Bob',
        level: 1,
        cognitiveLoad: 0.8,
        conceptualization: {
          addition: false,
          subtraction: false,
          confidence: 0.3
        },
        lastActivity: new Date()
      }
    ];

    setStudents(mockData);
  }, []);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    void trackActivity({
      type: 'started',
      activityId: 'teacher-analysis',
      context: {
        studentId,
        action: 'student-selection'
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord Enseignant</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Liste des élèves */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Élèves</h2>
          <div className="space-y-2">
            {students.map(student => (
              <div
                key={student.studentId}
                className={`
                  p-3 rounded-lg cursor-pointer transition-colors
                  ${selectedStudent === student.studentId
                    ? 'bg-green-100 border-green-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}
                onClick={() => handleStudentSelect(student.studentId)}
              >
                <div className="font-medium">{student.studentName}</div>
                <div className="text-sm text-gray-500">
                  Niveau {student.level}
                  {student.cognitiveLoad > 0.7 && (
                    <span className="ml-2 text-red-500">
                      ⚠️ Charge cognitive élevée
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Détails de l'élève sélectionné */}
        {selectedStudent && (
          <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
            {students
              .filter(s => s.studentId === selectedStudent)
              .map(student => (
                <div key={student.studentId}>
                  <h2 className="text-xl font-semibold mb-4">
                    Progression de {student.studentName}
                  </h2>
                  
                  {/* Graphique de charge cognitive */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">
                      Évolution de la charge cognitive
                    </h3>
                    <CognitiveLoadChart />
                  </div>

                  {/* Conceptualisation */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Addition</h4>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-2 ${
                            student.conceptualization.addition
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                        {student.conceptualization.addition
                          ? 'Concept maîtrisé'
                          : 'En apprentissage'
                        }
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Soustraction</h4>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-2 ${
                            student.conceptualization.subtraction
                              ? 'bg-green-500'
                              : 'bg-gray-300'
                          }`}
                        />
                        {student.conceptualization.subtraction
                          ? 'Concept maîtrisé'
                          : 'En apprentissage'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Recommandations */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">
                      Recommandations pédagogiques
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {student.cognitiveLoad > 0.7 && (
                        <li>
                          Considérer une pause ou des exercices plus simples pour
                          réduire la charge cognitive
                        </li>
                      )}
                      {!student.conceptualization.addition && (
                        <li>
                          Renforcer les exercices de composition avec manipulation
                          concrète
                        </li>
                      )}
                      {student.conceptualization.confidence < 0.5 && (
                        <li>
                          Encourager la verbalisation pour renforcer la confiance
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
