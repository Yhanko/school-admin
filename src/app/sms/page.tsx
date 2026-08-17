'use client';

import { useState, useEffect } from 'react';
import { smsService, SmsContact } from '@/service/sms.service';
import { emailService, EmailContact } from '@/service/email.service';
import { whatsappService, WhatsappContact } from '@/service/whatsapp.service';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState('sms');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State
  const [smsContacts, setSmsContacts] = useState<SmsContact[]>([]);
  const [selectedSmsIds, setSelectedSmsIds] = useState<Set<string>>(new Set());
  
  const [emailContacts, setEmailContacts] = useState<EmailContact[]>([]);
  const [selectedEmailIds, setSelectedEmailIds] = useState<Set<string>>(new Set());

  const [whatsappContacts, setWhatsappContacts] = useState<WhatsappContact[]>([]);
  const [selectedWhatsappIds, setSelectedWhatsappIds] = useState<Set<string>>(new Set());

  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [institutionName, setInstitutionName] = useState('Nossa Escola');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const smsData = await smsService.getContacts();
        setSmsContacts(smsData);
      } catch (error) {}
      try {
        const emailData = await emailService.getContacts();
        setEmailContacts(emailData);
      } catch (error) {}
      try {
        const wppData = await whatsappService.getContacts();
        setWhatsappContacts(wppData);
      } catch (error) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    import('@/service/api').then((api) => {
      api.default.get('/users/me').then((res) => {
        if (res.data?.institution?.name) {
          setInstitutionName(res.data.institution.name);
        }
      }).catch(console.error);
    });
  }, []);

  const getFilteredContacts = () => {
    const sourceContacts = activeTab === 'sms' ? smsContacts : activeTab === 'email' ? emailContacts : whatsappContacts;
    return sourceContacts.filter((c: any) => {
      const matchesRole = roleFilter === 'ALL' || c.role === roleFilter;
      const term = activeTab === 'sms' ? c.phone : activeTab === 'whatsapp' ? c.phone : c.email;
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (term && term.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesRole && matchesSearch;
    });
  };

  const filteredContacts = getFilteredContacts();
  const selectedSet = activeTab === 'sms' ? selectedSmsIds : activeTab === 'email' ? selectedEmailIds : selectedWhatsappIds;
  const setSelectedSet = activeTab === 'sms' ? setSelectedSmsIds : activeTab === 'email' ? setSelectedEmailIds : setSelectedWhatsappIds;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedSet);
      filteredContacts.forEach((c: any) => newSelected.add(c.id));
      setSelectedSet(newSelected);
    } else {
      const newSelected = new Set(selectedSet);
      filteredContacts.forEach((c: any) => newSelected.delete(c.id));
      setSelectedSet(newSelected);
    }
  };

  const handleToggleContact = (id: string) => {
    const newSelected = new Set(selectedSet);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSet(newSelected);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if ((activeTab === 'email' && !subject) || !message) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    if (selectedSet.size === 0) {
      toast.error('Selecione pelo menos um destinatário.');
      return;
    }

    try {
      setIsLoading(true);

      if (activeTab === 'sms') {
        const phoneNumbers = Array.from(selectedSmsIds)
          .map(id => smsContacts.find(c => c.id === id)?.phone)
          .filter((phone): phone is string => !!phone);

        await smsService.sendBulkSms({
          institutionName,
          subject: subject || 'Aviso',
          message,
          phoneNumbers,
        });
        toast.success('SMS enviado com sucesso!');
        setSelectedSmsIds(new Set());
      } else if (activeTab === 'email') {
        const emails = Array.from(selectedEmailIds)
          .map(id => emailContacts.find(c => c.id === id)?.email)
          .filter((email): email is string => !!email);

        await emailService.sendBulkEmail({
          institutionName,
          subject,
          message,
          emails,
        });
        toast.success('E-mails em processamento!');
        setSelectedEmailIds(new Set());
      } else {
        const phoneNumbers = Array.from(selectedWhatsappIds)
          .map(id => whatsappContacts.find(c => c.id === id)?.phone)
          .filter((phone): phone is string => !!phone);

        await whatsappService.sendBulkWhatsapp({
          institutionName,
          message,
          phoneNumbers,
        });
        toast.success('WhatsApp enviado com sucesso!');
        setSelectedWhatsappIds(new Set());
      }

      setSubject('');
      setMessage('');
    } catch (error: any) {
      console.error(error);
      toast.error('Erro ao processar o envio. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAllSelected = filteredContacts.length > 0 && filteredContacts.every((c: any) => selectedSet.has(c.id));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Comunicações</h1>
      </div>

      <Tabs defaultValue="sms" onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
          <TabsTrigger value="sms">Enviar SMS</TabsTrigger>
          <TabsTrigger value="email">Enviar E-mail</TabsTrigger>
          <TabsTrigger value="whatsapp">Enviar WhatsApp</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <form onSubmit={handleSend} className="space-y-6">
            
            {activeTab !== 'whatsapp' && (
              <div>
                <label className="block text-sm font-medium mb-2">Assunto</label>
                {activeTab === 'sms' ? (
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
                ) : (
                  <Input 
                    placeholder="Escreva o assunto do E-mail..." 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Mensagem Personalizada</label>
              <Textarea 
                rows={6}
                placeholder={`Corpo da mensagem para ${activeTab.toUpperCase()}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isLoading || selectedSet.size === 0} className="w-full">
              {isLoading ? 'A processar...' : `Enviar ${activeTab.toUpperCase()} para ${selectedSet.size} contactos`}
            </Button>
          </form>
        </div>

        <div className="w-full md:w-80 flex flex-col border rounded-md p-4 bg-gray-50/50">
          <h2 className="font-semibold mb-4">Destinatários ({
            activeTab === 'sms' ? smsContacts.length : 
            activeTab === 'email' ? emailContacts.length : 
            whatsappContacts.length
          })</h2>
          
          <div className="mb-4">
            <Input 
              placeholder={`Pesquisar por nome ou ${activeTab === 'email' ? 'email' : 'número'}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-sm mb-3"
            />
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
              {filteredContacts.map((contact: any) => (
                <div key={contact.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={contact.id} 
                    checked={selectedSet.has(contact.id)}
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
                      {activeTab === 'email' ? contact.email : contact.phone} • {contact.role}
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
    </div>
  );
}
