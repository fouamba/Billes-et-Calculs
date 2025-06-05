import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_STUDENT_ANALYTICS } from '../graphql/queries';
import { CognitiveLoadChart } from './CognitiveLoadChart';
import { ProgressTracker } from './ProgressTracker';

interface StudentAnalyticsProps {
  studentId: string;
}

export const StudentDashboard: React.FC<StudentAnalyticsProps> = ({ studentId }) => {
  const { loading, error, data } = useQuery(GET_STUDENT_ANALYTICS, {
    variables: { studentId },
  });

  if (loading) return <div>Chargement des analyses...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const { cognitiveLoadData, progressData } = data.studentAnalytics;

  return (
    <div className="student-dashboard">
      <h2>Tableau de bord d'apprentissage</h2>
      
      <div className="analytics-section">
        <h3>Charge cognitive</h3>
        <CognitiveLoadChart data={cognitiveLoadData} />
      </div>
      
      <div className="analytics-section">
        <h3>Progression</h3>
        <ProgressTracker data={progressData} />
      </div>
    </div>
  );
};
