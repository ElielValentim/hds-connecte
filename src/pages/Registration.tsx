
import { useState } from 'react';
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

// This would be a call to Firestore in a real implementation
const checkRegistrationOpen = () => {
  // Mock implementation - would read from Firestore
  return {
    isOpen: true,
    deadline: new Date(2023, 11, 5), // December 5, 2023
    eventDate: new Date(2023, 11, 12), // December 12, 2023
    eventName: 'Assembleia Geral Ordinária - AGO'
  };
};

const Registration = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const registrationStatus = checkRegistrationOpen();
  
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: undefined as Date | undefined,
    phone: '',
    email: user?.email || '',
    church: '',
    pastor: ''
  });
  
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
    
    if (!formData.fullName || !formData.birthDate || !formData.phone || !formData.email || !formData.church || !formData.pastor) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be a call to Firestore
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Cadastro realizado com sucesso!');
      // Reset form after successful submission
      setFormData({
        fullName: '',
        birthDate: undefined,
        phone: '',
        email: user?.email || '',
        church: '',
        pastor: ''
      });
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
        
        {registrationStatus.isOpen && (
          <Card className="bg-green-500 dark:bg-green-700 text-white animate-fade-in mb-6">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-2">{registrationStatus.eventName}</h3>
              <p className="opacity-90 mb-2">
                Inscrições abertas até {format(registrationStatus.deadline, "dd 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-sm bg-white/20 rounded-md p-2 text-center">
                Data do evento: {format(registrationStatus.eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </CardContent>
          </Card>
        )}
        
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
      </div>
    </AppLayout>
  );
};

export default Registration;
