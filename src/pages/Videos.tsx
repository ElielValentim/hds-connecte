
import { useState, useRef, useEffect } from 'react';
import { Film, Heart, MessageSquare, Share2, Plus, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

// Mock data for videos - would come from Firebase in a real app
const initialVideos = [
  {
    id: '1',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    title: 'Vídeo Inspirador - HDS 2023',
    author: 'Admin HDS',
    likes: 45,
    comments: 12,
    description: 'Momentos inspiradores do nosso último evento. Compartilhe com seus amigos!'
  },
  {
    id: '2',
    url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    title: 'Testemunho - Transformação de Vida',
    author: 'Maria Silva',
    likes: 32,
    comments: 8,
    description: 'Um poderoso testemunho de como Deus transformou uma vida!'
  },
  {
    id: '3',
    url: 'https://www.youtube.com/embed/fHsa9DqmId8',
    title: 'Louvor - Momento de Adoração',
    author: 'Ministério de Louvor HDS',
    likes: 67,
    comments: 23,
    description: 'Momento especial de louvor e adoração no último culto.'
  }
];

interface VideoType {
  id: string;
  url: string;
  title: string;
  author: string;
  likes: number;
  comments: number;
  description: string;
}

const Videos = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'dev-admin';
  
  const [videos, setVideos] = useState<VideoType[]>(initialVideos);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState(false);
  
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    description: ''
  });
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  // Track which videos the user has liked
  const handleLike = (videoId: string) => {
    if (userLiked[videoId]) {
      setVideos(prev => 
        prev.map(video => 
          video.id === videoId 
            ? { ...video, likes: video.likes - 1 } 
            : video
        )
      );
      setUserLiked(prev => ({ ...prev, [videoId]: false }));
    } else {
      setVideos(prev => 
        prev.map(video => 
          video.id === videoId 
            ? { ...video, likes: video.likes + 1 } 
            : video
        )
      );
      setUserLiked(prev => ({ ...prev, [videoId]: true }));
      toast.success('Você curtiu este vídeo!');
    }
  };
  
  const handleShare = (videoId: string) => {
    // In a real app, this would use the Web Share API if available
    toast.success('Link do vídeo copiado para a área de transferência!');
  };
  
  const handleScroll = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };
  
  const handleNewVideoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewVideo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.url) {
      toast.error('Por favor, preencha o título e URL do vídeo');
      return;
    }
    
    // Simple URL validation
    if (!newVideo.url.includes('youtube.com/embed/') && !newVideo.url.includes('youtu.be/')) {
      // Convert regular YouTube links to embed format
      let embedUrl = newVideo.url;
      if (newVideo.url.includes('youtube.com/watch?v=')) {
        const videoId = newVideo.url.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (newVideo.url.includes('youtu.be/')) {
        const videoId = newVideo.url.split('youtu.be/')[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else {
        toast.error('Por favor, insira um link válido do YouTube');
        return;
      }
      
      setNewVideo(prev => ({
        ...prev,
        url: embedUrl
      }));
    }
    
    const newId = Date.now().toString();
    const newVideoEntry: VideoType = {
      id: newId,
      url: newVideo.url,
      title: newVideo.title,
      author: user?.name || 'Usuário',
      likes: 0,
      comments: 0,
      description: newVideo.description
    };
    
    setVideos(prev => [...prev, newVideoEntry]);
    
    setNewVideo({
      title: '',
      url: '',
      description: ''
    });
    
    toast.success('Vídeo adicionado com sucesso!');
  };
  
  // Scroll to current video
  useEffect(() => {
    if (videoContainerRef.current) {
      const container = videoContainerRef.current;
      const videoHeight = container.clientHeight;
      container.scrollTo({
        top: currentVideoIndex * videoHeight,
        behavior: 'smooth'
      });
    }
  }, [currentVideoIndex]);
  
  const currentVideo = videos[currentVideoIndex];
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gradient mb-2">Vídeos</h1>
          <p className="text-muted-foreground">
            Assista e compartilhe conteúdos inspiradores
          </p>
        </section>
        
        {isAdmin && (
          <div className="mb-4 flex justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-2" /> Adicionar Vídeo
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Adicionar Novo Vídeo</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Vídeo</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newVideo.title}
                      onChange={handleNewVideoChange}
                      placeholder="Título do vídeo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL do YouTube</Label>
                    <Input
                      id="url"
                      name="url"
                      value={newVideo.url}
                      onChange={handleNewVideoChange}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Cole o link do YouTube (normal ou incorporado)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newVideo.description}
                      onChange={handleNewVideoChange}
                      placeholder="Descreva o vídeo..."
                      rows={3}
                    />
                  </div>
                  <Button 
                    className="w-full mt-6" 
                    onClick={handleAddVideo}
                  >
                    Adicionar Vídeo
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
        
        {videos.length > 0 ? (
          <div className="relative">
            <div 
              ref={videoContainerRef}
              className="h-[60vh] overflow-hidden rounded-xl bg-black"
            >
              <div className="relative h-full">
                <iframe
                  src={currentVideo.url}
                  title={currentVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                {/* Video Info Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                  <h3 className="font-bold text-lg">{currentVideo.title}</h3>
                  <p className="text-sm opacity-80">Por {currentVideo.author}</p>
                  <p className="mt-2 text-sm">{currentVideo.description}</p>
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white"
                      onClick={() => handleLike(currentVideo.id)}
                    >
                      <Heart 
                        size={20} 
                        className={userLiked[currentVideo.id] ? 'fill-red-500 text-red-500' : ''} 
                      />
                      <span className="ml-1">{currentVideo.likes}</span>
                    </Button>
                    
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-white"
                          onClick={() => setShowComments(true)}
                        >
                          <MessageSquare size={20} />
                          <span className="ml-1">{currentVideo.comments}</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="bottom" className="h-[70vh]">
                        <SheetHeader>
                          <SheetTitle>Comentários</SheetTitle>
                        </SheetHeader>
                        <div className="py-6">
                          <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary"></div>
                                <p className="font-medium">João Silva</p>
                              </div>
                              <p className="text-sm">Vídeo incrível! Me edificou muito.</p>
                            </div>
                            <div className="border rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-secondary"></div>
                                <p className="font-medium">Maria Oliveira</p>
                              </div>
                              <p className="text-sm">Que testemunho poderoso!</p>
                            </div>
                            <div className="mt-6">
                              <Textarea placeholder="Adicione um comentário..." />
                              <Button className="mt-2">Comentar</Button>
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white"
                      onClick={() => handleShare(currentVideo.id)}
                    >
                      <Share2 size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Controls */}
            {currentVideoIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full"
                onClick={() => handleScroll('prev')}
              >
                <Play size={24} className="rotate-180" />
              </Button>
            )}
            
            {currentVideoIndex < videos.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full"
                onClick={() => handleScroll('next')}
              >
                <Play size={24} />
              </Button>
            )}
            
            {/* Video Thumbnails at Bottom */}
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-none">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className={`flex-shrink-0 cursor-pointer transition-all ${
                    index === currentVideoIndex 
                      ? 'w-20 h-20 border-2 border-primary' 
                      : 'w-16 h-16 opacity-70'
                  }`}
                  onClick={() => setCurrentVideoIndex(index)}
                >
                  <div className="relative w-full h-full rounded-md overflow-hidden bg-gray-200">
                    <img
                      src={`https://img.youtube.com/vi/${video.url.split('/').pop()}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Film size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-10 flex flex-col items-center justify-center text-center">
              <Film size={48} className="text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">Nenhum vídeo disponível</h3>
              <p className="text-muted-foreground mt-1">
                Os vídeos aparecerão aqui quando forem adicionados.
              </p>
              {isAdmin && (
                <Button 
                  className="mt-6"
                  onClick={() => document.querySelector<HTMLButtonElement>(
                    '[aria-label="Adicionar Vídeo"]'
                  )?.click()}
                >
                  <Plus size={16} className="mr-2" /> Adicionar Primeiro Vídeo
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Videos;
