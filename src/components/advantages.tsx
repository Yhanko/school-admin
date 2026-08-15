"use cliente"
//Imagens
import Support from "../assets/chatc.gif";
import Information from "../assets/consulting.gif";
import Financial from "@/assets/Finance.gif";
//Componentes
import Image from "next/image";

export function UseCase(){
    return(
        <>
         {/* Cabeçalho da seção */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-[#FF5777]/10 rounded-full mb-6">
              <div className="flex items-center space-x-2 bg-[#FF5777]/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-[#FF5777] rounded-full animate-pulse"></div>
                  <span className="text-[#FF5777] font-semibold text-sm uppercase tracking-wider">Casos de Uso</span>
                </div>
              </div>
                    
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white text-center">
                Pais <span className="text-[#FF5777] relative">
                  Conectados
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5777]/50 to-transparent rounded-full"></div>
                </span> e Envolvidos
              </h2>
                    
              <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Descubra como nossa plataforma revoluciona a participação dos pais na educação dos filhos, 
                criando uma ponte digital entre família e escola.
              </p>
            </div>
        
            {/* Grid de cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    
              {/* Card 1 - Comunicação e Participação */}
              <div className="group relative">
                {/* Efeito de brilho no fundo */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF5777]/20 via-[#FF5777]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>   
                <div className="relative bg-white/5 backdrop-blur-md border border-[#FF5777]/20 p-8 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-[#FF5777]/20 hover:border-[#FF5777]/40 group">
                        {/* Efeito shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-2xl"></div>
                        
                        {/* Ícone e título */}
                        <div className="flex items-start space-x-4 mb-6 relative z-10">
                          <div className="flex-shrink-0 p-3 bg-[#FF5777]/20 rounded-xl group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                            <Image src={Support} alt="support" className="w-8 h-8 rounded-xl"/>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#FF5777] mb-2 group-hover:text-[#FF5777]/90 transition-colors duration-300">
                              Comunicação e Participação
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/50 rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Conteúdo */}
                        <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 relative z-10">
                          Os pais podem acompanhar o progresso dos seus filhos, 
                          receber notificações de eventos, reuniões, tarefas e 
                          avaliações, e interagir diretamente com os professores. A plataforma torna os pais participantes ativos no processo educativo.
                        </p>
                        
                        {/* Indicador de hover */}
                        <div className="absolute bottom-4 right-4 w-6 h-6 bg-[#FF5777]/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <svg className="w-3 h-3 text-[#FF5777]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
        
                    {/* Card 2 - Acesso à Informação */}
                    <div className="group relative" style={{ animationDelay: '0.1s' }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF5777]/20 via-[#FF5777]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative bg-white/5 backdrop-blur-md border border-[#FF5777]/20 p-8 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-[#FF5777]/20 hover:border-[#FF5777]/40 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-2xl"></div>
                        
                        <div className="flex items-start space-x-4 mb-6 relative z-10">
                          <div className="flex-shrink-0 p-3 bg-[#FF5777]/20 rounded-xl group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                            <Image src={Information} alt="information" className="w-8 h-8 rounded-xl"/>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#FF5777] mb-2 group-hover:text-[#FF5777]/90 transition-colors duration-300">
                              Acesso à Informação
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/50 rounded-full"></div>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 relative z-10">
                          A plataforma oferece aos pais acesso a informações importantes sobre a instituição, os horários, as atividades escolares e os 
                          recursos disponíveis, mantendo-os informados sobre tudo o que é relevante para a educação dos seus filhos.
                        </p>
                        
                        <div className="absolute bottom-4 right-4 w-6 h-6 bg-[#FF5777]/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <svg className="w-3 h-3 text-[#FF5777]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
        
                    {/* Card 3 - Gerenciamento Financeiro */}
                    <div className="group relative md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF5777]/20 via-[#FF5777]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative bg-white/5 backdrop-blur-md border border-[#FF5777]/20 p-8 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-[#FF5777]/20 hover:border-[#FF5777]/40 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-2xl"></div>
                        
                        <div className="flex items-start space-x-4 mb-6 relative z-10">
                          <div className="flex-shrink-0 p-3 bg-[#FF5777]/20 rounded-xl group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                            <Image src={Financial} alt="financial" className="w-8 h-8 rounded-xl"/>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#FF5777] mb-2 group-hover:text-[#FF5777]/90 transition-colors duration-300">
                              Gerenciamento Financeiro
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-[#FF5777] to-[#FF5777]/50 rounded-full"></div>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300 relative z-10">
                          Os pais podem realizar pagamentos de propinas e outras 
                          despesas escolares através da plataforma, de forma rápida, 
                          segura e conveniente. A plataforma também permite que os pais 
                          rastreiem os seus pagamentos e recebam recibos eletrónicos.
                        </p>
                        
                        <div className="absolute bottom-4 right-4 w-6 h-6 bg-[#FF5777]/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <svg className="w-3 h-3 text-[#FF5777]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
        
                  </div>
        
                  {/* Seção de estatísticas */}
                  <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center group">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                        <span className="text-2xl font-bold text-[#FF5777]">98%</span>
                      </div>
                      <h4 className="text-white font-semibold mb-2">Satisfação dos Pais</h4>
                      <p className="text-gray-400 text-sm">Pais mais envolvidos na educação</p>
                    </div>
                    
                    <div className="text-center group">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                        <span className="text-2xl font-bold text-[#FF5777]">24/7</span>
                      </div>
                      <h4 className="text-white font-semibold mb-2">Acesso Contínuo</h4>
                      <p className="text-gray-400 text-sm">Informações sempre disponíveis</p>
                    </div>
                    
                    <div className="text-center group">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5777]/20 rounded-full mb-4 group-hover:bg-[#FF5777]/30 transition-colors duration-300">
                        <span className="text-2xl font-bold text-[#FF5777]">100%</span>
                      </div>
                      <h4 className="text-white font-semibold mb-2">Segurança</h4>
                      <p className="text-gray-400 text-sm">Dados protegidos e criptografados</p>
                    </div>
                  </div>
        </>
    )
}