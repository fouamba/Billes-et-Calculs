import { gql } from '@apollo/client';

export const GET_STUDENT_ANALYTICS = gql`
  query GetStudentAnalytics($studentId: ID!) {
    studentAnalytics(studentId: $studentId) {
      cognitiveLoadData {
        timestamp
        value
        activity
      }
      progressData {
        completedActivities
        totalActivities
        masteryLevel
        timeSpent
      }
    }
  }
`;

export const GET_XAPI_STATEMENTS = gql`
  query GetXAPIStatements($actorId: String!, $after: DateTime) {
    xapiStatements(actorId: $actorId, after: $after) {
      id
      verb {
        id
        display
      }
      object {
        id
        definition {
          name
          description
        }
      }
      result {
        success
        completion
        score {
          scaled
          raw
          min
          max
        }
        extensions
      }
      timestamp
    }
  }
`;
