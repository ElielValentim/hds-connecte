
import { useNavigate } from 'react-router-dom';
import { FileText, Trophy, Film, User, Bell, Settings, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, FileUp } from 'lucide-react';
import { toast } from 'sonner';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState<Tables<'challenges'>[]>([]);
  const [teams, setTeams] = useState<Tables<'teams'>[]>([]);
  const [teamChallenges, setTeamChallenges] = useState<Tables<'team_challenges'>[]>([]);
  const [userTeam, setUserTeam] = useState<Tables<'team_members'> | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Tables<'challenges'> | null>(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  
  const menuItems = [
    {
      name: 'Vídeos',
      description: 'Assista e compartilhe',
      icon: Film,
      path: '/videos',
      color: 'bg-gold-100 dark:bg-gold-900/40',
      iconColor: 'text-gold-600'
    },
    {
      name: 'Perfil',
      description: 'Gerencie seus dados',
      icon: User,
      path: '/profile',
      color: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600'
    },
    {
      name: 'Notificações',
      description: 'Veja suas mensagens',
      icon: Bell,
      path: '/notifications',
      color: 'bg-gold-100 dark:bg-gold-900/40',
      iconColor: 'text-gold-600'
    },
  ];
  
  if (user?.role === 'dev-admin') {
    menuItems.push({
      name: 'Dev Admin',
      description: 'Configurações avançadas',
      icon: Settings,
      path: '/dev-admin',
      color: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600'
    });
  }
  
  if (user?.role === 'admin') {
    menuItems.push({
      name: 'Admin',
      description: 'Gerenciar conteúdo',
      icon: Settings,
      path: '/admin',
      color: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600'
    });
  }

  useEffect(() => {
    fetchUserTeam();
    fetchChallenges();
    fetchTeams();
  }, [user]);

  useEffect(() => {
    if (userTeam) {
      fetchTeamChallenges();
    }
  }, [userTeam]);

  const fetchUserTeam = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', user?.id || '')
      .eq('status', 'approved')
      .single();
    
    if (error) {
      console.error('Erro ao buscar equipe do usuário');
    } else {
      setUserTeam(data);
    }
  };

  const fetchChallenges = async () => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('active', true);
    
    if (error) {
      toast.error('Erro ao carregar desafios');
      console.error(error);
    } else {
      setChallenges(data || []);
    }
  };

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*');
    
    if (error) {
      toast.error('Erro ao carregar equipes');
      console.error(error);
    } else {
      setTeams(data || []);
    }
  };

  const fetchTeamChallenges = async () => {
    if (!userTeam) return;

    const { data, error } = await supabase
      .from('team_challenges')
      .select('*')
      .eq('team_id', userTeam.team_id);
    
    if (error) {
      toast.error('Erro ao carregar desafios da equipe');
      console.error(error);
    } else {
      setTeamChallenges(data || []);
    }
  };

  const handleSubmitChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChallenge || !userTeam) {
      toast.error('Selecione um desafio e sua equipe');
      return;
    }

    const { data, error } = await supabase
      .from('team_challenges')
      .insert({
        team_id: userTeam.team_id,
        challenge_id: selectedChallenge.id,
        status: 'pending',
        evidence: evidenceUrl
      });
    
    if (error) {
      toast.error('Erro ao enviar desafio');
      console.error(error);
    } else {
      toast.success('Desafio enviado para avaliação');
      fetchTeamChallenges();
      setSelectedChallenge(null);
      setEvidenceUrl('');
    }
  };

  const isTeamChallengeCompleted = (challengeId: string) => {
    return teamChallenges.some(
      (tc) => tc.challenge_id === challengeId && tc.status === 'completed'
    );
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/517237b8-3f79-4b2e-9ada-55197aa95076.png" 
              alt="HDS Logo" 
              className="h-24 w-24 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Bem-vindo(a)!</h1>
          <p className="text-muted-foreground">
            Olá, {user?.name || 'Usuário'}. O que você deseja fazer hoje?
          </p>
        </section>
        
        <Card className="bg-yellow-500 text-black overflow-hidden">
          <CardContent className="p-6 text-center">
            <h3 className="font-bold text-xl mb-2 text-black">Próximo evento</h3>
            <p className="text-gray-800 mb-2 font-semibold">Assembleia Geral Ordinária - AGO</p>
            <div className="bg-white/70 rounded-md p-2 shadow-sm">
              <p className="font-bold text-black text-lg">12 de Dezembro de 2023</p>
              <p className="text-sm text-gray-700 font-medium">Inscrições abertas até 05/12</p>
            </div>
          </CardContent>
        </Card>

        {!userTeam ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Você ainda não está em uma equipe</h1>
            <p>Para participar dos desafios, primeiro entre em uma equipe.</p>
            <Button onClick={() => document.getElementById('teams-tab')?.click()}>
              Ver Equipes
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="challenges" className="space-y-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="challenges" id="challenges-tab">
                <Trophy size={16} className="mr-2" /> Desafios
              </TabsTrigger>
              <TabsTrigger value="teams" id="teams-tab">
                <Users size={16} className="mr-2" /> Equipes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="challenges">
              <Card>
                <CardHeader>
                  <CardTitle>Desafios Disponíveis</CardTitle>
                  <CardDescription>
                    Selecione um desafio para completar com sua equipe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {challenges.map((challenge) => (
                      <div 
                        key={challenge.id} 
                        className={`border rounded-lg p-4 ${
                          isTeamChallengeCompleted(challenge.id) 
                          ? 'bg-green-50 border-green-200' 
                          : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{challenge.title}</h3>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          </div>
                          {isTeamChallengeCompleted(challenge.id) ? (
                            <div className="text-green-600 flex items-center">
                              <CheckCircle className="mr-2" /> Concluído
                            </div>
                          ) : (
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button 
                                  size="sm" 
                                  onClick={() => setSelectedChallenge(challenge)}
                                >
                                  <FileUp size={16} className="mr-2" /> Enviar Evidência
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Enviar Evidência de Desafio</SheetTitle>
                                </SheetHeader>
                                <form onSubmit={handleSubmitChallenge} className="space-y-4 mt-4">
                                  <div className="space-y-2">
                                    <Label>Desafio</Label>
                                    <Input 
                                      value={selectedChallenge?.title || ''} 
                                      readOnly 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>URL da Evidência</Label>
                                    <Input 
                                      placeholder="Link para comprovação do desafio" 
                                      value={evidenceUrl}
                                      onChange={(e) => setEvidenceUrl(e.target.value)}
                                      required
                                    />
                                  </div>
                                  <Button type="submit" className="w-full">
                                    Enviar Evidência
                                  </Button>
                                </form>
                              </SheetContent>
                            </Sheet>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <CardTitle>Equipes</CardTitle>
                  <CardDescription>
                    Veja as equipes participantes da gincana
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teams.map((team) => (
                      <Card key={team.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          {team.logo_url && (
                            <img 
                              src={team.logo_url} 
                              alt={`Logo da equipe ${team.name}`} 
                              className="w-full h-40 object-cover rounded-md mb-4"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{team.name}</h3>
                            <p className="text-sm text-muted-foreground">{team.description}</p>
                            {team.mascot && (
                              <p className="text-sm mt-2">Mascote: {team.mascot}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        <section className="mt-6">
          <h2 className="text-xl font-bold mb-4">Outros recursos</h2>
          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Card
                key={item.path}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow btn-transition"
                onClick={() => navigate(item.path)}
              >
                <CardContent className={`p-6 ${item.color}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full ${item.iconColor} bg-white/80 dark:bg-white/10 mb-4`}>
                      <item.icon size={28} />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Home;
