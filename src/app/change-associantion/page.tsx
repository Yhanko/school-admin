"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from '@/lib/icons';

function ChangeAssociationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    degree: '', // We use degree for Position/Role in association
  });

  useEffect(() => {
    if (!id) {
        setIsFetching(false);
        return;
    }

    const fetchMember = async () => {
        try {
            const response = await axiosInstance.get(`/users/${id}`);
            const data = response.data;
            const names = data.name.split(' ');

            setFormData({
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: data.email || '',
                phone: data.profile?.phone || '',
                address: data.profile?.address || '',
                city: data.profile?.city || '',
                degree: data.profile?.degree || '',
            });
        } catch (error) {
            console.error(error);
            toast({ title: 'Erro', description: 'Falha ao carregar membro da associação', variant: 'destructive' });
        } finally {
            setIsFetching(false);
        }
    };

    fetchMember();
  }, [id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);

    const name = `${formData.firstName} ${formData.lastName}`.trim();

    try {
        await axiosInstance.patch(`/users/${id}`, {
            name,
            email: formData.email,
            profile: {
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                degree: formData.degree,
            }
        });

        toast({ title: 'Sucesso', description: 'Membro atualizado com sucesso!' });
        router.push('/association');
    } catch (error: any) {
        toast({ title: 'Erro', description: error.response?.data?.message || 'Falha ao atualizar membro', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
    );
  }

  if (!id) {
    return <div className="p-10">Nenhum membro selecionado.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="container p-2">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-purple-600 mb-4">Editar dados do membro da associação</h2>

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
              maxLength={200}
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
            type="submit" 
            disabled={isLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-150 flex items-center justify-center w-40"
        >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Atualizar Membro"}
        </button>
      </div>
    </form>
  );
}

export default function ChangeAssociation() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ChangeAssociationContent />
    </Suspense>
  )
}