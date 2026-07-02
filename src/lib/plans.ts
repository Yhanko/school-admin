export interface Plan {
  id: string;
  name: string;
  description: string;
  period: number;
  discount: number;
  popular: boolean;
  features: string[];
  color: string;
}

export interface PriceCalculation {
  originalTotal: number;
  finalTotal: number;
  monthlyEquivalent: number;
  discountAmount: number;
  savings: number;
  annualEquivalent: number;
  annualSavings: number;
}

export const basePrice: number = 29.90;

export const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'Mensal',
    description: 'Flexibilidade máxima',
    period: 1,
    discount: 0,
    popular: false,
    features: ['Acesso completo', 'Suporte 24/7', 'Cancelamento livre'],
    color: 'gray'
  },
  {
    id: 'quarterly',
    name: 'Trimestral',
    description: 'Economia inteligente',
    period: 3,
    discount: 10,
    popular: false,
    features: ['Acesso completo', 'Suporte prioritário', 'Recursos extras'],
    color: 'pink'
  },
  {
    id: 'biannual',
    name: 'Semestral',
    description: 'Ótimo custo-benefício',
    period: 6,
    discount: 15,
    popular: false,
    features: ['Acesso completo', 'Suporte VIP', 'Recursos premium'],
    color: 'pink'
  },
  {
    id: 'annual',
    name: 'Anual',
    description: 'Máxima economia',
    period: 12,
    discount: 20,
    popular: true,
    features: ['Acesso completo', 'Suporte exclusivo', 'Todos os recursos', 'Acesso antecipado'],
    color: 'primary'
  }
];

export const calculatePrices = (plan: Plan): PriceCalculation => {
  const originalTotal = basePrice * plan.period;
  const discountAmount = originalTotal * (plan.discount / 100);
  const finalTotal = originalTotal - discountAmount;
  const monthlyEquivalent = finalTotal / plan.period;
  const annualEquivalent = monthlyEquivalent * 12;
  const annualSavings = (basePrice * 12) - annualEquivalent;
  
  return {
    originalTotal,
    finalTotal,
    monthlyEquivalent,
    discountAmount,
    savings: originalTotal - finalTotal,
    annualEquivalent,
    annualSavings
  };
};
