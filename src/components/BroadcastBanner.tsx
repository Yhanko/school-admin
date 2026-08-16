import { useState, useEffect } from 'react';
import axiosInstance from '@/service/api';
import { AlertCircle, AlertTriangle, Info } from '@/lib/icons';

interface Broadcast {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
}

export function BroadcastBanner() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  useEffect(() => {
    async function fetchBroadcasts() {
      try {
        const response = await axiosInstance.get('/broadcasts');
        setBroadcasts(response.data);
      } catch (error) {
        console.error('Failed to load broadcasts', error);
      }
    }
    fetchBroadcasts();
  }, []);

  if (broadcasts.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2.5 mb-6 font-hanken">
      {broadcasts.map(b => {
        const isError = b.type === 'error';
        const isWarning = b.type === 'warning';
        
        return (
          <div 
            key={b.id} 
            className={`p-3.5 rounded border flex items-center justify-between gap-3 text-xs sm:text-sm ${
              isError 
                ? 'bg-[#9B2226]/15 border-[#ffb4ab]/40 text-[#ffdad6]' 
                : isWarning 
                  ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/40 text-[#DDD6FE]' 
                  : 'bg-[#1A1A1A] border-[#414042] text-[#e5e2e1]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isError ? (
                <AlertCircle className="w-4 h-4 text-[#ffb4ab] shrink-0" />
              ) : isWarning ? (
                <AlertTriangle className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-[#C0C2C5] shrink-0" />
              )}
              <div>
                <span className="label-caps font-bold mr-1.5 opacity-90">
                  {isError ? 'Aviso Crítico:' : isWarning ? 'Aviso do Sistema:' : 'Informação:'}
                </span>
                <span>{b.message}</span>
              </div>
            </div>
            <span className="label-caps text-[10px] opacity-60 shrink-0 hidden sm:inline">BROADCAST</span>
          </div>
        );
      })}
    </div>
  );
}
