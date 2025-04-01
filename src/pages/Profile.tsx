import { useState } from 'react';
import { Camera, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: 'Membro da HDS',
    phone: '',
    church: '',
    instagram: '',
    facebook: '',
    whatsapp: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    if (isLoading) return;
    
    const success = await updateProfile({
      name: profileData.name
      // Other fields would be saved to Firestore in a real implementation
    });
    
    if (success) {
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      ...profileData,
      name: user?.name || ''
    });
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted mb-4">
              <img
                src={user?.photoURL || 'https://via.placeholder.com/100?text=User'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => toast.info('A funcionalidade de upload de imagem será implementada com o Firebase Storage')}
              >
                <Camera size={18} />
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <div className="w-full max-w-xs mt-2">
              <Label htmlFor="name" className="sr-only">Nome</Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="text-center font-semibold"
                placeholder="Seu nome"
              />
            </div>
          ) : (
            <h1 className="text-2xl font-semibold">{user?.name}</h1>
          )}
          
          <p className="text-muted-foreground mt-1">{profileData.bio}</p>
          
          {isEditing ? (
            <div className="flex gap-2 mt-4">
              <Button variant="default" onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="mt-4">
              Editar perfil
            </Button>
          )}
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Informações de contato</h2>
          
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="text-muted-foreground" size={18} />
                <span>{user?.email}</span>
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              ) : profileData.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="text-muted-foreground" size={18} />
                  <span>{profileData.phone}</span>
                </div>
              )}
              
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="church">Igreja</Label>
                  <Input
                    id="church"
                    name="church"
                    value={profileData.church}
                    onChange={handleChange}
                    placeholder="Nome da sua igreja"
                  />
                </div>
              ) : profileData.church && (
                <div className="flex items-center gap-3">
                  <MapPin className="text-muted-foreground" size={18} />
                  <span>{profileData.church}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Redes sociais</h2>
          
          <Card>
            <CardContent className="p-4 space-y-3">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      value={profileData.instagram}
                      onChange={handleChange}
                      placeholder="@seu_instagram"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      name="facebook"
                      value={profileData.facebook}
                      onChange={handleChange}
                      placeholder="seu.facebook"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      value={profileData.whatsapp}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {!profileData.instagram && !profileData.facebook && !profileData.whatsapp ? (
                    <p className="text-muted-foreground text-center py-2">
                      Nenhuma rede social adicionada
                    </p>
                  ) : null}
                  
                  {profileData.instagram && (
                    <div className="flex items-center gap-3">
                      <LinkIcon className="text-muted-foreground" size={18} />
                      <span>Instagram: {profileData.instagram}</span>
                    </div>
                  )}
                  
                  {profileData.facebook && (
                    <div className="flex items-center gap-3">
                      <LinkIcon className="text-muted-foreground" size={18} />
                      <span>Facebook: {profileData.facebook}</span>
                    </div>
                  )}
                  
                  {profileData.whatsapp && (
                    <div className="flex items-center gap-3">
                      <LinkIcon className="text-muted-foreground" size={18} />
                      <span>WhatsApp: {profileData.whatsapp}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default Profile;
