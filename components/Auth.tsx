import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { Heart, Users, Star, Eye, EyeOff } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AuthProps {
  onLogin: (userData: any) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('=== INICIANDO LOGIN ===');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      console.log('Status da resposta do login:', response.status);

      const data = await response.json();
      console.log('Dados da resposta do login:', data);

      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP ${response.status}: ${response.statusText}`);
      }

      // Salvar token no localStorage
      localStorage.setItem('access_token', data.access_token);
      
      console.log('=== LOGIN CONCLUÍDO ===');
      
      // Passar dados do usuário para o componente pai
      onLogin(data.user);

    } catch (err: any) {
      console.log('=== ERRO NO LOGIN ===');
      console.log('Erro completo:', err);
      
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('=== INICIANDO LOGIN AUTOMÁTICO (DEV) ===');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: 'artemis.siciliano@srna.co',
          password: 'qwer1234'
        })
      });

      console.log('Status da resposta do login automático:', response.status);

      const data = await response.json();
      console.log('Dados da resposta do login automático:', data);

      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP ${response.status}: ${response.statusText}`);
      }

      // Salvar token no localStorage
      localStorage.setItem('access_token', data.access_token);
      
      console.log('=== LOGIN AUTOMÁTICO CONCLUÍDO ===');
      
      // Passar dados do usuário para o componente pai
      onLogin(data.user);

    } catch (err: any) {
      console.log('=== ERRO NO LOGIN AUTOMÁTICO ===');
      console.log('Erro completo:', err);
      
      let errorMessage = 'Erro ao fazer login automático. Tente novamente.';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validação de senhas
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não conferem');
      setIsLoading(false);
      return;
    }

    // Validação de senha mínima
    if (registerData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      setIsLoading(false);
      return;
    }
    
    // Validação de termos
    if (!registerData.acceptTerms) {
      setError('Você deve aceitar os termos e condições para prosseguir');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('=== INICIANDO CADASTRO ===');
      console.log('URL da API:', `https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/register`);
      console.log('Dados enviados:', { 
        name: registerData.name, 
        email: registerData.email, 
        password: '***' 
      });

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        })
      });

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', Object.fromEntries(response.headers));

      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (!response.ok) {
        throw new Error(data.error || `Erro HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('Registro bem-sucedido! Fazendo login automático...');

      // Após registro bem-sucedido, fazer login automaticamente
      const loginResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        })
      });

      const loginData = await loginResponse.json();
      console.log('Resposta do login:', loginData);

      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Erro ao fazer login automático');
      }

      // Salvar token no localStorage
      localStorage.setItem('access_token', loginData.access_token);
      
      console.log('=== CADASTRO E LOGIN CONCLUÍDOS ===');
      
      // Passar dados do usuário para o componente pai
      onLogin(loginData.user);

    } catch (err: any) {
      console.log('=== ERRO NO CADASTRO ===');
      console.log('Erro completo:', err);
      console.log('Stack trace:', err.stack);
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      // Se for erro de rede
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Lado esquerdo - Informações sobre o projeto */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">Serena + Instituto Janelas</h1>
                <p className="text-gray-600">Plataforma de Mentoria Social</p>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Conectamos colaboradores da Serena com jovens em situação de vulnerabilidade do Instituto Janelas para o Mundo através de uma experiência de mentoria gamificada e transformadora.
            </p>
          </div>

          {/* Destaques do programa */}
          <div className="grid gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Impacto Real</h3>
                <p className="text-gray-600">Acompanhe o desenvolvimento dos jovens em tempo real</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Experiência Gamificada</h3>
                <p className="text-gray-600">Sistema de pontos, níveis e conquistas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Transformação Social</h3>
                <p className="text-gray-600">Faça a diferença na vida de jovens talentos</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
            <h3 className="font-medium mb-2">Dados de Impacto</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold">150+</div>
                <div className="text-blue-100">Jovens impactados</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">50+</div>
                <div className="text-blue-100">Mentores ativos</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">95%</div>
                <div className="text-blue-100">Taxa de conclusão</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado direito - Formulários de autenticação */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-2">
              <CardTitle>Acesse sua conta</CardTitle>
              <p className="text-gray-600">Entre na plataforma de mentoria social</p>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail corporativo</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu.email@serena.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        required
                        className="bg-input-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          required
                          className="bg-input-background pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar na plataforma'}
                    </Button>

                    {/* Botão de login automático para desenvolvimento */}
                    <Button 
                      type="button" 
                      onClick={handleDevLogin}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Login de Desenvolvimento'}
                    </Button>

                    <p className="text-center text-gray-600">
                      <button type="button" className="text-blue-600 hover:text-blue-700">
                        Esqueceu sua senha?
                      </button>
                    </p>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        placeholder="Digite seu nome completo"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                        required
                        className="bg-input-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="register-email">E-mail corporativo</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu.email@serena.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        required
                        className="bg-input-background"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Senha</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Min. 8 caracteres"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          required
                          minLength={8}
                          className="bg-input-background"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar senha</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Repita a senha"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                          required
                          className="bg-input-background"
                        />
                      </div>
                    </div>

                    {/* Checkbox de aceite de termos */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="accept-terms"
                        checked={registerData.acceptTerms}
                        onCheckedChange={(checked) => setRegisterData({...registerData, acceptTerms: checked as boolean})}
                      />
                      <Label htmlFor="accept-terms" className="cursor-pointer">
                        Eu li e aceito os{' '}
                        <button 
                          type="button" 
                          className="text-blue-600 hover:text-blue-700 underline"
                          onClick={() => window.open('#', '_blank')}
                        >
                          termos e condições
                        </button>
                        {' '}da plataforma
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      disabled={isLoading || !registerData.acceptTerms}
                    >
                      {isLoading ? 'Criando conta...' : 'Criar conta e começar'}
                    </Button>



                    <p className="text-center text-gray-600">
                      Já tem uma conta?{' '}
                      <button 
                        type="button" 
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => document.querySelector('[data-value="login"]')?.click()}
                      >
                        Faça login aqui
                      </button>
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}