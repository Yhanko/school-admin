"use client"
//libs
import { AnimatedSection } from "../utils/animations";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
//Componentes
import { Button } from "@/components/ui/button";
import Plane from "@/components/Plan";
import Feedback from "@/components/Costumers";
import { NewsletterForm } from '@/components/NewslatterForm';
import { UseCase } from "@/components/advantages";
import { AdvantageSection } from "@/components/advantageSection";
import AboutSection from "../components/AboutSection";
import ResponsiveHeader from "@/components/responsiveHeader";

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
   
  const router = useRouter();

    function goTo(){
      router.push("/login")
    }
    
    function goToPayment(){
      router.push("/payment")
    }
  return (
    <main className="bg-[#1B191F]">
      {/* HEADER */}
       <ResponsiveHeader goTo={goTo} goToPayment={goToPayment}/>

      {/* HERO */}
      <AnimatedSection className="py-8 px-32"  delay={0.2}>
        <section className="text-center py-30  gradient-background bg-white h-[30rem] space-y-6" id="home">
          <h1 className="text-4xl font-bold mb-4 text-white">Transformando a Educação com <span className="text-[#FF5777]">Tecnologia</span></h1>

          <p className="max-w-xl mx-auto text-white"> Imagine um futuro onde a tecnologia serve como um poderoso aliado na educação, conectando professores, alunos e pais numa experiência única e transformadora. Apresentamos uma plataforma inovadora, dedicada exclusivamente ao universo da educação. Uma plataforma que impulsionará a inclusão tecnológica e revolucionará a maneira como aprendemos e ensinamos.</p>

          <Button className="px-10 py-5 text-sm font-medium animate-pulse text-white bg-[#FF5777] hover:bg-[#FF5777] hover:shadow-[0_0_12px_rgba(255,87,119,0.5)] cursor-pointer rounded">
            Contactar
          </Button>
        </section>
      </AnimatedSection>

      {/* SOBRE O PRODUTO */}
      <AnimatedSection className="py-16 px-32" delay={0.2}>
        <section className="px-32" id="sobre">
          <AboutSection/>
        </section>
      </AnimatedSection>

      <AnimatedSection className="py-20 px-4 md:px-8 lg:px-32 relative overflow-hidden" delay={0.2}>
        {/* Efeitos de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5777]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Partículas flutuantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {mounted && [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#FF5777]/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>

        <section className="relative z-10" id="uso">
          <UseCase/>
        </section>

        {/* Estilos CSS personalizados */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
        `}</style>
      </AnimatedSection>

        {/* VANTAGENS */}
        <AnimatedSection className="py-20 px-4 md:px-8 lg:px-16 xl:px-32 relative overflow-hidden" delay={0.2}>
          {/* Efeitos de fundo atmosféricos */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5777]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Partículas flutuantes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {mounted && [...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#FF5777]/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${4 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>

          <section className="relative z-10 max-w-7xl mx-auto" id="vantagens">
           <AdvantageSection/>
          </section>

          {/* Estilos CSS personalizados */}
          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-15px) rotate(180deg); }
            }
            
            .animate-float {
              animation: float 5s ease-in-out infinite;
            }
            
            @keyframes fadeInUp {
              0% { opacity: 0; transform: translateY(30px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            
            .animate-fade-in-up {
              animation: fadeInUp 0.6s ease-out;
            }
          `}</style>
        </AnimatedSection>

        {/* Plano */}
       <AnimatedSection className="py-16 px-32"  delay={0.2}>
          <section id="plano">
            <Plane/>
          </section>
       </AnimatedSection>

      {/* CLIENTES */}
       <AnimatedSection className="py-16 px-32"  delay={0.2}>
          <section id="clientes">
            <Feedback/>
          </section>
       </AnimatedSection>

      {/* NEWSLETTER */}
      <section className="px-6" id="newsletter">
        <h2 className="text-3xl font-semibold mb-6 text-white text-center">Receba Novidades</h2>
        <div className="max-w-md mx-auto">
          <NewsletterForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-white text-center py-6 mt-12">
        <p>&copy; {new Date().getFullYear()} Yhanko. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}