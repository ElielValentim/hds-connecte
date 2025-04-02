
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
}

interface Registration {
  id: string;
  user_id: string;
  event_id: string;
  status: string;
  created_at: string;
}

const Registration = () => {
  const { user, profile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: profile?.name || user?.name || '',
    birthDate: undefined as Date | undefined,
    phone: profile?.phone || '',
    email: user?.email || '',
    church: profile?.church || '',
    pastor: profile?.responsible_pastor || ''
  });
  
  // Fetch active event and check if user is registered
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Get the active event
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('active', true)
          .order('start_date', { ascending: true })
          .limit(1)
          .single();
        
        if (eventError) {
          console.error('Error fetching event:', eventError);
          return;
        }
        
        setActiveEvent(eventData);
        
        // Check if the user is already registered for this event
        if (user && eventData) {
          const { data: registrationData } = await supabase
            .from('registrations')
            .select('*')
            .eq('user_id', user.id)
            .eq('event_id', eventData.id)
            .single();
          
          setIsRegistered(!!registrationData);
        }
      } catch (error) {
        console.error('Error in fetchEventData:', error);
      }
    };
    
    if (user) {
      fetchEventData();
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      birthDate: date,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !activeEvent) {
      toast.error('Você precisa estar logado e deve haver um evento ativo.');
      return;
    }
    
    if (!formData.fullName || !formData.birthDate || !formData.phone || !formData.email || !formData.church || !formData.pastor) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update profile information
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          name: formData.fullName,
          phone: formData.phone,
          church: formData.church,
          responsible_pastor: formData.pastor
        })
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      // Register for the event
      const { error } = await supabase
        .from('registrations')
        .insert({
          user_id: user.id,
          event_id: activeEvent.id
        });
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Você já está registrado para este evento.');
        } else {
          throw error;
        }
      } else {
        toast.success('Cadastro realizado com sucesso!');
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gradient mb-2">Cadastro</h1>
          <p className="text-muted-foreground">
            Preencha seus dados para participação nos eventos
          </p>
        </section>
        
        {activeEvent ? (
          <Card className="bg-green-500 dark:bg-green-700 text-white animate-fade-in mb-6">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{activeEvent.title}</h3>
              {activeEvent.description && (
                <p className="opacity-90 mb-2">{activeEvent.description}</p>
              )}
              <p className="opacity-90 mb-2">
                Inscrições abertas até {format(new Date(activeEvent.start_date), "dd 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-sm bg-white/20 rounded-md p-2 text-center">
                Data do evento: {format(new Date(activeEvent.start_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              {activeEvent.location && (
                <p className="text-sm mt-2">Local: {activeEvent.location}</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-yellow-500 dark:bg-yellow-700 text-white animate-fade-in mb-6">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">Nenhum evento ativo no momento</h3>
              <p className="opacity-90">
                Fique atento às notificações para saber quando abrirem inscrições para novos eventos.
              </p>
            </CardContent>
          </Card>
        )}
        
        {isRegistered ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Inscrição Confirmada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Você já está inscrito para este evento!</h3>
                <p className="text-muted-foreground mb-4">
                  Sua inscrição foi confirmada. Fique atento às notificações para mais informações.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                >
                  Voltar para a página inicial
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : activeEvent ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Formulário de Cadastro</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.birthDate ? (
                          format(formData.birthDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.birthDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="church">Igreja</Label>
                  <Input
                    id="church"
                    name="church"
                    value={formData.church}
                    onChange={handleChange}
                    placeholder="Nome da sua igreja"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pastor">Pastor Responsável</Label>
                  <Input
                    id="pastor"
                    name="pastor"
                    value={formData.pastor}
                    onChange={handleChange}
                    placeholder="Nome do pastor"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Cadastro'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AppLayout>
  );
};

export default Registration;
