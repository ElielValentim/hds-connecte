
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { Navigate } from 'react-router-dom';

const DevAdmin = () => {
  const { user, companyInfo, updateCompanyInfo, isLoading } = useAuthStore();
  
  // Redirect non-dev-admin users
  if (!user || user.role !== 'dev-admin') {
    return <Navigate to="/" replace />;
  }
  
  const [formData, setFormData] = useState({
    name: companyInfo.name,
    logo: companyInfo.logo,
    contactLink: companyInfo.contactLink
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    await updateCompanyInfo(formData);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="text-center mb-4">
          <h1 className="text-2xl font-bold">Painel Dev Admin</h1>
          <p className="text-muted-foreground">
            Gerencie as informações da empresa desenvolvedora
          </p>
        </section>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
            <CardDescription>
              Edite os detalhes da ValenSoft Desenvolvimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">URL do Logo</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/logo.png"
                />
                <div className="mt-2 flex justify-center">
                  <div className="w-20 h-20 bg-muted rounded-md overflow-hidden">
                    <img
                      src={formData.logo}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactLink">Link de Contato</Label>
                <Input
                  id="contactLink"
                  name="contactLink"
                  value={formData.contactLink}
                  onChange={handleChange}
                  placeholder="https://exemplo.com"
                  type="url"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <h3 className="font-semibold text-amber-700 dark:text-amber-300">Acesso Restrito</h3>
            </div>
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              Esta área é destinada exclusivamente para o desenvolvedor do aplicativo.
              Os dados aqui alterados afetam as informações do desenvolvedor exibidas no app.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Credenciais Dev Admin</CardTitle>
            <CardDescription>
              Acesso exclusivo para o desenvolvedor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono">elielvalentim.dev@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Senha:</span>
                <span className="font-mono">••••••••</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DevAdmin;
