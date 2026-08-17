"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { CreditCard, AlertCircle, Calendar, CheckCircle } from "lucide-react";

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [institutionStatus, setInstitutionStatus] = useState<string>("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await api.get("/institutions/me/subscription");
      setInstitutionStatus(response.data.institutionStatus);
      setSubscription(response.data.currentSubscription);
    } catch (error) {
      console.error("Failed to fetch subscription", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center text-slate-500">A carregar dados da subscrição...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Minha Subscrição</h1>
        <p className="text-slate-500">Efetue a gestão do plano e faturação da sua escola.</p>
      </div>

      {institutionStatus === "payment_restricted" && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8 flex items-start gap-4">
          <AlertCircle className="text-red-600 mt-1" size={24} />
          <div>
            <h3 className="text-red-800 font-semibold text-lg">Acesso Restrito: Pagamento Pendente</h3>
            <p className="text-red-600">
              O acesso à plataforma para professores e alunos encontra-se temporariamente suspenso devido à falta de pagamento.
              Por favor, regularize a sua subscrição para restaurar os serviços.
            </p>
          </div>
        </div>
      )}

      {institutionStatus === "suspended" && (
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-8 flex items-start gap-4">
          <AlertCircle className="text-orange-600 mt-1" size={24} />
          <div>
            <h3 className="text-orange-800 font-semibold text-lg">Conta Suspensa</h3>
            <p className="text-orange-600">
              A sua conta encontra-se suspensa. Entre em contacto com o suporte.
            </p>
          </div>
        </div>
      )}

      {institutionStatus === "active" && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-8 flex items-center gap-4">
          <CheckCircle className="text-green-600" size={24} />
          <div>
            <h3 className="text-green-800 font-semibold">Conta Ativa</h3>
            <p className="text-green-600 text-sm">O seu serviço está a funcionar normalmente.</p>
          </div>
        </div>
      )}

      {subscription ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-slate-800">Detalhes do Plano</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Plano Atual</p>
              <p className="font-semibold text-lg">{subscription.plan?.name || "Plano Personalizado"}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 mb-1">Preço Mensal</p>
              <p className="font-semibold text-lg">
                {subscription.plan?.price 
                  ? new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(subscription.plan.price) 
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Início da Subscrição</p>
              <p className="font-semibold text-slate-800 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                {new Date(subscription.startDate).toLocaleDateString('pt-AO')}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-1">Data de Fim / Próxima Fatura</p>
              <p className="font-semibold text-slate-800 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                {subscription.endDate 
                  ? new Date(subscription.endDate).toLocaleDateString('pt-AO')
                  : "Ilimitado"}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex gap-4">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              Pagar Mensalidade
            </button>
            <button className="border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition">
              Enviar Comprovativo
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center py-12">
          <p className="text-slate-500 mb-4">Nenhuma informação de subscrição encontrada para esta escola.</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
            Contactar Suporte
          </button>
        </div>
      )}
    </div>
  );
}
