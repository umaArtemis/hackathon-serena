import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Trilha from './components/Trilha';
import Desafios from './components/Desafios';
import Atividades from './components/Atividades';
import Instituto from './components/Instituto';
import Profile from './components/Profile';
import Auth from './components/Auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { User, Heart, Trophy, BookOpen, Info, Star, LogOut, Medal, Settings, UserCircle } from 'lucide-react';
import { projectId, publicAnonKey } from './utils/supabase/info';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    name: '',
    email: '',
    points: 0,
    level: 1,
    levelName: 'Mentor Iniciante',
    avatar: ''
  });

  // Verificar sessão ativa ao carregar a aplicação
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/verify-session`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserStats(data.user);
          setIsAuthenticated(true);
        } else {
          // Token inválido, remover do localStorage
          localStorage.removeItem('access_token');
        }
      } catch (error) {
        console.log('Erro ao verificar sessão:', error);
        localStorage.removeItem('access_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (userData: any) => {
    setUserStats(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.log('Erro no logout:', error);
    } finally {
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
      setUserStats({
        name: '',
        email: '',
        points: 0,
        level: 1,
        levelName: 'Mentor Iniciante',
        avatar: ''
      });
      setCurrentPage('dashboard');
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'atividades', label: 'Atividades', icon: BookOpen },
    { id: 'desafios', label: 'Desafios', icon: Trophy },
    { id: 'profile', label: 'Perfil', icon: UserCircle },
    { id: 'instituto', label: 'Instituto', icon: Info },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigateToProfile={() => setCurrentPage('profile')} />;
      case 'atividades':
        return <Atividades />;
      case 'desafios':
        return <Desafios />;
      case 'instituto':
        return <Instituto />;
      case 'profile':
        return <Profile userStats={userStats} onUpdateProfile={handleUpdateProfile} />;
      default:
        return <Dashboard onNavigateToProfile={() => setCurrentPage('profile')} />;
    }
  };

  const handleUpdateProfile = async (data: any) => {
    // Atualizar dados básicos do usuário se necessário
    if (data.name && data.name !== userStats.name) {
      setUserStats({
        ...userStats,
        name: data.name,
        email: data.email || userStats.email
      });
    }
  };

  // Mostrar loading enquanto verifica sessão
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="text-gray-600">Carregando plataforma...</div>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center h-16 px-8">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Serena + Instituto Janelas</h1>
          </div>
          <div className="flex items-center space-x-6">
            {/* Indicadores de gamificação */}
            <div className="flex items-center space-x-4">
              {/* Pontos */}
              <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs">
                <Star className="w-3 h-3" />
                <span className="font-medium">{userStats.points.toLocaleString()}</span>
              </div>
              
              {/* Nível */}
              <div className="flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs">
                <Medal className="w-3 h-3" />
                <span className="font-medium">Nível {userStats.level}</span>
              </div>
            </div>

            {/* Separador visual */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Informações do usuário */}
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      Olá, <span className="font-medium text-gray-900">{userStats.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">{userStats.levelName}</div>
                  </div>
                  
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-medium">{userStats.avatar}</span>
                  </div>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <div className="font-medium text-gray-900">{userStats.name}</div>
                    <div className="text-sm text-gray-500">{userStats.email}</div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => setCurrentPage('profile')} className="cursor-pointer">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Ver Perfil
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={() => setCurrentPage('profile')} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        currentPage === item.id
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}