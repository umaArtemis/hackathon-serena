import React from 'react';
import { Heart, Users, MapPin, BookOpen, Award, ArrowRight, Phone, Mail, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function Instituto() {
  const estatisticas = [
    { numero: '2.500+', label: 'Jovens atendidos', icon: Users },
    { numero: '150+', label: 'Mentores ativos', icon: Heart },
    { numero: '12', label: 'Estados impactados', icon: MapPin },
    { numero: '85%', label: 'Taxa de sucesso', icon: Award }
  ];

  const areasAtuacao = [
    {
      titulo: 'Desenvolvimento Profissional',
      descricao: 'Preparação para o mercado de trabalho com foco em habilidades técnicas e comportamentais',
      beneficiados: 680,
      cor: 'blue'
    },
    {
      titulo: 'Empreendedorismo',
      descricao: 'Capacitação para criação e gestão de negócios próprios',
      beneficiados: 420,
      cor: 'green'
    },
    {
      titulo: 'Tecnologia e Inovação',
      descricao: 'Formação em tecnologia, programação e habilidades digitais',
      beneficiados: 350,
      cor: 'purple'
    },
    {
      titulo: 'Educação Financeira',
      descricao: 'Orientação sobre gestão financeira pessoal e planejamento',
      beneficiados: 520,
      cor: 'yellow'
    }
  ];

  const depoimentos = [
    {
      nome: 'João Silva',
      idade: 20,
      conquista: 'Conseguiu primeiro emprego em TI',
      depoimento: 'O programa mudou minha vida! Hoje trabalho em uma empresa de tecnologia e estou cursando faculdade.',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      nome: 'Maria Santos',
      idade: 19,
      conquista: 'Abriu seu próprio negócio',
      depoimento: 'Com a mentoria, aprendi a transformar minha paixão por culinária em um negócio próspero.',
      foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      nome: 'Pedro Costa',
      idade: 21,
      conquista: 'Bolsa integral na universidade',
      depoimento: 'O apoio que recebi foi fundamental para conseguir minha bolsa de estudos e realizar o sonho da faculdade.',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl p-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Instituto Janelas para o Mundo</h1>
          <p className="text-xl text-blue-100 mb-6 leading-relaxed">
            Conectamos jovens em situação de vulnerabilidade social com oportunidades de desenvolvimento pessoal e profissional, 
            através de mentoria, capacitação e apoio integral.
          </p>
          <div className="flex space-x-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Heart className="w-5 h-5 mr-2" />
              Saiba como ajudar
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Saiba mais
            </Button>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {estatisticas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.numero}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Missão e Visão */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Nossa Missão</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Promover o desenvolvimento integral de jovens em situação de vulnerabilidade social, 
              oferecendo oportunidades de crescimento pessoal e profissional através de programas 
              de mentoria, capacitação e inserção no mercado de trabalho.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-blue-500 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Nossa Visão</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Ser referência nacional na transformação social através da educação e mentoria, 
              criando um futuro onde todos os jovens tenham acesso às oportunidades necessárias 
              para desenvolver seu potencial pleno.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Áreas de Atuação */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Áreas de Atuação</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {areasAtuacao.map((area, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">{area.titulo}</h3>
                  <Badge className={`bg-${area.cor}-100 text-${area.cor}-800`}>
                    {area.beneficiados} jovens
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{area.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Depoimentos */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Histórias de Transformação</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {depoimentos.map((depoimento, index) => (
            <Card key={index} className="bg-gradient-to-br from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <ImageWithFallback
                    src={depoimento.foto}
                    alt={depoimento.nome}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{depoimento.nome}</h4>
                    <p className="text-sm text-gray-600">{depoimento.idade} anos</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 mb-3">
                  {depoimento.conquista}
                </Badge>
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  "{depoimento.depoimento}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Regiões Impactadas */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-6 h-6 text-blue-600 mr-3" />
            Regiões Impactadas
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sudeste</h4>
              <p className="text-sm text-gray-600">São Paulo, Rio de Janeiro, Minas Gerais, Espírito Santo</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Nordeste</h4>
              <p className="text-sm text-gray-600">Bahia, Pernambuco, Ceará, Paraíba</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sul</h4>
              <p className="text-sm text-gray-600">Rio Grande do Sul, Santa Catarina, Paraná</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Faça parte dessa transformação
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Como colaborador da Serena, você tem a oportunidade única de impactar diretamente 
            a vida de jovens brasileiros. Sua experiência e conhecimento podem ser a chave 
            para abrir as janelas de oportunidade que eles precisam.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Heart className="w-5 h-5 mr-2" />
              Como ajudar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              <Users className="w-5 h-5 mr-2" />
              Participar como colaborador
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center">
          <Phone className="w-8 h-8 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">Telefone</h4>
          <p className="text-gray-600 text-sm">(11) 1234-5678</p>
        </div>
        <div className="flex flex-col items-center">
          <Mail className="w-8 h-8 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">E-mail</h4>
          <p className="text-gray-600 text-sm">contato@janelasparaomundo.org.br</p>
        </div>
        <div className="flex flex-col items-center">
          <Globe className="w-8 h-8 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">Website</h4>
          <p className="text-gray-600 text-sm">www.janelasparaomundo.org.br</p>
        </div>
      </div>
    </div>
  );
}