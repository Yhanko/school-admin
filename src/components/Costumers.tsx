"use client"
import React, { useState, useEffect } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  institution: string;
  comment: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ana Silva",
    role: "Diretora Pedagógica",
    institution: "Colégio São Francisco",
    comment: "A plataforma revolucionou completamente nossa gestão escolar. A comunicação com os pais melhorou drasticamente e conseguimos automatizar processos que antes tomavam horas do nosso tempo. Recomendo fortemente!",
    avatar: "AS",
    rating: 5
  },
  {
    id: 2,
    name: "Carlos Mendes",
    role: "Coordenador Administrativo",
    institution: "Instituto Educacional Horizonte",
    comment: "Implementamos a solução há 6 meses e os resultados são impressionantes. A gestão financeira ficou muito mais organizada e os relatórios automáticos nos poupam muito trabalho. Excelente investimento!",
    avatar: "CM",
    rating: 5
  },
  {
    id: 3,
    name: "Maria Santos",
    role: "Secretária Escolar",
    institution: "Escola Municipal Dom Pedro",
    comment: "Como secretária, posso dizer que esta plataforma facilitou enormemente meu trabalho diário. O sistema de notificações automáticas e a organização dos dados dos alunos são fantásticos. Muito intuitivo de usar!",
    avatar: "MS",
    rating: 5
  },
  {
    id: 4,
    name: "João Oliveira",
    role: "Diretor Geral",
    institution: "Colégio Técnico Inovação",
    comment: "A inclusão digital que a plataforma proporciona é notável. Conseguimos envolver mais os pais no processo educativo e a segurança dos dados nos dá total tranquilidade. Uma solução completa e moderna.",
    avatar: "JO",
    rating: 5
  },
  {
    id: 5,
    name: "Fernanda Costa",
    role: "Coordenadora de TI",
    institution: "Centro Educacional Futuro",
    comment: "A implementação foi surpreendentemente simples e o suporte técnico é excepcional. A plataforma é estável, segura e atende todas as nossas necessidades. Os professores e funcionários adoraram a interface.",
    avatar: "FC",
    rating: 5
  },
  {
    id: 6,
    name: "Roberto Lima",
    role: "Vice-Diretor",
    institution: "Escola Estadual Progresso",
    comment: "Estamos usando há um ano e não conseguimos mais imaginar nossa escola sem esta plataforma. A economia de tempo é significativa e a qualidade da comunicação com as famílias melhorou muito. Recomendamos!",
    avatar: "RL",
    rating: 5
  }
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isAutoPlaying]);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToTestimonial = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-[#FF5777]' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden bg-gradient-to-br from-[#1B191F] via-[#1B191F]/95 to-[#1B191F]/90" id="testemunhos">
      
      {/* Efeitos de fundo atmosféricos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-[#FF5777]/10 rounded-full mb-6">
            <div className="flex items-center space-x-2 bg-[#FF5777]/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-[#FF5777] rounded-full animate-pulse"></div>
              <span className="text-[#FF5777] font-semibold text-sm uppercase tracking-wider">Testemunhos</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">
            O que Nossos <span className="text-[#FF5777] relative">
              Clientes
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5777]/50 to-transparent rounded-full"></div>
            </span> Dizem
          </h2>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Descubra como nossa plataforma está transformando a gestão educacional 
            em instituições de ensino por todo o país.
          </p>
        </div>

        {/* Carrossel de testemunhos */}
        <div className="relative">
          
          {/* Container principal do carrossel */}
          <div 
            className="relative bg-white/5 backdrop-blur-md border border-[#FF5777]/20 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            
            {/* Efeito shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-3xl"></div>
            
            {/* Aspas decorativas */}
            <div className="absolute top-6 left-6 text-[#FF5777]/20 text-6xl font-serif">(&quot;)</div>
            <div className="absolute bottom-6 right-6 text-[#FF5777]/20 text-6xl font-serif rotate-180">(&quot;)</div>
            
            {/* Conteúdo do testemunho */}
            <div className="relative z-10 text-center">
              
              {/* Avatar */}
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FF5777] to-[#FF5777]/70 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg">
                  {testimonials[currentIndex].avatar}
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex justify-center mb-6">
                {renderStars(testimonials[currentIndex].rating)}
              </div>
              
              {/* Comentário */}
              <div className="mb-8">
                <p className="text-white text-lg md:text-xl leading-relaxed max-w-4xl mx-auto">
                  {testimonials[currentIndex].comment}
                </p>
              </div>
              
              {/* Informações do cliente */}
              <div className="space-y-2">
                <h4 className="text-[#FF5777] font-bold text-xl">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-300 font-medium">
                  {testimonials[currentIndex].role}
                </p>
                <p className="text-gray-400 text-sm">
                  {testimonials[currentIndex].institution}
                </p>
              </div>
              
            </div>
            
          </div>
          
          {/* Botões de navegação */}
          <button
            onClick={prevTestimonial}
            disabled={isAnimating}
            className="absolute cursor-pointer left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#FF5777]/20 hover:bg-[#FF5777]/30 backdrop-blur-md border border-[#FF5777]/30 rounded-full flex items-center justify-center text-[#FF5777] transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          
          <button
            onClick={nextTestimonial}
            disabled={isAnimating}
            className="absolute cursor-pointer right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#FF5777]/20 hover:bg-[#FF5777]/30 backdrop-blur-md border border-[#FF5777]/30 rounded-full flex items-center justify-center text-[#FF5777] transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
          
        </div>
        
        {/* Indicadores de posição */}
        <div className="flex justify-center mt-8 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              disabled={isAnimating}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#FF5777] scale-125'
                  : 'bg-[#FF5777]/30 hover:bg-[#FF5777]/50'
              } disabled:cursor-not-allowed`}
            />
          ))}
        </div>
        
        {/* Controle de autoplay */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#FF5777]/20 hover:bg-[#FF5777]/30 backdrop-blur-md border border-[#FF5777]/30 rounded-full text-[#FF5777] transition-all duration-300 text-sm"
          >
            {isAutoPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Pausar</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Reproduzir</span>
              </>
            )}
          </button>
        </div>
        
        {/* Estatísticas de satisfação */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
              <span className="text-2xl font-bold text-[#FF5777]">500+</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Clientes Satisfeitos</h4>
            <p className="text-gray-400 text-sm">Instituições que confiam em nós</p>
          </div>
          
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
              <span className="text-2xl font-bold text-[#FF5777]">4.9</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Avaliação Média</h4>
            <p className="text-gray-400 text-sm">De 5 estrelas possíveis</p>
          </div>
          
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
              <span className="text-2xl font-bold text-[#FF5777]">98%</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Taxa de Retenção</h4>
            <p className="text-gray-400 text-sm">Clientes que renovam conosco</p>
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
  );
};

export default TestimonialsSection;