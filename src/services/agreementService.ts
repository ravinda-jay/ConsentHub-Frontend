
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
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.engagedPartyId) searchParams.append('engagedPartyId', params.engagedPartyId);
    if (params?.agreementType) searchParams.append('agreementType', params.agreementType);
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}?${searchParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch agreements');
    }
    return response.json();
  },

  async getAgreementById(id: string): Promise<Agreement> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch agreement');
    }
    return response.json();
  },

  async createAgreement(agreement: Omit<Agreement, 'id' | 'createdDate' | 'href' | 'status' | 'audit'>): Promise<Agreement> {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agreement),
    });
    if (!response.ok) {
      throw new Error('Failed to create agreement');
    }
    return response.json();
  },

  async updateAgreement(id: string, agreement: Partial<Agreement>): Promise<Agreement> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agreement),
    });
    if (!response.ok) {
      throw new Error('Failed to update agreement');
    }
    return response.json();
  },

  async deleteAgreement(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete agreement');
    }
  },
};