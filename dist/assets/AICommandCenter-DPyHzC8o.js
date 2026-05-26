import{r as l,f as je,j as e}from"./vendor-react-CNa2jnXH.js";import{s as y,A as be,f as Ce,b as v,C as W,a as X,B as ye,c as M,D as q,T as Ne,E as ke}from"./page-dashboard-Dk_sLb2Q.js";import{T as we,f as Ae,g as Y,h as J,I as E,L as C,S as Z,a as ee,b as ae,c as oe,d as L,q as Se,i as te,n as Te}from"./page-agents-DS8dF5pd.js";import{M as se}from"./MarkdownRenderer-DAbw50QF.js";import{c as Pe}from"./page-alexandria-BoBlmSQI.js";import{M as Me,ab as _,_ as re,Y as Ee,ag as Le,aa as ne,W as $e,d as Ie,F as De}from"./vendor-icons-DlnuxFlV.js";import"./vendor-supabase-5-s6eCJd.js";import"./vendor-visuals-DGpBlf5v.js";import"./vendor-motion-CUNXwmoF.js";import"./page-clients-j8VXGiIa.js";function B(o){return{id:o.id,name:o.name,role:o.role,status:o.status||"offline",emoji:o.emoji||"🤖",category:o.category,tasks:o.tasks??0,daily_tasks:o.daily_tasks,success_rate:o.success_rate,created_at:o.created_at||new Date().toISOString(),slug:o.slug||void 0,agent_group:o.agent_group||void 0,description:o.description||void 0,is_orchestrator:o.is_orchestrator??(o.name?.toLowerCase().includes("tot")&&!o.name?.toLowerCase().includes("totum")),hierarchy_level:o.category==="orchestrator"?0:o.category==="mode"?1:2,type:o.category||"agent"}}const Oe=()=>{const[o,t]=l.useState({agents:[],isLoading:!0,error:null});return l.useEffect(()=>{let d=!0;(async()=>{try{t(s=>({...s,isLoading:!0}));const{data:n,error:r}=await y.from("agents").select("*").order("created_at",{ascending:!1});if(r)throw r;if(!d)return;t({agents:(n||[]).map(B),isLoading:!1,error:null})}catch(n){if(!d)return;t(r=>({...r,isLoading:!1,error:n instanceof Error?n:new Error("Erro ao carregar agentes")}))}})();const p=y.channel("agents-realtime").on("postgres_changes",{event:"*",schema:"public",table:"agents"},n=>{d&&(n.eventType==="DELETE"?t(r=>({...r,agents:r.agents.filter(s=>s.id!==n.old?.id)})):n.eventType==="INSERT"?t(r=>({...r,agents:[B(n.new),...r.agents]})):n.eventType==="UPDATE"&&t(r=>({...r,agents:r.agents.map(s=>s.id===n.new.id?B(n.new):s)})))}).subscribe();return()=>{d=!1,y.removeChannel(p)}},[]),o};async function Ge(o){const{data:t,error:d}=await y.functions.invoke("agent-chat",{body:{workspaceSlug:o.workspaceSlug,message:o.message,mode:o.mode||"chat",sessionId:o.sessionId,attachments:o.attachments||[],agentSlug:o.agentSlug,model:o.model}});if(d)throw new Error(d.message||"AnythingLLM não respondeu pelo proxy interno.");const m=t;return{text:m?.text||"",sources:m?.sources||[],raw:m?.raw}}function ie(o){return o?o==="hermione"?"hermione-alexandria":`agent-${o}`:"totum-agents"}const z=[{id:"social-plan",title:"Planejamento de Redes Sociais",description:"Calendário, pilares, formatos, canais, rotina e métricas.",recommendedModel:"Claude ou GPT-4.1",outputName:"Planejamento editorial"},{id:"ad-copy",title:"Copywriter de Ads",description:"Headlines, ângulos, CTAs, variações e matriz de teste.",recommendedModel:"Claude, GPT-4.1 ou Kimi",outputName:"Kit de anúncios"},{id:"social-posts",title:"Posts Estáticos",description:"Posts prontos para Instagram, LinkedIn, X/Twitter ou TikTok.",recommendedModel:"GPT-4.1 ou Gemini",outputName:"Pacote de posts"},{id:"seo-growth",title:"SEO e Growth",description:"Hipóteses, experimentos, keywords, funil e priorização ICE.",recommendedModel:"Gemini ou Claude",outputName:"Plano de growth"},{id:"support-bot",title:"Bot de Atendimento",description:"FAQ, fluxos, tom de voz, escalonamento e respostas padrão.",recommendedModel:"GPT-4.1 mini ou Claude Haiku",outputName:"Playbook de atendimento"},{id:"carousel",title:"Carrossel",description:"Estrutura slide a slide, copy visual e prompts de imagem.",recommendedModel:"Claude para roteiro + Gemini/ChatGPT para variações",outputName:"Roteiro de carrossel"}],Re=[{value:"anythingllm",label:"AnythingLLM workspace"},{value:"kimi",label:"Kimi"},{value:"groq",label:"Groq"},{value:"openai",label:"OpenAI"}];function $(){return`${Date.now()}-${Math.random().toString(36).slice(2,8)}`}function F(o,t){const d=new Blob([t],{type:"text/markdown"}),m=URL.createObjectURL(d),p=document.createElement("a");p.href=m,p.download=`${o.toLowerCase().replace(/[^a-z0-9]+/gi,"-").replace(/(^-|-$)/g,"")||"totum-os"}.md`,document.body.appendChild(p),p.click(),p.remove(),URL.revokeObjectURL(m)}function qe(o,t){const d=z.find(r=>r.id===o),m=`${d.outputName}: ${t.project||t.brand||"Novo artefato"}`,p=new Date().toLocaleDateString("pt-BR"),n={"social-plan":`## Estratégia Editorial

- Objetivo: ${t.objective||"Definir presença consistente e mensurável"}
- Público: ${t.audience||"Público a validar"}
- Canais: ${t.channels||"Instagram, LinkedIn e TikTok"}
- Tom: ${t.tone||"Claro, útil e direto"}

## Pilares

| Pilar | Papel | Formatos |
|---|---|---|
| Educação | Ensinar e gerar confiança | Carrossel, post curto, tutorial |
| Prova | Demonstrar resultado | Case, bastidor, antes/depois |
| Conversão | Chamar para ação | Oferta, checklist, diagnóstico |

## Calendário Inicial

| Semana | Tema | Entregáveis | Métrica |
|---|---|---|---|
| 1 | Diagnóstico e autoridade | 2 posts + 1 carrossel | Salvamentos |
| 2 | Problema e solução | 3 posts + 1 roteiro | Cliques |
| 3 | Prova social | 2 cases + 1 sequência | Leads |
| 4 | Conversão | 2 posts + CTA | Conversões |`,"ad-copy":`## Ângulos de Anúncio

| Ângulo | Promessa | Gancho |
|---|---|---|
| Dor atual | Resolver ${t.problem||"o gargalo principal"} | "Você ainda perde tempo com isso?" |
| Resultado | ${t.objective||"Melhorar performance"} | "O caminho mais curto para..." |
| Prova | Evidência/case | "Veja o que mudou quando..." |

## Variações

1. Headline: ${t.offer||"Oferta principal"} sem complicação
   Texto: Para ${t.audience||"seu público"}, uma forma direta de transformar ${t.problem||"o problema"} em resultado.
   CTA: Quero ver como funciona

2. Headline: Pare de improvisar ${t.topic||"sua operação"}
   Texto: Use um processo claro, mensurável e pronto para ajustar conforme os dados aparecem.
   CTA: Solicitar diagnóstico

## Matriz de Teste

| Criativo | Headline | Público | Métrica |
|---|---|---|---|
| A | Dor | Frio | CTR |
| B | Resultado | Morno | CPL |
| C | Prova | Remarketing | Conversão |`,"social-posts":`## Posts Prontos

### Post 1
Gancho: ${t.topic||"O erro invisível que trava seus resultados"}
Texto: ${t.problem||"Muitos negócios tentam crescer sem transformar conhecimento em processo."} A solução começa com clareza: objetivo, contexto, execução e revisão.
CTA: Salve para revisar com seu time.

### Post 2
Gancho: Antes de criar mais conteúdo, responda isto.
Texto: Para quem é? Qual ação queremos? Qual prova sustenta a promessa? Sem essas respostas, o post vira ruído.
CTA: Compartilhe com quem aprova conteúdo.

### Post 3
Gancho: Um bom sistema de IA não substitui estratégia.
Texto: Ele organiza contexto, acelera variações e reduz retrabalho. A decisão continua humana, só que mais bem informada.
CTA: Quer transformar isso em processo? Vamos mapear.`,"seo-growth":`## Hipóteses de Growth

| Hipótese | Impacto | Confiança | Esforço | Prioridade |
|---|---:|---:|---:|---:|
| Melhorar páginas de alta intenção | Alto | Média | Médio | P1 |
| Criar clusters sobre ${t.topic||"tema principal"} | Alto | Alta | Médio | P1 |
| Testar lead magnet por dor | Médio | Média | Baixo | P2 |

## SEO

- Tema central: ${t.topic||"tema a validar"}
- Público: ${t.audience||"persona principal"}
- Intenção: comparação, solução, implementação e prova

## Próximos 30 dias

1. Mapear 20 keywords por intenção.
2. Criar 4 conteúdos pilares.
3. Medir cliques, leads e avanço no funil.
4. Repriorizar por ICE.`,"support-bot":`## Playbook do Bot

- Persona: atendente objetivo, cordial e resolutivo.
- Objetivo: resolver dúvidas recorrentes e escalar casos complexos.
- Base: ${t.context||"FAQ, políticas, serviços e histórico do cliente"}

## Fluxos

| Situação | Resposta | Escalar quando |
|---|---|---|
| Dúvida comum | Responder com passo a passo | Usuário pedir humano |
| Reclamação | Acolher, pedir dados e abrir triagem | Sentimento negativo alto |
| Orçamento | Qualificar necessidade | Lead com intenção clara |

## Respostas Base

1. "Entendi. Vou te ajudar com isso agora."
2. "Para te orientar melhor, me diga: prazo, objetivo e contexto."
3. "Esse caso merece análise humana. Vou encaminhar com o resumo."`,carousel:`## Estrutura do Carrossel

Tema: ${t.topic||"Tema principal"}
Objetivo: ${t.objective||"Educar e converter"}

| Slide | Função | Copy |
|---|---|---|
| 1 | Hook | ${t.hook||"Você está resolvendo o problema errado"} |
| 2 | Contexto | O que parece simples vira gargalo quando não há processo. |
| 3 | Dor | Sem contexto, cada IA responde de um jeito. |
| 4 | Virada | Uma biblioteca viva muda o jogo. |
| 5 | Método | Fonte, skill, prompt, POP e decisão em um só pacote. |
| 6 | Exemplo | Um briefing vira plano, copy, anúncio e contexto exportável. |
| 7 | CTA | Salve este roteiro e teste no próximo projeto. |

## Prompt Visual

Criar arte minimalista, layout editorial limpo, alto contraste, tipografia forte, elementos de sistema operacional e biblioteca digital.`};return`# ${m}

> Gerado no Totum OS em ${p}. IA recomendada: ${d.recommendedModel}.

## Briefing

- Projeto/marca: ${t.project||t.brand||"Não informado"}
- Produto/serviço: ${t.offer||"Não informado"}
- Público: ${t.audience||"Não informado"}
- Objetivo: ${t.objective||"Não informado"}
- Tom de voz: ${t.tone||"Não informado"}
- Contexto extra: ${t.context||"Não informado"}

${n[o]}

## Feedback e Próxima Versão

- O que manter:
- O que remover:
- O que aprofundar:
- Nova direção:
`}function Ye(){const[o,t]=je(),d=o.get("tab")==="generators"?"generators":"chat",{agents:m,isLoading:p}=Oe(),[n,r]=l.useState(d),[s,ce]=l.useState(o.get("agent")||"hermione"),[f,le]=l.useState("anythingllm"),[I,de]=l.useState("contexto-skill.md"),[g,me]=l.useState(""),[N,V]=l.useState(""),[ue,b]=l.useState([{id:"welcome",type:"message",role:"assistant",content:"Bem-vindo ao AI Command Center. Escolha um agente, envie contexto/skill em Markdown quando quiser, e eu mostro o que estou fazendo enquanto gero a resposta.",timestamp:new Date}]),[k,H]=l.useState(!1),[w,pe]=l.useState("social-plan"),[A,xe]=l.useState({}),[j,ge]=l.useState(""),[U,S]=l.useState(""),h=l.useMemo(()=>m.find(a=>a.slug===s||a.id===s||a.name.toLowerCase()===s),[m,s]),D=z.find(a=>a.id===w);function K(a,c="running"){const u=$();return b(i=>[...i,{id:u,type:"activity",status:c,content:a,timestamp:new Date}]),u}function O(a,c,u){b(i=>i.map(x=>x.id===a&&x.type==="activity"?{...x,status:c,content:u||x.content}:x))}async function T(a,c="done",u={}){try{await y.from("agent_chat_events").insert({conversation_id:`totum-os-${s}`,agent_id:h?.id||null,agent_slug:h?.slug||s,event_type:"activity",status:c,summary:a,metadata:u})}catch{}}async function Q(){if(!N.trim()||k)return;const a=N.trim();V(""),H(!0),b(i=>[...i,{id:$(),type:"message",role:"user",content:a,timestamp:new Date}]);const c=K("Organizando agente, contexto e skill recebidos...");T("Organizando agente, contexto e skill recebidos","running",{hasContext:!!g.trim()}),await new Promise(i=>setTimeout(i,180)),O(c,"done");const u=K(f==="anythingllm"?"Consultando workspace AnythingLLM do agente...":`Chamando ${f.toUpperCase()} com o DNA do agente...`);T("Consultando motor do agente","running",{provider:f});try{let i="",x=[];if(f==="anythingllm"){const P=await Ge({workspaceSlug:ie(h?.slug||s),message:a,sessionId:`totum-os-${s}`,agentSlug:h?.slug||s,attachments:g.trim()?[{name:I||"contexto-skill.md",content:g,mime:"text/markdown"}]:[]});i=P.text||"O workspace respondeu sem texto. Verifique a configuração do AnythingLLM.",x=P.sources.map(R=>R.title||R.document||R.url||"Fonte AnythingLLM")}else Te()||(i="Não encontrei uma API de IA configurada neste ambiente. Ainda assim, o AI Command Center está pronto: selecione um agente, envie contexto/skill em Markdown e configure AnythingLLM ou uma chave Kimi/Groq/OpenAI para respostas reais.");O(u,"done","Resposta gerada e pronta para revisão."),T("Resposta gerada e pronta para revisão","done",{provider:f,sourceCount:x.length}),b(P=>[...P,{id:$(),type:"message",role:"assistant",content:i,timestamp:new Date,sources:x}])}catch(i){O(u,"error","Motor de chat indisponível; usando fallback explicativo."),T("Motor de chat indisponível; fallback exibido","error",{provider:f,error:i instanceof Error?i.message:"unknown"}),b(x=>[...x,{id:$(),type:"message",role:"assistant",content:`Não consegui acionar o motor selecionado agora. Detalhe: ${i instanceof Error?i.message:"erro desconhecido"}.

Fallback: mantenha o briefing/contexto em Markdown e tente novamente quando o AnythingLLM ou a API de modelo estiver configurada.`,timestamp:new Date}])}finally{H(!1)}}function he(a){r(a);const c=new URLSearchParams(o);a==="generators"?c.set("tab","generators"):c.delete("tab"),t(c,{replace:!0})}function G(a,c){xe(u=>({...u,[a]:c}))}function ve(){const a=qe(w,A);ge(a),S("")}async function fe(){if(j.trim()){S("Salvando na Alexandria...");try{await Pe([{name:`${D.outputName}.md`,content:j,origin:"AI Command Center",author:h?.name||"Totum OS"}],{type:"document",status:"draft"}),S("Salvo como artefato draft na Alexandria.")}catch(a){S(a instanceof Error?a.message:"Não foi possível salvar na Alexandria.")}}}return e.jsx(be,{children:e.jsxs("main",{className:"mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6",children:[e.jsx(Ce,{eyebrow:"Totum OS",title:"AI Command Center",description:"Chat único para chamar agentes, trocar IA/modelo, enviar contexto ou skill em Markdown e gerar documentos operacionais prontos para revisão.",icon:Me,actions:e.jsxs(v,{variant:"outline",onClick:()=>F("contexto-totum-os",g||`# Contexto Totum OS
`),children:[e.jsx(_,{className:"h-4 w-4"}),"Baixar contexto"]})}),e.jsxs(we,{value:n,onValueChange:he,children:[e.jsxs(Ae,{className:"grid w-full grid-cols-2 md:w-[420px]",children:[e.jsx(Y,{value:"chat",children:"Chat único"}),e.jsx(Y,{value:"generators",children:"Input para Output"})]}),e.jsx(J,{value:"chat",className:"mt-6",children:e.jsxs("div",{className:"grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]",children:[e.jsx(W,{className:"min-h-[620px]",children:e.jsxs(X,{className:"flex h-full min-h-[620px] flex-col p-0",children:[e.jsx("div",{className:"border-b border-border p-4",children:e.jsxs("div",{className:"flex flex-col gap-3 md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{children:[e.jsxs("p",{className:"text-sm font-semibold text-foreground",children:[h?.emoji||""," ",h?.name||"Hermione"]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["Workspace: ",ie(h?.slug||s)]})]}),e.jsx(ye,{variant:"outline",children:"log resumido ativo"})]})}),e.jsx("div",{className:"flex-1 space-y-4 overflow-y-auto p-4",children:ue.map(a=>a.type==="activity"?e.jsxs("div",{className:"mx-auto flex max-w-xl items-center justify-center gap-2 text-xs text-muted-foreground",children:[a.status==="running"?e.jsx(re,{className:"h-3.5 w-3.5 animate-spin"}):e.jsx(Ee,{className:M("h-3.5 w-3.5",a.status==="error"?"text-destructive":"text-emerald-600")}),e.jsx("span",{children:a.content})]},a.id):e.jsx("div",{className:M("flex",a.role==="user"?"justify-end":"justify-start"),children:e.jsxs("div",{className:M("max-w-[82%] border p-4 text-sm",a.role==="user"?"border-primary bg-primary text-primary-foreground":"border-border bg-card text-card-foreground"),children:[e.jsx(se,{content:a.content,className:"text-sm"}),!!a.sources?.length&&e.jsxs("div",{className:"mt-3 border-t border-current/20 pt-2 text-xs opacity-75",children:["Fontes: ",a.sources.join(", ")]})]})},a.id))}),e.jsx("div",{className:"border-t border-border p-4",children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(E,{value:N,onChange:a=>V(a.target.value),onKeyDown:a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),Q())},placeholder:"Chame um agente, peça uma análise ou envie uma tarefa...",disabled:k}),e.jsx(v,{onClick:Q,disabled:!N.trim()||k,size:"icon",children:k?e.jsx(re,{className:"h-4 w-4 animate-spin"}):e.jsx(Le,{className:"h-4 w-4"})})]})})]})}),e.jsxs("div",{className:"space-y-4",children:[e.jsx(q,{title:"Agente e IA",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(C,{children:"Agente"}),e.jsxs(Z,{value:s,onValueChange:ce,children:[e.jsx(ee,{children:e.jsx(ae,{placeholder:"Selecione um agente"})}),e.jsxs(oe,{children:[e.jsx(L,{value:"hermione",children:"Hermione"}),p?e.jsx(L,{value:"loading",disabled:!0,children:"Carregando agentes..."}):m.slice(0,80).map(a=>e.jsxs(L,{value:a.slug||a.id,children:[a.emoji," ",a.name]},a.id))]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(C,{children:"Motor/modelo"}),e.jsxs(Z,{value:f,onValueChange:a=>le(a),children:[e.jsx(ee,{children:e.jsx(ae,{})}),e.jsx(oe,{children:Re.map(a=>e.jsx(L,{value:a.value,children:a.label},a.value))})]}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["Fallback atual: ",Se().toUpperCase()," quando AnythingLLM não estiver disponível."]})]})]})}),e.jsx(q,{title:"Enviar contexto e skill",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx(E,{value:I,onChange:a=>de(a.target.value)}),e.jsx(te,{value:g,onChange:a=>me(a.target.value),placeholder:"# Skill ou contexto\\nCole aqui um MD para usar no chat ou baixar para Claude, Kimi, ChatGPT, Gemini...",className:"min-h-[220px]"}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsxs(v,{variant:"outline",onClick:()=>navigator.clipboard.writeText(g),disabled:!g.trim(),children:[e.jsx(ne,{className:"h-4 w-4"}),"Copiar"]}),e.jsxs(v,{variant:"outline",onClick:()=>F(I,g),disabled:!g.trim(),children:[e.jsx(_,{className:"h-4 w-4"}),"MD"]})]})]})})]})]})}),e.jsx(J,{value:"generators",className:"mt-6",children:e.jsxs("div",{className:"grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]",children:[e.jsx(q,{title:"Geradores",children:e.jsx("div",{className:"space-y-2",children:z.map(a=>e.jsxs("button",{onClick:()=>pe(a.id),className:M("w-full border p-3 text-left transition-colors",w===a.id?"border-primary bg-primary/10":"border-border bg-card hover:bg-muted"),children:[e.jsx("p",{className:"text-sm font-semibold text-foreground",children:a.title}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:a.description}),e.jsx("p",{className:"mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary",children:a.recommendedModel})]},a.id))})}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs(Ne,{children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold text-foreground",children:D.title}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Preencha o briefing, gere um MD único e refine com feedback."})]}),e.jsxs(v,{onClick:ve,children:[e.jsx($e,{className:"h-4 w-4"}),"Gerar documento"]})]}),e.jsxs("div",{className:"grid gap-4 md:grid-cols-2",children:[[["project","Projeto ou marca"],["offer","Produto, serviço ou oferta"],["audience","Público-alvo"],["objective","Objetivo"],["topic","Tema central"],["tone","Tom de voz"]].map(([a,c])=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(C,{children:c}),e.jsx(E,{value:A[a]||"",onChange:u=>G(a,u.target.value)})]},a)),e.jsxs("div",{className:"space-y-2 md:col-span-2",children:[e.jsx(C,{children:"Contexto, referências, restrições ou feedback"}),e.jsx(te,{value:A.context||"",onChange:a=>G("context",a.target.value),className:"min-h-[120px]"})]}),w==="carousel"&&e.jsxs("div",{className:"space-y-2 md:col-span-2",children:[e.jsx(C,{children:"Hook do primeiro slide"}),e.jsx(E,{value:A.hook||"",onChange:a=>G("hook",a.target.value)})]})]}),j?e.jsx(W,{children:e.jsxs(X,{className:"space-y-4 p-5",children:[e.jsxs("div",{className:"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-foreground",children:"Documento gerado"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Revise, dê feedback, salve na Alexandria ou baixe em Markdown."})]}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsxs(v,{variant:"outline",onClick:()=>navigator.clipboard.writeText(j),children:[e.jsx(ne,{className:"h-4 w-4"}),"Copiar"]}),e.jsxs(v,{variant:"outline",onClick:()=>F(D.outputName,j),children:[e.jsx(_,{className:"h-4 w-4"}),"Baixar"]}),e.jsxs(v,{onClick:fe,children:[e.jsx(Ie,{className:"h-4 w-4"}),"Salvar Alexandria"]})]})]}),U&&e.jsx("p",{className:"text-xs text-muted-foreground",children:U}),e.jsx("div",{className:"border border-border bg-muted/40 p-4",children:e.jsx(se,{content:j,className:"text-sm"})})]})}):e.jsx(ke,{icon:De,title:"Nenhum documento gerado ainda",description:"Preencha o briefing e gere a primeira versão. O resultado já sai em Markdown para revisão e exportação."})]})]})})]})]})})}export{Ye as default};
