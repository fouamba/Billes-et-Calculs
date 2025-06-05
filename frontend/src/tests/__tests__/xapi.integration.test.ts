/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { XAPIService } from '@/services/xapi.service';
import { MarbleInteraction, ConceptualizationData } from '@/types/analytics';
import { Vector3 } from 'three';

describe('XAPI Integration', () => {
  let xapiService: XAPIService;
  let mockFetch: jest.Mock;
    beforeEach(() => {
    // Mock des variables d'environnement
    process.env.LEARNING_LOCKER_ENDPOINT = 'http://localhost:8080/data/xAPI';
    process.env.LL_KEY = 'testkey';
    process.env.LL_SECRET = 'testsecret';
    
    // Configuration du mock fetch
    mockFetch = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;
    
    xapiService = new XAPIService();
  });

  describe('Marble Interactions', () => {
    it('should send valid marble interaction statement', async () => {      const marbleData: MarbleInteraction = {
        marbleId: 'test-marble-1',
        color: 'red',
        position: new Vector3(1, 0, 0),
        duration: 1500,
        interactionType: 'click'
      };

      mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

      await xapiService.trackMarbleManipulation(marbleData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/data/xAPI/statements'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-Experience-API-Version': '1.0.3'
          })
        })
      );

      const [, { body }] = (global.fetch as jest.Mock).mock.calls[0];
      const statement = JSON.parse(body);
      
      expect(statement).toMatchObject({
        verb: {
          id: 'http://addlearn.app/verbs/manipulated'
        },
        object: {
          definition: {
            type: 'http://addlearn.app/object-types/marble'
          }
        }
      });
    });
  });

  describe('Conceptualization Tracking', () => {
    it('should send valid conceptualization statement', async () => {
      const conceptData: ConceptualizationData = {
        conceptType: 'addition',
        confidence: 0.85,
        isImplicit: true,
        patternDetected: true
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      await xapiService.trackConceptualization(conceptData);

      const [, { body }] = (global.fetch as jest.Mock).mock.calls[0];
      const statement = JSON.parse(body);

      expect(statement).toMatchObject({
        verb: {
          id: 'http://addlearn.app/verbs/conceptualized'
        },
        result: {
          score: {
            raw: 0.85,
            max: 1
          },
          extensions: {
            'http://addlearn.app/extensions/implicit': true
          }
        }
      });
    });
  });

  describe('Batch Processing', () => {
    it('should batch multiple statements and send them together', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true });
      
      // Générer plusieurs interactions rapidement
      for (let i = 0; i < 10; i++) {
        await xapiService.trackMarbleManipulation({
          marbleId: `test-marble-${i}`,
          color: 'blue',
          position: new Vector3(i, 0, 0),
          duration: 1000,
          interactionType: 'click'
        });
      }

      // Attendre que le batch soit traité
      await new Promise(resolve => setTimeout(resolve, 100));

      // Vérifier que fetch n'a pas été appelé 10 fois
      expect(global.fetch).toHaveBeenCalledTimes(1);
      
      // Vérifier que le batch contient plusieurs statements
      const [, { body }] = (global.fetch as jest.Mock).mock.calls[0];
      const statements = JSON.parse(body);
      expect(Array.isArray(statements)).toBe(true);
      expect(statements.length).toBeGreaterThan(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Simuler une erreur réseau
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      
      await xapiService.trackMarbleManipulation({
        marbleId: 'test-marble',
        color: 'red',
        position: new Vector3(0, 0, 0),
        duration: 1000,
        interactionType: 'click'
      });

      expect(consoleError).toHaveBeenCalled();
      expect(xapiService['batchQueue'].length).toBeGreaterThan(0);

      consoleError.mockRestore();
    });

    it('should retry failed statements in next batch', async () => {
      // Premier appel échoue
      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        // Deuxième appel réussit
        .mockResolvedValueOnce({ ok: true });

      // Test d'une interaction
      await xapiService.trackMarbleManipulation({
        marbleId: 'retry-test',
        color: 'red',
        position: new Vector3(0, 0, 0),
        duration: 1000,
        interactionType: 'click'
      });

      // Attendre le retry
      await new Promise(resolve => setTimeout(resolve, 5100));

      expect(global.fetch).toHaveBeenCalledTimes(2);
      
      // Vérifier que le deuxième appel contient le statement qui a échoué
      const [, { body }] = (global.fetch as jest.Mock).mock.calls[1];
      const statements = JSON.parse(body);
      expect(statements[0].object.id).toContain('retry-test');
    });
  });
});
