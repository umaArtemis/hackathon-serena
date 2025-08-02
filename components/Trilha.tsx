import React, { useState } from 'react';
import { CheckCircle, Circle, Star, MessageSquare, Calendar, User, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function Trilha() {
  const [activeEtapa, setActiveEtapa] = useState(null);
  const [feedbacks, setFeedbacks] = useState({});

  const mentorado = {
    name: 'Mariana Santos',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    trilha: 'Marketing e Comunicação',
    nivel: 'Nível 2',
    progresso: 60
  };

  const etapas = [
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
    },
    {
      id: 4,
      titulo: 'Desenvolver portfólio digital',
      descricao: 'Criar um portfólio online showcasing projetos e habilidades em marketing',
      status: 'pendente',
      apoioMentor: false,
      atividades: [
        'Seleção de melhores projetos',
        'Criação de case studies',
        'Desenvolvimento do site/perfil',
        'Otimização para recrutadores'
      ],
      feedbackMentorado: null,
      proximaAcao: null
    },
    {
      id: 5,
      titulo: 'Primeiras aplicações',
      descricao: 'Aplicar para vagas estratégicas e acompanhar o processo seletivo',
      status: 'pendente',
      apoioMentor: false,
      atividades: [
        'Seleção de vagas alinhadas',
        'Personalização de aplicações',
        'Follow-up profissional',
        'Preparação para próximas etapas'
      ],
      feedbackMentorado: null,
      proximaAcao: null
    }
  ];

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

  const etapasConcluidas = etapas.filter(e => e.status === 'concluida').length;
  const progresso = (etapasConcluidas / etapas.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header da trilha */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <ImageWithFallback
            src={mentorado.photo}
            alt={mentorado.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{mentorado.name}</h1>
            <p className="text-gray-600">{mentorado.trilha} • {mentorado.nivel}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Progresso geral</p>
          <div className="flex items-center space-x-2">
            <Progress value={progresso} className="w-32 h-2" />
            <span className="text-sm font-medium text-gray-900">{Math.round(progresso)}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{etapasConcluidas} de {etapas.length} etapas</p>
        </div>
      </div>

      {/* Timeline das etapas */}
      <div className="space-y-4">
        {etapas.map((etapa, index) => (
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
        ))}
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
  );
}