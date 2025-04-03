
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Link as LinkIcon, Video, Trophy, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const { user, isLoading } = useAuthStore();
  
  // Redirect non-admin users
  if (!user || (user.role !== 'admin' && user.role !== 'dev-admin')) {
    return <Navigate to="/" replace />;
  }
  
  const [activeTab, setActiveTab] = useState('events');
  
  // State for events form
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: ''
  });
  
  // State for challenges form
  const [challengeForm, setChallenge] = useState({
    title: '',
    description: '',
    points: 10
  });
  
  // State for videos form
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    url: '',
    thumbnailUrl: ''
  });
  
  // State for social links
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    whatsapp: '',
    facebook: '',
    website: ''
  });
  
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleChallengeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setChallenge(prev => ({ ...prev, [name]: name === 'points' ? parseInt(value) || 0 : value }));
  };
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVideoForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      // TODO: Add supabase integration to save event
      toast.success('Evento criado com sucesso!');
      setEventForm({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Erro ao criar evento. Tente novamente.');
    }
  };
  
  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      // TODO: Add supabase integration to save challenge
      toast.success('Desafio criado com sucesso!');
      setChallenge({
        title: '',
        description: '',
        points: 10
      });
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error('Erro ao criar desafio. Tente novamente.');
    }
  };
  
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      // TODO: Add supabase integration to save video
      toast.success('Vídeo adicionado com sucesso!');
      setVideoForm({
        title: '',
        description: '',
        url: '',
        thumbnailUrl: ''
      });
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Erro ao adicionar vídeo. Tente novamente.');
    }
  };
  
  const handleSocialLinksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      // TODO: Add supabase integration to save social links
      toast.success('Links sociais atualizados com sucesso!');
    } catch (error) {
      console.error('Error updating social links:', error);
      toast.error('Erro ao atualizar links sociais. Tente novamente.');
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="text-center mb-4">
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie eventos, desafios, vídeos e redes sociais
          </p>
        </section>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Eventos</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Gincanas</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>Vídeos</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              <span>Redes Sociais</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Evento</CardTitle>
                <CardDescription>
                  Adicione eventos da igreja como AGOs, celebrações, etc.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Evento</Label>
                    <Input
                      id="title"
                      name="title"
                      value={eventForm.title}
                      onChange={handleEventChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={eventForm.description}
                      onChange={handleEventChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Data de Início</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="datetime-local"
                        value={eventForm.startDate}
                        onChange={handleEventChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Data de Término</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="datetime-local"
                        value={eventForm.endDate}
                        onChange={handleEventChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Local</Label>
                    <Input
                      id="location"
                      name="location"
                      value={eventForm.location}
                      onChange={handleEventChange}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Criar Evento'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="challenges">
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Desafio</CardTitle>
                <CardDescription>
                  Adicione desafios da gincana para os participantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChallengeSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="challengeTitle">Título do Desafio</Label>
                    <Input
                      id="challengeTitle"
                      name="title"
                      value={challengeForm.title}
                      onChange={handleChallengeChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="challengeDescription">Descrição</Label>
                    <Textarea
                      id="challengeDescription"
                      name="description"
                      value={challengeForm.description}
                      onChange={handleChallengeChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="points">Pontos</Label>
                    <Input
                      id="points"
                      name="points"
                      type="number"
                      min="1"
                      value={challengeForm.points}
                      onChange={handleChallengeChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Criar Desafio'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Vídeo</CardTitle>
                <CardDescription>
                  Compartilhe vídeos de pregações, testemunhos, etc.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="videoTitle">Título do Vídeo</Label>
                    <Input
                      id="videoTitle"
                      name="title"
                      value={videoForm.title}
                      onChange={handleVideoChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="videoDescription">Descrição</Label>
                    <Textarea
                      id="videoDescription"
                      name="description"
                      value={videoForm.description}
                      onChange={handleVideoChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">URL do Vídeo (YouTube, Vimeo, etc.)</Label>
                    <Input
                      id="videoUrl"
                      name="url"
                      value={videoForm.url}
                      onChange={handleVideoChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl">URL da Miniatura (opcional)</Label>
                    <Input
                      id="thumbnailUrl"
                      name="thumbnailUrl"
                      value={videoForm.thumbnailUrl}
                      onChange={handleVideoChange}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Adicionar Vídeo'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>
                  Configure os links das redes sociais da igreja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSocialLinksSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={socialLinks.instagram}
                      onChange={handleSocialLinkChange}
                      placeholder="https://instagram.com/seuusuario"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      value={socialLinks.whatsapp}
                      onChange={handleSocialLinkChange}
                      placeholder="https://wa.me/5511999999999"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      name="facebook"
                      value={socialLinks.facebook}
                      onChange={handleSocialLinkChange}
                      placeholder="https://facebook.com/suapagina"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={socialLinks.website}
                      onChange={handleSocialLinkChange}
                      placeholder="https://seusite.com"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar Links Sociais'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Admin;
