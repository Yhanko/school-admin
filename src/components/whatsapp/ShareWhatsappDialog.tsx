'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { whatsappService } from '@/service/whatsapp.service';

interface ShareWhatsappDialogProps {
  mediaUrl?: string;
  contactId?: string;
  defaultMessage?: string;
  trigger?: React.ReactNode;
}

export function ShareWhatsappDialog({ mediaUrl, contactId: initialContactId = '', defaultMessage = '', trigger }: ShareWhatsappDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contactId, setContactId] = useState(initialContactId);
  const [message, setMessage] = useState(defaultMessage);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    if (!contactId) {
      toast.error('Por favor insira o ID do contacto.');
      return;
    }
    
    try {
      setIsLoading(true);
      await whatsappService.sendMediaWhatsapp({
        contactId,
        mediaUrl,
        message,
      });
      toast.success('Ficheiro enviado via WhatsApp!');
      setIsOpen(false);
    } catch (err) {
      toast.error('Erro ao partilhar via WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Partilhar no WhatsApp</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Ficheiro via WhatsApp</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">ID do Destinatário</label>
            <Input 
              placeholder="Ex: user-uuid..." 
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Na implementação real, isto seria uma Dropdown de seleção de alunos/encarregados.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Mensagem Opcional</label>
            <Textarea 
              rows={3}
              placeholder="Escreva uma mensagem para acompanhar o ficheiro..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          {mediaUrl && (
            <div>
              <label className="text-sm font-medium">URL do Anexo</label>
              <Input value={mediaUrl} disabled className="bg-gray-50" />
            </div>
          )}
          <Button onClick={handleShare} disabled={isLoading || !contactId} className="w-full">
            {isLoading ? 'A Enviar...' : 'Enviar Agora'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
