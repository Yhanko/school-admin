import { useState, useEffect } from 'react';
import axiosInstance from '@/service/api';

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
    <div className="w-full flex flex-col gap-2 mb-4">
      {broadcasts.map(b => (
        <div key={b.id} className="p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="font-semibold">{b.type === 'error' ? 'Aviso Crítico' : b.type === 'warning' ? 'Aviso' : 'Informação'}:</div>
          <div>{b.message}</div>
        </div>
      ))}
    </div>
  );
}
