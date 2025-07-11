
import { Agreement } from '../types/Agreement';

// Use Vite environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const agreementService = {
  async getAllAgreements(params?: {
    status?: string;
    engagedPartyId?: string;
    agreementType?: string;
    offset?: number;
    limit?: number;
  }): Promise<Agreement[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.engagedPartyId) searchParams.append('engagedPartyId', params.engagedPartyId);
      if (params?.agreementType) searchParams.append('agreementType', params.agreementType);
      if (params?.offset) searchParams.append('offset', params.offset.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const url = `${API_BASE_URL}${searchParams.toString() ? `?${searchParams}` : ''}`;
      console.log('Fetching agreements from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching agreements:', error);
      throw new Error('Agreement service not available: ' + (error instanceof Error ? error.message : String(error)));
    }
  },

  async getAgreementById(id: string): Promise<Agreement> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching agreement:', error);
      throw new Error('Failed to fetch agreement: ' + (error instanceof Error ? error.message : String(error)));
    }
  },

  async createAgreement(agreement: Omit<Agreement, 'id' | 'createdDate' | 'href' | 'status' | 'audit'>): Promise<Agreement> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agreement),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error creating agreement:', error);
      throw new Error('Failed to create agreement: ' + (error instanceof Error ? error.message : String(error)));
    }
  },

  async updateAgreement(id: string, agreement: Partial<Agreement>): Promise<Agreement> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agreement),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error updating agreement:', error);
      throw new Error('Failed to update agreement: ' + (error instanceof Error ? error.message : String(error)));
    }
  },

  async deleteAgreement(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting agreement:', error);
      throw new Error('Failed to delete agreement: ' + (error instanceof Error ? error.message : String(error)));
    }
  },
};