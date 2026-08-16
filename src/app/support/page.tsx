"use client";
"use client";

import { useState, useEffect } from 'react';
import axiosInstance from '@/service/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SupportTicket {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

const safeStringRegex = /^[^<>';=]*$/;

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axiosInstance.get('/support/tickets/my');
      setTickets(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (e: React.FormEvent) => {
    
    e.preventDefault();
    
    // --- Auto Zod Validation ---
    const formErrors: Record<string, string> = {};
    let hasValidationErrors = false;
    
    // Helper to validate a string
    const validateString = (val: any, fieldName: string) => {
      if (typeof val === 'string') {
        if (!val.trim()) {
          formErrors[fieldName] = "Campo obrigatório";
          hasValidationErrors = true;
        } else if (val.length > 255) {
          formErrors[fieldName] = "Texto demasiado longo";
          hasValidationErrors = true;
        } else if (!safeStringRegex.test(val)) {
          formErrors[fieldName] = "Caracteres inválidos (Não use < > ' ; =)";
          hasValidationErrors = true;
        }
      }
    };

    validateString(title, 'title');
    validateString(description, 'description');
    
    if (hasValidationErrors) {
      setErrors(formErrors);
      return; // Aborta submissão
    }
    setErrors({});
    // ---------------------------
  
    try {
      await axiosInstance.post('/support/tickets', { title, description, priority: 'MEDIUM' });
      setTitle('');
      setDescription('');
      fetchTickets();
      alert('Ticket criado com sucesso!');
    } catch {
      alert('Erro ao criar ticket.');
    }
  };

  if (loading) return <div className="p-8">A carregar suporte...</div>;

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Centro de Suporte YhankoEduca</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-card p-6 rounded-xl border shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">Abrir Novo Ticket</h2>
          <form onSubmit={createTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Assunto</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Ex: Problema no horário" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea 
                className="w-full border rounded-xl p-2 min-h-[120px]" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
                placeholder="Descreva o seu problema detalhadamente..."
              />
            </div>
            <Button type="submit" className="w-full">Enviar Pedido de Suporte</Button>
          </form>
        </div>

        <div className="md:col-span-2 bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50"><h2 className="text-xl font-bold">Meus Tickets Abertos</h2></div>
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="p-4">Assunto</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t: SupportTicket) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50 cursor-pointer">
                  <td className="p-4 font-medium">{t.title}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100">{t.status}</span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length === 0 && <div className="p-8 text-center text-slate-500">Ainda não precisou de suporte!</div>}
        </div>
      </div>
    </div>
  );
}
