import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Clock, Calendar, Users, CheckCircle, AlertCircle, Filter, Search, Plus, ArrowRight, Play, PauseCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from "sonner@2.0.3";

interface Atividade {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'plano-mentoria' | 'atividade-aberta';
  status: 'em-andamento' | 'concluida' | 'agendada' | 'disponivel';
  categoria: string;
  dataInicio?: string;
  dataFim?: string;
  participantes?: number;
  maxParticipantes?: number;
  minParticipantes?: number;
  inscricoesAbertas?: boolean;
  responsavel?: string;
  tags: string[];
  participantesDetalhes?: any[];
}

interface NovaAtividadeForm {
  titulo: string;
  descricao: string;
  tipo: 'plano-mentoria' | 'atividade-aberta';
  categoria: string;
  dataInicio: string;
  dataFim: string;
  maxParticipantes: number;
  minParticipantes: number;
  tags: string;
}

export default function Atividades() {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [abaSelecionada, setAbaSelecionada] = useState('todas');
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Estado do formulário de nova atividade
  const [novaAtividade, setNovaAtividade] = useState<NovaAtividadeForm>({
    titulo: '',
    descricao: '',
    tipo: 'atividade-aberta',
    categoria: 'Geral',
    dataInicio: '',
    dataFim: '',
    maxParticipantes: 10,
    minParticipantes: 1,
    tags: ''
  });

  // Carregar atividades ao montar o componente
  useEffect(() => {
    carregarAtividades();
  }, []);

  const carregarAtividades = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Token de acesso não encontrado');
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/activities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Atividades carregadas:', data.activities);
      setAtividades(data.activities || []);
      
    } catch (error) {
      console.log('Erro ao carregar atividades:', error);
      toast.error('Erro ao carregar atividades');
      setAtividades([]);
    } finally {
      setIsLoading(false);
    }
  };

  const criarAtividade = async () => {
    try {
      setIsCreatingActivity(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Token de acesso não encontrado');
      }

      // Preparar dados da atividade
      const activityData = {
        titulo: novaAtividade.titulo,
        descricao: novaAtividade.descricao,
        tipo: novaAtividade.tipo,
        categoria: novaAtividade.categoria,
        dataInicio: novaAtividade.dataInicio || null,
        dataFim: novaAtividade.dataFim || null,
        maxParticipantes: novaAtividade.maxParticipantes,
        minParticipantes: novaAtividade.minParticipantes,
        tags: novaAtividade.tags ? novaAtividade.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        status: 'disponivel'
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/activities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activityData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Atividade criada:', data);
      
      toast.success('Atividade criada com sucesso!');
      setShowCreateDialog(false);
      
      // Reset form
      setNovaAtividade({
        titulo: '',
        descricao: '',
        tipo: 'atividade-aberta',
        categoria: 'Geral',
        dataInicio: '',
        dataFim: '',
        maxParticipantes: 10,
        minParticipantes: 1,
        tags: ''
      });
      
      // Recarregar atividades
      await carregarAtividades();
      
    } catch (error) {
      console.log('Erro ao criar atividade:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar atividade');
    } finally {
      setIsCreatingActivity(false);
    }
  };

  const inscreverNaAtividade = async (atividadeId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Token de acesso não encontrado');
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e7ec0f69/activities/${atividadeId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      toast.success('Inscrição realizada com sucesso!');
      
      // Recarregar atividades para atualizar contadores
      await carregarAtividades();
      
    } catch (error) {
      console.log('Erro ao se inscrever na atividade:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao se inscrever');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em-andamento': return <Play className="w-4 h-4 text-blue-600" />;
      case 'concluida': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'agendada': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'disponivel': return <AlertCircle className="w-4 h-4 text-purple-600" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'em-andamento': return 'Em andamento';
      case 'concluida': return 'Concluída';
      case 'agendada': return 'Agendada';
      case 'disponivel': return 'Disponível';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em-andamento': return 'bg-blue-100 text-blue-800';
      case 'concluida': return 'bg-green-100 text-green-800';
      case 'agendada': return 'bg-yellow-100 text-yellow-800';
      case 'disponivel': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filtrarAtividades = () => {
    return atividades.filter(atividade => {
      const matchTipo = filtroTipo === 'todos' || atividade.tipo === filtroTipo;
      const matchStatus = filtroStatus === 'todos' || atividade.status === filtroStatus;
      const matchBusca = busca === '' || 
        atividade.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        atividade.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        atividade.categoria.toLowerCase().includes(busca.toLowerCase());
      
      const matchAba = abaSelecionada === 'todas' || 
        (abaSelecionada === 'planos' && atividade.tipo === 'plano-mentoria') ||
        (abaSelecionada === 'abertas' && atividade.tipo === 'atividade-aberta');

      return matchTipo && matchStatus && matchBusca && matchAba;
    });
  };

  const atividadesFiltradas = filtrarAtividades();

  const renderAtividadeCard = (atividade: Atividade) => (
    <Card key={atividade.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${atividade.tipo === 'plano-mentoria' ? 'bg-blue-100' : 'bg-green-100'}`}>
              {atividade.tipo === 'plano-mentoria' ? 
                <BookOpen className="w-5 h-5 text-blue-600" /> : 
                <FileText className="w-5 h-5 text-green-600" />
              }
            </div>
            <div>
              <CardTitle className="text-lg">{atividade.titulo}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{atividade.categoria}</p>
            </div>
          </div>
          <Badge className={getStatusColor(atividade.status)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(atividade.status)}
              <span>{getStatusText(atividade.status)}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{atividade.descricao}</p>
        
        {/* Informações para atividades abertas */}
        {atividade.tipo === 'atividade-aberta' && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {atividade.participantes || 0}/{atividade.maxParticipantes || 0} participantes
                  </span>
                </div>
                {atividade.inscricoesAbertas && (
                  <Badge className="bg-green-100 text-green-800">
                    Inscrições abertas
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Informações gerais */}
        {(atividade.dataInicio || atividade.responsavel) && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            {atividade.dataInicio && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(atividade.dataInicio).toLocaleDateString('pt-BR')} 
                  {atividade.dataFim && ` - ${new Date(atividade.dataFim).toLocaleDateString('pt-BR')}`}
                </span>
              </div>
            )}
            {atividade.responsavel && (
              <span>Responsável: {atividade.responsavel}</span>
            )}
          </div>
        )}

        {/* Tags */}
        {atividade.tags && atividade.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {atividade.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Ações */}
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1" variant="outline">
            <ArrowRight className="w-4 h-4 mr-1" />
            Ver detalhes
          </Button>
          {atividade.tipo === 'atividade-aberta' && 
           atividade.inscricoesAbertas && 
           atividade.status === 'disponivel' && (
            <Button 
              size="sm" 
              onClick={() => inscreverNaAtividade(atividade.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Inscrever-se
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Carregando atividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-gray-900">Atividades</h1>
          <p className="text-gray-600 mt-1">Gerencie planos de mentoria e atividades abertas</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova atividade
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Atividade</DialogTitle>
              <DialogDescription>
                Preencha as informações da nova atividade.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={novaAtividade.titulo}
                  onChange={(e) => setNovaAtividade({...novaAtividade, titulo: e.target.value})}
                  placeholder="Digite o título da atividade"
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novaAtividade.descricao}
                  onChange={(e) => setNovaAtividade({...novaAtividade, descricao: e.target.value})}
                  placeholder="Descreva a atividade"
                  className="h-24"
                />
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select 
                  value={novaAtividade.tipo} 
                  onValueChange={(value) => setNovaAtividade({...novaAtividade, tipo: value as 'plano-mentoria' | 'atividade-aberta'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="atividade-aberta">Atividade Aberta</SelectItem>
                    <SelectItem value="plano-mentoria">Plano de Mentoria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={novaAtividade.categoria}
                  onChange={(e) => setNovaAtividade({...novaAtividade, categoria: e.target.value})}
                  placeholder="Ex: Desenvolvimento Profissional"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataInicio">Data Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={novaAtividade.dataInicio}
                    onChange={(e) => setNovaAtividade({...novaAtividade, dataInicio: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dataFim">Data Fim</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={novaAtividade.dataFim}
                    onChange={(e) => setNovaAtividade({...novaAtividade, dataFim: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minParticipantes">Min. Participantes</Label>
                  <Input
                    id="minParticipantes"
                    type="number"
                    min="1"
                    value={novaAtividade.minParticipantes}
                    onChange={(e) => setNovaAtividade({...novaAtividade, minParticipantes: parseInt(e.target.value) || 1})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxParticipantes">Máx. Participantes</Label>
                  <Input
                    id="maxParticipantes"
                    type="number"
                    min="1"
                    value={novaAtividade.maxParticipantes}
                    onChange={(e) => setNovaAtividade({...novaAtividade, maxParticipantes: parseInt(e.target.value) || 10})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={novaAtividade.tags}
                  onChange={(e) => setNovaAtividade({...novaAtividade, tags: e.target.value})}
                  placeholder="Ex: carreira, networking, desenvolvimento"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={criarAtividade} 
                disabled={!novaAtividade.titulo || !novaAtividade.descricao || isCreatingActivity}
              >
                {isCreatingActivity && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isCreatingActivity ? 'Criando...' : 'Criar Atividade'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar atividades..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipo de atividade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="plano-mentoria">Planos de mentoria</SelectItem>
                  <SelectItem value="atividade-aberta">Atividades abertas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos status</SelectItem>
                  <SelectItem value="em-andamento">Em andamento</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para organização */}
      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todas">Todas ({atividades.length})</TabsTrigger>
          <TabsTrigger value="planos">
            Planos de Mentoria ({atividades.filter(a => a.tipo === 'plano-mentoria').length})
          </TabsTrigger>
          <TabsTrigger value="abertas">
            Atividades Abertas ({atividades.filter(a => a.tipo === 'atividade-aberta').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {atividadesFiltradas.map(renderAtividadeCard)}
          </div>
        </TabsContent>

        <TabsContent value="planos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {atividadesFiltradas.filter(a => a.tipo === 'plano-mentoria').map(renderAtividadeCard)}
          </div>
        </TabsContent>

        <TabsContent value="abertas" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {atividadesFiltradas.filter(a => a.tipo === 'atividade-aberta').map(renderAtividadeCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Estado vazio */}
      {atividadesFiltradas.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">
              {atividades.length === 0 ? 'Nenhuma atividade cadastrada' : 'Nenhuma atividade encontrada'}
            </h3>
            <p className="text-gray-600 mb-4">
              {atividades.length === 0 
                ? 'Comece criando sua primeira atividade.'
                : 'Não encontramos atividades que correspondam aos seus filtros.'
              }
            </p>
            {atividades.length === 0 ? (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar primeira atividade
              </Button>
            ) : (
              <Button variant="outline" onClick={() => {
                setBusca('');
                setFiltroTipo('todos');
                setFiltroStatus('todos');
              }}>
                Limpar filtros
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}