'use client';

import { useState, useEffect } from 'react';
import { smsService, SmsContact } from '@/service/sms.service';
import { useAuth } from '@/store/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export default function SmsPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<SmsContact[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await smsService.getContacts();
        setContacts(data);
      } catch (error) {
        toast.error('Erro ao carregar contactos.');
      }
    };
    fetchContacts();
  }, []);

  const institutionName = 'Nossa Escola'; 

  const filteredContacts = contacts.filter(
    (c) => roleFilter === 'ALL' || c.role === roleFilter
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedContactIds);
      filteredContacts.forEach((c) => newSelected.add(c.id));
      setSelectedContactIds(newSelected);
    } else {
      const newSelected = new Set(selectedContactIds);
      filteredContacts.forEach((c) => newSelected.delete(c.id));
      setSelectedContactIds(newSelected);
    }
  };

  const handleToggleContact = (id: string) => {
    const newSelected = new Set(selectedContactIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContactIds(newSelected);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !message) {
      toast.error('Por favor, preencha o assunto e a mensagem.');
      return;
    }

    if (selectedContactIds.size === 0) {
      toast.error('Selecione pelo menos um destinatário.');
      return;
    }

    const phoneNumbers = Array.from(selectedContactIds)
      .map(id => contacts.find(c => c.id === id)?.phone)
      .filter((phone): phone is string => !!phone);

    try {
      setIsLoading(true);
      await smsService.sendBulkSms({
        institutionName,
        subject,
        message,
        phoneNumbers,
      });
      toast.success('SMS enviado com sucesso!');
      setSubject('');
      setMessage('');
      setSelectedContactIds(new Set());
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao enviar SMS. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAllSelected = filteredContacts.length > 0 && filteredContacts.every(c => selectedContactIds.has(c.id));

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Enviar SMS</h1>
        <form onSubmit={handleSend} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Assunto</label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o assunto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Faltas">Faltas</SelectItem>
                <SelectItem value="Atraso no Pagamento">Atraso no Pagamento</SelectItem>
                <SelectItem value="Boletim">Levantamento de Boletim</SelectItem>
                <SelectItem value="Reunião">Reunião de Encarregados</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Mensagem Personalizada</label>
            <Textarea 
              rows={6}
              placeholder="Escreva aqui a mensagem adicional..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isLoading || selectedContactIds.size === 0} className="w-full">
            {isLoading ? 'A enviar...' : `Enviar SMS para ${selectedContactIds.size} contactos`}
          </Button>
        </form>
      </div>

      <div className="w-full md:w-80 flex flex-col border rounded-md p-4 bg-gray-50/50">
        <h2 className="font-semibold mb-4">Destinatários ({contacts.length})</h2>
        
        <div className="mb-4">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Filtrar por grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Grupos</SelectItem>
              <SelectItem value="STUDENT">Alunos</SelectItem>
              <SelectItem value="PARENT">Encarregados</SelectItem>
              <SelectItem value="TEACHER">Professores</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 mb-4 pb-2 border-b">
          <Checkbox 
            id="selectAll" 
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="selectAll" className="text-sm font-medium leading-none cursor-pointer">
            Selecionar Todos ({filteredContacts.length})
          </label>
        </div>

        <ScrollArea className="flex-1 h-[400px]">
          <div className="space-y-3">
            {filteredContacts.map(contact => (
              <div key={contact.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={contact.id} 
                  checked={selectedContactIds.has(contact.id)}
                  onCheckedChange={() => handleToggleContact(contact.id)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={contact.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {contact.name}
                  </label>
                  <p className="text-xs text-muted-foreground">
                    {contact.phone} • {contact.role}
                  </p>
                </div>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum contacto encontrado.</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
