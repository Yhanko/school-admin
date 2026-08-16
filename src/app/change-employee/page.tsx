
"use client";
import React, { useState, useEffect, Suspense } from 'react';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from '@/lib/icons';
import { useSearchParams, useRouter } from 'next/navigation';

const safeStringRegex = /^[^<>';=]*$/;

const ChangeEmployeeContent = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFetching, setIsFetching] = useState(true);
  
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
      role: ''
  });

  useEffect(() => {
    if (!id) {
        setIsFetching(false);
        return;
    }

    const fetchEmployee = async () => {
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
                university: data.profile?.university || '',
                degree: data.profile?.degree || '',
                educationPeriod: data.profile?.educationPeriod || '',
                role: data.role || ''
            });
        } catch (error) {
            console.error(error);
            toast({ title: 'Erro', description: 'Falha ao carregar funcionário', variant: 'destructive' });
        } finally {
            setIsFetching(false);
        }
    };

    fetchEmployee();
  }, [id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      
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

    // Dinamicamente valida o estado do formulário se for um objeto como formData
    if (typeof formData !== 'undefined' && formData !== null) {
      Object.entries(formData).forEach(([k, v]) => validateString(v, k));
    }
    
    if (hasValidationErrors) {
      setErrors(formErrors);
      return; // Aborta submissão
    }
    setErrors({});
    // ---------------------------
  
      if (!id) return;

      setIsLoading(true);
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      
      try {
          await axiosInstance.patch(`/users/${id}`, {
              name,
              email: formData.email,
              role: formData.role,
              profile: {
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                university: formData.university,
                degree: formData.degree,
                educationPeriod: formData.educationPeriod
              }
          });

          toast({ title: 'Sucesso', description: 'Funcionário atualizado com sucesso!' });
          router.push('/employees');
      } catch (error) {
          const err = error as { response?: { data?: { message?: string } } };
          toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao atualizar funcionário', variant: 'destructive' });
      } finally {
          setIsLoading(false);
      }
  };

  if (isFetching) {
    return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!id) {
    return <div className="p-10">Nenhum funcionário selecionado.</div>;
  }

  return (
    <div className="min-h-screen p-10 w-[70rem]">
      <h1 className="text-2xl font-semibold text-center text-foreground p-5">Editar Funcionário</h1>
      <form onSubmit={handleSubmit} className="mx-auto shadow-lg rounded-xl flex space-x-20 bg-card">
        <div className="flex-1">
          <div className="bg-primary text-white p-5 rounded-t-lg">
            <h2 className="text-lg font-semibold">Dados Pessoais</h2>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-foreground">Primeiro Nome *</label>
                <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Nome" />
{errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-foreground">Último Nome *</label>
                <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Sobrenome" />
{errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-foreground">Email *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="exemplo@email.com" />
{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-foreground">Telemóvel *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="(xxx) xxx-xxxx" />
{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-foreground">Morada</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="mt-1 p-2 border rounded w-full" rows={3} placeholder="Endereço completo..."></textarea>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-foreground">Cargo / Role</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Ex: TEACHER, ADMIN" />
{errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-foreground">Cidade / País</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Cidade, País" />
{errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className='w-[30rem] border-l'>
          <div className="bg-primary text-white p-5 rounded-tr-lg">
            <h2 className="text-lg font-semibold">Formação Académica</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4 p-4">
            <div>
              <label className="block text-foreground">Universidade *</label>
              <input required type="text" name="university" value={formData.university} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Nome da Instituição" />
{errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
              {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
            </div>
            <div>
              <label className="block text-foreground">Grau Académico *</label>
              <input required type="text" name="degree" value={formData.degree} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="Licenciatura, Mestrado..." />
{errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
              {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4">
            <div>
              <label className="block text-foreground">Período *</label>
              <input required type="text" name="educationPeriod" value={formData.educationPeriod} onChange={handleChange} className="mt-1 p-2 border rounded w-full" placeholder="ex: 2018 - 2022" />
{errors.educationPeriod && <p className="text-red-500 text-xs mt-1">{errors.educationPeriod}</p>}
              {errors.educationPeriod && <p className="text-red-500 text-xs mt-1">{errors.educationPeriod}</p>}
            </div>
            <div>
              <label className="block text-foreground">CV (Opcional)</label>
              <input type="file" className="mt-1 p-2 border rounded w-full" />
            </div>
          </div>
          <div className="flex justify-end mt-5 p-5">
            <button disabled={isLoading} type="submit" className="bg-primary rounded-full text-white p-2 w-36 hover:bg-indigo-700 flex justify-center cursor-pointer">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Atualizar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default function ChangeEmployee() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ChangeEmployeeContent />
    </Suspense>
  )
}