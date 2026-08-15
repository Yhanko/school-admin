"use client"
//Hooks
import React, { useState, useEffect } from 'react';
//Iamgens
import Yhanko from "@/assets/yhankoIMG.svg";
//Componentes
import Image from 'next/image';
import { Button } from "@/components/ui/button";

interface ResponsiveHeaderProps {
  goTo?: () => void;
  goToPayment?: () => void;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({ 
  goTo = () => {}, 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para adicionar efeitos
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu mobile quando clicar em um link
  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevenir scroll quando menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigationItems = [
    { href: '#home', label: 'Home', className: 'nav-item-1' },
    { href: '#sobre', label: 'Sobre', className: 'nav-item-2' },
    { href: '#uso', label: 'Pais', className: 'nav-item-3' },
    { href: '#vantagens', label: 'Vantagens', className: 'nav-item-4' },
    { href: '#plano', label: 'Plano', className: 'nav-item-5' },
    { href: '#clientes', label: 'Testemunho', className: 'nav-item-6' }
  ];

  return (
    <>
      <header 
        className={`
          flex items-center p-4 lg:p-6 shadow-sm bg-transparent backdrop-brightness-50 
          fixed z-50 w-full transition-all duration-300
          ${isScrolled ? 'backdrop-blur-md bg-[#1B191F]/80' : ''}
        `}
      >
        {/* Logo */}
        <div className="flex items-center z-50">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            {/* Placeholder para logo - substitua pela Image real */}
            <Image src={Yhanko} alt="yhanko" className="w-10 text-[#FF5777]"/>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center max-w-2xl ml-28">
          <ul className="flex justify-center items-center space-x-8 text-white">
            {navigationItems.map((item, index) => (
              <li 
                key={item.href}
                className={`${item.className} animate-slide-in-left`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <a 
                  href={item.href} 
                  className="nav-link hover:text-[#FF5777] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 relative group"
                >
                  {item.label}
                  {/* Underline effect */}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF5777] transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-3 ml-auto">
          <Button
            onClick={goTo} 
            className="px-6 py-2 w-56 cursor-pointer bg-[#FF5777] text-sm font-medium text-white border border-[#FF5777] rounded-xl hover:bg-[#FF5777] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#FF5777]/25"
          >
            Login
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className='ml-auto'>
            <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden z-50 p-2 rounded-xl bg-[#FF5777]/10 hover:bg-[#FF5777]/20 transition-all duration-300"
            aria-label="Toggle mobile menu"
            >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span 
                className={`block w-5 h-0.5 bg-[#FF5777] transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                }`}
                ></span>
                <span 
                className={`block w-5 h-0.5 bg-[#FF5777] transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
                ></span>
                <span 
                className={`block w-5 h-0.5 bg-[#FF5777] transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                }`}
                ></span>
            </div>
            </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`
          fixed inset-0 z-40 lg:hidden transition-all duration-500 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        {/* Backdrop */}
        <div 
          className={`
            absolute inset-0 bg-[#1B191F]/95 backdrop-blur-md transition-all duration-500
            ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>

        {/* Menu Content */}
        <div 
          className={`
            relative h-full flex flex-col justify-center items-center transition-all duration-500 ease-out
            ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
          `}
        >
          {/* Navigation Links */}
          <nav className="flex flex-col items-center space-y-8 mb-12">
            {navigationItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleMobileMenuClick}
                className={`
                  text-2xl font-semibold text-white hover:text-[#FF5777] 
                  transition-all duration-300 transform hover:scale-110 
                  relative group
                  ${isMobileMenuOpen ? 'animate-slide-in-left' : ''}
                `}
                style={{ 
                  animationDelay: isMobileMenuOpen ? `${index * 100 + 200}ms` : '0ms' 
                }}
              >
                {item.label}
                {/* Underline effect */}
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-[#FF5777] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Mobile Buttons */}
          <div 
            className={`
              flex flex-col items-center space-y-4 w-full max-w-xs px-6
              ${isMobileMenuOpen ? 'animate-slide-in-up' : ''}
            `}
            style={{ animationDelay: isMobileMenuOpen ? '800ms' : '0ms' }}
          >
            <button 
              onClick={() => {
                goTo();
                handleMobileMenuClick();
              }}
              className="w-full py-3 bg-transparent text-lg font-medium text-[#FF5777] border-2 border-[#FF5777] rounded-xl hover:bg-[#FF5777] hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Login
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-[#FF5777]/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-1 h-1 bg-[#FF5777]/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-[#FF5777]/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-12 w-1 h-1 bg-[#FF5777]/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #1B191F;
        }

        ::-webkit-scrollbar-thumb {
          background: #FF5777;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #FF5777;
        }
      `}</style>
    </>
  );
};

export default ResponsiveHeader;