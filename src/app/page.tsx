"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from '@/lib/icons';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-white p-4">
      <Loader2 className="w-10 h-10 text-[#FF5777] animate-spin mb-4" />
      <p className="text-sm font-medium text-gray-400">Redirecionando para o Portal de Acesso...</p>
    </main>
  );
}