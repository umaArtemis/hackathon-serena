import React, { useState } from 'react';
import { Trophy, Star, Gift, Users, Clock, Target, Award, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function Desafios() {
  const [activeTab, setActiveTab] = useState('disponíveis');

  const pontuacaoAtual = 1250;
  const proximoNivel = 1500;
  const progressoNivel = ((pontuacaoAtual - 1000) / (proximoNivel - 1000)) * 100;

  const desafiosDisponiveis = [
    {
      id: 1,
      titulo: 'Mentor do Mês',
      descricao: 'Complete 5 sessões de mentoria neste mês',
      pontos: 500,
      tipo: 'individual',
      dificuldade: 'médio',
      prazo: '15 dias',
      progresso: 60,
      meta: '3/5 sessões completas',
      icon: Trophy,
      cor: 'yellow'
    },
    {
      id: 2,
      titulo: 'Impacto Coletivo',
      descricao: 'Participe do evento de capacitação do Instituto',
      pontos: 300,
      tipo: 'evento',
      dificuldade: 'fácil',
      prazo: '7 dias',
      progresso: 0,
      meta: 'Inscrição aberta',
      icon: Users,
      cor: 'green'
    },
    {
      id: 3,
      titulo: 'Trilha Completa',
      descricao: 'Ajude um mentorado a concluir uma trilha inteira',
      pontos: 800,
      tipo: 'individual',
      dificuldade: 'difícil',
      prazo: '30 dias',
      progresso: 25,
      meta: '2/8 etapas concluídas',
      icon: Target,
      cor: 'blue'
    },
    {
      id: 4,
      titulo: 'Rede de Apoio',
      descricao: 'Conecte 3 mentorados com oportunidades de estágio',
      pontos: 400,
      tipo: 'networking',
      dificuldade: 'médio',
      prazo: '20 dias',
      progresso: 33,
      meta: '1/3 conexões feitas',
      icon: Users,
      cor: 'purple'
    }
  ];

  const recompensas = [
    {
      id: 1,
      nome: 'Kit Instituto Janelas',
      descricao: 'Camiseta, caneca e adesivos personalizados',
      pontosNecessarios: 500,
      tipo: 'físico',
      disponivel: true,
      icon: Gift
    },
    {
      id: 2,
      nome: 'Doação em seu nome',
      descricao: 'R$ 100 doados para o Instituto em seu nome',
      pontosNecessarios: 800,
      tipo: 'doação',
      disponivel: true,
      icon: Star
    },
    {
      id: 3,
      nome: 'Mentoria Premium',
      descricao: 'Sessão de coaching com especialista em carreira',
      pontosNecessarios: 1200,
      tipo: 'experiência',
      disponivel: true,
      icon: Award
    },
    {
      id: 4,
      nome: 'Visita ao Instituto',
      descricao: 'Tour guiado + almoço com equipe e mentorados',
      pontosNecessarios: 1000,
      tipo: 'experiência',
      disponivel: false,
      icon: Users
    }
  ];

  const historicoPontos = [
    { acao: 'Sessão de mentoria com Carlos', pontos: 50, data: '15/08/2024' },
    { acao: 'Desafio "Primeira Conexão" concluído', pontos: 100, data: '12/08/2024' },
    { acao: 'Participação no evento de networking', pontos: 150, data: '08/08/2024' },
    { acao: 'Trilha "Desenvolvimento Profissional" concluída', pontos: 300, data: '05/08/2024' }
  ];

  const getDificuldadeColor = (dificuldade) => {
    switch (dificuldade) {
      case 'fácil': return 'bg-green-100 text-green-800';
      case 'médio': return 'bg-yellow-100 text-yellow-800';
      case 'difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconColor = (cor) => {
    switch (cor) {
      case 'yellow': return 'text-yellow-600';
      case 'green': return 'text-green-600';
      case 'blue': return 'text-blue-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com pontuação */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Sistema de Recompensas</h1>
            <p className="opacity-90">Continue fazendo a diferença e acumule pontos!</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-6 h-6" />
              <span className="text-3xl font-bold">{pontuacaoAtual.toLocaleString()}</span>
            </div>
            <p className="text-sm opacity-90">Mentor Ouro</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso para próximo nível</span>
            <span>{proximoNivel - pontuacaoAtual} pontos restantes</span>
          </div>
          <Progress value={progressoNivel} className="h-2 bg-white/20" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="disponíveis">Desafios Disponíveis</TabsTrigger>
          <TabsTrigger value="recompensas">Recompensas</TabsTrigger>
          <TabsTrigger value="histórico">Histórico</TabsTrigger>
        </TabsList>

        {/* Desafios Disponíveis */}
        <TabsContent value="disponíveis" className="space-y-4">
          <div className="grid gap-4">
            {desafiosDisponiveis.map((desafio) => {
              const Icon = desafio.icon;
              return (
                <Card key={desafio.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-3 rounded-lg bg-${desafio.cor}-100`}>
                          <Icon className={`w-6 h-6 ${getIconColor(desafio.cor)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{desafio.titulo}</h3>
                            <Badge className={getDificuldadeColor(desafio.dificuldade)}>
                              {desafio.dificuldade}
                            </Badge>
                            <Badge variant="outline">{desafio.tipo}</Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{desafio.descricao}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {desafio.prazo}
                            </div>
                            <div className="flex items-center">
                              <Zap className="w-4 h-4 mr-1" />
                              +{desafio.pontos} pontos
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{desafio.meta}</span>
                              <span className="font-medium">{desafio.progresso}%</span>
                            </div>
                            <Progress value={desafio.progresso} className="h-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {desafio.progresso === 0 ? (
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            Participar
                          </Button>
                        ) : (
                          <Button variant="outline">
                            Continuar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Recompensas */}
        <TabsContent value="recompensas" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {recompensas.map((recompensa) => {
              const Icon = recompensa.icon;
              const podeResgatar = pontuacaoAtual >= recompensa.pontosNecessarios && recompensa.disponivel;
              
              return (
                <Card key={recompensa.id} className={`${podeResgatar ? 'border-green-200 bg-green-50/30' : 'opacity-75'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${podeResgatar ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-6 h-6 ${podeResgatar ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{recompensa.nome}</h3>
                        <p className="text-gray-600 text-sm mb-3">{recompensa.descricao}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">{recompensa.pontosNecessarios} pontos</span>
                          </div>
                          
                          {podeResgatar ? (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Resgatar
                            </Button>
                          ) : !recompensa.disponivel ? (
                            <Badge variant="secondary">Indisponível</Badge>
                          ) : (
                            <Badge variant="outline">
                              Faltam {recompensa.pontosNecessarios - pontuacaoAtual} pts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="histórico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pontuação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historicoPontos.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.acao}</p>
                      <p className="text-sm text-gray-500">{item.data}</p>
                    </div>
                    <div className="flex items-center text-green-600 font-semibold">
                      +{item.pontos}
                      <Star className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}