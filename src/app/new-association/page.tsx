"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from '@/lib/icons';

export default function NewAssociation() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    degree: '', // We can use degree to store the 'Position in association'
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const name = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      await axiosInstance.post('/users/employee', {
        name,
        email: formData.email,
        password: formData.password,
        role: 'ASSOCIATION_MEMBER',
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        degree: formData.degree, // Use this for "Position/Role in Association"
      });

      toast({ title: 'Sucesso', description: 'Membro da associação criado com sucesso!' });
      router.push('/association');
    } catch (error: any) {
      toast({ title: 'Erro', description: error.response?.data?.message || 'Falha ao criar membro', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold text-foreground mb-6">Adicionar Membro à Associação</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Dados do Membro</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <label htmlFor="firstName">Primeiro Nome *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="border rounded-lg p-2"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="lastName">Último Nome *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="border rounded-lg p-2"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="border rounded-lg p-2"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="password">Palavra-passe (Login) *</label>
              <input
                id="password"
                name="password"
                type="password"
                className="border rounded-lg p-2"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone">Telefone *</label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="border rounded-lg p-2"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="degree">Cargo na Associação</label>
              <input
                id="degree"
                name="degree"
                type="text"
                placeholder="Ex: Presidente, Vogal, Secretário..."
                className="border rounded-lg p-2"
                value={formData.degree}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="city">Cidade</label>
              <input
                id="city"
                name="city"
                type="text"
                className="border rounded-lg p-2"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="address">Morada</label>
              <textarea
                id="address"
                name="address"
                className="border rounded-lg p-2"
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-150 flex items-center justify-center w-40"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar Membro"}
          </button>
        </div>
      </form>
    </div>
  );
}