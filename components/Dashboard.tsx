import React from 'react';
import { Star, TrendingUp, Award, Users, Heart, Clock, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Progress } from './ui/progress';


interface DashboardProps {
  onNavigateToProfile: () => void;
}

export default function Dashboard({ onNavigateToProfile }: DashboardProps) {
  const mentor = {
    name: 'Ana Silva',
    points: 1250,
    level: 'Mentor Ouro'
  };



  const trilhasApoiadas = [
    { nome: 'Desenvolvimento Profissional', participantes: 3 },
    { nome: 'Empreendedorismo', participantes: 1 },
    { nome: 'Tecnologia', participantes: 2 }
  ];

  const impactoGerado = {
    jovensImpactados: { valor: 6, meta: 10, progresso: 60 },
    horasDoadas: { valor: 45, meta: 60, progresso: 75 },
    trilhasConcluidas: { valor: 3, meta: 5, progresso: 60 }
  };

  return (
    <div className="space-y-6">
      {/* Header com saudação */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-gray-900">Bem-vinda, {mentor.name}! 👋</h1>
          <p className="text-gray-600 mt-1">Continue fazendo a diferença na vida dos jovens</p>
        </div>
        <div className="flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-sm">
          <Star className="w-5 h-5 mr-2" />
          <span>{mentor.points} pontos</span>
          <span className="ml-2 opacity-95">({mentor.level})</span>
        </div>
      </div>

      {/* Card de Call to Action para começar mentoria */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center justify-between">
            Pronto para fazer a diferença?
            <Heart className="w-5 h-5 text-blue-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              Complete seu perfil para começar a impactar a vida de jovens através da mentoria
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={onNavigateToProfile}
            >
              Completar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid com outras seções */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Trilhas que você apoia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Trilhas que você apoia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trilhasApoiadas.map((trilha, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-900">{trilha.nome}</p>
                    <p className="text-gray-600">{trilha.participantes} participante(s)</p>
                  </div>
                  <Button size="sm" variant="ghost">Ver</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impacto gerado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Impacto gerado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {/* Jovens impactados */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-green-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - impactoGerado.jovensImpactados.progresso / 100)}`}
                      className="text-green-500 transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Heart className="w-4 h-4 text-green-600 mb-0.5" />
                    <span className="text-green-600">{impactoGerado.jovensImpactados.valor}</span>
                  </div>
                </div>
                <p className="text-gray-900">Jovens impactados</p>
                <p className="text-gray-600">Meta: {impactoGerado.jovensImpactados.meta}</p>
              </div>

              {/* Horas doadas */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-blue-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - impactoGerado.horasDoadas.progresso / 100)}`}
                      className="text-blue-500 transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600 mb-0.5" />
                    <span className="text-blue-600">{impactoGerado.horasDoadas.valor}h</span>
                  </div>
                </div>
                <p className="text-gray-900">Horas doadas</p>
                <p className="text-gray-600">Meta: {impactoGerado.horasDoadas.meta}h</p>
              </div>

              {/* Trilhas concluídas */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-purple-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - impactoGerado.trilhasConcluidas.progresso / 100)}`}
                      className="text-purple-500 transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600 mb-0.5" />
                    <span className="text-purple-600">{impactoGerado.trilhasConcluidas.valor}</span>
                  </div>
                </div>
                <p className="text-gray-900">Trilhas concluídas</p>
                <p className="text-gray-600">Meta: {impactoGerado.trilhasConcluidas.meta}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desafios disponíveis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Desafios disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-gray-900">Mentor do Mês</p>
                <p className="text-gray-600 mb-2">Complete 5 mentorias esta semana</p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600">+500 pontos</span>
                  <Progress value={60} className="w-16 h-1" />
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-gray-900">Impacto Coletivo</p>
                <p className="text-gray-600 mb-2">Participe do evento do Instituto</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600">+300 pontos</span>
                  <Button size="sm" variant="ghost" className="h-6">Participar</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}