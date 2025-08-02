import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// Configuração do CORS e logging
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin'
  ],
  exposeHeaders: ['Content-Length', 'X-JSON'],
  credentials: false,
}));

// Middleware para adicionar headers CORS explicitamente
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  c.header('Access-Control-Max-Age', '86400');
  
  // Responder imediatamente para requests OPTIONS (preflight)
  if (c.req.method === 'OPTIONS') {
    return c.text('', 200);
  }
  
  await next();
});

app.use('*', logger(console.log));

// Cliente Supabase
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Rota de teste para verificar conectividade
app.get('/make-server-e7ec0f69/health', async (c) => {
  console.log('Health check solicitado');
  return c.json({
    status: 'ok',
    message: 'Servidor funcionando corretamente',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});



// Rota OPTIONS para todas as rotas (preflight)
app.options('/make-server-e7ec0f69/*', async (c) => {
  console.log('Preflight request recebido para:', c.req.url);
  return c.text('', 200);
});

// Rota para registrar novo usuário
app.post('/make-server-e7ec0f69/register', async (c) => {
  try {
    console.log('=== INÍCIO DO REGISTRO ===');
    
    const body = await c.req.json();
    console.log('Dados recebidos:', { ...body, password: '***' });
    
    const { name, email, password } = body;

    if (!name || !email || !password) {
      console.log('Erro: Campos obrigatórios faltando');
      return c.json({ error: 'Nome, email e senha são obrigatórios' }, 400);
    }

    console.log('Tentando criar usuário no Supabase Auth...');

    // Criar usuário no Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { name: name },
      // Automaticamente confirma o email pois não temos servidor de email configurado
      email_confirm: true
    });

    if (error) {
      console.log('Erro do Supabase Auth:', error);
      return c.json({ error: error.message }, 400);
    }

    console.log('Usuário criado no Supabase Auth com sucesso:', data.user?.id);

    // Salvar dados adicionais do mentor na tabela KV
    const userId = data.user?.id;
    if (userId) {
      console.log('Salvando dados do mentor no KV store...');
      
      // Dados iniciais do mentor
      const mentorData = {
        id: userId,
        name: name,
        email: email,
        points: 0,
        level: 1,
        levelName: 'Mentor Iniciante',
        avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        createdAt: new Date().toISOString(),
        mentoradosAtivos: 0,
        totalMentorados: 0,
        horasDoadas: 0,
        trilhasConcluidas: 0
      };

      // Usar o KV store para salvar dados do mentor
      const kv = await import('./kv_store.tsx');
      await kv.set(`mentor:${userId}`, mentorData);
      
      console.log('Dados do mentor salvos no KV store com sucesso');
    }

    console.log('=== REGISTRO CONCLUÍDO COM SUCESSO ===');

    return c.json({
      message: 'Usuário criado com sucesso',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        name: name
      }
    });

  } catch (error) {
    console.log('=== ERRO NO REGISTRO ===');
    console.log('Erro completo:', error);
    console.log('Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return c.json({ error: 'Erro interno do servidor: ' + (error instanceof Error ? error.message : 'Erro desconhecido') }, 500);
  }
});

