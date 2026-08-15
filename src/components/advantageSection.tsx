"use client"
//Imagens
import Automacao from "@/assets/automacao.jpg";
import Future from "@/assets/future.jpg";
import Securtitydata from "../assets/securityData.jpg";
//Componentes
import Image from "next/image";

export function AdvantageSection(){
    return(
        <>
         {/* Cabeçalho da seção */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center p-2 bg-[#FF5777]/10 rounded-full mb-6">
                <div className="flex items-center space-x-2 bg-[#FF5777]/20 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-[#FF5777] rounded-full animate-pulse"></div>
                  <span className="text-[#FF5777] font-semibold text-sm uppercase tracking-wider">Vantagens</span>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">
                Por que Escolher Nossa <span className="text-[#FF5777] relative">
                  Plataforma
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5777]/50 to-transparent rounded-full"></div>
                </span>?
              </h2>
              
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Descubra as vantagens que fazem da nossa solução a escolha ideal para transformar 
                a gestão educacional da sua instituição.
              </p>
            </div>

            {/* Container das vantagens */}
            <div className="space-y-24">
              
              {/* Vantagem 1 - Automação de Processos */}
              <div className="group relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Conteúdo */}
                  <div className="space-y-6 order-2 lg:order-1">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-[#FF5777]/20 rounded-xl group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                        <svg className="w-8 h-8 text-[#FF5777]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl md:text-3xl text-[#FF5777] group-hover:text-[#FF5777]/90 transition-colors duration-300">
                          Automação de Processos
                        </h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/50 rounded-full mt-2"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { title: "Relatórios automáticos", desc: "Gere relatórios em segundos sem esforço manual." },
                        { title: "Gestão de pagamentos eficiente", desc: "Controle e organize seus recebimentos e pagamentos com facilidade." },
                        { title: "Alertas e lembretes automáticos", desc: "Receba notificações importantes sem precisar acompanhar tudo manualmente." },
                        { title: "Redução de tarefas repetitivas", desc: "Automatize fluxos que consomem tempo diariamente." },
                        { title: "Mais foco no que importa", desc: "Libere sua equipe para atividades estratégicas e de maior impacto." }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 group/item hover:bg-white/5 p-3 rounded-xl transition-all duration-300">
                          <div className="flex-shrink-0 w-6 h-6 bg-[#FF5777]/20 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-[#FF5777]/30 transition-colors duration-300">
                            <svg className="w-3 h-3 text-[#FF5777]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white group-hover/item:text-[#FF5777] transition-colors duration-300">{item.title}</h4>
                            <p className="text-gray-300 text-sm mt-1 group-hover/item:text-gray-200 transition-colors duration-300">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Imagem */}
                  <div className="order-1 lg:order-2 relative group/image">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF5777]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover/image:shadow-[#FF5777]/20 transition-all duration-500">
                      <Image 
                        src={Automacao} 
                        alt="Automação de processos" 
                        className="w-full h-80 object-cover transform group-hover/image:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1B191F]/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                          <p className="text-white font-semibold text-sm">Automatize processos e ganhe eficiência</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Vantagem 2 - Inclusão Digital */}
              <div className="group relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Imagem */}
                  <div className="relative group/image">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF5777]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover/image:shadow-[#FF5777]/20 transition-all duration-500">
                      <Image 
                        src={Future} 
                        alt="Inclusão Digital" 
                        className="w-full h-80 object-cover transform group-hover/image:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1B191F]/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                          <p className="text-white font-semibold text-sm">Tecnologia acessível para todos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-[#FF5777]/20 rounded-xl group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                        <svg className="w-8 h-8 text-[#FF5777]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl md:text-3xl text-[#FF5777] group-hover:text-[#FF5777]/90 transition-colors duration-300">
                          Inclusão Digital
                        </h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/50 rounded-full mt-2"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { title: "Acesso para todos", desc: "Ferramentas pensadas para todos os públicos, sem exceção." },
                        { title: "Acessibilidade", desc: "Funcionalidades adaptadas para alunos com necessidades especiais." },
                        { title: "Interface intuitiva", desc: "Navegação fácil e compreensível, mesmo para quem tem pouca experiência com tecnologia." },
                        { title: "Tecnologia como aliada", desc: "Promovemos a igualdade de oportunidades por meio da inovação." },
                        { title: "Educação sem barreiras", desc: "Levamos conhecimento a todos, independentemente de limitações físicas, sociais ou cognitivas." }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 group/item hover:bg-white/5 p-3 rounded-xl transition-all duration-300">
                          <div className="flex-shrink-0 w-6 h-6 bg-[#FF5777]/20 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-[#FF5777]/30 transition-colors duration-300">
                            <svg className="w-3 h-3 text-[#FF5777]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white group-hover/item:text-[#FF5777] transition-colors duration-300">{item.title}</h4>
                            <p className="text-gray-300 text-sm mt-1 group-hover/item:text-gray-200 transition-colors duration-300">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Vantagem 3 - Segurança */}
              <div className="group relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Conteúdo */}
                  <div className="space-y-6 order-2 lg:order-1">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-3 bg-[#FF5777]/20 rounded-xl group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                        <svg className="w-8 h-8 text-[#FF5777]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl md:text-3xl text-[#FF5777] group-hover:text-[#FF5777]/90 transition-colors duration-300">
                          Segurança
                        </h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/50 rounded-full mt-2"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { title: "Proteção de dados", desc: "Proteção dos seus dados pessoais e sensíveis." },
                        { title: "Privacidade garantida", desc: "Privacidade garantida em todas as operações." },
                        { title: "Criptografia avançada", desc: "Informações criptografadas e armazenadas com segurança." },
                        { title: "Monitoramento contínuo", desc: "Monitoramento contínuo contra acessos não autorizados." },
                        { title: "Conformidade", desc: "Conformidade com padrões e boas práticas de segurança digital." }
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3 group/item hover:bg-white/5 p-3 rounded-xl transition-all duration-300">
                          <div className="flex-shrink-0 w-6 h-6 bg-[#FF5777]/20 rounded-full flex items-center justify-center mt-1 group-hover/item:bg-[#FF5777]/30 transition-colors duration-300">
                            <svg className="w-3 h-3 text-[#FF5777]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white group-hover/item:text-[#FF5777] transition-colors duration-300">{item.title}</h4>
                            <p className="text-gray-300 text-sm mt-1 group-hover/item:text-gray-200 transition-colors duration-300">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Imagem */}
                  <div className="order-1 lg:order-2 relative group/image">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF5777]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl group-hover/image:shadow-[#FF5777]/20 transition-all duration-500">
                      <Image 
                        src={Securtitydata} 
                        alt="Segurança de dados" 
                        className="w-full h-80 object-cover transform group-hover/image:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1B191F]/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                          <p className="text-white font-semibold text-sm">Máxima segurança para seus dados</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

            </div>

            {/* Seção de estatísticas/métricas */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                  <span className="text-3xl font-bold text-[#FF5777]">90%</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Redução de Tempo</h4>
                <p className="text-gray-400 text-sm">Em tarefas administrativas</p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                  <span className="text-3xl font-bold text-[#FF5777]">99%</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Uptime</h4>
                <p className="text-gray-400 text-sm">Disponibilidade garantida</p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                  <span className="text-3xl font-bold text-[#FF5777]">256</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Segurança</h4>
                <p className="text-gray-400 text-sm">Dados criptografados</p>
              </div>
            </div>
        </>
    )
}