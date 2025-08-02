import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { 
  User, Mail, Calendar, MapPin, Phone, Edit3, Save, X, 
  Heart, Trophy, Clock, Star, Award,
  Settings, Bell, Shield, Building2,
  GraduationCap, Users, CalendarDays
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ProfileProps {
  userStats: {
    name: string;
    email: string;
    points: number;
    level: number;
    levelName: string;
    avatar: string;
  };
  onUpdateProfile?: (data: any) => void;
}

export default function Profile({ userStats, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    linkedin: '',
    area: '',
    formacao: '',
    voluntarioOutrasIniciativas: false,
    skills: [] as string[],
    atuacaoAreas: [] as Array<{area: string, nivel: string}>,
    availability: {
      segunda: [] as string[], // [start1, end1, start2, end2] ou []
      terca: [] as string[],
      quarta: [] as string[],
      quinta: [] as string[],
      sexta: [] as string[],
      sabado: [] as string[],
      domingo: [] as string[]
    }
  });

  // Timer para debounce do salvamento de disponibilidade
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Estados para adicionar nova área de atuação
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedNivel, setSelectedNivel] = useState('');

  // Carregar dados do perfil ao montar o componente
  useEffect(() => {
    loadProfile();
  }, []);

  // Cleanup timer quando componente for desmontado
  useEffect(() => {
    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
    };
  }, [saveTimer]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Garantir que os dados básicos do usuário estão sempre presentes
        const profileWithUserData = {
          ...data.profile,
          name: data.profile.name || userStats.name,
          email: data.profile.email || userStats.email
        };
        
        setProfileData(profileWithUserData);
      } else {
        const errorText = await response.text();
        console.error('Erro ao carregar perfil:', response.status, errorText);
      }
    } catch (error) {
      console.error('Erro no carregamento do perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (updatedData: any) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.profile && onUpdateProfile) {
          onUpdateProfile(data.profile);
        }
      } else {
        const errorText = await response.text();
        console.error('Erro ao salvar perfil:', response.status, errorText);
      }
    } catch (error) {
      console.error('Erro no salvamento do perfil:', error);
    }
  };

  const saveAvailability = async (availability: any) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/profile/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ availability })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro ao salvar disponibilidade:', response.status, errorText);
      }
    } catch (error) {
      console.error('Erro no salvamento da disponibilidade:', error);
    }
  };

  const debouncedSaveAvailability = (availability: any) => {
    // Limpar timer anterior se existir
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    // Criar novo timer para salvar após 1 segundo
    const newTimer = setTimeout(() => {
      saveAvailability(availability);
      setSaveTimer(null);
    }, 1000);

    setSaveTimer(newTimer);
  };

  const areas = [
    'CEO',
    'Desenvolvimento',
    'Financeiro',
    'Gestão de Ativos',
    'Implantação',
    'Legal',
    'Retail e/ou Marketing',
    'Plataforma',
    'Produto & Regulatório',
    'Sustentabilidade',
    'Tech'
  ];

  const areasAtuacao = [
    'Assistência Social',
    'Educação',
    'Saúde',
    'Meio Ambiente',
    'Cultura e Arte',
    'Esporte e Recreação',
    'Direitos Humanos',
    'Desenvolvimento Comunitário',
    'Tecnologia Social',
    'Empreendedorismo Social',
    'Capacitação Profissional',
    'Orientação Vocacional',
    'Gestão e Liderança',
    'Comunicação e Marketing',
    'Finanças Pessoais',
    'Desenvolvimento Pessoal'
  ];

  const niveisExperiencia = [
    { value: 'iniciante', label: 'Iniciante' },
    { value: 'intermediario', label: 'Intermediário' },
    { value: 'avancado', label: 'Avançado' },
    { value: 'especialista', label: 'Especialista' }
  ];



  const daysOfWeek = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await saveProfile(profileData);
    await loadProfile(); // Recarregar dados para confirmar persistência
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = async () => {
    await loadProfile(); // Recarregar dados originais
    setIsEditing(false);
  };



  // Mock data para demonstração
  const achievements = [
    { id: 1, name: "Primeiro Match", description: "Fez seu primeiro match com um mentorado", date: "15 Nov 2024", icon: Heart },
    { id: 2, name: "Mentor Dedicado", description: "Completou 10 horas de mentoria", date: "10 Nov 2024", icon: Clock },
    { id: 3, name: "Inspirador", description: "Recebeu 5 avaliações positivas", date: "5 Nov 2024", icon: Star }
  ];

  const nextLevel = userStats.level + 1;
  const pointsToNext = nextLevel * 1000 - userStats.points;
  const progressToNext = (userStats.points % 1000) / 10;

  // Funções para gerenciar áreas de atuação
  const handleAddAtuacaoArea = () => {
    if (selectedArea && selectedNivel) {
      // Verificar se a área já existe
      const areaExists = profileData.atuacaoAreas.some(item => item.area === selectedArea);
      
      if (!areaExists) {
        const newAtuacaoAreas = [
          ...profileData.atuacaoAreas,
          { area: selectedArea, nivel: selectedNivel }
        ];
        
        const updatedProfile = {
          ...profileData,
          atuacaoAreas: newAtuacaoAreas
        };
        
        setProfileData(updatedProfile);
        saveProfile(updatedProfile);
        
        // Limpar seleções
        setSelectedArea('');
        setSelectedNivel('');
      }
    }
  };

  const handleRemoveAtuacaoArea = (areaToRemove: string) => {
    const newAtuacaoAreas = profileData.atuacaoAreas.filter(item => item.area !== areaToRemove);
    
    const updatedProfile = {
      ...profileData,
      atuacaoAreas: newAtuacaoAreas
    };
    
    setProfileData(updatedProfile);
    saveProfile(updatedProfile);
  };

  // Calcular completude do perfil
  const getProfileCompleteness = () => {
    let completed = 0;
    let total = 9; // Aumentado para incluir áreas de atuação
    
    if (profileData.name) completed++;
    if (profileData.email) completed++;
    if (profileData.phone) completed++;
    if (profileData.location) completed++;
    if (profileData.bio) completed++;
    if (profileData.area) completed++;
    if (profileData.formacao) completed++;
    if (profileData.atuacaoAreas.length > 0) completed++;
    
    // Verificar se tem pelo menos um horário disponível (pelo menos 2 elementos = start e end)
    const hasAvailability = Object.values(profileData.availability).some(day => day.length >= 2);
    if (hasAvailability) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const profileCompleteness = getProfileCompleteness();

  // Mostrar loading enquanto carrega os dados
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header do Perfil */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-medium">{userStats.avatar}</span>
              </div>
              
              {/* Informações Básicas */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-semibold text-gray-900">{userStats.name}</h1>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                    {userStats.levelName}
                  </Badge>
                </div>
                <p className="text-gray-600 flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{userStats.email}</span>
                </p>
                {profileData.area && (
                  <p className="text-gray-600 flex items-center space-x-2">
                    <Building2 className="w-4 h-4" />
                    <span>{profileData.area}</span>
                  </p>
                )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-amber-600">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">{userStats.points.toLocaleString()} pontos</span>
                  </div>
                  <div className="flex items-center space-x-1 text-purple-600">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">Nível {userStats.level}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Editar */}
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancelar' : 'Editar Perfil'}</span>
            </Button>
          </div>

          {/* Progresso para o Próximo Nível */}
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso para Nível {nextLevel}</span>
                <span className="text-sm text-gray-600">{pointsToNext} pontos restantes</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
            </div>

            {/* Completude do Perfil */}
            {profileCompleteness < 100 && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-amber-800">Complete seu perfil</span>
                  <span className="text-sm text-amber-700">{profileCompleteness}% completo</span>
                </div>
                <Progress value={profileCompleteness} className="h-2 mb-2" />
                <p className="text-xs text-amber-700">
                  Complete informações pessoais, áreas de atuação e disponibilidade para ter melhor visibilidade!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs do Perfil */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="max-w-2xl">
            {/* Informações Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Informações Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Localização</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        placeholder="São Paulo, SP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="area">Área na Empresa</Label>
                      <Select value={profileData.area} onValueChange={(value) => setProfileData({...profileData, area: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione sua área" />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((area) => (
                            <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="formacao">Formação Acadêmica</Label>
                      <Input
                        id="formacao"
                        value={profileData.formacao}
                        onChange={(e) => setProfileData({...profileData, formacao: e.target.value})}
                        placeholder="Ex: Engenharia Civil - USP"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="voluntario"
                        checked={profileData.voluntarioOutrasIniciativas}
                        onCheckedChange={(checked) => setProfileData({...profileData, voluntarioOutrasIniciativas: checked as boolean})}
                      />
                      <Label htmlFor="voluntario">Voluntário em outras iniciativas</Label>
                    </div>
                    <div>
                      <Label htmlFor="bio">Sobre mim</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Conte um pouco sobre você, suas experiências e o que te motiva a ser mentor..."
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="flex items-center space-x-1"
                      >
                        <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                        <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancel} 
                        disabled={isSaving}
                        className="flex items-center space-x-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{profileData.phone || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{profileData.location || 'Não informado'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{profileData.area || 'Área não informada'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span>{profileData.formacao || 'Formação não informada'}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {profileData.voluntarioOutrasIniciativas 
                          ? 'Voluntário em outras iniciativas' 
                          : 'Não é voluntário em outras iniciativas'
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Mentor desde Nov 2024</span>
                    </div>
                    {profileData.bio && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Sobre mim</h4>
                        <p className="text-sm text-gray-700">{profileData.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Áreas de Atuação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <span>Áreas de Atuação</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Selecione as áreas onde você tem conhecimento ou interesse em atuar como voluntário
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formulário para adicionar nova área */}
                {areasAtuacao.filter(area => !profileData.atuacaoAreas.some(item => item.area === area)).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Área de Atuação</Label>
                      <Select value={selectedArea} onValueChange={setSelectedArea}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                        <SelectContent>
                          {areasAtuacao
                            .filter(area => !profileData.atuacaoAreas.some(item => item.area === area))
                            .map((area) => (
                              <SelectItem key={area} value={area}>{area}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  
                  <div>
                    <Label>Nível de Experiência</Label>
                    <Select value={selectedNivel} onValueChange={setSelectedNivel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        {niveisExperiencia.map((nivel) => (
                          <SelectItem key={nivel.value} value={nivel.value}>{nivel.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      onClick={handleAddAtuacaoArea}
                      disabled={!selectedArea || !selectedNivel}
                      className="w-full bg-gray-600 hover:bg-gray-700"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
                )}

                {/* Mensagem quando todas as áreas foram selecionadas */}
                {areasAtuacao.filter(area => !profileData.atuacaoAreas.some(item => item.area === area)).length === 0 && profileData.atuacaoAreas.length > 0 && (
                  <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      Parabéns! Você já configurou todas as áreas de atuação disponíveis.
                    </p>
                  </div>
                )}

                {/* Lista de áreas adicionadas */}
                {profileData.atuacaoAreas.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Suas Áreas de Atuação:</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileData.atuacaoAreas.map((item, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="px-3 py-1 cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors flex items-center space-x-2"
                          onClick={() => handleRemoveAtuacaoArea(item.area)}
                        >
                          <span>{item.area} - {niveisExperiencia.find(n => n.value === item.nivel)?.label}</span>
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-blue-600">
                      Clique em uma área para removê-la
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Disponibilidade */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                <span>Horários de Mentoria</span>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Defina sua disponibilidade semanal para mentoria. As alterações são salvas automaticamente.
              </p>
            </CardHeader>
            <CardContent>
              <div className="max-w-2xl space-y-6">
                <div className="space-y-4">
                  {daysOfWeek.map((day, index) => {
                    const dayKey = day.key as keyof typeof profileData.availability;
                    const isUnavailable = profileData.availability[dayKey].length === 0;
                    const dayLetters = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
                    const dayColors = [
                      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
                      'bg-orange-500', 'bg-indigo-500', 'bg-pink-500'
                    ];
                    
                    const handleAvailabilityChange = (newAvailability: string[]) => {
                      const updatedData = {
                        ...profileData,
                        availability: {
                          ...profileData.availability,
                          [dayKey]: newAvailability
                        }
                      };
                      
                      setProfileData(updatedData);
                      debouncedSaveAvailability(updatedData.availability);
                    };
                    
                    return (
                      <div key={day.key} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        {/* Círculo do dia */}
                        <div className={`w-10 h-10 ${dayColors[index]} rounded-full flex items-center justify-center text-white font-medium shrink-0`}>
                          {dayLetters[index]}
                        </div>
                        
                        {/* Nome do dia */}
                        <div className="w-24 shrink-0">
                          <span className="font-medium text-gray-900">{day.label.split('-')[0]}</span>
                        </div>
                        
                        {/* Conteúdo do dia */}
                        <div className="flex-1">
                          {isUnavailable ? (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Indisponível</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAvailabilityChange(['09:00', '17:00'])}
                              >
                                + Adicionar Horário
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {/* Primeiro período */}
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="time"
                                    value={profileData.availability[dayKey][0] || '09:00'}
                                    onChange={(e) => {
                                      const current = [...profileData.availability[dayKey]];
                                      current[0] = e.target.value;
                                      handleAvailabilityChange(current);
                                    }}
                                    className="w-24"
                                  />
                                  <span className="text-gray-500">-</span>
                                  <Input
                                    type="time"
                                    value={profileData.availability[dayKey][1] || '17:00'}
                                    onChange={(e) => {
                                      const current = [...profileData.availability[dayKey]];
                                      current[1] = e.target.value;
                                      handleAvailabilityChange(current);
                                    }}
                                    className="w-24"
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  {/* Botão de remover */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAvailabilityChange([])}
                                    className="text-gray-400 hover:text-red-500"
                                    title="Remover disponibilidade"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                  
                                  {/* Botão adicionar segundo período */}
                                  {profileData.availability[dayKey].length < 4 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const current = [...profileData.availability[dayKey]];
                                        handleAvailabilityChange([...current, '18:00', '19:00']);
                                      }}
                                      className="text-blue-500 hover:text-blue-600"
                                      title="Adicionar segundo período"
                                    >
                                      <CalendarDays className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              {/* Segundo período se existir */}
                              {profileData.availability[dayKey].length >= 4 && (
                                <div className="flex items-center space-x-4 pl-8">
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="time"
                                      value={profileData.availability[dayKey][2] || '18:00'}
                                      onChange={(e) => {
                                        const current = [...profileData.availability[dayKey]];
                                        current[2] = e.target.value;
                                        handleAvailabilityChange(current);
                                      }}
                                      className="w-24"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <Input
                                      type="time"
                                      value={profileData.availability[dayKey][3] || '19:00'}
                                      onChange={(e) => {
                                        const current = [...profileData.availability[dayKey]];
                                        current[3] = e.target.value;
                                        handleAvailabilityChange(current);
                                      }}
                                      className="w-24"
                                    />
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const current = profileData.availability[dayKey].slice(0, 2);
                                      handleAvailabilityChange(current);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                    title="Remover segundo período"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Indicador de salvamento automático */}
                <div className={`flex items-center space-x-2 text-sm rounded-lg p-3 ${
                  saveTimer ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-green-600 bg-green-50 border border-green-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    saveTimer ? 'bg-amber-500 animate-pulse' : 'bg-green-500'
                  }`}></div>
                  <span>
                    {saveTimer ? 'Salvando alterações...' : 'Alterações salvas automaticamente'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conquistas */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Conquistas Desbloqueadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={achievement.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500">Desbloqueado em {achievement.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            {/* Notificações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span>Notificações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Novos matches</h4>
                    <p className="text-sm text-gray-600">Receber notificações de novos mentorados</p>
                  </div>
                  <Button variant="outline" size="sm">Ativado</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Lembretes de mentoria</h4>
                    <p className="text-sm text-gray-600">Lembretes de sessões agendadas</p>
                  </div>
                  <Button variant="outline" size="sm">Ativado</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Conquistas</h4>
                    <p className="text-sm text-gray-600">Notificações de novas conquistas</p>
                  </div>
                  <Button variant="outline" size="sm">Ativado</Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Privacidade</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Perfil público</h4>
                    <p className="text-sm text-gray-600">Permitir que outros mentores vejam seu perfil</p>
                  </div>
                  <Button variant="outline" size="sm">Ativado</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Estatísticas visíveis</h4>
                    <p className="text-sm text-gray-600">Mostrar suas estatísticas no ranking</p>
                  </div>
                  <Button variant="outline" size="sm">Ativado</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}