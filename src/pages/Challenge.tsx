
import React, { useState, useEffect } from 'react';
import { Trophy, Users, CheckCircle, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { Navigate, Link } from 'react-router-dom';

type TeamWithChallenges = Tables<'teams'> & {
  completedChallengesCount?: number;
};

const Challenge = () => {
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState<Tables<'challenges'>[]>([]);
  const [teams, setTeams] = useState<TeamWithChallenges[]>([]);
  const [teamChallenges, setTeamChallenges] = useState<Tables<'team_challenges'>[]>([]);
  const [userTeam, setUserTeam] = useState<Tables<'team_members'> | null>(null);
  const [userTeamDetails, setUserTeamDetails] = useState<Tables<'teams'> | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Tables<'challenges'> | null>(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [view, setView] = useState<'challenges' | 'teams'>('challenges');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchUserTeam();
    fetchChallenges();
    fetchTeams();
  }, [user]);

  useEffect(() => {
    if (userTeam) {
      fetchTeamChallenges();
      fetchUserTeamDetails();
    }
  }, [userTeam]);

  const fetchUserTeam = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'approved')
      .single();
    
    if (error) {
      console.error('Erro ao buscar equipe do usuário');
    } else {
      setUserTeam(data);
    }
  };

  const fetchUserTeamDetails = async () => {
    if (!userTeam) return;

    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', userTeam.team_id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar detalhes da equipe do usuário');
    } else {
      setUserTeamDetails(data);
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
    // First fetch all teams
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('*');
    
    if (teamsError) {
      toast.error('Erro ao carregar equipes');
      console.error(teamsError);
      return;
    }

    // Then fetch all team_challenges
    const { data: allTeamChallenges, error: challengesError } = await supabase
      .from('team_challenges')
      .select('*')
      .eq('status', 'completed');
    
    if (challengesError) {
      toast.error('Erro ao carregar desafios das equipes');
      console.error(challengesError);
      return;
    }
    
    // Calculate completed challenges for each team
    const teamsWithChallenges = teamsData?.map(team => {
      const completedChallenges = allTeamChallenges?.filter(tc => tc.team_id === team.id) || [];
      return {
        ...team,
        completedChallengesCount: completedChallenges.length
      };
    }) || [];

    // Sort teams by number of completed challenges (descending)
    const sortedTeams = teamsWithChallenges.sort((a, b) => 
      (b.completedChallengesCount || 0) - (a.completedChallengesCount || 0)
    );
    
    setTeams(sortedTeams);
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

  const getTeamCompletedChallenges = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.completedChallengesCount || 0;
  };

  const scrollToUserTeam = () => {
    if (!userTeamDetails) return;
    
    const teamElement = document.getElementById(`team-${userTeamDetails.id}`);
    if (teamElement) {
      teamElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a highlight animation
      teamElement.classList.add('pulse-highlight');
      setTimeout(() => {
        teamElement.classList.remove('pulse-highlight');
      }, 2000);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
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
            <Button asChild>
              <Link to="/teams">Ver Equipes</Link>
            </Button>
          </div>
        ) : (
          <>
            {userTeamDetails && (
              <Card className="bg-gradient-to-r from-gold-800 to-gold-600 text-white overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {userTeamDetails.logo_url && (
                      <img 
                        src={userTeamDetails.logo_url} 
                        alt={`Logo da equipe ${userTeamDetails.name}`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/50"
                      />
                    )}
                    <div>
                      <h3 className="font-bold text-lg">Sua equipe: {userTeamDetails.name}</h3>
                      <p className="text-white/80 text-sm">
                        Desafios completados: {getTeamCompletedChallenges(userTeamDetails.id)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Carousel */}
            <div className="py-3 space-y-3">
              <h2 className="font-bold text-lg">Equipes Participantes</h2>
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {teams.map((team) => (
                      <CarouselItem key={team.id} className="basis-1/3 lg:basis-1/4">
                        <Card 
                          className={`h-full cursor-pointer hover:shadow-md transition-shadow border-2 
                            ${userTeamDetails?.id === team.id ? 'border-gold-500' : 'border-transparent'}`}
                          onClick={userTeamDetails?.id === team.id ? scrollToUserTeam : undefined}
                        >
                          <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                            {team.logo_url && (
                              <img
                                src={team.logo_url}
                                alt={`${team.name} logo`}
                                className="w-12 h-12 object-cover rounded-full mb-2"
                              />
                            )}
                            <h3 className="font-semibold text-sm">{team.name}</h3>
                            <div className="mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center justify-center">
                                <Trophy size={12} className="mr-1 text-gold-500" />
                                {getTeamCompletedChallenges(team.id)} pts
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden md:block">
                    <CarouselPrevious />
                    <CarouselNext />
                  </div>
                </Carousel>
              </div>
            </div>

            <Tabs defaultValue="challenges" className="space-y-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="challenges" id="challenges-tab" onClick={() => setView('challenges')}>
                  <Trophy size={16} className="mr-2" /> Desafios
                </TabsTrigger>
                <TabsTrigger value="teams" id="teams-tab" onClick={() => setView('teams')}>
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
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">{challenge.title}</h3>
                              <p className="text-sm text-muted-foreground">{challenge.description}</p>
                            </div>
                            {isTeamChallengeCompleted(challenge.id) ? (
                              <div className="text-green-600 dark:text-green-400 flex items-center">
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
                    <CardTitle>Ranking de Equipes</CardTitle>
                    <CardDescription>
                      Veja a classificação das equipes com base nos desafios completados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teams.map((team, index) => (
                        <div 
                          key={team.id} 
                          id={`team-${team.id}`}
                          className={`border rounded-lg p-4 flex items-center space-x-4 transition-all
                            ${userTeamDetails?.id === team.id ? 'ring-2 ring-gold-500 dark:ring-gold-400' : ''}`}
                        >
                          <div className="font-bold text-xl text-muted-foreground w-8 text-center">
                            {index + 1}
                          </div>
                          {team.logo_url && (
                            <img 
                              src={team.logo_url} 
                              alt={`Logo da equipe ${team.name}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold">{team.name}</h3>
                            {team.mascot && (
                              <p className="text-sm text-muted-foreground">Mascote: {team.mascot}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-center">
                            <Trophy size={20} className="text-gold-500" />
                            <span className="font-bold">{getTeamCompletedChallenges(team.id)}</span>
                            <span className="text-xs text-muted-foreground">pontos</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Challenge;
