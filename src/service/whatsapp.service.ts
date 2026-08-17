import api from './api';

export interface WhatsappContact {
  id: string;
  name: string;
  role: string;
  phone: string;
}

export interface SendWhatsappPayload {
  institutionName: string;
  message: string;
  phoneNumbers: string[];
}

export interface SendWhatsappMediaPayload {
  contactId: string;
  mediaUrl?: string;
  message?: string;
}

export const whatsappService = {
  async getContacts(): Promise<WhatsappContact[]> {
    const response = await api.get('/whatsapp/contacts');
    return response.data;
  },

  async sendBulkWhatsapp(payload: SendWhatsappPayload): Promise<void> {
    const response = await api.post('/whatsapp/send', payload);
    return response.data;
  },

  async sendMediaWhatsapp(payload: SendWhatsappMediaPayload): Promise<void> {
    const response = await api.post('/whatsapp/send-media', payload);
    return response.data;
  },
};
