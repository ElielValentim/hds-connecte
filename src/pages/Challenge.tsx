
import { useState } from 'react';
import { Trophy, CheckCircle, Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

// Mock data for challenges - would come from Firestore in a real app
const initialChallenges = [
  { id: '1', title: 'Compartilhar vídeo nas redes sociais', points: 5, completed: false },
  { id: '2', title: 'Convidar 3 amigos para o evento', points: 10, completed: true },
  { id: '3', title: 'Participar de uma reunião online', points: 15, completed: false },
  { id: '4', title: 'Postar uma foto com a camiseta do evento', points: 20, completed: false },
  { id: '5', title: 'Completar questionário bíblico', points: 25, completed: true },
];

// Mock data for leaderboard - would come from Firestore in a real app
const initialLeaderboard = [
  { id: '1', name: 'João Silva', points: 45, position: 1 },
  { id: '2', name: 'Maria Oliveira', points: 40, position: 2 },
  { id: '3', name: 'Pedro Santos', points: 35, position: 3 },
  { id: '4', name: 'Ana Costa', points: 30, position: 4 },
  { id: '5', name: 'Lucas Fernandes', points: 25, position: 5 },
];

interface ChallengeType {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

interface LeaderboardEntryType {
  id: string;
  name: string;
  points: number;
  position: number;
}

const Challenge = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'dev-admin';
  
  const [challenges, setChallenges] = useState<ChallengeType[]>(initialChallenges);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryType[]>(initialLeaderboard);
  const [activeTab, setActiveTab] = useState('challenges');
  
  const [editingChallenge, setEditingChallenge] = useState<ChallengeType | null>(null);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    points: 5,
  });
  
  // Calculate user's points
  const userPoints = challenges
    .filter(challenge => challenge.completed)
    .reduce((sum, challenge) => sum + challenge.points, 0);
  
  // Find user's position in leaderboard
  const userPosition = leaderboard.findIndex(entry => entry.name === user?.name) + 1;
  
  const handleChallengeToggle = (id: string) => {
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.id === id
          ? { ...challenge, completed: !challenge.completed }
          : challenge
      )
    );
    
    toast.success('Status do desafio atualizado!');
  };
  
  const handleNewChallengeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewChallenge(prev => ({
      ...prev,
      [name]: name === 'points' ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleEditChallengeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingChallenge) return;
    
    const { name, value } = e.target;
    setEditingChallenge(prev => ({
      ...prev!,
      [name]: name === 'points' ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleAddChallenge = () => {
    if (!newChallenge.title) {
      toast.error('Por favor, preencha o título do desafio');
      return;
    }
    
    const newId = Date.now().toString();
    setChallenges(prev => [
      ...prev,
      {
        id: newId,
        title: newChallenge.title,
        points: newChallenge.points,
        completed: false,
      },
    ]);
    
    setNewChallenge({
      title: '',
      points: 5,
    });
    
    toast.success('Desafio adicionado com sucesso!');
  };
  
  const handleUpdateChallenge = () => {
    if (!editingChallenge?.title) {
      toast.error('Por favor, preencha o título do desafio');
      return;
    }
    
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.id === editingChallenge.id
          ? {
              ...editingChallenge,
            }
          : challenge
      )
    );
    
    setEditingChallenge(null);
    toast.success('Desafio atualizado com sucesso!');
  };
  
  const handleDeleteChallenge = (id: string) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== id));
    toast.success('Desafio removido com sucesso!');
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gradient mb-2">Gincana</h1>
          <p className="text-muted-foreground">
            Participe dos desafios e conquiste pontos
          </p>
        </section>
        
        {/* User Stats Card */}
        <Card className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Seus Pontos</h3>
                <p className="text-3xl font-bold mt-2">{userPoints}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Trophy size={32} />
              </div>
            </div>
            
            <div className="mt-4 bg-white/10 rounded-lg p-3 text-center">
              {userPosition > 0 ? (
                <p>Sua posição atual: {userPosition}º lugar</p>
              ) : (
                <p>Complete desafios para entrar no ranking</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for Challenges and Leaderboard */}
        <Tabs defaultValue="challenges" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="challenges">Desafios</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          </TabsList>
          
          {/* Challenges Tab */}
          <TabsContent value="challenges" className="animate-fade-in">
            <div className="space-y-4">
              {isAdmin && (
                <div className="flex justify-end">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm">
                        <Plus size={16} className="mr-2" /> Adicionar Desafio
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Adicionar Novo Desafio</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Título do Desafio</Label>
                          <Input
                            id="title"
                            name="title"
                            value={newChallenge.title}
                            onChange={handleNewChallengeChange}
                            placeholder="Descreva o desafio"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="points">Pontos</Label>
                          <Input
                            id="points"
                            name="points"
                            type="number"
                            min={1}
                            value={newChallenge.points}
                            onChange={handleNewChallengeChange}
                          />
                        </div>
                        <Button 
                          className="w-full mt-6" 
                          onClick={handleAddChallenge}
                        >
                          Adicionar Desafio
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              )}
              
              {challenges.map((challenge) => (
                <Card key={challenge.id} className={`transition-colors ${challenge.completed ? 'bg-muted' : ''}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button 
                        onClick={() => handleChallengeToggle(challenge.id)}
                        className={`rounded-full p-1 ${
                          challenge.completed 
                            ? 'text-green-500' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        <CheckCircle size={24} />
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${challenge.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {challenge.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {challenge.points} pontos
                        </p>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingChallenge(challenge)}
                            >
                              <Edit size={16} />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            {editingChallenge && (
                              <>
                                <SheetHeader>
                                  <SheetTitle>Editar Desafio</SheetTitle>
                                </SheetHeader>
                                <div className="space-y-4 mt-6">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-title">Título do Desafio</Label>
                                    <Input
                                      id="edit-title"
                                      name="title"
                                      value={editingChallenge.title}
                                      onChange={handleEditChallengeChange}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-points">Pontos</Label>
                                    <Input
                                      id="edit-points"
                                      name="points"
                                      type="number"
                                      min={1}
                                      value={editingChallenge.points}
                                      onChange={handleEditChallengeChange}
                                    />
                                  </div>
                                  <Button 
                                    className="w-full mt-6" 
                                    onClick={handleUpdateChallenge}
                                  >
                                    Atualizar Desafio
                                  </Button>
                                </div>
                              </>
                            )}
                          </SheetContent>
                        </Sheet>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteChallenge(challenge.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              {challenges.length === 0 && (
                <Card className="bg-muted">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">Nenhum desafio disponível no momento</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-center">Ranking da Gincana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={entry.id}
                      className={`flex items-center p-3 rounded-lg ${
                        index === 0 
                          ? 'bg-amber-100 dark:bg-amber-900 font-bold' 
                          : index === 1
                            ? 'bg-gray-100 dark:bg-gray-800'
                            : index === 2
                              ? 'bg-amber-50 dark:bg-amber-950'
                              : 'bg-muted/50'
                      }`}
                    >
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-background mr-3">
                        {index === 0 ? (
                          <Trophy size={16} className="text-amber-500" />
                        ) : (
                          <span>{entry.position}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{entry.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{entry.points}</span>
                        <span className="text-xs text-muted-foreground">pts</span>
                      </div>
                      <div className="w-4 ml-2">
                        {Math.random() > 0.5 ? (
                          <ArrowUp size={16} className="text-green-500" />
                        ) : (
                          <ArrowDown size={16} className="text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Challenge;
