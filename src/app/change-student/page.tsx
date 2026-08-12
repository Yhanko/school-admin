"use client"
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from '@/lib/icons';

interface StudentData {
  photo: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthCity: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
}

interface ParentData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'debit';
}

function StudentParentFormContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [studentData, setStudentData] = useState<StudentData>({
    photo: '', firstName: '', lastName: '', birthDate: '', birthCity: '',
    parentName: '', phone: '', email: '', address: ''
  });

  const [parentData, setParentData] = useState<ParentData>({
    firstName: '', lastName: '', email: '', phone: '', address: '', paymentMethod: 'cash'
  });

  useEffect(() => {
    if (!id) {
        setIsFetching(false);
        return;
    }

    const fetchStudent = async () => {
        try {
            const response = await axiosInstance.get(`/users/${id}`);
            const data = response.data;
            const names = data.name.split(' ');

            setStudentData({
                photo: data.profile?.photoUrl || '',
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                birthDate: data.profile?.dateOfBirth || '',
                birthCity: data.profile?.birthCity || '',
                parentName: data.profile?.guardianName || '',
                phone: data.profile?.phone || '',
                email: data.email || '',
                address: data.profile?.address || '',
            });

            const parentNames = (data.profile?.guardianName || '').split(' ');
            setParentData({
                firstName: parentNames[0] || '',
                lastName: parentNames.slice(1).join(' ') || '',
                email: data.profile?.guardianEmail || '',
                phone: data.profile?.guardianPhone || '',
                address: data.profile?.guardianAddress || '',
                paymentMethod: 'cash'
            });
        } catch (error) {
            console.error(error);
            toast({ title: 'Erro', description: 'Falha ao carregar aluno', variant: 'destructive' });
        } finally {
            setIsFetching(false);
        }
    };

    fetchStudent();
  }, [id, toast]);

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParentData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentData(prev => ({ ...prev, paymentMethod: e.target.value as ParentData['paymentMethod'] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);

    const name = `${studentData.firstName} ${studentData.lastName}`.trim();
    const guardianName = `${parentData.firstName} ${parentData.lastName}`.trim();

    try {
        await axiosInstance.patch(`/users/${id}`, {
            name,
            email: studentData.email,
            profile: {
                dateOfBirth: studentData.birthDate,
                birthCity: studentData.birthCity,
                phone: studentData.phone,
                address: studentData.address,
                guardianName,
                guardianPhone: parentData.phone,
                guardianEmail: parentData.email,
                guardianAddress: parentData.address,
            }
        });

        toast({ title: 'Sucesso', description: 'Aluno atualizado com sucesso!' });
        router.push('/student');
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao atualizar aluno', variant: 'destructive' });
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
    return <div className="p-10">Nenhum aluno selecionado.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="container p-2">
      {/* Student Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-purple-600">Editar Dados do Aluno</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label>Foto *</label>
            <div className="border-dashed border-2 border-gray-300 h-32 flex items-center justify-center text-gray-500">
              {studentData.photo ? 'Foto Carregada' : 'Arraste e solte ou clique para selecionar o ficheiro'}
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="firstName">Primeiro Nome *</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="border rounded-lg p-2"
              value={studentData.firstName}
              onChange={handleStudentChange}
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
              value={studentData.lastName}
              onChange={handleStudentChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="birthDate">Data de Nascimento *</label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="border rounded-lg p-2"
              value={studentData.birthDate}
              onChange={handleStudentChange}
            />
            <label htmlFor="birthCity" className="mt-2">Local de Nascimento (Cidade) *</label>
            <input
              id="birthCity"
              name="birthCity"
              type="text"
              placeholder="Cidade"
              className="border rounded-lg p-2 mt-1"
              value={studentData.birthCity}
              onChange={handleStudentChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="parentName">Nome do Encarregado de Educação *</label>
            <input
              id="parentName"
              name="parentName"
              type="text"
              className="border rounded-lg p-2"
              value={studentData.parentName}
              onChange={handleStudentChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone">Telefone *</label>
            <input
              id="phone"
              name="phone"
              type="text"
              className="border rounded-lg p-2"
              value={studentData.phone}
              onChange={handleStudentChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              className="border rounded-lg p-2"
              value={studentData.email}
              onChange={handleStudentChange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="address">Morada *</label>
            <textarea
              id="address"
              name="address"
              className="border rounded-lg p-2"
              rows={4}
              maxLength={200}
              value={studentData.address}
              onChange={handleStudentChange}
            />
          </div>
        </div>
      </div>

      {/* Parent Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-purple-600">Detalhes do Encarregado de Educação</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label htmlFor="parentFirstName">Primeiro Nome *</label>
            <input
              id="parentFirstName"
              name="firstName"
              type="text"
              className="border rounded-lg p-2"
              value={parentData.firstName}
              onChange={handleParentChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="parentLastName">Último Nome *</label>
            <input
              id="parentLastName"
              name="lastName"
              type="text"
              className="border rounded-lg p-2"
              value={parentData.lastName}
              onChange={handleParentChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="parentEmail">Email *</label>
            <input
              id="parentEmail"
              name="email"
              type="email"
              className="border rounded-lg p-2"
              value={parentData.email}
              onChange={handleParentChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="parentPhone">Telefone *</label>
            <input
              id="parentPhone"
              name="phone"
              type="text"
              className="border rounded-lg p-2"
              value={parentData.phone}
              onChange={handleParentChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="parentAddress">Morada *</label>
            <input
              id="parentAddress"
              name="address"
              className="border rounded-lg p-2"
              value={parentData.address}
              onChange={handleParentChange}
            />
          </div>
          <div className="flex flex-col">
            <label>Método de Pagamento *</label>
            <div className="flex items-center mt-2">
              <input
                type="radio"
                id="paymentCash"
                name="paymentMethod"
                value="cash"
                className="mr-2"
                checked={parentData.paymentMethod === 'cash'}
                onChange={handlePaymentChange}
              />
              <label htmlFor="paymentCash" className="mr-4">Dinheiro</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition duration-150">Guardar como Rascunho</button>
        <button disabled={isLoading} type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-150 flex justify-center w-48">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submeter Atualização"}
        </button>
      </div>
    </form>
  );
}

export default function StudentParentForm() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <StudentParentFormContent />
    </Suspense>
  )
}