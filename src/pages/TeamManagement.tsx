
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import AppLayout from '@/components/layout/AppLayout';
import { Navigate } from 'react-router-dom';

const TeamManagement = () => {
  const { user } = useAuthStore();
  const [teams, setTeams] = useState<Tables<'teams'>[]>([]);
  const [newTeam, setNewTeam] = useState({
    name: '',
    logo_url: '',
    color: '',
    mascot: '',
    description: ''
  });

  // Redirect non-admin users
  if (!user || (user.role !== 'admin' && user.role !== 'dev-admin')) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*');
    if (error) {
      toast.error('Erro ao carregar equipes');
      console.error(error);
    } else {
      setTeams(data || []);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('teams').insert(newTeam);
    
    if (error) {
      toast.error('Erro ao criar equipe');
      console.error(error);
    } else {
      toast.success('Equipe criada com sucesso');
      fetchTeams();
      setNewTeam({
        name: '',
        logo_url: '',
        color: '',
        mascot: '',
        description: ''
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    const { error } = await supabase.from('teams').delete().eq('id', teamId);
    
    if (error) {
      toast.error('Erro ao excluir equipe');
      console.error(error);
    } else {
      toast.success('Equipe excluída com sucesso');
      fetchTeams();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Gestão de Equipes</h1>
        
        <Tabs defaultValue="list">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="list">Equipes Existentes</TabsTrigger>
            <TabsTrigger value="create">Criar Nova Equipe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
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
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">{team.description}</p>
                        {team.mascot && <p className="text-sm">Mascote: {team.mascot}</p>}
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteTeam(team.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Criar Nova Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
                      placeholder="Nome da Equipe" 
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      placeholder="URL do Logo (opcional)" 
                      value={newTeam.logo_url}
                      onChange={(e) => setNewTeam({...newTeam, logo_url: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      placeholder="Cor da Equipe" 
                      value={newTeam.color}
                      onChange={(e) => setNewTeam({...newTeam, color: e.target.value})}
                    />
                    <Input 
                      placeholder="Mascote" 
                      value={newTeam.mascot}
                      onChange={(e) => setNewTeam({...newTeam, mascot: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      placeholder="Descrição da Equipe" 
                      value={newTeam.description}
                      onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Plus size={16} className="mr-2" /> Criar Equipe
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

export default TeamManagement;
