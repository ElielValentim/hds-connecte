
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import { Navigate } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';

const Teams = () => {
  const { user } = useAuthStore();
  const [teams, setTeams] = useState<Tables<'teams'>[]>([]);
  const [userTeams, setUserTeams] = useState<Tables<'team_members'>[]>([]);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchTeams();
    fetchUserTeams();
  }, [user]);

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*');
    if (error) {
      toast.error('Erro ao carregar equipes');
      console.error(error);
    } else {
      setTeams(data || []);
    }
  };

  const fetchUserTeams = async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      toast.error('Erro ao carregar suas equipes');
      console.error(error);
    } else {
      setUserTeams(data || []);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        team_id: teamId,
        user_id: user.id,
        status: 'pending'
      });
    
    if (error) {
      toast.error('Erro ao solicitar participação na equipe');
      console.error(error);
    } else {
      toast.success('Solicitação de participação enviada');
      fetchUserTeams();
    }
  };

  const isUserInTeam = (teamId: string) => {
    return userTeams.some(
      (membership) => membership.team_id === teamId && 
      (membership.status === 'approved' || membership.status === 'pending')
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Equipes</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {team.logo_url && (
                  <img 
                    src={team.logo_url} 
                    alt={`Logo da equipe ${team.name}`} 
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{team.description}</p>
                  {team.mascot && <p className="text-sm">Mascote: {team.mascot}</p>}
                  
                  <Button 
                    className="w-full mt-2" 
                    variant={isUserInTeam(team.id) ? 'secondary' : 'default'}
                    disabled={isUserInTeam(team.id)}
                    onClick={() => handleJoinTeam(team.id)}
                  >
                    {isUserInTeam(team.id) ? 'Participando' : 'Participar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Teams;
