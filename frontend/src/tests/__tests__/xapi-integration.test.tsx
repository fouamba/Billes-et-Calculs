import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { MarbleManipulationActivity } from '@/components/activities/MarbleManipulationActivity';
import { useXAPITracking } from '@/hooks/useXAPITracking';
import { XAPIService } from '@/services/xapi.service';

// Mock du hook useXAPITracking
const mockTrackMarbleInteraction = jest.fn();
const mockTrackConceptualization = jest.fn();
const mockTrackActivity = jest.fn();

jest.mock('@/hooks/useXAPITracking', () => ({
  useXAPITracking: () => ({
    trackMarbleInteraction: mockTrackMarbleInteraction,
    trackConceptualization: mockTrackConceptualization,
    trackActivity: mockTrackActivity
  })
}));

// Mock du service XAPI
jest.mock('@/services/xapi.service');

describe('Intégration xAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait envoyer des événements xAPI lors des interactions avec les billes', async () => {
    const { getByTestId } = render(<MarbleManipulationActivity />);

    // Simuler une interaction avec une bille
    await act(async () => {
      fireEvent.click(getByTestId('marble-0'));
      await waitFor(() => {
        expect(mockTrackMarbleInteraction).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'select',
            marbleId: 'marble-0'
          })
        );
      });
    });
  });

  it('devrait envoyer des événements lors des conceptualisations détectées', async () => {
    const { getByTestId } = render(<MarbleManipulationActivity />);

    // Simuler un groupement de billes
    await act(async () => {
      fireEvent.click(getByTestId('marble-0'));
      fireEvent.click(getByTestId('marble-1'));
      fireEvent.click(getByTestId('group-btn'));

      await waitFor(() => {
        expect(mockTrackConceptualization).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'grouping',
            details: expect.objectContaining({
              count: 2
            })
          })
        );
      });
    });
  });

  it('devrait suivre la progression des activités', async () => {
    const { getByTestId } = render(<MarbleManipulationActivity />);

    await act(async () => {
      // Démarrer l'activité
      fireEvent.click(getByTestId('start-activity-btn'));

      // Vérifier l'événement de début
      await waitFor(() => {
        expect(mockTrackActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'started',
            activityId: expect.any(String)
          })
        );
      });

      // Simuler une action de l'utilisateur
      fireEvent.click(getByTestId('marble-0'));
      fireEvent.click(getByTestId('group-btn'));

      // Vérifier l'événement de progression
      await waitFor(() => {
        expect(mockTrackActivity).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'progressed',
            result: expect.objectContaining({
              progress: expect.any(Number)
            })
          })
        );
      });
    });
  });

  it('devrait gérer les erreurs de connexion', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockError = new Error('Network Error');
    mockTrackMarbleInteraction.mockRejectedValueOnce(mockError);

    const { getByTestId } = render(<MarbleManipulationActivity />);

    await act(async () => {
      fireEvent.click(getByTestId('marble-0'));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Erreur lors du tracking:'),
      mockError
    );

    consoleSpy.mockRestore();
  });
});