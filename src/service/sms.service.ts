import axiosInstance from './api';

export interface SendSmsPayload {
  institutionName: string;
  subject: string;
  message: string;
  phoneNumbers: string[];
}

export interface SmsContact {
  id: string;
  name: string;
  role: string;
  phone: string;
}

export const smsService = {
  sendBulkSms: async (payload: SendSmsPayload) => {
    const response = await axiosInstance.post('/sms/send', payload);
    return response.data;
  },
  getContacts: async (): Promise<SmsContact[]> => {
    const response = await axiosInstance.get('/sms/contacts');
    return response.data;
  }
};
