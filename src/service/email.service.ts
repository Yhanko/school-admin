import api from './api';

export interface EmailContact {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface SendEmailPayload {
  institutionName: string;
  subject: string;
  message: string;
  emails: string[];
}

export const emailService = {
  async getContacts(): Promise<EmailContact[]> {
    const response = await api.get('/email/contacts');
    return response.data;
  },

  async sendBulkEmail(payload: SendEmailPayload): Promise<void> {
    const response = await api.post('/email/send', payload);
    return response.data;
  },
};
