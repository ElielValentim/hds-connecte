
import { useState } from 'react';
import { Bell, X, CheckCheck, AlertCircle, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';

// Mock data for notifications - would come from Firebase in a real app
const initialNotifications = [
  {
    id: '1',
    title: 'Nova Inscrição Aberta',
    message: 'Inscrições para a Assembleia Geral de Dezembro estão abertas! Não perca o prazo.',
    timestamp: new Date(2023, 11, 1, 9, 30), // Dec 1, 2023, 9:30 AM
    read: false,
    type: 'event'
  },
  {
    id: '2',
    title: 'Novos Desafios da Gincana',
    message: 'Confira os novos desafios disponíveis na seção Gincana e ganhe mais pontos!',
    timestamp: new Date(2023, 10, 28, 14, 15), // Nov 28, 2023, 2:15 PM
    read: true,
    type: 'challenge'
  },
  {
    id: '3',
    title: 'Seu vídeo foi curtido',
    message: 'Maria Oliveira curtiu seu vídeo "Testemunho - Transformação de Vida"',
    timestamp: new Date(2023, 10, 25, 20, 45), // Nov 25, 2023, 8:45 PM
    read: false,
    type: 'social'
  },
  {
    id: '4',
    title: 'Lembrete de Evento',
    message: 'O encontro de jovens acontecerá amanhã às 19h no salão principal.',
    timestamp: new Date(2023, 10, 22, 10, 0), // Nov 22, 2023, 10:00 AM
    read: false,
    type: 'event'
  },
  {
    id: '5',
    title: 'Atualização do Aplicativo',
    message: 'Uma nova versão do HDS Conecte está disponível. Atualize para acessar os novos recursos.',
    timestamp: new Date(2023, 10, 18, 12, 30), // Nov 18, 2023, 12:30 PM
    read: true,
    type: 'system'
  }
];

interface NotificationType {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'event' | 'challenge' | 'social' | 'system';
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);
  const [filter, setFilter] = useState<string>('all');
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar size={20} className="text-blue-500" />;
      case 'challenge':
        return <Info size={20} className="text-purple-500" />;
      case 'social':
        return <Bell size={20} className="text-pink-500" />;
      case 'system':
        return <AlertCircle size={20} className="text-amber-500" />;
      default:
        return <Bell size={20} />;
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success('Todas as notificações marcadas como lidas');
  };
  
  const handleDelete = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
    toast.success('Notificação removida');
  };
  
  const handleClearAll = () => {
    setNotifications([]);
    toast.success('Todas as notificações foram removidas');
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Hoje';
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  };
  
  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gradient mb-2">Notificações</h1>
          <p className="text-muted-foreground">
            Fique por dentro das novidades
          </p>
        </section>
        
        {/* Filter and Clear Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Não lidas {unreadCount > 0 && `(${unreadCount})`}
            </Button>
            <Button
              variant={filter === 'event' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('event')}
            >
              Eventos
            </Button>
            <Button
              variant={filter === 'challenge' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('challenge')}
            >
              Desafios
            </Button>
          </div>
          
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck size={16} className="mr-1" />
                Ler todas
              </Button>
            )}
          </div>
        </div>
        
        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <Card
                key={notification.id}
                className={`transition-colors ${notification.read ? 'bg-muted/30' : 'border-l-4 border-l-primary'}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-semibold ${notification.read ? 'text-muted-foreground' : ''}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{notification.message}</p>
                      
                      {/* Actions */}
                      <div className="flex justify-end gap-2 mt-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCheck size={16} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                <Bell size={48} className="text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">Nenhuma notificação</h3>
                <p className="text-muted-foreground mt-1">
                  Você não tem nenhuma notificação no momento.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="text-center pt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearAll}
            >
              Limpar todas as notificações
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
