import { useState, useEffect } from 'react';
import { Trophy, Plus, FileUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Challenge component implementation
// This component will display and manage user challenges
const Challenge = () => {
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState([
    {
      id: '1',
      title: 'Desafio de Boas-Vindas',
      description: 'Compartilhe uma mensagem de boas-vindas para novos membros!',
      points: 100,
      active: true
    },
    {
      id: '2',
      title: 'Desafio da Gratidão',
      description: 'Expresse gratidão por algo especial em sua vida.',
      points: 150,
      active: true
    },
    {
      id: '3',
      title: 'Desafio da Comunidade',
      description: 'Participe de um evento comunitário e compartilhe sua experiência.',
      points: 200,
      active: false
    }
  ]);
  const [userChallenges, setUserChallenges] = useState([
    {
      id: '1',
      challengeId: '1',
      completed: true,
      evidence: 'Link para a mensagem de boas-vindas'
    },
    {
      id: '2',
      challengeId: '2',
      completed: false,
      evidence: null
    }
  ]);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    points: 100
  });
  const [uploading, setUploading] = useState(false);
  const [completedCount, setCompletedCount] = useState(1);
  const [points, setPoints] = useState(100);
  
  // Showing the user's name properly in the user challenges
  const renderUserChallenges = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Meus Desafios</h2>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{completedCount}</span> de {challenges.length} completados
          </div>
        </div>
        
        <div className="mb-4">
          <Progress value={(completedCount / Math.max(challenges.length, 1)) * 100} />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Painel de Pontuação</CardTitle>
            <CardDescription>
              Suas conquistas aparecem aqui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                  <Trophy className="text-amber-500" size={24} />
                </div>
                <div>
                  <p className="font-medium">{user?.name || 'Usuário'}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">{points}</span> pontos acumulados
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <h4 className="text-sm font-semibold">Ranking</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p>1. {user?.name || 'Usuário'}</p>
                  <span className="font-medium">{points}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p>2. Maria Silva</p>
                  <span>180</span>
                </div>
                <div className="flex items-center justify-between">
                  <p>3. João Oliveira</p>
                  <span>150</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id}>
              <CardHeader>
                <CardTitle>{challenge.title}</CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Recompensa: <span className="font-semibold">{challenge.points}</span> pontos
                  </p>
                  {userChallenges.find(uc => uc.challengeId === challenge.id)?.completed ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle size={16} />
                      <span className="text-xs">Concluído</span>
                    </div>
                  ) : (
                    <Button size="sm">
                      <FileUp size={16} className="mr-2" />
                      Enviar Evidência
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  // Component's return JSX
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gradient mb-2">Gincana</h1>
          <p className="text-muted-foreground">
            Participe dos desafios e ganhe recompensas
          </p>
        </section>
        
        {renderUserChallenges()}
      </div>
    </AppLayout>
  );
};

export default Challenge;
