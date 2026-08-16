"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plan, PriceCalculation, plans, calculatePrices } from '@/lib/plans';
import { z } from "zod";
import { CreditCard, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from '@/lib/icons';

// Interfaces TypeScript
interface FormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  email: string;
  plan: string;
}

interface FormErrors {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  email?: string;
}

// Componentes UI baseados no shadcn/ui
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Label: React.FC<{ htmlFor: string; children: React.ReactNode; className?: string }> = ({ htmlFor, children, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const Input: React.FC<{
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number;
}> = ({ id, type = 'text', placeholder, value, onChange, className = '', maxLength }) => (
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    maxLength={maxLength}
    className={`flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
);

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}> = ({ children, onClick, disabled = false, className = '', type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${className}`}
  >
    {children}
  </button>
);

const paymentSchema = z.object({
  cardNumber: z.string().transform(v => v.replace(/\s/g, '')).pipe(z.string().length(16, "Número do cartão deve ter 16 dígitos")),
  cardName: z.string().trim().min(2, "Nome do titular é obrigatório").max(100, "Nome muito longo").regex(/^[^<>';=]*$/, "Caracteres inválidos"),
  expiryDate: z.string().trim().min(5, "Data de expiração inválida").max(5, "Data de expiração inválida").regex(/^[^<>';=]*$/, "Caracteres inválidos"),
  cvv: z.string().trim().min(3, "CVV deve ter 3 ou 4 dígitos").max(4, "CVV deve ter 3 ou 4 dígitos"),
  email: z.string().trim().email("Email inválido"),
  plan: z.string().optional()
});

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    plan: ''
  });

  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<(Plan & { prices: PriceCalculation }) | null>(null);

  useEffect(() => {
    const planId = searchParams.get('plan');
    if (planId) {
      const foundPlan = plans.find(p => p.id === planId);
      if (foundPlan) {
        const prices = calculatePrices(foundPlan);
        setSelectedPlan({ ...foundPlan, prices });
        setFormData(prev => ({ ...prev, plan: foundPlan.name }));
      }
    }
  }, [searchParams]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  // Função para formatar número do cartão
  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';

    const parts: string[] = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Função para formatar data de expiração
  const formatExpiryDate = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handler para mudanças nos inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handler para submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      paymentSchema.parse(formData);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof FormErrors] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
      return;
    }

    setIsLoading(true);
    
    // Simular processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  // Detectar tipo do cartão
  const getCardType = (number: string): string => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'Mastercard';
    if (num.startsWith('3')) return 'American Express';
    return 'Cartão';
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#1B191F] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/5 backdrop-blur-md border border-white/10 animate-fade-in-up">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-secondary-foreground mx-auto animate-bounce" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Pagamento Realizado!</h2>
            <p className="text-gray-300 mb-6">
              Seu pagamento foi processado com sucesso. Você receberá um email de confirmação em breve.
            </p>
            <Button 
              onClick={() => setIsSuccess(false)}
              className="w-full bg-secondary hover:bg-[#E04B6B] text-white font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Fazer Novo Pagamento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B191F] flex items-center justify-center p-4">
      {/* Efeitos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Card className="w-full max-w-md bg-card/5 backdrop-blur-md border border-white/10 shadow-2xl animate-fade-in-up relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-secondary/20 rounded-full">
              <CreditCard className="w-8 h-8 text-secondary-foreground" />
            </div>
          </div>
          <CardTitle className="text-secondary-foreground text-3xl font-bold">
            Finalizar Pagamento
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Preencha os dados do seu cartão para aderir ao serviço
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Plano Selecionado */}
            <div className="bg-card/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">
                    {selectedPlan ? selectedPlan.name : 'Plano Básico'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {selectedPlan ? selectedPlan.description : 'Plano selecionado para assinatura'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-secondary-foreground font-bold text-lg">
                    {selectedPlan ? selectedPlan.prices.finalTotal.toFixed(2) : '29,90'} KZ
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {selectedPlan && selectedPlan.period > 1 
                      ? `por ${selectedPlan.period} meses`
                      : 'por mês'}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`bg-card/10 border-white/20 text-white placeholder:text-muted-foreground focus:border-[#FF5777] focus:ring-[#FF5777] transition-all duration-300 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Número do Cartão */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-gray-200">
                Número do Cartão
              </Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  maxLength={19}
                  className={`bg-card/10 border-white/20 text-white placeholder:text-muted-foreground focus:border-[#FF5777] focus:ring-[#FF5777] transition-all duration-300 pr-16 ${
                    errors.cardNumber ? 'border-red-500' : ''
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-xs text-muted-foreground bg-card/10 px-2 py-1 rounded">
                    {getCardType(formData.cardNumber)}
                  </span>
                </div>
              </div>
              {errors.cardNumber && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.cardNumber}
                </p>
              )}
            </div>

            {/* Nome do Titular */}
            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-gray-200">
                Nome do Titular
              </Label>
              <Input
                id="cardName"
                placeholder="João Silva"
                value={formData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value.toUpperCase())}
                className={`bg-card/10 border-white/20 text-white placeholder:text-muted-foreground focus:border-[#FF5777] focus:ring-[#FF5777] transition-all duration-300 ${
                  errors.cardName ? 'border-red-500' : ''
                }`}
              />
              {errors.cardName && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.cardName}
                </p>
              )}
            </div>

            {/* Data de Expiração e CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-gray-200">
                  Validade
                </Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/AA"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  maxLength={5}
                  className={`bg-card/10 border-white/20 text-white placeholder:text-muted-foreground focus:border-[#FF5777] focus:ring-[#FF5777] transition-all duration-300 ${
                    errors.expiryDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.expiryDate && (
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-gray-200">
                  CVV
                </Label>
                <div className="relative">
                  <Input
                    id="cvv"
                    type={showCvv ? 'text' : 'password'}
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    maxLength={4}
                    className={`bg-card/10 border-white/20 text-white placeholder:text-muted-foreground focus:border-[#FF5777] focus:ring-[#FF5777] transition-all duration-300 pr-10 ${
                      errors.cvv ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                  >
                    {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.cvv && (
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>

            {/* Informações de Segurança */}
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <Lock className="w-4 h-4" />
              <span>Seus dados estão protegidos com criptografia SSL</span>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-[#E04B6B] text-white font-bold py-3 text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Pagar {selectedPlan ? selectedPlan.prices.finalTotal.toFixed(2) : '29,90'} KZ</span>
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};
import { Suspense } from 'react';

const PaymentPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1B191F] flex items-center justify-center p-4"><div className="w-8 h-8 border-4 border-[#FF5777] border-t-transparent rounded-full animate-spin"></div></div>}>
      <PaymentPageContent />
    </Suspense>
  );
};

const PaymentPageContent = PaymentForm;

export default PaymentPage;