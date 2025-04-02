
import { useState, useEffect } from 'react';
import { Bell, X, CheckCheck, AlertCircle, Info, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

// Define the notification type with proper type literals
interface NotificationType {
  id: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  type: 'event' | 'challenge' | 'social' | 'system';
}

const Notifications = () => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch notifications from Supabase
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .or(`user_id.eq.${user.id},user_id.is.null`)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }
        
        setNotifications(data as NotificationType[]);
      } catch (error) {
        console.error('Error in fetchNotifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        }, 
        (payload) => {
          setNotifications(prev => [payload.new as NotificationType, ...prev]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
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
  
  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error in handleMarkAsRead:', error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .eq('read', false);
      
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }
      
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast.success('Todas as notificações marcadas como lidas');
    } catch (error) {
      console.error('Error in handleMarkAllAsRead:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      // In a real app, you might just hide the notification instead of deleting it
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting notification:', error);
        return;
      }
      
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
      
      toast.success('Notificação removida');
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };
  
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
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
          {isLoading ? (
            <Card>
              <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Carregando notificações...</p>
              </CardContent>
            </Card>
          ) : filteredNotifications.length > 0 ? (
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
                          {formatTimestamp(notification.created_at)}
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
      </div>
    </AppLayout>
  );
};

export default Notifications;
