'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './ui/button'

// Schema de validação com Zod
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Por favor, insira um email válido')
    .max(100, 'Email muito longo'),
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo')
    .optional()
    .or(z.literal('')),
  interests: z.array(z.string()).optional()
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

export function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    mode: 'onChange'
  })

  const watchedEmail = watch('email')
  const watchedName = watch('name')

  const interests = [
    { id: 'updates', label: 'Atualizações do Produto', icon: '🚀' },
    { id: 'tips', label: 'Dicas Educacionais', icon: '💡' },
    { id: 'events', label: 'Eventos e Webinars', icon: '📅' },
    { id: 'news', label: 'Notícias do Setor', icon: '📰' }
  ]

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true)
    
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Newsletter data:', { ...data, interests: selectedInterests })
    
    setSubmitted(true)
    setIsSubmitting(false)
    reset()
    setSelectedInterests([])
  }

  const resetForm = () => {
    setSubmitted(false)
    reset()
    setSelectedInterests([])
  }

  if (submitted) {
    return (
      <section>
        {/* Efeitos de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF5777]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF5777]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-md border border-[#FF5777]/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            
            {/* Ícone de sucesso animado */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FF5777] to-[#FF5777]/70 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>

            {/* Mensagem de sucesso */}
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              🎉 Inscrição Realizada!
            </h3>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Obrigado por se inscrever na nossa newsletter! Em breve você receberá 
              conteúdos exclusivos e novidades sobre nossa plataforma educacional.
            </p>
            
            {/* Benefícios */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <svg className="w-5 h-5 text-[#FF5777]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span>Conteúdo exclusivo toda semana</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <svg className="w-5 h-5 text-[#FF5777]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span>Acesso antecipado a novos recursos</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <svg className="w-5 h-5 text-[#FF5777]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span>Dicas e melhores práticas educacionais</span>
              </div>
            </div>

            {/* Botão para nova inscrição */}
            <Button
              onClick={resetForm}
              className="bg-[#FF5777]/20 hover:bg-[#FF5777]/30 text-[#FF5777] border border-[#FF5777]/30 px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
            >
              Fazer Nova Inscrição
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section  id="newsletter">
      
      {/* Efeitos de fundo atmosféricos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF5777]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF5777]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5777]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Partículas flutuantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#FF5777]/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-[#FF5777]/10 rounded-full mb-6">
            <div className="flex items-center space-x-2 bg-[#FF5777]/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-[#FF5777] rounded-full animate-pulse"></div>
              <span className="text-[#FF5777] font-semibold text-sm uppercase tracking-wider">Newsletter</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">
            Fique por Dentro das <span className="text-[#FF5777] relative">
              Novidades
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5777]/50 to-transparent rounded-full"></div>
            </span>
          </h2>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Receba conteúdo exclusivo, dicas educacionais e atualizações sobre nossa plataforma 
            diretamente no seu email. Junte-se a mais de 10.000 educadores!
          </p>
        </div>

        {/* Formulário principal */}
        <div className="bg-white/5 backdrop-blur-md border border-[#FF5777]/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          
          {/* Efeito shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-3xl"></div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
            
            {/* Campo de Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-white font-medium text-sm">
                Email *
              </label>
              <div className="relative">
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-[1.02] ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : watchedEmail 
                        ? 'border-[#FF5777] focus:ring-[#FF5777]/50' 
                        : 'border-[#FF5777]/30 focus:ring-[#FF5777]/50'
                  }`}
                />
                {watchedEmail && !errors.email && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Campo de Nome (Opcional) */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-white font-medium text-sm">
                Nome <span className="text-gray-400">(opcional)</span>
              </label>
              <div className="relative">
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  placeholder="Seu nome"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-[1.02] ${
                    errors.name 
                      ? 'border-red-500 focus:ring-red-500/50' 
                      : watchedName 
                        ? 'border-[#FF5777] focus:ring-[#FF5777]/50' 
                        : 'border-[#FF5777]/30 focus:ring-[#FF5777]/50'
                  }`}
                />
                {watchedName && !errors.name && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  <span>{errors.name.message}</span>
                </p>
              )}
            </div>

            {/* Interesses */}
            <div className="space-y-4">
              <label className="block text-white font-medium text-sm">
                Interesses <span className="text-gray-400">(opcional)</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleInterestToggle(interest.id)}
                    className={`flex items-center space-x-3 p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      selectedInterests.includes(interest.id)
                        ? 'bg-[#FF5777]/20 border-[#FF5777] text-white'
                        : 'bg-white/5 border-[#FF5777]/30 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{interest.icon}</span>
                    <span className="font-medium">{interest.label}</span>
                    {selectedInterests.includes(interest.id) && (
                      <svg className="w-5 h-5 text-[#FF5777] ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão de submissão */}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full py-4 cursor-pointer rounded-xl font-semibold text-lg transition-all duration-300 ${
                isSubmitting
                  ? 'bg-[#FF5777]/50 cursor-not-allowed'
                  : isValid
                    ? 'bg-gradient-to-r from-[#FF5777] to-[#FF5777]/80 hover:from-[#FF5777]/90 hover:to-[#FF5777]/70 hover:scale-105 shadow-lg hover:shadow-[#FF5777]/25'
                    : 'bg-gray-600 cursor-not-allowed'
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Inscrevendo...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span>Inscrever-se na Newsletter</span>
                </div>
              )}
            </Button>

            {/* Informações de privacidade */}
            <p className="text-gray-400 text-sm text-center leading-relaxed">
              Ao se inscrever, você concorda em receber emails da nossa newsletter. 
              Você pode cancelar a inscrição a qualquer momento. 
              <span className="text-[#FF5777] hover:underline cursor-pointer"> Política de Privacidade</span>
            </p>

          </form>
        </div>

        {/* Estatísticas da newsletter */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
              <span className="text-2xl font-bold text-[#FF5777]">10K+</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Inscritos</h4>
            <p className="text-gray-400 text-sm">Educadores conectados</p>
          </div>
          
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
              <span className="text-2xl font-bold text-[#FF5777]">95%</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Taxa de Abertura</h4>
            <p className="text-gray-400 text-sm">Conteúdo relevante</p>
          </div>
          
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
              <span className="text-2xl font-bold text-[#FF5777]">2x</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Por Semana</h4>
            <p className="text-gray-400 text-sm">Frequência de envio</p>
          </div>
        </div>

      </div>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
    </section>
  )
}