// Rota para login do usuário
app.post('/make-server-e7ec0f69/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email e senha são obrigatórios' }, 400);
    }

    // Fazer login via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log('Erro no login:', error);
      return c.json({ error: 'Credenciais inválidas' }, 401);
    }

    // Buscar dados do mentor no KV store
    const kv = await import('./kv_store.tsx');
    const mentorData = await kv.get(`mentor:${data.user?.id}`);

    if (!mentorData) {
      return c.json({ error: 'Dados do mentor não encontrados' }, 404);
    }

    return c.json({
      message: 'Login realizado com sucesso',
      access_token: data.session?.access_token,
      user: mentorData
    });

  } catch (error) {
    console.log('Erro no login:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Rota para verificar sessão ativa
app.get('/make-server-e7ec0f69/verify-session', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Token de acesso não fornecido' }, 401);
    }

    // Verificar token com Supabase
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Sessão inválida' }, 401);
    }

    // Buscar dados atualizados do mentor
    const kv = await import('./kv_store.tsx');
    const mentorData = await kv.get(`mentor:${user.id}`);

    if (!mentorData) {
      return c.json({ error: 'Dados do mentor não encontrados' }, 404);
    }

    return c.json({
      valid: true,
      user: mentorData
    });

  } catch (error) {
    console.log('Erro na verificação de sessão:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Rota para logout
app.post('/make-server-e7ec0f69/logout', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Token de acesso não fornecido' }, 401);
    }

    // Fazer logout via Supabase
    const { error } = await supabase.auth.admin.signOut(accessToken);
    
    if (error) {
      console.log('Erro no logout:', error);
      return c.json({ error: 'Erro ao fazer logout' }, 400);
    }

    return c.json({ message: 'Logout realizado com sucesso' });

  } catch (error) {
    console.log('Erro no logout:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Rotas de perfil
// Buscar perfil do membro
app.get('/make-server-e7ec0f69/profile', async (c) => {
  try {
    console.log('📥 [GET /profile] Requisição recebida');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.log('❌ [GET /profile] Token não fornecido');
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    console.log('🔑 [GET /profile] Verificando token...');
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('❌ [GET /profile] Token inválido:', error);
      return c.json({ error: 'Token inválido' }, 401);
    }

    console.log('✅ [GET /profile] Usuário autenticado:', user.email);

    // Buscar perfil na tabela usando kv_store
    const kv = await import('./kv_store.tsx');
    const profileKey = `member_profile_${user.email}`;
    console.log('🔍 [GET /profile] Buscando perfil com chave:', profileKey);
    
    const profileData = await kv.get(profileKey);

    if (!profileData) {
      console.log('⚠️ [GET /profile] Perfil não encontrado, retornando perfil básico');
      // Retornar perfil básico se não existir
      const basicProfile = {
        name: user.user_metadata?.name || 'Usuário',
        email: user.email || '',
        phone: '',
        location: '',
        bio: '',
        linkedin: '',
        area: '',
        formacao: '',
        voluntarioOutrasIniciativas: false,
        skills: [],
        atuacaoAreas: [],
        availability: {
          segunda: [],
          terca: [],
          quarta: [],
          quinta: [],
          sexta: [],
          sabado: [],
          domingo: []
        }
      };
      
      return c.json({ profile: basicProfile });
    }

    console.log('✅ [GET /profile] Perfil encontrado e enviado');
    return c.json({ profile: profileData });

  } catch (error) {
    console.log('❌ [GET /profile] Erro ao buscar perfil:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Salvar perfil do membro
app.post('/make-server-e7ec0f69/profile', async (c) => {
  try {
    console.log('📥 [POST /profile] Requisição de salvamento recebida');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.log('❌ [POST /profile] Token não fornecido');
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    console.log('🔑 [POST /profile] Verificando token...');
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('❌ [POST /profile] Token inválido:', error);
      return c.json({ error: 'Token inválido' }, 401);
    }

    console.log('✅ [POST /profile] Usuário autenticado:', user.email);

    const profileData = await c.req.json();
    console.log('📝 [POST /profile] Dados recebidos:', profileData);

    // Salvar perfil na tabela usando kv_store
    const kv = await import('./kv_store.tsx');
    const profileKey = `member_profile_${user.email}`;
    
    // Adicionar timestamp de atualização
    const profileWithTimestamp = {
      ...profileData,
      email: user.email, // Garantir que o email esteja sempre correto
      updatedAt: new Date().toISOString()
    };

    console.log('💾 [POST /profile] Salvando com chave:', profileKey);
    await kv.set(profileKey, profileWithTimestamp);

    console.log('✅ [POST /profile] Perfil salvo com sucesso para usuário:', user.email);

    return c.json({ 
      message: 'Perfil salvo com sucesso',
      profile: profileWithTimestamp
    });

  } catch (error) {
    console.log('❌ [POST /profile] Erro ao salvar perfil:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Atualizar disponibilidade (salvamento específico e rápido)
app.post('/make-server-e7ec0f69/profile/availability', async (c) => {
  try {
    console.log('📥 [POST /profile/availability] Requisição de disponibilidade recebida');
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.log('❌ [POST /profile/availability] Token não fornecido');
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    console.log('🔑 [POST /profile/availability] Verificando token...');
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log('❌ [POST /profile/availability] Token inválido:', error);
      return c.json({ error: 'Token inválido' }, 401);
    }

    console.log('✅ [POST /profile/availability] Usuário autenticado:', user.email);

    const { availability } = await c.req.json();
    console.log('📅 [POST /profile/availability] Disponibilidade recebida:', availability);

    // Buscar perfil atual
    const kv = await import('./kv_store.tsx');
    const profileKey = `member_profile_${user.email}`;
    console.log('🔍 [POST /profile/availability] Buscando perfil atual...');
    let currentProfile = await kv.get(profileKey);

    if (!currentProfile) {
      console.log('⚠️ [POST /profile/availability] Perfil não encontrado, criando perfil básico');
      // Criar perfil básico se não existir
      currentProfile = {
        name: user.user_metadata?.name || 'Usuário',
        email: user.email || '',
        phone: '',
        location: '',
        bio: '',
        linkedin: '',
        area: '',
        formacao: '',
        voluntarioOutrasIniciativas: false,
        skills: [],
        atuacaoAreas: [],
        availability: {}
      };
    }

    // Atualizar apenas a disponibilidade
    const updatedProfile = {
      ...currentProfile,
      availability,
      updatedAt: new Date().toISOString()
    };

    console.log('💾 [POST /profile/availability] Salvando perfil atualizado...');
    await kv.set(profileKey, updatedProfile);

    console.log('✅ [POST /profile/availability] Disponibilidade atualizada com sucesso para usuário:', user.email);

    return c.json({ 
      message: 'Disponibilidade salva com sucesso',
      availability
    });

  } catch (error) {
    console.log('❌ [POST /profile/availability] Erro ao salvar disponibilidade:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// ===============================
// ROTAS DE ATIVIDADES
// ===============================

// Listar todas as atividades
app.get('/make-server-e7ec0f69/activities', async (c) => {
  try {
    console.log('📥 [GET /activities] Listando atividades');
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Token inválido' }, 401);
    }

    // Primeiro, tentar buscar atividades do banco de dados
    const { data: activities, error } = await supabase
      .from('activities')
      .select(`
        *,
        created_by_member:members!activities_created_by_fkey(name),
        participants:activity_participants(
          member_id,
          role,
          status,
          joined_at,
          member:members(name, email)
        )
      `)
      .order('created_at', { ascending: false });

    // Se houver erro ou tabela não existir, usar KV store como fallback
    if (error || !activities) {
      console.log('⚠️ [GET /activities] Tabelas não disponíveis, usando KV store. Erro:', error);
      
      const kv = await import('./kv_store.tsx');
      
      // Verificar se existem atividades no KV
      const existingActivities = await kv.get('activities') || [];
      
      if (existingActivities.length === 0) {
        console.log('🔧 [GET /activities] Criando atividades iniciais no KV store');
        
        // Criar atividades de exemplo
        const defaultActivities = [
          {
            id: 'activity_1',
            titulo: 'Programa de Desenvolvimento Profissional',
            descricao: 'Plano completo de mentoria focado em desenvolvimento de carreira, habilidades técnicas e comportamentais.',
            tipo: 'plano-mentoria',
            status: 'em-andamento',
            categoria: 'Desenvolvimento Profissional',
            dataInicio: '2024-01-15',
            dataFim: '2024-04-15',
            participantes: 1,
            maxParticipantes: 5,
            minParticipantes: 1,
            inscricoesAbertas: true,
            responsavel: 'Ana Silva',
            tags: ['carreira', 'habilidades', 'profissional'],
            participantesDetalhes: []
          },
          {
            id: 'activity_2',
            titulo: 'Mentoria em Empreendedorismo',
            descricao: 'Acompanhamento para jovens interessados em abrir o próprio negócio.',
            tipo: 'plano-mentoria',
            status: 'agendada',
            categoria: 'Empreendedorismo',
            dataInicio: '2024-03-01',
            dataFim: '2024-06-01',
            participantes: 0,
            maxParticipantes: 3,
            minParticipantes: 1,
            inscricoesAbertas: true,
            responsavel: 'Carlos Mendes',
            tags: ['empreendedorismo', 'negócios', 'startup'],
            participantesDetalhes: []
          },
          {
            id: 'activity_3',
            titulo: 'Edital Jovens Empreendedores 2024',
            descricao: 'Auxílio na construção de inscrições para o edital de apoio a jovens empreendedores.',
            tipo: 'atividade-aberta',
            status: 'disponivel',
            categoria: 'Editais e Concursos',
            dataInicio: '2024-02-01',
            dataFim: '2024-02-28',
            participantes: 12,
            maxParticipantes: 25,
            minParticipantes: 5,
            inscricoesAbertas: true,
            responsavel: 'Maria Santos',
            tags: ['edital', 'empreendedorismo', 'financiamento'],
            participantesDetalhes: []
          },
          {
            id: 'activity_4',
            titulo: 'Workshop: Preparação para ENEM',
            descricao: 'Atividade coletiva de preparação e orientação para o ENEM.',
            tipo: 'atividade-aberta',
            status: 'em-andamento',
            categoria: 'Educação',
            dataInicio: '2024-01-20',
            dataFim: '2024-11-30',
            participantes: 35,
            maxParticipantes: 40,
            minParticipantes: 10,
            inscricoesAbertas: true,
            responsavel: 'Pedro Costa',
            tags: ['educação', 'enem', 'vestibular'],
            participantesDetalhes: []
          },
          {
            id: 'activity_5',
            titulo: 'Trilha de Tecnologia - Programação Básica',
            descricao: 'Programa de mentoria individual em programação e tecnologia.',
            tipo: 'plano-mentoria',
            status: 'concluida',
            categoria: 'Tecnologia',
            dataInicio: '2023-10-01',
            dataFim: '2024-01-15',
            participantes: 2,
            maxParticipantes: 5,
            minParticipantes: 1,
            inscricoesAbertas: false,
            responsavel: 'João Silva',
            tags: ['tecnologia', 'programação', 'carreira-tech'],
            participantesDetalhes: []
          }
        ];
        
        await kv.set('activities', defaultActivities);
        
        console.log('✅ [GET /activities] Atividades iniciais criadas no KV store');
        return c.json({ activities: defaultActivities });
      }
      
      console.log('✅ [GET /activities] Retornando atividades do KV store:', existingActivities.length);
      return c.json({ activities: existingActivities });
    }

    // Processar dados do banco para o frontend
    const processedActivities = activities?.map(activity => ({
      id: activity.id,
      titulo: activity.name,
      descricao: activity.description,
      tipo: activity.type === 'mentoring_plan' ? 'plano-mentoria' : 'atividade-aberta',
      status: activity.status === 'active' ? 'em-andamento' : 
              activity.status === 'completed' ? 'concluida' :
              activity.status === 'scheduled' ? 'agendada' : 'disponivel',
      categoria: activity.category || 'Geral',
      dataInicio: activity.start_date,
      dataFim: activity.end_date,
      participantes: activity.participants?.filter(p => p.status === 'accepted').length || 0,
      maxParticipantes: activity.max_participants,
      minParticipantes: activity.min_participants,
      inscricoesAbertas: activity.status === 'active' || activity.status === 'scheduled',
      responsavel: activity.created_by_member?.name || 'Sistema',
      tags: activity.tags || [],
      participantesDetalhes: activity.participants || []
    })) || [];

    console.log('✅ [GET /activities] Retornando', processedActivities.length, 'atividades do banco');
    return c.json({ activities: processedActivities });

  } catch (error) {
    console.log('❌ [GET /activities] Erro:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Criar nova atividade
app.post('/make-server-e7ec0f69/activities', async (c) => {
  try {
    console.log('📥 [POST /activities] Criando nova atividade');
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Token inválido' }, 401);
    }

    const activityData = await c.req.json();
    console.log('📝 [POST /activities] Dados recebidos:', activityData);

    // Tentar inserir no banco primeiro
    try {
      // Buscar ID do membro na tabela members
      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('email', user.email)
        .single();

      if (member) {
        // Mapear dados do frontend para o banco
        const dbActivityData = {
          name: activityData.titulo,
          description: activityData.descricao,
          type: activityData.tipo === 'plano-mentoria' ? 'mentoring_plan' : 'open_activity',
          status: activityData.status === 'em-andamento' ? 'active' :
                  activityData.status === 'concluida' ? 'completed' :
                  activityData.status === 'agendada' ? 'scheduled' : 'pending',
          category: activityData.categoria,
          start_date: activityData.dataInicio || null,
          end_date: activityData.dataFim || null,
          min_participants: activityData.minParticipantes || 1,
          max_participants: activityData.maxParticipantes || 10,
          tags: activityData.tags || [],
          created_by: member.id
        };

        const { data: newActivity, error } = await supabase
          .from('activities')
          .insert([dbActivityData])
          .select()
          .single();

        if (!error) {
          console.log('✅ [POST /activities] Atividade criada no banco:', newActivity.id);
          return c.json({ 
            message: 'Atividade criada com sucesso',
            activity: newActivity 
          });
        }
      }
    } catch (dbError) {
      console.log('⚠️ [POST /activities] Erro no banco, usando KV store:', dbError);
    }

    // Fallback para KV store
    console.log('🔧 [POST /activities] Usando KV store como fallback');
    
    const kv = await import('./kv_store.tsx');
    
    // Buscar atividades existentes
    const existingActivities = await kv.get('activities') || [];
    
    // Criar nova atividade
    const newActivity = {
      id: `activity_${Date.now()}`,
      titulo: activityData.titulo,
      descricao: activityData.descricao,
      tipo: activityData.tipo,
      status: activityData.status || 'disponivel',
      categoria: activityData.categoria,
      dataInicio: activityData.dataInicio,
      dataFim: activityData.dataFim,
      participantes: 0,
      maxParticipantes: activityData.maxParticipantes || 10,
      minParticipantes: activityData.minParticipantes || 1,
      inscricoesAbertas: true,
      responsavel: user.user_metadata?.name || user.email,
      tags: activityData.tags || [],
      participantesDetalhes: []
    };
    
    // Adicionar nova atividade à lista
    const updatedActivities = [newActivity, ...existingActivities];
    await kv.set('activities', updatedActivities);

    console.log('✅ [POST /activities] Atividade criada no KV store:', newActivity.id);
    return c.json({ 
      message: 'Atividade criada com sucesso',
      activity: newActivity 
    });

  } catch (error) {
    console.log('❌ [POST /activities] Erro:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Inscrever-se em uma atividade
app.post('/make-server-e7ec0f69/activities/:id/join', async (c) => {
  try {
    const activityId = c.req.param('id');
    console.log('📥 [POST /activities/:id/join] Inscrição na atividade:', activityId);
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Token inválido' }, 401);
    }

    // Tentar usar banco de dados primeiro
    try {
      // Buscar ID do membro
      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('email', user.email)
        .single();

      if (member) {
        // Verificar se a atividade existe
        const { data: activity } = await supabase
          .from('activities')
          .select('*, participants:activity_participants(count)')
          .eq('id', activityId)
          .single();

        if (activity) {
          // Verificar se já está inscrito
          const { data: existingParticipant } = await supabase
            .from('activity_participants')
            .select('*')
            .eq('activity_id', activityId)
            .eq('member_id', member.id)
            .single();

          if (existingParticipant) {
            return c.json({ error: 'Você já está inscrito nesta atividade' }, 400);
          }

          // Verificar limite de participantes
          const currentParticipants = activity.participants?.[0]?.count || 0;
          if (activity.max_participants && currentParticipants >= activity.max_participants) {
            return c.json({ error: 'Atividade lotada' }, 400);
          }

          // Criar inscrição
          const { error: insertError } = await supabase
            .from('activity_participants')
            .insert([{
              activity_id: activityId,
              member_id: member.id,
              role: 'participant',
              status: 'accepted'
            }]);

          if (!insertError) {
            console.log('✅ [POST /activities/:id/join] Inscrição realizada no banco');
            return c.json({ message: 'Inscrição realizada com sucesso' });
          }
        }
      }
    } catch (dbError) {
      console.log('⚠️ [POST /activities/:id/join] Erro no banco, usando KV store:', dbError);
    }

    // Fallback para KV store
    console.log('🔧 [POST /activities/:id/join] Usando KV store como fallback');
    
    const kv = await import('./kv_store.tsx');
    
    // Buscar atividades do KV
    const activities = await kv.get('activities') || [];
    const activityIndex = activities.findIndex((a: any) => a.id === activityId);
    
    if (activityIndex === -1) {
      return c.json({ error: 'Atividade não encontrada' }, 404);
    }
    
    const activity = activities[activityIndex];
    
    // Verificar limite de participantes
    if (activity.maxParticipantes && activity.participantes >= activity.maxParticipantes) {
      return c.json({ error: 'Atividade lotada' }, 400);
    }
    
    // Verificar se usuário já está inscrito
    const userParticipations = await kv.get(`user_activities_${user.email}`) || [];
    if (userParticipations.includes(activityId)) {
      return c.json({ error: 'Você já está inscrito nesta atividade' }, 400);
    }
    
    // Adicionar participante
    activity.participantes = (activity.participantes || 0) + 1;
    activity.participantesDetalhes = activity.participantesDetalhes || [];
    activity.participantesDetalhes.push({
      id: user.id,
      nome: user.user_metadata?.name || user.email,
      email: user.email,
      dataIngresso: new Date().toISOString()
    });
    
    // Atualizar atividade
    activities[activityIndex] = activity;
    await kv.set('activities', activities);
    
    // Atualizar participações do usuário
    userParticipations.push(activityId);
    await kv.set(`user_activities_${user.email}`, userParticipations);

    console.log('✅ [POST /activities/:id/join] Inscrição realizada no KV store');
    return c.json({ message: 'Inscrição realizada com sucesso' });

  } catch (error) {
    console.log('❌ [POST /activities/:id/join] Erro:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Buscar detalhes de uma atividade específica
app.get('/make-server-e7ec0f69/activities/:id', async (c) => {
  try {
    const activityId = c.req.param('id');
    console.log('📥 [GET /activities/:id] Buscando atividade:', activityId);
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Token inválido' }, 401);
    }

    // Buscar atividade com detalhes completos
    const { data: activity, error } = await supabase
      .from('activities')
      .select(`
        *,
        created_by_member:members!activities_created_by_fkey(name, email),
        participants:activity_participants(
          member_id,
          role,
          status,
          joined_at,
          member:members(name, email, bio)
        )
      `)
      .eq('id', activityId)
      .single();

    if (error) {
      console.log('❌ Erro ao buscar atividade:', error);
      return c.json({ error: 'Atividade não encontrada' }, 404);
    }

    // Processar dados para o frontend
    const processedActivity = {
      id: activity.id,
      titulo: activity.name,
      descricao: activity.description,
      tipo: activity.type === 'mentoring_plan' ? 'plano-mentoria' : 'atividade-aberta',
      status: activity.status === 'active' ? 'em-andamento' : 
              activity.status === 'completed' ? 'concluida' :
              activity.status === 'scheduled' ? 'agendada' : 'disponivel',
      categoria: activity.category || 'Geral',
      dataInicio: activity.start_date,
      dataFim: activity.end_date,
      participantes: activity.participants?.filter(p => p.status === 'accepted').length || 0,
      maxParticipantes: activity.max_participants,
      minParticipantes: activity.min_participants,
      inscricoesAbertas: activity.status === 'active' || activity.status === 'scheduled',
      responsavel: activity.created_by_member?.name || 'Sistema',
      tags: activity.tags || [],
      participantesDetalhes: activity.participants?.map(p => ({
        id: p.member_id,
        nome: p.member?.name,
        email: p.member?.email,
        bio: p.member?.bio,
        role: p.role,
        status: p.status,
        dataIngresso: p.joined_at
      })) || []
    };

    console.log('✅ [GET /activities/:id] Atividade encontrada');
    return c.json({ activity: processedActivity });

  } catch (error) {
    console.log('❌ [GET /activities/:id] Erro:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Buscar atividades do usuário (como participante ou criador)
app.get('/make-server-e7ec0f69/my-activities', async (c) => {
  try {
    console.log('📥 [GET /my-activities] Buscando atividades do usuário');
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Token inválido' }, 401);
    }

    // Buscar ID do membro
    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('email', user.email)
      .single();

    if (!member) {
      return c.json({ error: 'Membro não encontrado' }, 404);
    }

    // Buscar atividades criadas pelo usuário
    const { data: createdActivities, error: createdError } = await supabase
      .from('activities')
      .select(`
        *,
        participants:activity_participants(count)
      `)
      .eq('created_by', member.id);

    // Buscar atividades onde o usuário é participante
    const { data: participantActivities, error: participantError } = await supabase
      .from('activity_participants')
      .select(`
        role,
        status,
        joined_at,
        activity:activities(*)
      `)
      .eq('member_id', member.id);

    if (createdError || participantError) {
      console.log('❌ Erro ao buscar atividades do usuário:', createdError || participantError);
      return c.json({ error: 'Erro ao buscar atividades' }, 500);
    }

    const result = {
      created: createdActivities?.map(activity => ({
        id: activity.id,
        titulo: activity.name,
        descricao: activity.description,
        tipo: activity.type === 'mentoring_plan' ? 'plano-mentoria' : 'atividade-aberta',
        status: activity.status,
        participantes: activity.participants?.[0]?.count || 0,
        maxParticipantes: activity.max_participants,
        dataInicio: activity.start_date,
        dataFim: activity.end_date
      })) || [],
      participating: participantActivities?.map(p => ({
        id: p.activity.id,
        titulo: p.activity.name,
        descricao: p.activity.description,
        tipo: p.activity.type === 'mentoring_plan' ? 'plano-mentoria' : 'atividade-aberta',
        status: p.activity.status,
        role: p.role,
        participantStatus: p.status,
        dataIngresso: p.joined_at
      })) || []
    };

    console.log('✅ [GET /my-activities] Retornando atividades do usuário');
    return c.json(result);

  } catch (error) {
    console.log('❌ [GET /my-activities] Erro:', error);
    return c.json({ error: 'Erro interno do servidor' }, 500);
  }
});

// Iniciar servidor
Deno.serve(app.fetch);