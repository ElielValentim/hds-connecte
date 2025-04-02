
import { useState, useEffect } from 'react';
import { Camera, Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, profile, updateProfile, isLoading } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: profile?.name || user?.name || '',
    phone: profile?.phone || '',
    church: profile?.church || '',
    responsible_pastor: profile?.responsible_pastor || '',
    instagram: '',
    facebook: '',
    whatsapp: ''
  });
  
  // Update local state when profile changes in the store
  useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      name: profile?.name || user?.name || '',
      phone: profile?.phone || '',
      church: profile?.church || '',
      responsible_pastor: profile?.responsible_pastor || ''
    }));
  }, [profile, user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    if (isLoading) return;
    
    const success = await updateProfile({
      name: profileData.name,
      phone: profileData.phone,
      church: profileData.church,
      responsible_pastor: profileData.responsible_pastor
    });
    
    if (success) {
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      ...profileData,
      name: profile?.name || user?.name || '',
      phone: profile?.phone || '',
      church: profile?.church || '',
      responsible_pastor: profile?.responsible_pastor || ''
    });
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the profile with the new avatar URL
      const success = await updateProfile({ photo_url: publicUrl });
      
      if (success) {
        toast.success('Foto de perfil atualizada com sucesso');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Falha ao fazer upload da imagem. Por favor, tente novamente.');
    }
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted mb-4">
              <img
                src={profile?.photo_url || user?.photoURL || 'https://via.placeholder.com/100?text=User'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <div className="absolute bottom-0 right-0 rounded-full">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="bg-secondary text-secondary-foreground h-8 w-8 rounded-full flex items-center justify-center">
                    <Camera size={18} />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
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
            <h1 className="text-2xl font-semibold">{profileData.name}</h1>
          )}
          
          <p className="text-muted-foreground mt-1">Membro da HDS</p>
          
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
              
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="responsible_pastor">Pastor Responsável</Label>
                  <Input
                    id="responsible_pastor"
                    name="responsible_pastor"
                    value={profileData.responsible_pastor}
                    onChange={handleChange}
                    placeholder="Nome do pastor"
                  />
                </div>
              ) : profileData.responsible_pastor && (
                <div className="flex items-center gap-3">
                  <MapPin className="text-muted-foreground" size={18} />
                  <span>{profileData.responsible_pastor}</span>
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
