import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn()
}));

vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        get: mockGet
      }))
    }
  };
});

import { fetchPatients, fetchPatientById } from '../services/api';

describe('api.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPatients', () => {
    it('fetches patients successfully and validates schema', async () => {
      const mockData = [
        {
          id: '1',
          name: 'John Doe',
          description: 'Desc',
          website: 'https://example.com',
          avatar: 'avatar.png',
          createdAt: '2023-01-01'
        }
      ];
      mockGet.mockResolvedValueOnce({ data: mockData });

      const result = await fetchPatients(1, 10, '');
      expect(mockGet).toHaveBeenCalledWith('/users', {
        params: { page: 1, limit: 10 }
      });
      expect(result).toEqual(mockData);
    });

    it('adds search param when search string is provided', async () => {
      mockGet.mockResolvedValueOnce({ data: [] });
      await fetchPatients(1, 10, 'John');
      expect(mockGet).toHaveBeenCalledWith('/users', {
        params: { page: 1, limit: 10, name: 'John' }
      });
    });

    it('returns empty array on 404 when searching', async () => {
      mockGet.mockRejectedValueOnce({
        response: { status: 404 }
      });

      const result = await fetchPatients(1, 10, 'NonExistent');
      expect(result).toEqual([]);
    });

    it('throws error when validation fails', async () => {
      // Invalid data missing required fields
      mockGet.mockResolvedValueOnce({ data: [{ id: '1' }] });

      await expect(fetchPatients()).rejects.toThrow('La respuesta de la API no tiene el formato esperado');
    });

    it('throws original error on non-404 failures', async () => {
      mockGet.mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchPatients(1, 10, 'John')).rejects.toThrow('Network Error');
    });
  });

  describe('fetchPatientById', () => {
    it('fetches patient by id successfully', async () => {
      const mockPatient = {
        id: '1',
        name: 'John Doe',
        description: 'Desc',
        website: 'https://example.com',
        avatar: 'avatar.png',
        createdAt: '2023-01-01'
      };
      mockGet.mockResolvedValueOnce({ data: mockPatient });

      const result = await fetchPatientById('1');
      expect(mockGet).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockPatient);
    });

    it('throws error when validation fails', async () => {
      mockGet.mockResolvedValueOnce({ data: { id: '1' } }); // Missing name, etc.

      await expect(fetchPatientById('1')).rejects.toThrow('La respuesta de la API no tiene el formato esperado');
    });
  });
});
