import React, { useState } from 'react';
import { Heart, MessageCircle, Calendar, BookOpen, Clock, MapPin, Sparkles, CheckCircle, Circle, Star, MessageSquare, User, ArrowLeft, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function Match() {
  const [selectedMentorado, setSelectedMentorado] = useState(null);
  const [activeEtapa, setActiveEtapa] = useState(null);
  const [showNewMatch, setShowNewMatch] = useState(false);

  const mentorados = [
    {
      id: 1,
      name: 'Mariana Santos',
      age: 18,
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      location: 'São Paulo, SP',
      objetivo: 'Desenvolver habilidades em marketing digital',
      trilha: 'Marketing e Comunicação',
      nivel: 'Nível 2',
      progresso: 60,
      matchScore: 95,
      interesses: ['Redes Sociais', 'Design Gráfico', 'Empreendedorismo'],
      dificuldades: ['Autoconfiança', 'Networking', 'Experiência prática'],
      disponibilidade: 'Segundas e quartas, 18h-20h',
      bio: 'Estudante do último ano do ensino médio, sonha em trabalhar com marketing digital e ter seu próprio negócio.',
      status: 'ativo'
    },
    {
      id: 2,
      name: 'Carlos Silva',
      age: 19,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      location: 'Rio de Janeiro, RJ',
      objetivo: 'Ingressar na área de tecnologia',
      trilha: 'Desenvolvimento Web',
      nivel: 'Nível 1',
      progresso: 30,
      matchScore: 88,
      interesses: ['Programação', 'Jogos', 'Tecnologia'],
      dificuldades: ['Matemática', 'Inglês técnico', 'Foco nos estudos'],
      disponibilidade: 'Terças e quintas, 19h-21h',
      bio: 'Apaixonado por tecnologia, quer se tornar desenvolvedor full-stack e trabalhar em uma startup.',
      status: 'ativo'
    },
    {
      id: 3,
      name: 'Ana Costa',
      age: 17,
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      location: 'Belo Horizonte, MG',
      objetivo: 'Preparação para vestibular e carreira em saúde',
      trilha: 'Ciências da Saúde',
      nivel: 'Nível 3',
      progresso: 75,
      matchScore: 92,
      interesses: ['Biologia', 'Medicina', 'Pesquisa científica'],
      dificuldades: ['Pressão psicológica', 'Organização de estudos', 'Ansiedade'],
      disponibilidade: 'Sábados, 14h-16h',
      bio: 'Determinada a seguir carreira médica, busca orientação para lidar com pressão dos estudos.',
      status: 'ativo'
    }
  ];

  const novoMatch = {
    name: 'Pedro Oliveira',
    age: 18,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    location: 'Salvador, BA',
    objetivo: 'Desenvolver habilidades de liderança e empreendedorismo',
    trilha: 'Liderança e Gestão',
    interesses: ['Empreendedorismo', 'Liderança', 'Sustentabilidade'],
    dificuldades: ['Comunicação pública', 'Gestão de tempo', 'Networking'],
    disponibilidade: 'Quartas e sextas, 17h-19h',
    bio: 'Jovem empreendedor social, quer desenvolver projeto de impacto ambiental na sua comunidade.',
    matchScore: 89
  };

  const getEtapasForMentorado = (mentoradoId) => {
    // Dados simulados de trilha para cada mentorado
    const trilhasData = {
      1: [
        {
          id: 1,
          titulo: 'Revisar currículo',
          descricao: 'Analisar e aprimorar o currículo atual, destacando habilidades e experiências relevantes',
          status: 'concluida',
          apoioMentor: true,
          atividades: [
            'Análise do currículo atual',
            'Identificação de pontos fortes',
            'Sugestões de melhorias',
            'Formatação profissional'
          ],
          feedbackMentorado: 'Foi muito útil! Aprendi a destacar melhor minhas experiências de projetos pessoais e voluntariado.',
          proximaAcao: null
        },
        {
          id: 2,
          titulo: 'Simular entrevista',
          descricao: 'Praticar situações de entrevista de emprego e desenvolver técnicas de comunicação',
          status: 'em_andamento',
          apoioMentor: true,
          atividades: [
            'Preparação de perguntas comuns',
            'Simulação de entrevista presencial',
            'Feedback sobre postura e comunicação',
            'Dicas para controlar nervosismo'
          ],
          feedbackMentorado: null,
          proximaAcao: 'Agendar simulação de entrevista - 18/08 às 19h'
        },
        {
          id: 3,
          titulo: 'Explorar mercado de trabalho',
          descricao: 'Pesquisar oportunidades, empresas e tendências na área de marketing digital',
          status: 'pendente',
          apoioMentor: false,
          atividades: [
            'Mapeamento de empresas na região',
            'Análise de vagas disponíveis',
            'Identificação de competências em alta',
            'Networking estratégico'
          ],
          feedbackMentorado: null,
          proximaAcao: null
        }
      ],
      2: [
        {
          id: 1,
          titulo: 'Fundamentos de programação',
          descricao: 'Aprender conceitos básicos de lógica de programação e sintaxe',
          status: 'concluida',
          apoioMentor: true,
          atividades: [
            'Conceitos de variáveis e tipos',
            'Estruturas condicionais',
            'Loops e repetições',
            'Primeiro projeto prático'
          ],
          feedbackMentorado: 'Consegui entender melhor a lógica! Os exemplos práticos ajudaram muito.',
          proximaAcao: null
        },
        {
          id: 2,
          titulo: 'HTML e CSS básico',
          descricao: 'Criar suas primeiras páginas web com estrutura e estilo',
          status: 'em_andamento',
          apoioMentor: false,
          atividades: [
            'Estrutura HTML semântica',
            'Estilização com CSS',
            'Layout responsivo básico',
            'Projeto: página pessoal'
          ],
          feedbackMentorado: null,
          proximaAcao: 'Finalizar projeto da página pessoal até sexta-feira'
        }
      ],
      3: [
        {
          id: 1,
          titulo: 'Organização de estudos',
          descricao: 'Criar cronograma eficiente e técnicas de memorização',
          status: 'concluida',
          apoioMentor: true,
          atividades: [
            'Análise do tempo disponível',
            'Criação de cronograma personalizado',
            'Técnicas de memorização',
            'Controle de ansiedade'
          ],
          feedbackMentorado: 'O cronograma está funcionando muito bem! Me sinto mais organizada e confiante.',
          proximaAcao: null
        },
        {
          id: 2,
          titulo: 'Revisão intensiva - Biologia',
          descricao: 'Foco nas disciplinas mais importantes para o vestibular',
          status: 'concluida',
          apoioMentor: false,
          atividades: [
            'Revisão de citologia',
            'Genética e hereditariedade',
            'Ecologia e meio ambiente',
            'Simulados práticos'
          ],
          feedbackMentorado: 'Melhorou muito meu desempenho nos simulados!',
          proximaAcao: null
        },
        {
          id: 3,
          titulo: 'Preparação psicológica',
          descricao: 'Desenvolver estratégias para lidar com pressão e ansiedade',
          status: 'em_andamento',
          apoioMentor: true,
          atividades: [
            'Técnicas de respiração',
            'Mindfulness e meditação',
            'Simulação de dia de prova',
            'Estratégias de autoconfiança'
          ],
          feedbackMentorado: null,
          proximaAcao: 'Sessão de técnicas de relaxamento - Sábado 14h'
        }
      ]
    };
    return trilhasData[mentoradoId] || [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'concluida': return 'text-green-600';
      case 'em_andamento': return 'text-blue-600';
      case 'pendente': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'concluida': return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'em_andamento': return <Circle className="w-6 h-6 text-blue-600 fill-blue-100" />;
      case 'pendente': return <Circle className="w-6 h-6 text-gray-400" />;
      default: return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  // Renderização do novo match
  if (showNewMatch) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header do Match */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 mr-2" />
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              É um Match!
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-500 ml-2" />
          </div>
          <p className="text-gray-600">Você e {novoMatch.name} têm {novoMatch.matchScore}% de compatibilidade</p>
        </div>

        {/* Card do Match */}
        <Card className="overflow-hidden border-2 border-pink-200 shadow-xl">
          <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
            {/* Foto e informações básicas */}
            <div className="flex items-start space-x-6 mb-6">
              <div className="relative">
                <ImageWithFallback
                  src={novoMatch.photo}
                  alt={novoMatch.name}
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  {novoMatch.matchScore}% match
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">{novoMatch.name}</h2>
                <p className="text-gray-600 mb-2">{novoMatch.age} anos</p>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{novoMatch.location}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{novoMatch.bio}</p>
              </div>
            </div>

            {/* Objetivo da trilha */}
            <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Objetivo da trilha
              </h3>
              <p className="text-gray-700">{novoMatch.objetivo}</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">{novoMatch.trilha}</Badge>
            </div>

            {/* Interesses */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Interesses</h3>
              <div className="flex flex-wrap gap-2">
                {novoMatch.interesses.map((interesse, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                    {interesse}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dificuldades */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">🎯 Áreas de desenvolvimento</h3>
              <div className="flex flex-wrap gap-2">
                {novoMatch.dificuldades.map((dificuldade, index) => (
                  <Badge key={index} variant="outline" className="border-orange-200 text-orange-700">
                    {dificuldade}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="mb-8 p-4 bg-white rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Disponibilidade para encontros
              </h3>
              <p className="text-gray-700">{novoMatch.disponibilidade}</p>
            </div>

            {/* Botões de ação */}
            <div className="flex space-x-3 mb-6">
              <Button 
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                size="lg"
                onClick={() => {
                  // Aceitar match - adicionar aos mentorados ativos
                  setShowNewMatch(false);
                  setSelectedMentorado(null);
                }}
              >
                <Heart className="w-5 h-5 mr-2" />
                Aceitar mentoria
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                size="lg"
                onClick={() => setShowNewMatch(false)}
              >
                Agora não
              </Button>
            </div>

            {/* Mensagem motivacional */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <p className="text-sm text-gray-700 text-center">
                💛 <strong>Juntos, vocês podem transformar sonhos em realidade!</strong> Esta mentoria é o primeiro passo de uma jornada incrível de crescimento mútuo.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Layout principal com sidebar
  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar com lista de mentorados */}
      <div className="w-80 bg-white rounded-lg shadow-sm border p-6 h-fit">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Seus mentorados</h2>
            <p className="text-sm text-gray-600">{mentorados.length} ativos</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowNewMatch(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Heart className="w-4 h-4 mr-1" />
            Novo match
          </Button>
        </div>

        <div className="space-y-3">
          {mentorados.map((mentorado) => (
            <Card 
              key={mentorado.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedMentorado?.id === mentorado.id 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => setSelectedMentorado(mentorado)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <ImageWithFallback
                    src={mentorado.photo}
                    alt={mentorado.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{mentorado.name}</h3>
                    <p className="text-xs text-gray-600">{mentorado.trilha}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <Progress value={mentorado.progresso} className="flex-1 h-1" />
                      <span className="text-xs text-gray-500">{mentorado.progresso}%</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {mentorado.matchScore}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1">
        {selectedMentorado ? (
          <div className="space-y-6">
            {/* Header da trilha do mentorado selecionado */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMentorado(null)}
                  className="mr-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <ImageWithFallback
                  src={selectedMentorado.photo}
                  alt={selectedMentorado.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{selectedMentorado.name}</h1>
                  <p className="text-gray-600">{selectedMentorado.trilha} • {selectedMentorado.nivel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Progresso geral</p>
                <div className="flex items-center space-x-2">
                  <Progress value={selectedMentorado.progresso} className="w-32 h-2" />
                  <span className="text-sm font-medium text-gray-900">{selectedMentorado.progresso}%</span>
                </div>
                <div className="flex space-x-2 mt-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-1" />
                    Agendar
                  </Button>
                </div>
              </div>
            </div>

            {/* Timeline das etapas */}
            <div className="space-y-4">
              {getEtapasForMentorado(selectedMentorado.id).map((etapa, index) => {
                const etapas = getEtapasForMentorado(selectedMentorado.id);
                const etapasConcluidas = etapas.filter(e => e.status === 'concluida').length;
                
                return (
                  <Card key={etapa.id} className={`relative ${etapa.status === 'em_andamento' ? 'border-blue-200 shadow-md' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Timeline connector */}
                        <div className="flex flex-col items-center">
                          {getStatusIcon(etapa.status)}
                          {index < etapas.length - 1 && (
                            <div className={`w-0.5 h-16 mt-2 ${etapa.status === 'concluida' ? 'bg-green-200' : 'bg-gray-200'}`} />
                          )}
                        </div>

                        {/* Conteúdo da etapa */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className={`text-lg font-semibold ${getStatusColor(etapa.status)}`}>
                                {etapa.titulo}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">{etapa.descricao}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {etapa.apoioMentor && (
                                <Badge className="bg-purple-100 text-purple-800">
                                  <User className="w-3 h-3 mr-1" />
                                  Apoio mentor
                                </Badge>
                              )}
                              {etapa.status === 'em_andamento' && (
                                <Badge className="bg-blue-100 text-blue-800">Em andamento</Badge>
                              )}
                              {etapa.status === 'concluida' && (
                                <Badge className="bg-green-100 text-green-800">Concluída</Badge>
                              )}
                            </div>
                          </div>

                          {/* Atividades */}
                          <div className="mb-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveEtapa(activeEtapa === etapa.id ? null : etapa.id)}
                              className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                            >
                              <BookOpen className="w-4 h-4 mr-1" />
                              {activeEtapa === etapa.id ? 'Ocultar' : 'Ver'} atividades
                            </Button>
                            
                            {activeEtapa === etapa.id && (
                              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                                <ul className="space-y-2">
                                  {etapa.atividades.map((atividade, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-700">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0" />
                                      {atividade}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Próxima ação */}
                          {etapa.proximaAcao && (
                            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center text-blue-800">
                                <Calendar className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Próxima ação:</span>
                              </div>
                              <p className="text-sm text-blue-700 mt-1">{etapa.proximaAcao}</p>
                            </div>
                          )}

                          {/* Feedback do mentorado */}
                          {etapa.status === 'concluida' && etapa.feedbackMentorado && (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center text-green-800 mb-2">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Feedback do mentorado:</span>
                              </div>
                              <p className="text-sm text-green-700">{etapa.feedbackMentorado}</p>
                            </div>
                          )}

                          {/* Ações do mentor */}
                          <div className="flex items-center space-x-3 mt-4">
                            {etapa.status === 'em_andamento' && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Marcar como apoiada
                                </Button>
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Adicionar nota
                                </Button>
                              </>
                            )}
                            {etapa.status === 'pendente' && (
                              <Button size="sm" variant="outline">
                                <Star className="w-4 h-4 mr-1" />
                                Oferecer apoio
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Área de feedback geral */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  Feedback geral da trilha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Compartilhe suas observações sobre o progresso geral, pontos de atenção ou sugestões para próximas etapas..."
                  className="mb-4"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Enviar feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Estado inicial sem mentorado selecionado */
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Selecione um mentorado</h2>
              <p className="text-gray-600 mb-6">Escolha um mentorado da lista ao lado para acompanhar sua trilha de desenvolvimento</p>
              <Button 
                onClick={() => setShowNewMatch(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                Encontrar novo match
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}