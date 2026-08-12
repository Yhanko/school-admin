"use client"
import React, { useState } from 'react';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from '@/lib/icons';

const AddNewTeacher: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      university: '',
      degree: '',
      educationPeriod: '',
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
              password: 'Password123!', // Default password for new teachers
              role: 'TEACHER',
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              university: formData.university,
              degree: formData.degree,
              educationPeriod: formData.educationPeriod
          });

          toast({ title: 'Sucesso', description: 'Professor criado com sucesso!' });
          setFormData({
              firstName: '', lastName: '', email: '', phone: '', address: '',
              city: '', university: '', degree: '', educationPeriod: ''
          });
      } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao criar professor', variant: 'destructive' });
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen p-10 w-[70rem]">
      <h1 className="text-2xl font-semibold text-center text-gray-800 p-5">Adicionar Novo Professor</h1>
      <form onSubmit={handleSubmit} className="mx-auto shadow-lg rounded-lg flex space-x-20 bg-white">
        <div className="flex-1">
          <div className="bg-indigo-600 text-white p-5 rounded-t-lg">
            <h2 className="text-lg font-semibold">Dados Pessoais</h2>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700">Primeiro Nome *</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Nome" />
            </div>
            <div>
                <label className="block text-gray-700">Último Nome *</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Sobrenome" />
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
                <label className="block text-gray-700">Email *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="exemplo@email.com" />
            </div>
            <div>
                <label className="block text-gray-700">Telemóvel *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="(xxx) xxx-xxxx" />
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
                <label className="block text-gray-700">Morada</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="mt-1 p-2 border rounded w-full" rows={3} placeholder="Endereço completo..."></textarea>
            </div>

            <div>
                <label className="block text-gray-700">Foto</label>
                <div className="border-dashed border-2 border-gray-300 rounded p-4 flex items-center justify-center text-gray-400">
                Arraste um ficheiro
                </div>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
                <label className="block text-gray-700">Cidade / País</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Cidade, País" />
            </div>
            </div>
          </div>
        </div>

        <div className='w-[30rem] border-l'>
          <div className="bg-indigo-600 text-white p-5 rounded-tr-lg">
            <h2 className="text-lg font-semibold">Formação Académica</h2>
          </div>
          
            <div className="grid grid-cols-1 gap-4 p-4">
              <div>
                <label className="block text-gray-700">Universidade *</label>
                <input required type="text" name="university" value={formData.university} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Nome da Instituição" />
              </div>
              <div>
                <label className="block text-gray-700">Grau Académico *</label>
                <input required type="text" name="degree" value={formData.degree} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Licenciatura, Mestrado..." />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4">
              <div>
                <label className="block text-gray-700">Período *</label>
                <input required type="text" name="educationPeriod" value={formData.educationPeriod} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="ex: 2018 - 2022" />
              </div>
              <div>
                <label className="block text-gray-700">CV (Opcional)</label>
                <input type="file" className="mt-1 p-2 border rounded w-full" />
              </div>
              <div>
                <label className="block text-gray-700">BI (Opcional)</label>
                <input type="file" className="mt-1 p-2 border rounded w-full" />
              </div>
            </div>
            <div className="flex justify-end mt-5 p-5">
              <button disabled={isLoading} type="submit" className="bg-indigo-600 rounded-full text-white p-2 w-36 hover:bg-indigo-700 flex justify-center cursor-pointer">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gravar"}
              </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewTeacher;