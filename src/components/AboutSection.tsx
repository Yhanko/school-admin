"use client"
import React, { useState, useEffect } from 'react';

interface AboutSectionProps {
  className?: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ className = '' }) => {
  const [, setActiveFeature] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      id: 1,
      title: "Automação e Eficiência",
      description: "Oferece automação de tarefas repetitivas, liberando tempo precioso para os administradores se dedicarem a atividades mais estratégicas. A geração de relatórios automatizados, a gestão de pagamentos e a comunicação interna são apenas alguns exemplos da eficiência que a plataforma proporciona.",
      icon: "⚡",
      color: "from-[#FF5777] to-[#FF5777]/70"
    },
    {
      id: 2,
      title: "Comunicação Direta e Eficaz",
      description: "A plataforma oferece aos professores ferramentas de comunicação eficientes para se conectarem com os alunos, pais e colegas, agendando reuniões, partilhando materiais, dando feedback e colaborando em projetos.",
      icon: "💬",
      color: "from-[#FF5777] to-[#FF5777]/70"
    },
    {
      id: 3,
      title: "Gestão Centralizada",
      description: "Tendo acesso a todas as informações, recursos e dados da instituição num único lugar, simplificando tarefas administrativas e eliminando a necessidade de consulta em vários documentos.",
      icon: "🎯",
      color: "from-[#FF5777] to-[#FF5777]/70"
    }
  ];

  const galleryImages = [
    { title: "Dashboard", description: "Visão geral completa" },
    { title: "Professores", description: "Gestão de docentes" },
    { title: "Comunicação", description: "Chat integrado" },
    { title: "Estudantes", description: "Perfis de alunos" },
    { title: "Financeiro", description: "Controle de pagamentos" },
    { title: "Eventos", description: "Calendário escolar" }
  ];

  return (
    <div className={`py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-32 relative overflow-hidden ${className}`} id="sobre">
      {/* Efeitos de fundo atmosféricos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-[#FF5777]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Partículas flutuantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isVisible && [...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#FF5777]/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-[#FF5777]/10 rounded-full mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 bg-[#FF5777]/20 px-3 sm:px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-[#FF5777] rounded-full animate-pulse"></div>
              <span className="text-[#FF5777] font-semibold text-xs sm:text-sm uppercase tracking-wider">Sobre a Plataforma</span>
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-8 text-white text-center leading-tight">
            Nossa <span className="text-[#FF5777] relative">
              Plataforma
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-[#FF5777]/50 to-transparent rounded-full"></div>
            </span> Educacional
          </h2>
          
          <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Uma solução completa e inovadora que revoluciona a gestão educacional, 
            conectando administradores, professores, alunos e pais em um ecossistema digital integrado.
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          
          {/* Timeline de funcionalidades */}
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/70 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="leading-tight">Principais Funcionalidades</span>
            </h3>
            
            <div className="space-y-6 sm:space-y-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.id}
                  className={`flex items-start group transition-all duration-500 ${
                    isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[-50px] opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Timeline */}
                  <div className="flex flex-col items-center mr-4 sm:mr-6 relative flex-shrink-0">
                    <div className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <span className="text-sm sm:text-base">{feature.icon}</span>
                    </div>
                    {index < features.length - 1 && (
                      <div className="w-0.5 h-16 sm:h-20 bg-gradient-to-b from-[#FF5777]/50 to-[#FF5777]/20 mt-4"></div>
                    )}
                    
                    {/* Efeito de brilho */}
                    <div className="absolute inset-0 w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-[#FF5777]/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="flex-1 pt-2 min-w-0">
                    <div className="bg-white/5 backdrop-blur-md border border-[#FF5777]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 group-hover:bg-white/10 group-hover:border-[#FF5777]/30 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-[#FF5777]/10 relative">
                      <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FF5777] mb-2 sm:mb-3 group-hover:text-[#FF5777] transition-colors duration-300 leading-tight">
                        {feature.title}
                      </h4>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </p>
                      
                      {/* Indicador de número */}
                      <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/70 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                        {feature.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Galeria de imagens interativa */}
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/70 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="leading-tight">Interface da Plataforma</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[30px] opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                >
                  <div className="relative overflow-hidden rounded-xl sm:rounded-xl bg-white/5 backdrop-blur-md border border-[#FF5777]/20 group-hover:border-[#FF5777]/40 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#FF5777]/20">
                    
                    {/* Placeholder para imagem */}
                    <div className="aspect-square bg-gradient-to-br from-[#FF5777]/20 to-[#FF5777]/5 flex items-center justify-center">
                      <div className="text-2xl sm:text-3xl md:text-4xl opacity-50">
                        {index === 0 && '📊'}
                        {index === 1 && '👨‍🏫'}
                        {index === 2 && '💬'}
                        {index === 3 && '👨‍🎓'}
                        {index === 4 && '💰'}
                        {index === 5 && '📅'}
                      </div>
                    </div>
                    
                    {/* Overlay com informações */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1B191F]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 sm:p-4 w-full">
                        <h5 className="text-white font-bold text-xs sm:text-sm mb-1">{image.title}</h5>
                        <p className="text-gray-300 text-xs">{image.description}</p>
                      </div>
                    </div>
                    
                    {/* Efeito shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    
                    {/* Indicador de hover */}
                    <div className="absolute top-2 right-2 w-5 sm:w-6 h-5 sm:h-6 bg-[#FF5777]/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#FF5777]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Informação adicional */}
            <div className="bg-white/5 backdrop-blur-md border border-[#FF5777]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-6 sm:mt-8">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/70 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="text-base sm:text-lg font-bold text-white mb-2">Interface Intuitiva</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Nossa plataforma foi desenvolvida com foco na experiência do usuário, 
                    oferecendo uma interface limpa, moderna e fácil de navegar para todos os perfis de usuário.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção de estatísticas */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { number: "100%", label: "Digital", description: "Gestão completamente digital" },
            { number: "24/7", label: "Disponível", description: "Acesso a qualquer momento" },
            { number: "99.9%", label: "Uptime", description: "Disponibilidade garantida" },
            { number: "∞", label: "Escalável", description: "Cresce com sua instituição" }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`text-center group transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[20px] opacity-0'
              }`}
              style={{ transitionDelay: `${800 + index * 100}ms` }}
            >
              <div className="bg-white/5 backdrop-blur-md border border-[#FF5777]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 group-hover:bg-white/10 group-hover:border-[#FF5777]/30 transition-all duration-300 group-hover:scale-105">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FF5777] mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">{stat.label}</h4>
                <p className="text-gray-400 text-xs sm:text-sm leading-tight">{stat.description}</p>
              </div>
            </div>
          ))}
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
      
    </div>
  );
};

export default AboutSection;

