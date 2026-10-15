import { api } from './api';
import { Feedback } from '@ilc/shared';

export const feedbackService = {
  async submitFeedback(merchantName: string, rating: number, comment: string): Promise<Feedback> {
    const res = await api.fetch<{ success: boolean; feedback: Feedback }>('/feedback', {
      method: 'POST',
      body: JSON.stringify({
        merchant_name: merchantName,
        rating,
        comment,
      }),
    });
    return res.feedback;
  },

  async fetchMyFeedback(): Promise<Feedback[]> {
    try {
      const res = await api.fetch<{ success: boolean; feedback: Feedback[] }>('/feedback');
      return res.feedback || [];
    } catch {
      return [];
    }
  },
};
