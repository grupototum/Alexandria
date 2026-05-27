import{u as Ba,j as e,L as Ea,r as x,f as Oa,d as da}from"./vendor-react-Bz9B1RWF.js";import{c as G,s as w,C as h,B as f,A as q,a as Pe,e as j,b as L,d as B,k as J,D as I,j as Ra,f as D,E as Me,l as Fe}from"./page-dashboard-CJ6xbCKe.js";import{B as C,T as ma,f as ua,g as F,h as K,L as Z,I as H,S as $a,a as za,b as qa,c as Ma,d as le,i as Fa,s as Ka,j as Ga,P as pa,k as Ua,l as Ha,O as Wa}from"./page-agents-DeZsz5jS.js";import{n as Ae,H as Ke,c as se,Z as W,an as Ie,_ as Va,O as Q,R as ge,b as he,ao as me,E as X,S as Se,A as fe,F as oe,e as je,a1 as be,G as xa,X as Za,Q as ga,P as Y,q as ha,ap as Ja,m as Qa,x as Xa,J as ue,aq as Ya,ar as en,as as an,at as De,f as fa,au as Ge,av as Ue,W as He,N as re,K as ja,aw as nn,a7 as sn,ax as on,v as tn,w as rn,t as ln,z as cn,ay as dn,az as mn,aA as ce,g as ba,aB as We,aC as Te,aD as ve,aE as un,aF as va,L as pn,d as xn,$ as gn}from"./vendor-icons-amnWLyN6.js";import{A as Ve,m as Ze}from"./vendor-motion-BlnQqqQC.js";import{D as hn,a as fn,b as jn,c as bn,d as vn}from"./page-clients-XaODk9KK.js";import{a as Cn,al as Ca}from"./vendor-visuals-CselT4Bf.js";const _n={"/dashboard":[{label:"Dashboard"}],"/agents":[{label:"Agentes"}],"/tasks":[{label:"Tarefas"}],"/content":[{label:"Pipeline de Conteúdo"}],"/office":[{label:"Escritório"}],"/settings":[{label:"Configurações"}],"/alexandria":[{label:"Alexandria"}],"/hermione":[{label:"Alexandria",path:"/alexandria"},{label:"Hermione"}],"/alexandria/pops":[{label:"Alexandria",path:"/alexandria"},{label:"Portal POPs"}],"/alexandria/context":[{label:"Alexandria",path:"/alexandria"},{label:"Contexto"}],"/alexandria/skills":[{label:"Alexandria",path:"/alexandria"},{label:"Skills"}],"/alexandria/openclaw":[{label:"Alexandria",path:"/alexandria"},{label:"OpenClaw"}],"/clients":[{label:"Clientes"}],"/new-client":[{label:"Clientes",path:"/clients"},{label:"Novo Cliente"}],"/hosting":[{label:"Hosting"}],"/claude-code":[{label:"Claude Code"}],"/pop-sla":[{label:"POPs & SLAs"}],"/dicas":[{label:"Dicas & Recursos"}],"/recursos":[{label:"Recursos Centrais"}],"/action-plan":[{label:"Plano de Ação"}]};function V({className:a}){const o=Ba().pathname,s=_n[o]||[{label:kn(o)}],r=[{label:"Início",path:"/dashboard"},...s];return e.jsx("nav",{className:G("flex items-center gap-2 text-sm text-muted-foreground py-2 px-4 border-b border-zinc-800 bg-zinc-900/30",a),"aria-label":"Breadcrumb",children:r.map((t,c)=>{const l=c===r.length-1,i=c===0;return e.jsxs("div",{className:"flex items-center gap-2",children:[c>0&&e.jsx(Ae,{className:"w-4 h-4 text-zinc-600"}),l||!t.path?e.jsxs("span",{className:G("font-medium",l?"text-white":"text-zinc-400"),children:[i&&e.jsx(Ke,{className:"w-4 h-4 inline mr-1"}),t.label]}):e.jsxs(Ea,{to:t.path,className:"font-medium text-zinc-400 hover:text-white transition-colors",children:[i&&e.jsx(Ke,{className:"w-4 h-4 inline mr-1"}),t.label]})]},c)})})}function kn(a){const n=a.split("/").filter(Boolean);return(n[n.length-1]||"Página").split("-").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(" ")}function yn(a){return a?a==="tier1"||a.endsWith("-1")?1:a==="tier3"||a.endsWith("-3")?3:2:2}function Nn(a){return{agent_id:a.id,name:a.name,emoji:a.emoji||"🤖",tier:yn(a.agent_group),system_prompt:a.description||a.role||"",skills:[],status:a.status==="online"?"active":"inactive",created_at:a.created_at}}function de(a,n){if(a.error)throw new Error(a.error.message||`Erro ao carregar ${n}.`);return a.data||[]}const _a=()=>{const[a,n]=x.useState(null),[o,s]=x.useState(!0),[r,t]=x.useState(null),c=x.useCallback(async()=>{try{s(!0),t(null);const[l,i,m,v]=await Promise.all([w.from("rag_documents").select("*").order("created_at",{ascending:!1}),w.from("skills").select("*").eq("status","active").order("name"),w.from("agents_config").select("*").order("name"),w.from("agents").select("id,name,emoji,role,description,status,category,agent_group,slug,created_at").order("name")]),b=de(l,"documentos RAG"),g=de(i,"skills"),_=de(m,"configurações de agentes"),k=de(v,"agentes do dashboard"),E=new Set(_.map(A=>A.agent_id)),P=[..._,...k.filter(A=>!E.has(A.id)).map(Nn)],O={totalDocuments:b.length,totalSkills:g.length,totalAgents:P.length,activeAgents:P.filter(A=>A.status==="active").length};n({documents:b,skills:g,agents:P,stats:O})}catch(l){const i=l instanceof Error?l:new Error("Erro ao carregar dados Alexandria");t(i),console.error("Erro ao carregar Alexandria:",l)}finally{s(!1)}},[]);return x.useEffect(()=>{c()},[c]),{data:a,isLoading:o,error:r,refetch:c}};function Sn({data:a}){const n=[{label:"📚 Documentos",value:a.stats.totalDocuments,icon:se,color:"bg-blue-500/10 text-blue-400"},{label:"⚙️ Skills Ativas",value:a.stats.totalSkills,icon:W,color:"bg-amber-500/10 text-amber-400"},{label:"🤖 Agentes",value:a.stats.totalAgents,icon:Ie,color:"bg-emerald-500/10 text-emerald-400"},{label:"📈 Taxa de Uso",value:"92%",icon:Va,color:"bg-purple-500/10 text-purple-400"}],o={design_system:a.documents.filter(s=>s.type==="design_system").length,pops:a.documents.filter(s=>s.type==="pops").length,slas:a.documents.filter(s=>s.type==="slas").length,client_info:a.documents.filter(s=>s.type==="client_info").length};return e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:n.map(s=>e.jsx(h,{className:"p-6",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground mb-1",children:s.label}),e.jsx("p",{className:"text-3xl font-bold",children:s.value})]}),e.jsx("div",{className:`p-3 rounded-lg ${s.color}`,children:e.jsx(s.icon,{className:"h-5 w-5"})})]})},s.label))}),e.jsxs(h,{className:"p-6",children:[e.jsx("h3",{className:"font-semibold text-lg mb-4",children:"📚 Distribuição de Documentos"}),e.jsx("div",{className:"space-y-4",children:Object.entries(o).map(([s,r])=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between text-sm mb-1",children:[e.jsx("span",{className:"capitalize",children:s.replace("_"," ")}),e.jsx("span",{className:"font-semibold",children:r})]}),e.jsx("div",{className:"w-full bg-muted rounded-full h-2",children:e.jsx("div",{className:"bg-primary rounded-full h-2 transition-all",style:{width:`${a.stats.totalDocuments>0?r/a.stats.totalDocuments*100:0}%`}})})]},s))})]}),e.jsxs(h,{className:"p-6",children:[e.jsx("h3",{className:"font-semibold text-lg mb-4",children:"⭐ Skills mais Usadas"}),a.skills.length===0?e.jsx("p",{className:"text-sm text-muted-foreground",children:"Nenhuma skill encontrada"}):e.jsx("div",{className:"space-y-3",children:a.skills.slice(0,5).map(s=>e.jsxs("div",{className:"flex items-center justify-between p-3 bg-muted rounded-lg",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-xl",children:s.emoji}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-sm",children:s.name}),e.jsx("p",{className:"text-xs text-muted-foreground",children:s.category})]})]}),e.jsx("div",{className:"text-right",children:e.jsxs("p",{className:"text-sm font-semibold",children:[s.success_rate||0,"%"]})})]},s.id))})]}),e.jsxs(h,{className:"p-6",children:[e.jsx("h3",{className:"font-semibold text-lg mb-4",children:"🎯 Status do Ecossistema"}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-muted-foreground",children:"Documentos Indexados"}),e.jsx("span",{className:"font-semibold text-emerald-400",children:"✅ OK"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-muted-foreground",children:"Skills Operacionais"}),e.jsx("span",{className:"font-semibold text-emerald-400",children:"✅ OK"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-muted-foreground",children:"Agentes Online"}),e.jsxs("span",{className:"font-semibold text-emerald-400",children:["✅ ",a.stats.activeAgents,"/",a.stats.totalAgents]})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-muted-foreground",children:"Última Sincronização"}),e.jsx("span",{className:"font-semibold text-emerald-400",children:"✅ Agora"})]})]})]})]})}function Je(a){return!a||a.length===0?[]:typeof a[0]=="string"?a:a.map(n=>n.skill_id)}const Qe={online:{bg:"bg-emerald-500/15",text:"text-emerald-400",label:"Online"},offline:{bg:"bg-red-500/15",text:"text-red-400",label:"Offline"},idle:{bg:"bg-blue-500/15",text:"text-blue-400",label:"Idle"},error:{bg:"bg-red-500/15",text:"text-red-400",label:"Erro"},maintenance:{bg:"bg-amber-500/15",text:"text-amber-400",label:"Manutenção"},active:{bg:"bg-emerald-500/15",text:"text-emerald-400",label:"Ativo"},inactive:{bg:"bg-zinc-500/15",text:"text-zinc-400",label:"Inativo"},testing:{bg:"bg-yellow-500/15",text:"text-yellow-400",label:"Testing"}};function ka({agents:a=[]}){const n=a.filter(s=>s.status==="online"||s.status==="active").length,o=a.reduce((s,r)=>s+Je(r.skills).length,0);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsx(h,{className:"p-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Total de Agentes"}),e.jsx("p",{className:"text-3xl font-bold",children:a.length})]}),e.jsx(Ie,{className:"h-8 w-8 text-primary opacity-20"})]})}),e.jsx(h,{className:"p-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Online"}),e.jsx("p",{className:"text-3xl font-bold",children:n})]}),e.jsx("div",{className:"w-3 h-3 bg-green-500 rounded-full opacity-50"})]})}),e.jsx(h,{className:"p-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Skills Associadas"}),e.jsx("p",{className:"text-3xl font-bold",children:o})]}),e.jsx(W,{className:"h-8 w-8 text-amber-500 opacity-20"})]})})]}),a.length===0?e.jsx(h,{className:"p-8 text-center",children:e.jsx("p",{className:"text-muted-foreground",children:"Nenhum agente encontrado"})}):e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:a.map(s=>{const r=Qe[s.status]||Qe.offline;return e.jsxs(h,{className:"p-6 hover:shadow-lg transition-shadow",children:[e.jsx("div",{className:"flex items-start justify-between mb-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"text-3xl",children:s.emoji}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold",children:s.name}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:["Tier ",s.tier]})]})]})}),e.jsx("div",{className:"mb-4",children:e.jsx(C,{className:`${r.bg} ${r.text} border-0`,children:r.label})}),e.jsxs("div",{className:"mb-4",children:[e.jsx("p",{className:"text-xs text-muted-foreground mb-1",children:"Prompt:"}),e.jsx("p",{className:"text-xs bg-muted p-2 rounded line-clamp-2",children:s.system_prompt})]}),(()=>{const t=Je(s.skills);return e.jsxs("div",{children:[e.jsxs("p",{className:"text-xs text-muted-foreground mb-2",children:["Skills (",t.length,")"]}),e.jsxs("div",{className:"flex flex-wrap gap-1",children:[t.slice(0,3).map(c=>e.jsx(C,{variant:"outline",className:"text-xs",children:c},c)),t.length>3&&e.jsxs(C,{variant:"outline",className:"text-xs",children:["+",t.length-3]})]})]})})()]},s.agent_id)})})]})}function Dn(){const{data:a,isLoading:n,error:o,refetch:s}=_a(),[r]=Oa(),t=r.get("tab"),[c,l]=x.useState(t==="exports"||t==="bridges"?t:"dashboard"),i=da();return n?e.jsx("div",{className:"flex items-center justify-center min-h-[60vh]",children:e.jsxs("div",{className:"text-center space-y-4",children:[e.jsx(Q,{className:"h-10 w-10 animate-spin mx-auto text-primary"}),e.jsx("p",{className:"text-muted-foreground",children:"Carregando Alexandria..."})]})}):o||!a?e.jsx("div",{className:"flex items-center justify-center min-h-[60vh]",children:e.jsxs(h,{className:"p-8 text-center max-w-md",children:[e.jsx("p",{className:"text-destructive font-semibold mb-2",children:"Erro ao carregar dados"}),e.jsx("p",{className:"text-sm text-muted-foreground mb-4",children:o?.message||"Não foi possível conectar ao Supabase"}),e.jsxs(f,{onClick:s,variant:"outline",size:"sm",children:[e.jsx(ge,{className:"h-4 w-4 mr-2"}),"Tentar novamente"]})]})}):e.jsxs(q,{children:[e.jsx(V,{}),e.jsxs("div",{className:"space-y-6 p-4 sm:p-6",children:[e.jsx(Pe,{eyebrow:"Knowledge First",title:"Alexandria",description:"Second brain do Totum OS: fontes, artefatos, skills, POPs, decisões e pacotes de contexto para usar dentro ou fora do sistema.",icon:se,actions:e.jsxs(e.Fragment,{children:[e.jsxs(f,{onClick:()=>i("/hermione"),className:"gap-2",children:[e.jsx(he,{className:"h-4 w-4"}),"Consultar Hermione"]}),e.jsxs(f,{onClick:s,variant:"outline",size:"sm",children:[e.jsx(ge,{className:"h-4 w-4 mr-2"}),"Atualizar"]})]})}),e.jsx(h,{className:"border-primary/20 bg-card",children:e.jsxs(j,{className:"flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"grid h-10 w-10 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary",children:e.jsx(me,{className:"h-5 w-5"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold",children:"Hermione assimila documentos e devolve artefatos utilizáveis"}),e.jsx("p",{className:"mt-1 max-w-3xl text-sm text-muted-foreground",children:"Envie MDs e textos de várias IAs para analisar, unificar, apontar lacunas e gerar skills, POPs, prompts, decisões ou pacotes de contexto com download."}),e.jsx("div",{className:"mt-3 flex flex-wrap gap-2",children:["Claude","Kimi","ChatGPT","Gemini","MCP"].map(m=>e.jsx(C,{variant:"outline",children:m},m))})]})]}),e.jsxs(f,{variant:"outline",onClick:()=>i("/hermione"),className:"shrink-0 gap-2",children:[e.jsx(X,{className:"h-4 w-4"}),"Criar artefato"]})]})}),e.jsx(h,{className:"border-border/80 bg-white",children:e.jsxs(j,{className:"flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-secondary text-primary",children:e.jsx(Se,{className:"h-5 w-5"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-foreground",children:"Tutorial interativo da Alexandria"}),e.jsx("p",{className:"mt-1 max-w-3xl text-sm text-muted-foreground",children:"Um tour guiado para entender o papel de cada página, como elas se conectam e qual resultado esperar no uso do dia a dia."})]})]}),e.jsxs(f,{onClick:()=>i("/alexandria/tutorial"),className:"shrink-0 gap-2",children:["Abrir tutorial",e.jsx(fe,{className:"h-4 w-4"})]})]})}),e.jsxs(ma,{value:c,onValueChange:l,children:[e.jsxs(ua,{className:"grid w-full grid-cols-3 md:grid-cols-6",children:[e.jsxs(F,{value:"dashboard",className:"flex items-center gap-2",children:[e.jsx(W,{className:"h-4 w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Biblioteca"})]}),e.jsxs(F,{value:"pops",className:"flex items-center gap-2",children:[e.jsx(oe,{className:"h-4 w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"POPs & SLAs"})]}),e.jsxs(F,{value:"context",className:"flex items-center gap-2",children:[e.jsx(Ie,{className:"h-4 w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Context Hub"})]}),e.jsxs(F,{value:"skills",className:"flex items-center gap-2",children:[e.jsx(se,{className:"h-4 w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Skills Center"})]}),e.jsxs(F,{value:"bridges",className:"flex items-center gap-2",children:[e.jsx(je,{className:"h-4 w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Conexões"})]}),e.jsxs(F,{value:"exports",className:"flex items-center gap-2",children:[e.jsx(be,{className:"h-4 w-4"}),e.jsx("span",{className:"hidden sm:inline",children:"Exportar"})]})]}),e.jsx(K,{value:"dashboard",className:"mt-6",children:e.jsx(Sn,{data:a})}),e.jsx(K,{value:"pops",className:"mt-6",children:e.jsx("div",{className:"flex items-center justify-center min-h-[40vh]",children:e.jsxs(h,{className:"max-w-md w-full",children:[e.jsxs(L,{className:"text-center pb-2",children:[e.jsx("div",{className:"mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10",children:e.jsx(oe,{className:"h-7 w-7 text-primary"})}),e.jsx(B,{className:"text-xl",children:"Portal POPs & SLAs"}),e.jsx(J,{children:"Gerencie Procedimentos Operacionais Padrão e Acordos de Nível de Serviço do ecossistema Totum."})]}),e.jsx(j,{className:"flex justify-center pt-4",children:e.jsxs(f,{onClick:()=>i("/alexandria/pops"),className:"gap-2",children:[e.jsx(X,{className:"h-4 w-4"}),"Abrir"]})})]})})}),e.jsx(K,{value:"context",className:"mt-6",children:e.jsx(ka,{agents:a.agents})}),e.jsx(K,{value:"skills",className:"mt-6",children:e.jsx("div",{className:"flex items-center justify-center min-h-[40vh]",children:e.jsxs(h,{className:"max-w-md w-full",children:[e.jsxs(L,{className:"text-center pb-2",children:[e.jsx("div",{className:"mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10",children:e.jsx(W,{className:"h-7 w-7 text-amber-500"})}),e.jsx(B,{className:"text-xl",children:"Skills Central"}),e.jsx(J,{children:"Explore e gerencie todas as skills disponíveis nos agentes do ecossistema Totum."})]}),e.jsx(j,{className:"flex justify-center pt-4",children:e.jsxs(f,{onClick:()=>i("/alexandria/skills"),className:"gap-2",children:[e.jsx(X,{className:"h-4 w-4"}),"Abrir"]})})]})})}),e.jsx(K,{value:"bridges",className:"mt-6",children:e.jsx(h,{className:"border-primary/20 bg-card",children:e.jsxs(j,{className:"flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"grid h-10 w-10 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary",children:e.jsx(je,{className:"h-5 w-5"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold",children:"Conectar Segundo Cérebro sem vazar vida pessoal"}),e.jsx("p",{className:"mt-1 max-w-3xl text-sm text-muted-foreground",children:"Importe apenas pacotes sanitizados da Bulma/Logseq, classifique verde/amarelo/vermelho e crie uma fonte rastreável na Alexandria."})]})]}),e.jsxs(f,{onClick:()=>i("/alexandria/bridges"),className:"shrink-0 gap-2",children:[e.jsx(X,{className:"h-4 w-4"}),"Abrir Conexões"]})]})})}),e.jsx(K,{value:"exports",className:"mt-6",children:e.jsx("div",{className:"grid gap-4 lg:grid-cols-3",children:[{title:"Pacote Claude",description:"Contexto longo, instruções, fontes e decisões em Markdown para continuar no Claude.",icon:he},{title:"Pacote ChatGPT/Gemini",description:"Prompt principal, exemplos, restrições e saída esperada para execução rápida.",icon:Se},{title:"Pacote MCP/local",description:"Estrutura preparada para futuras inserções de contexto e skills em apps locais de IA.",icon:xa}].map(m=>e.jsx(I,{children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"grid h-10 w-10 shrink-0 place-items-center border border-border bg-muted text-muted-foreground",children:e.jsx(m.icon,{className:"h-5 w-5"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-foreground",children:m.title}),e.jsx("p",{className:"mt-1 text-sm text-muted-foreground",children:m.description}),e.jsx(f,{className:"mt-4",variant:"outline",onClick:()=>i("/ai-command-center"),children:"Preparar no Command Center"})]})]})},m.title))})})]})]})]})}const ft=Object.freeze(Object.defineProperty({__proto__:null,default:Dn},Symbol.toStringTag,{value:"Module"}));function Le(a,n,o){const s=new Blob([a],{type:o}),r=URL.createObjectURL(s),t=document.createElement("a");t.href=r,t.download=n,document.body.appendChild(t),t.click(),t.remove(),URL.revokeObjectURL(r)}const Tn=new Set(["para","com","uma","que","dos","das","como","mais","isso","essa","esse","pela","pelo","the","and","with","from","this","that","your","about","into"]),wn=["senha","password","token:","access token","bearer ","api_key","secret","service_role","cpf","cartao","cartão","dados banc"];async function Pn(a){if(globalThis.crypto?.subtle){const o=new TextEncoder().encode(a),s=await globalThis.crypto.subtle.digest("SHA-256",o);return Array.from(new Uint8Array(s)).map(r=>r.toString(16).padStart(2,"0")).join("")}let n=0;for(let o=0;o<a.length;o+=1)n=(n<<5)-n+a.charCodeAt(o),n|=0;return`fallback-${Math.abs(n)}`}async function ya(a){const n=a.content.replace(/\r\n?/g,`
`),o=[];let s=An(n,o);s!==a.content&&o.push("Conteúdo normalizado antes de salvar."),s=s.normalize("NFC");const r=Bn(a.name,s);return{...a,content:s,originalContent:a.content,contentHash:await Pn(s),sanitizationWarnings:R(o),privacyZone:r.privacyZone,privacyReason:r.reason}}function An(a,n){let o="";for(const s of a){const r=s.charCodeAt(0);if(r<32&&r!==9&&r!==10&&r!==13||r===127){n.push(`Caractere de controle removido: U+${r.toString(16).padStart(4,"0")}`);continue}o+=s}return o}async function jt(a){const n=await Promise.all(a.map(ya)),o=n.filter(k=>k.privacyZone!=="red"),s=n.filter(k=>k.privacyZone==="red"),r=o.map(k=>Be(k.name,k.content)),t=await En(o),c=await On(r),l=Rn(o,t),i=$n(r,c,o,l),m=zn(r,c),v=R(r.flatMap(k=>k.gaps)).slice(0,12),b=Sa(r.length?r:[{recommendedOutput:"document"}]),g=s.length||m.some(k=>k.severity==="high")||i.length?"review":"draft",_={generatedAt:new Date().toISOString(),files:n,allowedFiles:o,blockedFiles:s,analyses:r,exactDuplicates:l,nearDuplicates:i,conflicts:m,gaps:v,relatedArtifacts:c,recommendedStatus:g,recommendedArtifactType:b};return{..._,reportMarkdown:qn(_)}}function Be(a,n){const o=Gn(n),s=we(`${a} ${n}`).slice(0,12),r=Fn(a,n),t=Un(n),c=Ye(n,["conflito","contradi","diverg","versus"," vs ","não usar","evitar","problema"]),l=Ye(n,["risco","cuidado","atenção","falha","erro","bloqueio"]),i=Hn(n,r),m=Array.from(new Set([r,...s.slice(0,6)])).slice(0,8);return{name:a,detectedType:r,title:o[0]||Xn(a),headings:o,tags:m,keywords:s,keyIdeas:t,risks:l,gaps:i,conflicts:c,recommendedOutput:r==="document"?Kn(n):r}}async function Ee(a){const o=(await Promise.all(a.map(ya))).filter(l=>l.privacyZone!=="red"),s=new Map;for(const l of o){const i=Be(l.name,l.content);s.has(l.contentHash)||s.set(l.contentHash,{title:i.title,file_name:l.name,source_type:l.name.toLowerCase().match(/\.(md|markdown)$/)?"markdown":"text",origin:l.origin||"upload",author:l.author||Qn(l.name,l.content),content:l.content,content_hash:l.contentHash,detected_type:i.detectedType,tags:i.tags,metadata:{headings:i.headings,keywords:i.keywords,keyIdeas:i.keyIdeas,risks:i.risks,gaps:i.gaps,conflicts:i.conflicts,recommendedOutput:i.recommendedOutput,originalName:l.name,privacyZone:l.privacyZone,privacyReason:l.privacyReason,sanitizationWarnings:l.sanitizationWarnings}})}const r=Array.from(s.values());if(!r.length)return[];const{data:t,error:c}=await w.from("hermione_sources").upsert(r,{onConflict:"content_hash"}).select("*");if(c)throw new Error(`Não consegui salvar as fontes da Hermione: ${c.message}`);return t||[]}async function bt(a){if(!a.allowedFiles.length)throw new Error("Nenhum arquivo permitido para assimilar na Alexandria.");const n=a.allowedFiles.filter(t=>!a.exactDuplicates.some(c=>c.name===t.name)).map(({name:t,content:c,origin:l,author:i})=>({name:t,content:c,origin:l,author:i})),o=n.length?n:a.allowedFiles.map(({name:t,content:c,origin:l,author:i})=>({name:t,content:c,origin:l,author:i})),s=await Ee(o),r=await Oe(o,{sourceIds:s.map(t=>t.id),type:a.recommendedArtifactType,status:a.recommendedStatus,changeNote:"Assimilação após simulação da Hermione",metadata:{assimilationPreview:{generatedAt:a.generatedAt,exactDuplicates:a.exactDuplicates,nearDuplicates:a.nearDuplicates,conflicts:a.conflicts,blockedFiles:a.blockedFiles.map(t=>({name:t.name,reason:t.privacyReason})),relatedArtifacts:a.relatedArtifacts.map(t=>({id:t.id,title:t.title,status:t.status,artifact_type:t.artifact_type}))},assimilationReport:a.reportMarkdown}});return await Ln({query:`Relatório de assimilação: ${a.allowedFiles.map(t=>t.name).join(", ")}`,response:a.reportMarkdown,sourceIds:s.map(t=>t.id),artifactIds:[r.id],metadata:{exactDuplicates:a.exactDuplicates.length,nearDuplicates:a.nearDuplicates.length,conflicts:a.conflicts.length,blockedFiles:a.blockedFiles.length}}),{sources:s,artifact:r}}function vt(a,n="markdown"){const o=n==="json"?JSON.stringify(a,null,2):a.reportMarkdown;Le(o,`relatorio-assimilacao-hermione.${n==="json"?"json":"md"}`,n==="json"?"application/json":"text/markdown")}function In(a){const n=a.map(m=>Be(m.name,m.content)),o=Sa(n),s=Wn(n,o),r=R(n.flatMap(m=>m.conflicts)).slice(0,8),t=R(n.flatMap(m=>m.gaps)).slice(0,8),c=R(n.flatMap(m=>m.tags)).slice(0,12),l=Vn(n,o,a.length),i=Zn({title:s,artifactType:o,summary:l,tags:c,analysis:n,conflicts:r,gaps:t});return{title:s,artifactType:o,summary:l,tags:c,analysis:n,content:i,conflicts:r,gaps:t}}async function Oe(a,n={}){const o=In(a),s=n.type||o.artifactType,r={title:o.title,artifact_type:s,status:n.status||"draft",scope:n.scope||"totum",content:s===o.artifactType?o.content:Jn(o,s),summary:o.summary,tags:o.tags,metadata:{sourceCount:a.length,conflicts:o.conflicts,gaps:o.gaps,analyses:o.analysis,...n.metadata||{}},version:1},{data:t,error:c}=await w.from("hermione_artifacts").insert(r).select("*").single();if(c)throw new Error(`Não consegui criar o artefato da Hermione: ${c.message}`);const{error:l}=await w.from("hermione_artifact_versions").insert({artifact_id:t.id,version:1,content:r.content,change_note:n.changeNote||"Criação a partir do chat consultivo da Hermione",metadata:r.metadata});if(l)throw new Error(`Artefato criado, mas falhei ao registrar a versão: ${l.message}`);if(n.sourceIds?.length){const{error:i}=await w.from("hermione_artifact_sources").insert(n.sourceIds.map(m=>({artifact_id:t.id,source_id:m,contribution_type:"source"})));if(i)throw new Error(`Artefato criado, mas falhei ao vincular fontes: ${i.message}`)}return t}async function Xe(a="",n=12){let o=w.from("hermione_artifacts").select("*").order("updated_at",{ascending:!1}).limit(n);if(a.trim()){const t=a.trim().replace(/[,%]/g,"");o=o.or(`title.ilike.%${t}%,summary.ilike.%${t}%,content.ilike.%${t}%`)}const{data:s,error:r}=await o;return r?(console.warn("Hermione artifacts unavailable:",r.message),[]):s||[]}async function Ln(a){const{error:n}=await w.from("hermione_consultations").insert({query:a.query,response:a.response||null,source_ids:a.sourceIds||[],artifact_ids:a.artifactIds||[],metadata:a.metadata||{}});if(n)throw new Error(`Não consegui registrar a consulta da Hermione: ${n.message}`)}function Ct(a,n="markdown"){const o=n==="json"?JSON.stringify(a,null,2):a.content,s=n==="json"?"application/json":"text/markdown",r=n==="json"?"json":"md";Le(o,`${Yn(a.title)}.${r}`,s)}function Bn(a,n){const o=`${a}
${n}`.toLowerCase(),s=wn.find(r=>o.includes(r));return s?{privacyZone:"red",privacyReason:`Sinal sensível detectado: ${s}.`}:/pessoal|rotina|prefer[eê]ncia|logseq|journal|di[aá]rio/i.test(o)?{privacyZone:"yellow",privacyReason:"Contexto pessoal/operacional permitido somente com revisão."}:{privacyZone:"green",privacyReason:"Nenhum sinal sensível conhecido detectado."}}async function En(a){const n=R(a.map(r=>r.contentHash));if(!n.length)return[];const{data:o,error:s}=await w.from("hermione_sources").select("*").in("content_hash",n);return s?(console.warn("Hermione sources unavailable for preview:",s.message),[]):o||[]}async function On(a){const n=R(a.flatMap(r=>[r.title,...r.tags])).slice(0,6);if(!n.length)return Xe("",8);const o=await Promise.all(n.map(r=>Xe(r,4))),s=new Map;return o.flat().forEach(r=>s.set(r.id,r)),Array.from(s.values()).slice(0,10)}function Rn(a,n){const o=[],s=new Map,r=new Map(n.map(t=>[t.content_hash,t]));return a.forEach(t=>{const c=r.get(t.contentHash);if(c){o.push({name:t.name,match:c.file_name,severity:"exact",reason:"Mesmo hash de uma fonte já catalogada na Alexandria."});return}const l=s.get(t.contentHash);if(l){o.push({name:t.name,match:l,severity:"exact",reason:"Mesmo hash de outro arquivo selecionado nesta assimilação."});return}s.set(t.contentHash,t.name)}),o}function $n(a,n,o,s){const r=new Set(s.map(c=>c.name)),t=[];return a.forEach((c,l)=>{const i=o[l];if(!i||r.has(i.name))return;const m=n.find(v=>c.tags.filter(g=>v.tags?.includes(g)).length>=2||Na(c.title,v.title)>=.65);m&&t.push({name:i.name,match:m.title,severity:"near",reason:`Tema parecido com artefato existente (${m.status}/${m.artifact_type}).`})}),t}function zn(a,n){const o=a.filter(t=>t.conflicts.length>0).map(t=>({topic:t.title,severity:"high",sources:[t.name],recommendation:"Manter em revisão humana antes de aprovar ou substituir conhecimento existente."})),s=n.filter(t=>t.status==="approved"),r=a.filter(t=>s.some(c=>Na(t.title,c.title)>=.65)).map(t=>({topic:`Possível atualização de conhecimento aprovado: ${t.title}`,severity:"medium",sources:[t.name,...s.map(c=>c.title).slice(0,2)],recommendation:"Não sobrescrever automaticamente. Gerar nova versão em review e pedir aprovação."}));return Mn([...o,...r],t=>`${t.topic}-${t.sources.join(",")}`).slice(0,12)}function qn(a){const n=a.allowedFiles.map(i=>`- **${i.name}**: ${i.privacyZone}; hash \`${i.contentHash.slice(0,12)}\`; ${i.privacyReason}`).join(`
`)||"- Nenhuma fonte permitida.",o=a.blockedFiles.map(i=>`- **${i.name}**: ${i.privacyReason}`).join(`
`)||"- Nenhuma fonte bloqueada.",s=a.exactDuplicates.map(i=>`- **${i.name}** duplica **${i.match}**: ${i.reason}`).join(`
`)||"- Nenhuma duplicata exata encontrada.",r=a.nearDuplicates.map(i=>`- **${i.name}** parece relacionado a **${i.match}**: ${i.reason}`).join(`
`)||"- Nenhuma duplicata próxima relevante encontrada.",t=a.conflicts.map(i=>`- **${i.topic}** (${i.severity}): ${i.recommendation} Fontes: ${i.sources.join(", ")}`).join(`
`)||"- Nenhum conflito crítico detectado.",c=a.relatedArtifacts.map(i=>`- **${i.title}**: ${i.status}/${i.artifact_type}`).join(`
`)||"- Nenhum artefato relacionado encontrado.",l=a.gaps.map(i=>`- ${i}`).join(`
`)||"- Nenhuma lacuna crítica detectada.";return`# Relatório de Assimilação Hermione

Gerado em: ${a.generatedAt}

## Resumo

- Arquivos analisados: ${a.files.length}
- Fontes permitidas: ${a.allowedFiles.length}
- Fontes bloqueadas: ${a.blockedFiles.length}
- Duplicatas exatas: ${a.exactDuplicates.length}
- Duplicatas próximas: ${a.nearDuplicates.length}
- Conflitos: ${a.conflicts.length}
- Artefato recomendado: ${a.recommendedArtifactType}
- Status recomendado: ${a.recommendedStatus}

## Fontes Permitidas

${n}

## Fontes Bloqueadas

${o}

## Conhecimento Existente Relacionado

${c}

## Duplicatas Exatas

${s}

## Duplicatas Próximas

${r}

## Conflitos

${t}

## Lacunas

${l}

## Recomendações da Hermione

- Não sobrescrever conhecimento aprovado automaticamente.
- Usar autoridade/status antes de data; data serve como desempate.
- Criar ou atualizar artefato em revisão quando houver conflito, duplicata próxima ou fonte amarela.
- Preservar todas as fontes e decisões de síntese para rastreabilidade.
`}function Na(a,n){const o=new Set(we(a).slice(0,8)),s=new Set(we(n).slice(0,8));return!o.size||!s.size?0:Array.from(o).filter(t=>s.has(t)).length/Math.max(o.size,s.size)}function Mn(a,n){const o=new Set;return a.filter(s=>{const r=n(s);return o.has(r)?!1:(o.add(r),!0)})}function Fn(a,n){const o=`${a} ${n}`.toLowerCase();return o.includes("skill.md")||o.includes("quando usar")||o.includes("entrada")&&o.includes("saída")?"skill":o.includes("pop-")||o.includes("procedimento operacional")||o.includes("sla")?"pop":o.includes("system prompt")||o.includes("prompt")||o.includes("instruções do agente")?"prompt":o.includes("decisão")||o.includes("adr")||o.includes("decision record")?"decision":o.includes("contexto")||o.includes("context pack")||o.includes("memória")?"context_pack":o.includes("resumo")||o.includes("summary")?"summary":"document"}function Kn(a){const n=a.toLowerCase();return n.includes("passo")||n.includes("checklist")?"pop":n.includes("habilidade")||n.includes("capability")||n.includes("workflow")?"skill":n.includes("decidir")||n.includes("tradeoff")?"decision":"document"}function Gn(a){return a.split(`
`).map(n=>n.match(/^#{1,4}\s+(.+)$/)?.[1]?.trim()).filter(Boolean).slice(0,12)}function Un(a){const n=a.split(/\n+/).map(o=>o.replace(/^[-*]\s+/,"").trim()).filter(o=>o.length>=48&&o.length<=220).filter(o=>/deve|precisa|permite|central|skill|contexto|agente|documento|conhecimento|gerar|unificar|analisar/i.test(o));return R(n).slice(0,8)}function Ye(a,n){return R(a.split(/\n+/).map(o=>o.replace(/^[-*]\s+/,"").trim()).filter(o=>o.length>20).filter(o=>n.some(s=>o.toLowerCase().includes(s)))).slice(0,6)}function Hn(a,n){const o=a.toLowerCase(),s=[];return!o.includes("fonte")&&!o.includes("source")&&s.push("Fonte/origem pouco explícita."),o.includes("exemplo")||s.push("Faltam exemplos de uso."),n==="skill"&&!o.includes("entrada")&&s.push("Skill sem schema claro de entrada."),n==="skill"&&!o.includes("saída")&&s.push("Skill sem schema claro de saída."),(n==="pop"||n==="decision")&&!o.includes("status")&&s.push("Status editorial não definido."),s}function we(a){const n={};return a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g," ").split(/\s+/).forEach(o=>{o.length>3&&!Tn.has(o)&&(n[o]=(n[o]||0)+1)}),Object.entries(n).sort((o,s)=>s[1]-o[1]).map(([o])=>o)}function Sa(a){const o=a.map(s=>s.recommendedOutput).reduce((s,r)=>(s[r]=(s[r]||0)+1,s),{});return Object.entries(o).sort((s,r)=>r[1]-s[1])[0]?.[0]||"document"}function Wn(a,n){const o=a.find(r=>r.title&&r.title.length>3)?.title,s={skill:"Skill consolidada",pop:"POP consolidado",prompt:"Prompt consolidado",decision:"Decisão consolidada",summary:"Resumo consolidado",document:"Documento consolidado",context_pack:"Pacote de contexto consolidado"};return o?`${s[n]}: ${o}`:s[n]}function Vn(a,n,o){const s=R(a.flatMap(r=>r.tags)).slice(0,5).join(", ");return`Hermione analisou ${o} fonte${o===1?"":"s"} e recomenda gerar um artefato do tipo ${n}. Temas principais: ${s||"conhecimento geral"}.`}function Zn(a){const n=R(a.analysis.flatMap(s=>s.keyIdeas)).slice(0,12),o=a.analysis.map((s,r)=>`- ${r+1}. **${s.name}**: ${s.detectedType}; ${s.keywords.slice(0,5).join(", ")}`).join(`
`);return`# ${a.title}

> Artefato criado pela Hermione a partir do chat consultivo da Alexandria.

## Resumo

${a.summary}

## Síntese Consolidada

${n.length?n.map(s=>`- ${s}`).join(`
`):"- O material foi consolidado em uma base única, pronta para curadoria e uso por agentes."}

## Recomendação da Hermione

- Tipo recomendado: **${a.artifactType}**
- Status inicial: **draft**
- Próximo passo: revisar, aprovar e publicar na biblioteca da Alexandria.

## Divergências Encontradas

${a.conflicts.length?a.conflicts.map(s=>`- ${s}`).join(`
`):"- Nenhuma divergência explícita encontrada nos documentos enviados."}

## Lacunas

${a.gaps.length?a.gaps.map(s=>`- ${s}`).join(`
`):"- Nenhuma lacuna crítica detectada nesta primeira análise."}

## Fontes

${o}

## Tags

${a.tags.map(s=>`\`${s}\``).join(" ")}
`}function Jn(a,n){return n==="skill"?`# ${a.title}

## Quando Usar

Use esta skill quando a tarefa envolver ${a.tags.slice(0,5).join(", ")}.

## Instruções

${a.content}

## Entrada

- \`documentos\`: lista de fontes ou contexto bruto.
- \`objetivo\`: resultado esperado pelo usuário.

## Saída

- Documento Markdown consolidado.
- Fontes utilizadas.
- Lacunas e divergências.
`:n==="prompt"?`# ${a.title}

Você é Hermione, bibliotecária da Alexandria. Analise as fontes abaixo, preserve rastreabilidade, aponte conflitos e gere uma síntese utilizável por agentes.

${a.content}
`:a.content}function Qn(a,n){const o=`${a} ${n}`.toLowerCase();return o.includes("notebooklm")||o.includes("notebook lm")?"NotebookLM":o.includes("kimi")?"Kimi":o.includes("claude")?"Claude":o.includes("chatgpt")||o.includes("openai")?"ChatGPT":o.includes("gemini")?"Gemini":"upload"}function Xn(a){return a.replace(/\.(md|txt|markdown)$/i,"").replace(/[-_]+/g," ").replace(/\b\w/g,n=>n.toUpperCase())}function Yn(a){return a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,80)}function R(a){return Array.from(new Set(a.filter(Boolean)))}const es=["financas/app","localstorage","cartao","cpf","senha","access token","bearer ","api_key","chave secreta","secret","saúde","saude","doença","doenca","família","familia","miguel","mylena","dados banc"],as=["preferencia","preferência","rotina","agenda","memoria quente","memória quente","pessoal","diario","diário","logseq"],ns=["totum","alexandria","skill","pop","prompt","decisao","decisão","contexto-sanitizado","preferencias-permitidas","manifest"];function ss(a){const n=a.map(Da),o=a.find(s=>s.name.toLowerCase().endsWith("manifest.json"));return{source:"bulma_logseq_bridge",generatedAt:new Date().toISOString(),files:n,importableFiles:n.filter(s=>s.zone==="green"),allowedFiles:n.filter(s=>s.zone!=="red"),reviewFiles:n.filter(s=>s.zone==="yellow"),blockedFiles:n.filter(s=>s.zone==="red"),manifest:o?ls(o.content):void 0}}function Da(a){const n=`${a.name}
${a.content}`.toLowerCase(),o=es.find(t=>n.includes(t)),s=as.find(t=>n.includes(t)),r=ns.find(t=>n.includes(t));return o?{...a,zone:"red",label:"Bloqueado",reason:`Sinal sensível detectado: ${o}.`,suggestedAction:"Manter apenas no Mac/Bulma e gerar um resumo sanitizado antes de enviar.",tags:["privacy:red","blocked",o.replace(/\s+/g,"-")]}:s?{...a,zone:"yellow",label:"Permitido com cuidado",reason:`Contexto pessoal permitido ou operacional detectado: ${s}.`,suggestedAction:"Importar como contexto temporário ou preferência permitida, sem detalhes íntimos.",tags:["privacy:yellow","sanitized",s.replace(/\s+/g,"-")]}:{...a,zone:"green",label:r?"Permitido":"Permitido após revisão",reason:r?`Conteúdo operacional detectado: ${r}.`:"Nenhum sinal sensível conhecido foi encontrado nesta primeira análise.",suggestedAction:"Importar para Alexandria como fonte rastreável.",tags:["privacy:green","bulma-bridge",r||"reviewed"]}}async function os(a){const n=a.importableFiles||a.allowedFiles.filter(r=>r.zone==="green");if(!n.length)throw new Error("Nenhum arquivo verde para importar. Revise os amarelos na Bulma antes de assimilar.");const o=n.map(r=>({name:r.name,content:is(r),origin:"bulma_logseq_bridge",author:"Bulma"})),s=await Ee(o);return Oe(o,{type:"context_pack",status:"review",scope:"personal_allowed",sourceIds:s.map(r=>r.id),changeNote:"Importação de pacote sanitizado da Bulma/Logseq Bridge",metadata:{bridge:"bulma_logseq_bridge",privacyModel:"green-yellow-red",importedFiles:n.map(({name:r,zone:t,tags:c})=>({name:r,zone:t,tags:c})),reviewFiles:a.reviewFiles.map(({name:r,reason:t})=>({name:r,reason:t})),blockedFiles:a.blockedFiles.map(({name:r,reason:t})=>({name:r,reason:t})),manifest:a.manifest||null}})}function ts(){return JSON.stringify({name:"bulma-to-alexandria-context-pack",source:"bulma_logseq_bridge",generated_at:"2026-04-27T00:00:00.000Z",vault:"Logseq local sanitizado",privacy_policy:{green:"Pode entrar na Alexandria.",yellow:"Pode entrar apenas como resumo permitido.",red:"Nunca enviar para Alexandria."},files:["contexto-sanitizado.md","preferencias-permitidas.md","decisoes.md","tags.json"]},null,2)}function rs(){return`# Pacote Bulma -> Alexandria

Origem: Bulma / Logseq local
Destino: Alexandria / Totum OS
Status: sanitizado

## O que este pacote pode conter

- Preferências permitidas de trabalho
- Decisões que afetam Totum OS ou operação
- Contexto de estudo que pode ajudar agentes
- Resumos sem dados íntimos

## O que este pacote não pode conter

- Finanças pessoais detalhadas
- Saúde e família
- Tokens, senhas, chaves ou dados bancários
- Journals brutos do Logseq

## Checklist antes de importar

- [ ] Revisei arquivos vermelhos e removi do pacote
- [ ] Mantive apenas verde/amarelo
- [ ] O pacote tem manifest.json
- [ ] A Bulma/Xavier validou o roteamento
`}function is(a){return`---
source: bulma_logseq_bridge
privacy_zone: ${a.zone}
privacy_label: ${a.label}
review_status: pending
---

${a.content}`}function ls(a){try{return JSON.parse(a)}catch{return}}const pe="totum.googleDriveToken",cs=new Set(["text/markdown","text/plain","application/json","application/vnd.google-apps.document"]);function ea(a,n){const o=xs(n.map(m=>ms(m))),s=o.filter(m=>m.isSkillCandidate),r=o.filter(m=>m.isDuplicate),t=s.filter(m=>m.zone==="green"&&!m.isDuplicate),c=s.filter(m=>m.zone==="yellow"||m.isDuplicate),l=o.filter(m=>m.zone==="red"),i={source:a,scope:"skills",generatedAt:new Date().toISOString(),files:o,skillCandidates:s,importableSkills:t,blockedFiles:l,reviewFiles:c,duplicateFiles:r};return{...i,health:us(i)}}async function ds(a){if(!a.importableSkills.length)throw new Error("Nenhuma skill verde pronta para importar.");const n=a.importableSkills.map(t=>({name:t.sourcePath||t.name,content:Cs(a.source,t),origin:a.source,author:a.source==="google_drive"?"Google Drive":"Logseq local"})),o=await Ee(n),s=a.importableSkills.length===1?"skill":"context_pack",r=await Oe(n,{sourceIds:o.map(t=>t.id),type:s,status:"review",scope:"totum",changeNote:`Sincronização inicial de skills via ${a.source}`,metadata:{syncSource:a.source,syncScope:a.scope,importedSkills:a.importableSkills.map(t=>({name:t.name,sourcePath:t.sourcePath||null,externalId:t.externalId||null,webViewLink:t.webViewLink||null,modifiedTime:t.modifiedTime||null,skillReason:t.skillReason,privacyZone:t.zone,tags:t.tags})),reviewFiles:a.reviewFiles.map(t=>({name:t.name,reason:t.zoneReason,skillReason:t.skillReason,duplicateCount:t.duplicateCount})),blockedFiles:a.blockedFiles.map(t=>({name:t.name,reason:t.zoneReason})),duplicateFiles:a.duplicateFiles.map(t=>({name:t.name,identityKey:t.identityKey,duplicateCount:t.duplicateCount})),health:a.health}});return{sources:o,artifact:r,importedSkills:a.importableSkills.length}}function ms(a){const n=Da({name:a.sourcePath||a.name,content:a.content}),o=gs(a);return{...a,identityKey:ps(a),zone:n.zone,zoneLabel:n.label,zoneReason:n.reason,suggestedAction:n.suggestedAction,tags:n.tags,isSkillCandidate:o.isSkillCandidate,skillReason:o.reason,duplicateCount:1,isDuplicate:!1}}function us(a){const n=[];if(!a.files.length)return{status:"empty",score:0,nextAction:"Selecionar uma pasta ou pacote de arquivos para análise.",warnings:["Nenhum arquivo foi analisado nesta rodada."]};a.skillCandidates.length||n.push("Nenhum arquivo com formato de skill foi detectado."),a.duplicateFiles.length&&n.push(`${a.duplicateFiles.length} arquivo(s) duplicado(s) ficaram fora da importação automática.`),a.blockedFiles.length&&n.push(`${a.blockedFiles.length} arquivo(s) vermelho(s) bloqueado(s) por política de privacidade.`),a.reviewFiles.length&&n.push(`${a.reviewFiles.length} skill(s) precisam de revisão antes de entrar na Alexandria.`);const o=Math.round(a.importableSkills.length/Math.max(a.skillCandidates.length,1)*100);return a.importableSkills.length?{status:a.reviewFiles.length||a.blockedFiles.length?"needs_review":"ready",score:o,nextAction:"Importar as skills verdes e manter duplicatas/amarelos para revisão.",warnings:n}:{status:a.blockedFiles.length?"blocked":"needs_review",score:o,nextAction:"Revisar o pacote de origem antes de sincronizar.",warnings:n}}function ps(a){return(a.externalId||a.sourcePath||a.name).trim().toLowerCase()}function xs(a){const n=a.reduce((s,r)=>(s[r.identityKey]=(s[r.identityKey]||0)+1,s),{}),o=new Set;return a.map(s=>{const r=n[s.identityKey]||1,t=o.has(s.identityKey);return o.add(s.identityKey),{...s,duplicateCount:r,isDuplicate:r>1&&t}})}function gs(a){const n=`${a.sourcePath||a.name}`.toLowerCase();return a.content.toLowerCase(),/(^|\/)(skills?|agents?)\//.test(n)?{isSkillCandidate:!0,reason:"Caminho indica catálogo de skills."}:/(\n|^)type\s*[:=]{1,2}\s*skill(\n|$)/i.test(a.content)||/(\n|^)tipo\s*[:=]{1,2}\s*skill(\n|$)/i.test(a.content)?{isSkillCandidate:!0,reason:"Frontmatter ou propriedade indica type=skill."}:/skill_id:|## entradas|## saídas|recommended_skills|execution_plan|quando usar|use esta skill/i.test(a.content)?{isSkillCandidate:!0,reason:"Estrutura interna compatível com skill operacional."}:{isSkillCandidate:!1,reason:"Arquivo não parece ser skill nesta primeira varredura."}}function hs(){throw new Error("Configure VITE_GOOGLE_CLIENT_ID para conectar o Google Drive.")}function _t(a){localStorage.setItem(pe,JSON.stringify(a))}function Ta(){const a=localStorage.getItem(pe);if(!a)return null;try{const n=JSON.parse(a);return!n.accessToken||!n.expiresAt||n.expiresAt<=Date.now()?(localStorage.removeItem(pe),null):n}catch{return localStorage.removeItem(pe),null}}function wa(a){const n=a.trim();if(!n)return"";const o=n.match(/\/folders\/([a-zA-Z0-9_-]+)/);if(o)return o[1];const s=n.match(/[?&]id=([a-zA-Z0-9_-]+)/);return s?s[1]:n}async function fs(a){const n=Ta();if(!n)throw new Error("Conecte o Google Drive antes de sincronizar.");const o=wa(a);if(!o)throw new Error("Informe o ID ou link da pasta do Google Drive.");const r=(await js(o,n.accessToken)).filter(t=>bs(t));return Promise.all(r.map(async t=>({name:t.name,content:await vs(t,n.accessToken),sourcePath:t.name,externalId:t.id,webViewLink:t.webViewLink,modifiedTime:t.modifiedTime})))}async function js(a,n){const o=[],s=[a];for(;s.length;){const r=s.shift();if(!r)continue;const t=await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(`'${r}' in parents and trashed = false`)}&fields=files(id,name,mimeType,modifiedTime,webViewLink,parents)&pageSize=200`,{headers:{Authorization:`Bearer ${n}`}}),c=await t.json().catch(()=>({}));if(!t.ok)throw new Error(c?.error?.message||"Não consegui listar os arquivos do Google Drive.");for(const l of c.files||[])l.mimeType==="application/vnd.google-apps.folder"?s.push(l.id):o.push(l)}return o}function bs(a){return cs.has(a.mimeType)?!0:/\.(md|markdown|txt|json)$/i.test(a.name)}async function vs(a,n){const o=a.mimeType==="application/vnd.google-apps.document"?`https://www.googleapis.com/drive/v3/files/${a.id}/export?mimeType=text/plain`:`https://www.googleapis.com/drive/v3/files/${a.id}?alt=media`,s=await fetch(o,{headers:{Authorization:`Bearer ${n}`}});if(!s.ok){const r=await s.json().catch(()=>({}));throw new Error(r?.error?.message||`Não consegui baixar ${a.name} do Google Drive.`)}return s.text()}function Cs(a,n){return["---",`source: ${a}`,"sync_scope: skills",`privacy_zone: ${n.zone}`,`skill_candidate: ${n.isSkillCandidate}`,...n.externalId?[`external_id: ${n.externalId}`]:[],...n.webViewLink?[`external_url: ${n.webViewLink}`]:[],"---","",n.content].join(`
`)}function aa({accept:a,multiple:n=!0,onFiles:o}){const s=document.createElement("input");s.type="file",s.multiple=n,s.accept=a,s.webkitdirectory=!0,s.directory=!0,s.setAttribute("webkitdirectory",""),s.setAttribute("directory",""),s.style.position="fixed",s.style.left="-9999px",s.style.top="0",s.addEventListener("change",()=>{o(s.files),s.remove()},{once:!0}),document.body.appendChild(s),s.click()}function _s(){const{data:a,isLoading:n,error:o}=_a();return n?e.jsx(q,{children:e.jsx("div",{className:"flex items-center justify-center min-h-[60vh]",children:e.jsx(Q,{className:"h-10 w-10 animate-spin text-primary"})})}):o?e.jsx(q,{children:e.jsx("div",{className:"flex items-center justify-center min-h-[60vh]",children:e.jsxs(h,{className:"p-8 text-center max-w-md",children:[e.jsx("p",{className:"text-destructive font-semibold",children:"Erro ao carregar dados"}),e.jsx("p",{className:"text-sm text-muted-foreground mt-1",children:o.message||"Não foi possível conectar ao Supabase"})]})})}):e.jsxs(q,{children:[e.jsx(V,{}),e.jsx("div",{className:"p-6",children:e.jsx(ka,{agents:a?.agents})})]})}const kt=Object.freeze(Object.defineProperty({__proto__:null,default:_s},Symbol.toStringTag,{value:"Module"})),ks={draft:"bg-zinc-800 text-zinc-300",review:"bg-yellow-500/10 text-yellow-400",approved:"bg-emerald-500/10 text-emerald-400",deprecated:"bg-red-500/10 text-red-400"},na={draft:"Rascunho",review:"Revisão",approved:"Aprovado",deprecated:"Descontinuado"},Ce={titulo:"",departamento:"",status:"draft",sla_horas:24,responsavel:"",descricao:""};function ys(){const[a,n]=x.useState(""),[o,s]=x.useState(null),[r,t]=x.useState(!0),[c,l]=x.useState([]),[i,m]=x.useState(null),[v,b]=x.useState(!1),[g,_]=x.useState(Ce),[k,E]=x.useState(!1),[P,O]=x.useState(null),A=async()=>{t(!0);const{data:p,error:N}=await w.from("pops").select("*").order("created_at",{ascending:!1});!N&&p&&l(p),t(!1)};x.useEffect(()=>{A()},[]);const M=[...new Set(c.map(p=>p.departamento))].sort(),U=c.filter(p=>!(o&&p.departamento!==o||a&&!p.titulo.toLowerCase().includes(a.toLowerCase()))),d=c.filter(p=>p.status==="approved").length,T=c.length>0?Math.round(c.reduce((p,N)=>p+(N.sla_horas||0),0)/c.length):0,$=async p=>{if(p.preventDefault(),!g.titulo.trim()||!g.departamento.trim()){O("Título e Departamento são obrigatórios.");return}O(null),E(!0);const{error:N}=await w.from("pops").insert([{titulo:g.titulo.trim(),departamento:g.departamento.trim(),status:g.status,sla_horas:Number(g.sla_horas)||24,responsavel:g.responsavel.trim()||null,descricao:g.descricao.trim()||null}]);if(E(!1),N){O("Erro ao salvar. Tente novamente.");return}_(Ce),b(!1),A()};return e.jsxs(q,{children:[e.jsx(V,{}),e.jsxs("div",{className:"p-8 space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-slate-900",children:"Portal de POPs SLA"}),e.jsx("p",{className:"text-slate-600 mt-1",children:"Procedimentos Operacionais Padrão com SLAs"})]}),e.jsxs(f,{onClick:()=>b(p=>!p),children:[v?e.jsx(Za,{size:18,className:"mr-2"}):e.jsx(ga,{size:18,className:"mr-2"}),v?"Cancelar":"Novo POP"]})]}),e.jsx(Ve,{children:v&&e.jsx(Ze.div,{initial:{opacity:0,y:-12},animate:{opacity:1,y:0},exit:{opacity:0,y:-12},transition:{duration:.2},children:e.jsxs(h,{className:"border-blue-200 bg-blue-50",children:[e.jsx(L,{children:e.jsx(B,{className:"text-blue-900 text-lg",children:"Novo Procedimento"})}),e.jsx(j,{children:e.jsxs("form",{onSubmit:$,className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(Z,{htmlFor:"titulo",children:"Título *"}),e.jsx(H,{id:"titulo",placeholder:"Nome do procedimento",value:g.titulo,onChange:p=>_(N=>({...N,titulo:p.target.value}))})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(Z,{htmlFor:"departamento",children:"Departamento *"}),e.jsx(H,{id:"departamento",placeholder:"Ex: Operações, Comercial...",value:g.departamento,onChange:p=>_(N=>({...N,departamento:p.target.value}))})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(Z,{htmlFor:"status",children:"Status"}),e.jsxs($a,{value:g.status,onValueChange:p=>_(N=>({...N,status:p})),children:[e.jsx(za,{id:"status",children:e.jsx(qa,{})}),e.jsxs(Ma,{children:[e.jsx(le,{value:"draft",children:"Rascunho"}),e.jsx(le,{value:"review",children:"Revisão"}),e.jsx(le,{value:"approved",children:"Aprovado"}),e.jsx(le,{value:"deprecated",children:"Descontinuado"})]})]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(Z,{htmlFor:"sla_horas",children:"SLA (horas)"}),e.jsx(H,{id:"sla_horas",type:"number",min:1,value:g.sla_horas,onChange:p=>_(N=>({...N,sla_horas:Number(p.target.value)}))})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(Z,{htmlFor:"responsavel",children:"Responsável"}),e.jsx(H,{id:"responsavel",placeholder:"Nome do responsável",value:g.responsavel,onChange:p=>_(N=>({...N,responsavel:p.target.value}))})]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(Z,{htmlFor:"descricao",children:"Descrição"}),e.jsx(Fa,{id:"descricao",placeholder:"Descreva o procedimento...",value:g.descricao,onChange:p=>_(N=>({...N,descricao:p.target.value})),rows:3})]}),P&&e.jsxs("p",{className:"text-sm text-red-600 flex items-center gap-1",children:[e.jsx(Y,{size:14})," ",P]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsxs(f,{type:"submit",disabled:k,children:[k&&e.jsx(Q,{size:16,className:"mr-2 animate-spin"}),"Salvar POP"]}),e.jsx(f,{type:"button",variant:"outline",onClick:()=>{b(!1),_(Ce),O(null)},children:"Cancelar"})]})]})})]})})}),e.jsx(h,{children:e.jsx(j,{className:"p-4",children:e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("div",{className:"relative flex-1",children:[e.jsx(ha,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400",size:18}),e.jsx(H,{placeholder:"Buscar POPs...",value:a,onChange:p=>n(p.target.value),className:"pl-10"})]}),e.jsxs(f,{variant:"outline",children:[e.jsx(Ja,{size:18,className:"mr-2"}),"Filtros"]})]})})}),e.jsxs("div",{className:"flex gap-2 flex-wrap",children:[e.jsx(f,{variant:o===null?"secondary":"outline",size:"sm",onClick:()=>s(null),children:"Todos"}),M.map(p=>e.jsx(f,{variant:o===p?"secondary":"outline",size:"sm",onClick:()=>s(p),children:p},p))]}),e.jsxs(h,{children:[e.jsx(L,{children:e.jsx(B,{children:"Procedimentos"})}),e.jsx(j,{children:r?e.jsxs("div",{className:"flex items-center justify-center py-12",children:[e.jsx(Q,{className:"animate-spin mr-2"}),"Carregando..."]}):U.length===0?e.jsxs("div",{className:"text-center py-12 text-slate-500",children:[e.jsx(oe,{size:48,className:"mx-auto mb-4 text-slate-300"}),e.jsx("p",{children:"Nenhum POP encontrado"})]}):e.jsx("div",{className:"space-y-2",children:U.map(p=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-900/50 transition-colors cursor-pointer",onClick:()=>m(i===p.id?null:p.id),children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0",children:e.jsx(oe,{className:"text-blue-600",size:20})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-slate-900",children:p.titulo}),e.jsx("p",{className:"text-sm text-slate-500",children:p.departamento})]})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(C,{className:ks[p.status]||"bg-zinc-800",children:na[p.status]||p.status}),i===p.id?e.jsx(Qa,{size:18,className:"text-slate-400"}):e.jsx(Ae,{size:18,className:"text-slate-400"})]})]}),e.jsx(Ve,{children:i===p.id&&e.jsx(Ze.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},exit:{opacity:0,height:0},transition:{duration:.2},className:"overflow-hidden",children:e.jsxs("div",{className:"border border-t-0 rounded-b-lg bg-slate-50 px-6 py-4",children:[e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 mb-3",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-slate-400 uppercase tracking-wide",children:"SLA"}),e.jsx("p",{className:"text-sm font-medium text-slate-700",children:p.sla_horas?`${p.sla_horas}h`:"—"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-slate-400 uppercase tracking-wide",children:"Responsável"}),e.jsx("p",{className:"text-sm font-medium text-slate-700",children:p.responsavel||"—"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-slate-400 uppercase tracking-wide",children:"Versão"}),e.jsx("p",{className:"text-sm font-medium text-slate-700",children:p.versao||"1.0"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-slate-400 uppercase tracking-wide",children:"Status"}),e.jsx("p",{className:"text-sm font-medium text-slate-700",children:na[p.status]||p.status})]})]}),p.descricao&&e.jsx("p",{className:"text-sm text-slate-600 leading-relaxed",children:p.descricao})]})})})]},p.id))})})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsx(h,{className:"bg-blue-50 border-blue-200",children:e.jsx(j,{className:"p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(Xa,{className:"text-blue-600",size:24}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-blue-600 font-medium",children:"SLA Médio"}),e.jsx("p",{className:"text-2xl font-bold text-blue-900",children:T>0?`${T}h`:"—"})]})]})})}),e.jsx(h,{className:"bg-emerald-500/5 border-emerald-500/20",children:e.jsx(j,{className:"p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(ue,{className:"text-green-600",size:24}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-green-600 font-medium",children:"Aprovados"}),e.jsx("p",{className:"text-2xl font-bold text-green-900",children:d})]})]})})}),e.jsx(h,{className:"bg-purple-50 border-purple-200",children:e.jsx(j,{className:"p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(se,{className:"text-purple-600",size:24}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-purple-600 font-medium",children:"Departamentos"}),e.jsx("p",{className:"text-2xl font-bold text-purple-900",children:M.length})]})]})})})]})]})]})}const yt=Object.freeze(Object.defineProperty({__proto__:null,default:ys},Symbol.toStringTag,{value:"Module"})),Ns=`# ⚙️ Agent Browser

> **ID:** \`agent_browser\`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Browser headless

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.08/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/agent_browser.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ss=`# 📊 Ahrefs

> **ID:** \`ahrefs\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

SEO e backlinks

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/ahrefs.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ds=`# 📊 Airtable

> **ID:** \`airtable\`  
> **Categoria:** analytics  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Bases Airtable

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/airtable.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ts=`# ⚙️ API Gateway

> **ID:** \`api_gateway\`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Gateway APIs gerenciado

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.08/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/api_gateway.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,ws=`# 🔌 Asana

> **ID:** \`asana\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gestão Asana

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/asana.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ps=`# ⚙️ Automation Workflows

> **ID:** \`automation_workflows\`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Design de automações

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.08/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/automation_workflows.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,As=`# 🔌 Calendly

> **ID:** \`calendly\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Agendamento Calendly

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/calendly.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Is=`# 🔌 Channels Setup

> **ID:** \`channels_setup\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Configuração canais

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/channels_setup.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ls=`# 🔌 ClickUp

> **ID:** \`clickup\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

All-in-one workspace

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/clickup.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Bs=`# 🔌 Confluence

> **ID:** \`confluence\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Wiki Confluence

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/confluence.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Es=`# 📝 Daily Report

> **ID:** \`daily_report\`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Relatórios diários

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.06/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/daily_report.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Os=`# 📊 Data Analyst

> **ID:** \`data_analyst\`  
> **Categoria:** analytics  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Visualização, SQL, reports

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/data_analyst.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Rs=`# 🔌 Discord

> **ID:** \`discord\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gestão Discord

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/discord.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,$s=`# 📝 DOCX Generator

> **ID:** \`docx_generator\`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gerar Word

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.06/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/docx_generator.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,zs=`# 🔌 Dropbox

> **ID:** \`dropbox\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Storage

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/dropbox.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,qs=`# 🔌 Feishu Bitable

> **ID:** \`feishu_bitable\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Gestão de dados em tabelas

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/feishu_bitable.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ms=`# 🔌 Feishu Calendar

> **ID:** \`feishu_calendar\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Calendário e agendamento

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/feishu_calendar.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Fs=`# 🔌 Feishu Create Doc

> **ID:** \`feishu_create_doc\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Criação de documentos

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/feishu_create_doc.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ks=`# 🔌 Feishu Fetch Doc

> **ID:** \`feishu_fetch_doc\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Leitura de documentos

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/feishu_fetch_doc.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Gs=`# 🔌 Feishu IM Read

> **ID:** \`feishu_im_read\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Leitura de mensagens

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/feishu_im_read.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Us=`# 🔌 Feishu Task

> **ID:** \`feishu_task\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Tarefas e to-dos

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/feishu_task.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Hs=`# 🔌 Gmail

> **ID:** \`gmail\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gmail integrado

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/gmail.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ws=`# 📊 Google Ads

> **ID:** \`google_ads\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Google Ads

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/google_ads.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Vs=`# 📊 Google Analytics

> **ID:** \`google_analytics\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Métricas GA4

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/google_analytics.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Zs=`# 🔌 Google Calendar

> **ID:** \`google_calendar\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Calendário Google

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/google_calendar.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Js=`# 🔌 Google Drive

> **ID:** \`google_drive\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Drive Google

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/google_drive.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Qs=`# 📊 Google Sheets

> **ID:** \`google_sheets\`  
> **Categoria:** analytics  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Planilhas Google

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/google_sheets.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Xs=`# 📊 HubSpot

> **ID:** \`hubspot\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

CRM HubSpot

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/hubspot.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ys=`# 🔌 Jira

> **ID:** \`jira\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gestão Jira

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/jira.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,eo=`# 📊 LinkedIn Ads

> **ID:** \`linkedin_ads\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

LinkedIn Ads

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/linkedin_ads.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,ao=`# 📊 Mailchimp

> **ID:** \`mailchimp\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Email marketing

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/mailchimp.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,no=`# 📊 Markdown Converter

> **ID:** \`markdown_converter\`  
> **Categoria:** analytics  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Converter para Markdown

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/markdown_converter.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,so=`# 📝 MD to PDF

> **ID:** \`md_to_pdf\`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Markdown → PDF

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.06/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/md_to_pdf.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,oo=`# 📊 Mercado Pago

> **ID:** \`mercado_pago\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Mercado Pago

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/mercado_pago.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,to=`# 📊 Meta Ads

> **ID:** \`meta_ads\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Facebook/Instagram Ads

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/meta_ads.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,ro=`# 🔌 Monday

> **ID:** \`monday\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Monday.com

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/monday.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,io=`# ⚙️ n8n Workflow Automation

> **ID:** \`n8n_workflow_automation\`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Design workflows n8n

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.08/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/n8n_workflow_automation.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,lo=`# 🔌 Notion

> **ID:** \`notion\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Integração Notion

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/notion.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,co=`# 📊 OpenClaw Usage Tracker

> **ID:** \`openclaw_usage_tracker\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Tracking custos

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/openclaw_usage_tracker.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,mo=`# 📊 PayPal

> **ID:** \`paypal\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Pagamentos PayPal

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/paypal.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,uo=`# 📝 PDF Generator

> **ID:** \`pdf_generator\`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gerar PDFs

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.06/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/pdf_generator.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,po=`# 📊 PIX

> **ID:** \`pix\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

PIX Brazil

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/pix.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,xo=`# ⚙️ Playwright MCP

> **ID:** \`playwright_mcp\`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Browser Playwright

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.08/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/playwright_mcp.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,go=`# ⚙️ Playwright Scraper

> **ID:** \`playwright_scraper_skill\`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Web scraping

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.08/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/playwright_scraper_skill.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,ho=`# 📝 PPTX Generator

> **ID:** \`pptx_generator\`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gerar PowerPoint

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.06/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/pptx_generator.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,fo=`# 📊 Salesforce

> **ID:** \`salesforce\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

CRM Salesforce

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/salesforce.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,jo=`# 📊 SendGrid

> **ID:** \`sendgrid\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Email transacional

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/sendgrid.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,bo=`# 📊 Shopify

> **ID:** \`shopify\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

E-commerce Shopify

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/shopify.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,vo=`# 🚦 Skill Router

> **ID:** \`skill_router\`  
> **Categoria:** automation  
> **Prioridade:** P0  
> **Status:** active  
> **Papel:** principal

## Descrição

Escolhe quais skills da Totum devem ser usadas para cada objetivo antes da execução.

## Uso na Totum

- Primeira skill consultada quando a IA precisa decidir o melhor caminho
- Roteamento entre skills por objetivo, contexto e categoria
- Planejamento de ordem de execução antes de chamar outras skills

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| objective | string | sim | Pedido, meta ou problema que precisa de roteamento |
| context | object | não | Contexto adicional de cliente, canal, projeto, etapa ou restrições |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| recommended_skills | array | Lista priorizada de skills recomendadas |
| execution_plan | object | Plano sugerido de execução, ordem e justificativa |

## Regras de Roteamento

- Sempre considere a intenção principal antes do provider preferido
- Prefira o menor conjunto de skills capaz de resolver o objetivo
- Priorize skills ativas e com melhor aderência de categoria
- Explique por que cada skill foi escolhida
- Se faltar confiança, devolva 2 a 3 opções com ordem sugerida

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.03/chamada
- **Taxa de sucesso:** ~98%
- **Duração estimada:** ~1200ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/skill_router.md
\`\`\`

---

*Skill principal da Alexandria para descoberta e priorização de skills*
`,Co=`# 🔌 Slack

> **ID:** \`slack\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Integração Slack

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/slack.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,_o=`# 📊 Stock Analysis

> **ID:** \`stock_analysis\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Análise ações

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/stock_analysis.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,ko=`# 📊 Stock Watcher

> **ID:** \`stock_watcher\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Monitor ações

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/stock_watcher.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,yo=`# 📊 Stripe

> **ID:** \`stripe\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Pagamentos Stripe

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/stripe.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,No=`# 📝 Summarize

> **ID:** \`summarize\`  
> **Categoria:** content  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Resumir conteúdo

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.06/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/summarize.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,So=`# 🔌 Telegram

> **ID:** \`telegram\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Bot Telegram

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/telegram.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Do=`# 📊 TikTok Ads

> **ID:** \`tiktok_ads\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

TikTok Ads

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/tiktok_ads.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,To=`# 🔌 Trello

> **ID:** \`trello\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Gestão Trello

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/trello.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,wo=`# 📊 Twilio

> **ID:** \`twilio\`  
> **Categoria:** analytics  
> **Prioridade:** P1  
> **Status:** active

## Descrição

SMS/WhatsApp API

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`groq\`
- **Custo estimado:** R$ 0.04/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/twilio.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Po=`# 🔌 WeCom Contact Lookup

> **ID:** \`wecom_contact_lookup\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Busca de contatos

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_contact_lookup.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ao=`# 🔌 WeCom Doc Manager

> **ID:** \`wecom_doc_manager\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Docs e smart sheets

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_doc_manager.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Io=`# 🔌 WeCom Edit Todo

> **ID:** \`wecom_edit_todo\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Tarefas WeCom

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_edit_todo.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Lo=`# 🔌 WeCom Meeting Create

> **ID:** \`wecom_meeting_create\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Criar reuniões

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_meeting_create.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Bo=`# 🔌 WeCom Meeting Manage

> **ID:** \`wecom_meeting_manage\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Gerenciar reuniões

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_meeting_manage.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Eo=`# 🔌 WeCom Meeting Query

> **ID:** \`wecom_meeting_query\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Consultar reuniões

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_meeting_query.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Oo=`# 🔌 WeCom Message

> **ID:** \`wecom_msg\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Mensagens WeCom

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_msg.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Ro=`# 🔌 WeCom Schedule

> **ID:** \`wecom_schedule\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Agendas WeCom

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_schedule.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,$o=`# 🔌 WeCom Smartsheet Data

> **ID:** \`wecom_smartsheet_data\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Dados smart tables

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_smartsheet_data.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,zo=`# 🔌 WeCom Smartsheet Schema

> **ID:** \`wecom_smartsheet_schema\`  
> **Categoria:** integration  
> **Prioridade:** P0  
> **Status:** active

## Descrição

Estrutura tabelas

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/wecom_smartsheet_schema.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,qo=`# 🔌 WhatsApp

> **ID:** \`whatsapp\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

WhatsApp Business

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/whatsapp.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Mo=`# 🔌 Zoom

> **ID:** \`zoom\`  
> **Categoria:** integration  
> **Prioridade:** P1  
> **Status:** active

## Descrição

Zoom meetings

## Uso na Totum

- Integração com fluxos de trabalho Alexandria
- Automação de processos B2B/B2C
- Orquestração via agentes

## Entradas

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| input | string | sim | Entrada principal da skill |
| context | object | não | Contexto adicional de execução |

## Saídas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| result | object | Resultado da execução |
| logs | array | Logs de execução |

## Configuração

- **Modelo preferido:** \`claude\`
- **Custo estimado:** R$ 0.05/chamada
- **Taxa de sucesso:** ~95%
- **Duração estimada:** ~2000ms

## Dependências

\`\`\`json
{"dependencies": []}
\`\`\`

## Prompt Template

\`\`\`
prompts/zoom.md
\`\`\`

---

*Skill gerada automaticamente a partir do Catálogo Totum*
`,Fo=["claude_web","chatgpt","kimi"];async function Ko(a){const n=new TextEncoder().encode(a),o=await crypto.subtle.digest("SHA-256",n);return Array.from(new Uint8Array(o)).map(s=>s.toString(16).padStart(2,"0")).join("")}async function Go(a,n,o={}){const s=o.scope||"all_active",r=o.generatedAt||new Date().toISOString(),t=[];for(const[c,l]of Object.entries(a)){if(s==="all_active"&&l.status!=="active")continue;const i=(n[c]||"").trim();if(!i)continue;const m=JSON.stringify({id:c,name:l.name,status:l.status,model_preference:l.model_preference||null,category:l.category,is_primary:!!l.is_primary,routing_priority:l.routing_priority||0,tags:l.tags||[],prompt_template_path:l.prompt_template||null,skill_markdown:i});t.push({id:c,name:l.name,status:l.status,model_preference:l.model_preference||null,category:l.category,is_primary:!!l.is_primary,routing_priority:l.routing_priority||0,tags:l.tags||[],skill_markdown:i,prompt_template_path:l.prompt_template||null,content_hash:await Ko(m),updated_at:l.updated_at||r})}return t.sort((c,l)=>c.is_primary!==l.is_primary?c.is_primary?-1:1:l.routing_priority-c.routing_priority||c.category.localeCompare(l.category)||c.name.localeCompare(l.name)),{generated_at:r,scope:s,total_skills:t.length,entries:t}}const Uo=Object.assign({"../skills/agent_browser/SKILL.md":Ns,"../skills/ahrefs/SKILL.md":Ss,"../skills/airtable/SKILL.md":Ds,"../skills/api_gateway/SKILL.md":Ts,"../skills/asana/SKILL.md":ws,"../skills/automation_workflows/SKILL.md":Ps,"../skills/calendly/SKILL.md":As,"../skills/channels_setup/SKILL.md":Is,"../skills/clickup/SKILL.md":Ls,"../skills/confluence/SKILL.md":Bs,"../skills/daily_report/SKILL.md":Es,"../skills/data_analyst/SKILL.md":Os,"../skills/discord/SKILL.md":Rs,"../skills/docx_generator/SKILL.md":$s,"../skills/dropbox/SKILL.md":zs,"../skills/feishu_bitable/SKILL.md":qs,"../skills/feishu_calendar/SKILL.md":Ms,"../skills/feishu_create_doc/SKILL.md":Fs,"../skills/feishu_fetch_doc/SKILL.md":Ks,"../skills/feishu_im_read/SKILL.md":Gs,"../skills/feishu_task/SKILL.md":Us,"../skills/gmail/SKILL.md":Hs,"../skills/google_ads/SKILL.md":Ws,"../skills/google_analytics/SKILL.md":Vs,"../skills/google_calendar/SKILL.md":Zs,"../skills/google_drive/SKILL.md":Js,"../skills/google_sheets/SKILL.md":Qs,"../skills/hubspot/SKILL.md":Xs,"../skills/jira/SKILL.md":Ys,"../skills/linkedin_ads/SKILL.md":eo,"../skills/mailchimp/SKILL.md":ao,"../skills/markdown_converter/SKILL.md":no,"../skills/md_to_pdf/SKILL.md":so,"../skills/mercado_pago/SKILL.md":oo,"../skills/meta_ads/SKILL.md":to,"../skills/monday/SKILL.md":ro,"../skills/n8n_workflow_automation/SKILL.md":io,"../skills/notion/SKILL.md":lo,"../skills/openclaw_usage_tracker/SKILL.md":co,"../skills/paypal/SKILL.md":mo,"../skills/pdf_generator/SKILL.md":uo,"../skills/pix/SKILL.md":po,"../skills/playwright_mcp/SKILL.md":xo,"../skills/playwright_scraper_skill/SKILL.md":go,"../skills/pptx_generator/SKILL.md":ho,"../skills/salesforce/SKILL.md":fo,"../skills/sendgrid/SKILL.md":jo,"../skills/shopify/SKILL.md":bo,"../skills/skill_router/SKILL.md":vo,"../skills/slack/SKILL.md":Co,"../skills/stock_analysis/SKILL.md":_o,"../skills/stock_watcher/SKILL.md":ko,"../skills/stripe/SKILL.md":yo,"../skills/summarize/SKILL.md":No,"../skills/telegram/SKILL.md":So,"../skills/tiktok_ads/SKILL.md":Do,"../skills/trello/SKILL.md":To,"../skills/twilio/SKILL.md":wo,"../skills/wecom_contact_lookup/SKILL.md":Po,"../skills/wecom_doc_manager/SKILL.md":Ao,"../skills/wecom_edit_todo/SKILL.md":Io,"../skills/wecom_meeting_create/SKILL.md":Lo,"../skills/wecom_meeting_manage/SKILL.md":Bo,"../skills/wecom_meeting_query/SKILL.md":Eo,"../skills/wecom_msg/SKILL.md":Oo,"../skills/wecom_schedule/SKILL.md":Ro,"../skills/wecom_smartsheet_data/SKILL.md":$o,"../skills/wecom_smartsheet_schema/SKILL.md":zo,"../skills/whatsapp/SKILL.md":qo,"../skills/zoom/SKILL.md":Mo});async function Ho(a="all_active"){const n=Object.entries(Uo).reduce((o,[s,r])=>{const t=s.match(/\/skills\/([^/]+)\/SKILL\.md$/);return t&&(o[t[1]]=String(r||"")),o},{});return Go({...Ga,...Ka},n,{scope:a})}async function Wo({scope:a="all_active",providers:n=Fo,triggeredBy:o=null}={}){const s=await Ho(a),{data:r,error:t}=await w.functions.invoke("skills-sync",{body:{scope:a,providers:n,triggeredBy:o,manifest:s}});if(t)throw new Error(t.message||"A função de sincronização de skills não respondeu.");return r}const xe=Ha(),_e=Ua(),Vo=[...new Set(xe.map(a=>a.model_preference).filter(Boolean))].sort(),sa={automacao:He,automation:He,analise:Ue,analytics:Ue,criacao:Ge,content:Ge,integracao:fa,validacao:De,validation:De,image:an,research:en},ke={automacao:"Automação",automation:"Automação",analise:"Análise",analytics:"Análise",criacao:"Criação",content:"Conteúdo",integracao:"Integração",validacao:"Validação",validation:"Validação",image:"Imagem",research:"Pesquisa"},ye={automacao:"bg-blue-500/10 text-blue-400 border-blue-500/20",automation:"bg-blue-500/10 text-blue-400 border-blue-500/20",analise:"bg-purple-500/10 text-purple-400 border-purple-500/20",analytics:"bg-purple-500/10 text-purple-400 border-purple-500/20",criacao:"bg-orange-500/10 text-orange-400 border-orange-500/20",content:"bg-orange-500/10 text-orange-400 border-orange-500/20",integracao:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",validacao:"bg-red-500/10 text-red-400 border-red-500/20",validation:"bg-red-500/10 text-red-400 border-red-500/20",image:"bg-pink-500/10 text-pink-400 border-pink-500/20",research:"bg-teal-500/10 text-teal-400 border-teal-500/20"},Zo={claude:"bg-violet-500/10 text-violet-400 border-violet-500/20",groq:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",gemini:"bg-indigo-500/10 text-indigo-400 border-indigo-500/20",kimi:"bg-amber-500/10 text-amber-400 border-amber-500/20"};function Jo(){const{user:a}=Ra(),[n,o]=x.useState(""),[s,r]=x.useState(null),[t,c]=x.useState(null),[l,i]=x.useState(!1),[m,v]=x.useState(!1),[b,g]=x.useState(null),[_,k]=x.useState(null),E=x.useMemo(()=>_e.reduce((d,T)=>(d[T]=xe.filter($=>$.category===T).length,d),{}),[]),P=x.useMemo(()=>xe.filter(d=>!(s&&d.category!==s||t&&d.model_preference!==t||n&&!d.name.toLowerCase().includes(n.toLowerCase())&&!d.description.toLowerCase().includes(n.toLowerCase()))),[n,s,t]),O=x.useMemo(()=>xe.filter(d=>d.status==="active").length,[]),A=b?.targets.filter(d=>d.status!=="preparing"&&d.status!=="queued").length||0,M=m?35:b?.targets.length?Math.round(A/b.targets.length*100):0,U=async()=>{i(!0),v(!0),k(null),g(null);try{const d=await Wo({triggeredBy:a?.id||null});g(d),D.success("Sincronização de skills concluída.")}catch(d){const T=d instanceof Error?d.message:"Falha ao sincronizar as skills.";k(T),D.error(T)}finally{v(!1)}};return e.jsxs(q,{children:[e.jsx(V,{}),e.jsxs("div",{className:"p-8 space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-slate-900",children:"Central de Skills"}),e.jsx("p",{className:"text-slate-600 mt-1",children:"Catálogo de habilidades com recomendações inteligentes"})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs(f,{variant:"outline",onClick:U,disabled:m,children:[m?e.jsx(Q,{size:18,className:"mr-2 animate-spin"}):e.jsx(Ya,{size:18,className:"mr-2"}),"Sincronizar skills"]}),e.jsxs(f,{children:[e.jsx(ga,{size:18,className:"mr-2"}),"Nova Skill"]})]})]}),e.jsx("div",{className:"grid grid-cols-2 md:grid-cols-5 gap-4",children:_e.map(d=>{const T=sa[d]||W,$=E[d]||0;return e.jsx(h,{className:`cursor-pointer transition-all ${s===d?"ring-2 ring-purple-500":""}`,onClick:()=>r(s===d?null:d),children:e.jsxs(j,{className:"p-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(T,{size:20,className:"text-slate-400"}),e.jsx("span",{className:"text-2xl font-bold",children:$})]}),e.jsx("p",{className:"text-sm text-slate-600 mt-2",children:ke[d]||d})]})},d)})}),e.jsx(h,{children:e.jsx(j,{className:"p-4",children:e.jsxs("div",{className:"relative",children:[e.jsx(ha,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400",size:18}),e.jsx(H,{placeholder:"Buscar skills...",value:n,onChange:d=>o(d.target.value),className:"pl-10"})]})})}),e.jsxs(ma,{defaultValue:"categoria",className:"w-full",children:[e.jsxs(ua,{className:"grid w-full grid-cols-2",children:[e.jsx(F,{value:"categoria",children:"Por Categoria"}),e.jsx(F,{value:"modelo",children:"Por Modelo"})]}),e.jsx(K,{value:"categoria",className:"space-y-4",children:e.jsxs("div",{className:"flex gap-2 flex-wrap pt-2",children:[e.jsx(f,{variant:s===null?"secondary":"outline",size:"sm",onClick:()=>r(null),children:"Todas"}),_e.map(d=>e.jsx(f,{variant:s===d?"secondary":"outline",size:"sm",onClick:()=>r(s===d?null:d),children:ke[d]||d},d))]})}),e.jsx(K,{value:"modelo",className:"pt-2",children:e.jsxs("div",{className:"flex gap-2 flex-wrap",children:[e.jsx(f,{variant:t===null?"secondary":"outline",size:"sm",onClick:()=>c(null),children:"Todos"}),Vo.map(d=>e.jsx(f,{variant:t===d?"secondary":"outline",size:"sm",onClick:()=>c(t===d?null:d),className:"capitalize",children:d},d))]})})]}),e.jsxs(h,{children:[e.jsx(L,{children:e.jsxs(B,{children:["Skills (",P.length,")"]})}),e.jsx(j,{children:P.length===0?e.jsxs("div",{className:"text-center py-12 text-slate-500",children:[e.jsx(W,{size:48,className:"mx-auto mb-4 text-slate-300"}),e.jsx("p",{children:"Nenhuma skill encontrada"})]}):e.jsx("div",{className:"space-y-3",children:P.map(d=>{const T=sa[d.category]||W,$=d.status==="active";return e.jsxs("div",{className:"flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${ye[d.category]?.split(" ")[0]||"bg-slate-100"}`,children:e.jsx(T,{className:ye[d.category]?.split(" ")[1]||"text-slate-600",size:20})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"mr-1",children:d.emoji}),e.jsx("h4",{className:"font-medium text-slate-900",children:d.name}),d.is_primary?e.jsx(C,{className:"bg-amber-500/10 text-amber-600 border-amber-500/20",children:"Principal"}):null,$?e.jsx(re,{size:16,className:"text-green-500"}):e.jsx(ja,{size:16,className:"text-red-500"})]}),e.jsx("p",{className:"text-sm text-slate-500",children:d.description}),e.jsxs("div",{className:"flex items-center gap-2 mt-1 flex-wrap",children:[e.jsx(C,{variant:"outline",className:`capitalize ${Zo[d.model_preference]||"bg-slate-100"}`,children:d.model_preference}),e.jsx(C,{className:ye[d.category]||"bg-slate-100",children:ke[d.category]||d.category}),d.routing_priority?e.jsxs(C,{variant:"outline",children:["prioridade ",d.routing_priority]}):null,e.jsxs("span",{className:"text-xs text-slate-400",children:["v",d.version," · $",d.cost_per_call.toFixed(2),"/call · ",Math.round(d.success_rate*100),"% sucesso"]})]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-shrink-0",children:[e.jsx(f,{variant:"ghost",size:"sm",children:e.jsx(nn,{size:16})}),e.jsx(f,{variant:"ghost",size:"sm",className:"text-red-600",children:e.jsx(sn,{size:16})}),e.jsx(f,{variant:"ghost",size:"sm",children:e.jsx(Ae,{size:18})})]})]},d.id)})})})]})]}),e.jsx(hn,{open:l,onOpenChange:i,children:e.jsxs(fn,{className:"max-w-3xl",children:[e.jsxs(jn,{children:[e.jsx(bn,{children:"Sincronização de skills"}),e.jsxs(vn,{children:["Publica ",O," skill(s) ativa(s) para Claude Web, ChatGPT e Kimi."]})]}),e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-sm text-slate-600",children:[e.jsx("span",{children:m?"Sincronizando agora...":"Status da última execução"}),e.jsxs("span",{children:[M,"%"]})]}),e.jsx(pa,{value:M})]}),_?e.jsx(h,{className:"border-red-200 bg-red-50",children:e.jsx(j,{className:"p-4 text-sm text-red-700",children:_})}):null,b?e.jsxs("div",{className:"grid gap-4",children:[e.jsx(h,{children:e.jsxs(j,{className:"p-4 space-y-3",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-3 text-sm text-slate-600",children:[e.jsxs(C,{variant:"outline",children:["Run ",b.run_id.slice(0,8)]}),e.jsx(C,{variant:"outline",className:"capitalize",children:b.status.replaceAll("_"," ")})]}),e.jsxs("div",{className:"grid gap-2 text-sm text-slate-700",children:[e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Branch:"})," ",b.git_branch||"não criada"]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-medium",children:"PR:"}),b.git_pr_url?e.jsxs("a",{href:b.git_pr_url,target:"_blank",rel:"noreferrer",className:"inline-flex items-center gap-1 text-blue-600 hover:underline",children:["Abrir pull request",e.jsx(X,{size:14})]}):e.jsx("span",{children:"não criada"})]})]})]})}),e.jsx("div",{className:"grid gap-3",children:b.targets.map(d=>e.jsx(Qo,{target:d},d.provider))})]}):m?e.jsx(h,{children:e.jsxs(j,{className:"p-6 flex items-center gap-3 text-sm text-slate-600",children:[e.jsx(Q,{className:"h-5 w-5 animate-spin"}),"Preparando manifest, exports e publicação por provider."]})}):e.jsx(h,{children:e.jsxs(j,{className:"p-6 text-sm text-slate-600",children:["Clique em ",e.jsx("strong",{children:"Sincronizar skills"})," para publicar os exports no GitHub e enviar os arquivos da Kimi."]})})]})]})})]})}function Qo({target:a}){const n=Array.isArray(a.external_ids?.files)?a.external_ids.files.length:void 0;return e.jsx(h,{className:"border-slate-200",children:e.jsxs(j,{className:"p-4 space-y-3",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(on,{size:18,className:"text-slate-400"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-slate-900",children:a.provider==="claude_web"?"Claude Web":a.provider==="chatgpt"?"ChatGPT":"Kimi"}),e.jsx("p",{className:"text-sm text-slate-500",children:a.message})]})]}),e.jsx(C,{variant:"outline",className:"capitalize",children:a.status.replaceAll("_"," ")})]}),e.jsxs("div",{className:"grid gap-1 text-sm text-slate-700",children:[e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Skills exportadas:"})," ",a.exported_skills??0]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Arquivos processados:"})," ",a.exported_files??0]}),typeof n=="number"?e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Uploads Kimi:"})," ",n]}):null]})]})})}const Nt=Object.freeze(Object.defineProperty({__proto__:null,default:Jo},Symbol.toStringTag,{value:"Module"})),Xo=[{name:"feishu-calendar",version:"1.2.0"},{name:"feishu-bitable",version:"1.0.5"},{name:"feishu-task",version:"0.9.2"},{name:"wecom-schedule",version:"1.1.0"},{name:"wecom-todo",version:"1.0.0"},{name:"healthcheck",version:"2.0.1"}];function Yo(a){return a<60?`${Math.floor(a)}s`:a<3600?`${Math.floor(a/60)}m`:a<86400?`${Math.floor(a/3600)}h ${Math.floor(a%3600/60)}m`:`${Math.floor(a/86400)}d ${Math.floor(a%86400/3600)}h`}function et(a){return a?typeof a.cpu=="number"?`${a.cpu.toFixed(1)}%`:typeof a.cpu=="object"&&a.cpu?.usage!==void 0?`${a.cpu.usage.toFixed(1)}%`:"N/D":"N/D"}function at(a){if(!a)return"N/D";const n=a.memory;return n?n.usedMB!==void 0?`${n.usedMB} MB`:n.used!==void 0&&n.used>1024*1024?`${(n.used/1024/1024).toFixed(0)} MB`:n.used!==void 0?`${n.used} B`:"N/D":"N/D"}function nt(a){return!a||a.uptime===void 0?"N/D":Yo(a.uptime)}function st(){const[a,n]=x.useState({online:!1,loading:!0,health:null,error:null,lastChecked:null}),o=Wa.MOCK_MODE,s=!1,r=Xo.map(g=>({...g,status:a.loading?"unknown":a.online?g.name==="wecom-schedule"?"inactive":"active":"unknown"}));r.filter(g=>g.status==="active").length;const t=r.length,c=x.useCallback(async()=>{{n({online:!1,loading:!1,health:null,error:"Modo simulado",lastChecked:new Date});return}},[o]);x.useEffect(()=>{c();const g=setInterval(c,3e4);return()=>clearInterval(g)},[c]);const l=a.online&&a.health?et(a.health):a.online?"N/D":"—",i=a.online&&a.health?at(a.health):a.online?"N/D":"—";a.online&&a.health?nt(a.health):a.online;const m={card:"bg-zinc-900/50 border-zinc-800",icon:"bg-zinc-800",ico:"text-zinc-500",label:"text-zinc-400",value:"text-zinc-300"},v={card:"bg-zinc-900/50 border-zinc-800",icon:"bg-zinc-800",ico:"text-zinc-500",label:"text-zinc-400",value:"text-zinc-300"},b={card:"bg-zinc-900/50 border-zinc-800",icon:"bg-zinc-800",ico:"text-zinc-500",label:"text-zinc-400",value:"text-zinc-300"};return e.jsxs(q,{children:[e.jsx(V,{}),e.jsxs("div",{className:"p-8 space-y-6",children:[e.jsxs("div",{className:"flex items-center gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-400",children:[e.jsx(Y,{size:18,className:"shrink-0"}),e.jsxs("span",{className:"text-sm font-medium",children:["Configure ",e.jsx("code",{className:"bg-amber-500/10 px-1 rounded",children:"VITE_OPENCLAW_URL"})," para conectar ao gateway real"]})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-slate-900",children:"Dashboard OpenClaw"}),e.jsxs("p",{className:"text-slate-600 mt-1",children:["Monitoramento do gateway e skills instaladas",a.lastChecked&&e.jsxs("span",{className:"ml-2 text-xs text-slate-400",children:["· atualizado às ",a.lastChecked.toLocaleTimeString("pt-BR")]})]})]}),e.jsxs(f,{variant:"outline",onClick:c,disabled:a.loading,children:[e.jsx(ge,{size:18,className:`mr-2 ${a.loading?"animate-spin":""}`}),"Atualizar"]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:[e.jsx(h,{className:m.card,children:e.jsx(j,{className:"p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`w-12 h-12 ${m.icon} rounded-full flex items-center justify-center`,children:e.jsx(tn,{className:m.ico,size:24})}),e.jsxs("div",{children:[e.jsx("p",{className:`text-sm font-medium ${m.label}`,children:"Gateway"}),e.jsx("p",{className:`text-xl font-bold ${m.value}`,children:a.loading?"...":"Offline"})]})]})})}),e.jsx(h,{className:"bg-blue-50 border-blue-200",children:e.jsx(j,{className:"p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center",children:e.jsx(rn,{className:"text-blue-600",size:24})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-blue-600 font-medium",children:"Skills Ativas"}),e.jsx("p",{className:"text-xl font-bold text-blue-900",children:a.loading?"…":`—/${t}`})]})]})})}),e.jsx(h,{className:v.card,children:e.jsx(j,{className:"p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`w-12 h-12 ${v.icon} rounded-full flex items-center justify-center`,children:e.jsx(ln,{className:v.ico,size:24})}),e.jsxs("div",{children:[e.jsx("p",{className:`text-sm font-medium ${v.label}`,children:"CPU Usage"}),e.jsx("p",{className:`text-xl font-bold ${v.value}`,children:a.loading?"…":l})]})]})})}),e.jsx(h,{className:b.card,children:e.jsx(j,{className:"p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`w-12 h-12 ${b.icon} rounded-full flex items-center justify-center`,children:e.jsx(cn,{className:b.ico,size:24})}),e.jsxs("div",{children:[e.jsx("p",{className:`text-sm font-medium ${b.label}`,children:"Memória"}),e.jsx("p",{className:`text-xl font-bold ${b.value}`,children:a.loading?"…":i})]})]})})})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsxs(h,{children:[e.jsxs(L,{className:"flex flex-row items-center justify-between",children:[e.jsxs(B,{className:"flex items-center gap-2",children:[e.jsx(fa,{size:20}),"Skills Instaladas"]}),e.jsx(C,{variant:"outline",children:"status desconhecido"})]}),e.jsx(j,{children:e.jsx("div",{className:"space-y-2",children:r.map(g=>e.jsxs("div",{className:"flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-900/50",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[g.status==="active"?e.jsx(ue,{size:18,className:"text-green-500"}):g.status==="error"?e.jsx(ja,{size:18,className:"text-red-500"}):e.jsx(Y,{size:18,className:"text-yellow-500"}),e.jsx("span",{className:"font-medium",children:g.name})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs(C,{variant:"secondary",children:["v",g.version]}),e.jsx(C,{className:g.status==="active"?"bg-emerald-500/10 text-emerald-400":g.status==="inactive"?"bg-zinc-800 text-zinc-300":"bg-yellow-500/10 text-yellow-400",children:g.status==="unknown"?"desconhecido":g.status})]})]},g.name))})})]}),e.jsxs(h,{children:[e.jsxs(L,{className:"flex flex-row items-center justify-between",children:[e.jsxs(B,{className:"flex items-center gap-2",children:[e.jsx(dn,{size:20}),"Logs em Tempo Real"]}),e.jsx(f,{variant:"ghost",size:"sm",children:"Ver todos"})]}),e.jsx(j,{children:e.jsx("div",{className:"space-y-2 font-mono text-sm",children:e.jsxs("div",{className:"flex items-center gap-2 p-4 rounded bg-slate-50 text-slate-500 text-sm",children:[e.jsx(Y,{size:16,className:"shrink-0"}),e.jsx("span",{children:"Gateway offline — conecte o VPS para visualizar logs em tempo real."})]})})})]})]}),e.jsxs(h,{children:[e.jsx(L,{children:e.jsxs(B,{className:"flex items-center gap-2",children:[e.jsx(mn,{size:20}),"Status de Conexões"]})}),e.jsx(j,{children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{className:"flex items-center gap-3 p-4 border rounded-lg",children:[e.jsx("div",{className:"w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center",children:e.jsx(ue,{className:"text-green-600",size:20})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium",children:"Supabase"}),e.jsx("p",{className:"text-sm text-slate-500",children:"Conectado"})]})]}),e.jsxs("div",{className:"flex items-center gap-3 p-4 border rounded-lg",children:[e.jsx("div",{className:`w-10 h-10 rounded-lg flex items-center justify-center ${s?"bg-green-100":"bg-yellow-500/10"}`,children:s?e.jsx(ue,{className:"text-green-600",size:20}):e.jsx(Y,{className:"text-yellow-600",size:20})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium",children:"Google Gemini"}),e.jsx("p",{className:`text-sm ${s?"text-slate-500":"text-yellow-600"}`,children:s?"Disponível":"Chave não configurada"})]})]}),e.jsxs("div",{className:"flex items-center gap-3 p-4 border rounded-lg",children:[e.jsx("div",{className:"w-10 h-10 rounded-lg flex items-center justify-center bg-zinc-800",children:e.jsx(De,{className:"text-slate-400",size:20})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium",children:"OpenClaw Gateway"}),e.jsx("p",{className:"text-sm text-slate-400",children:a.loading?"Verificando…":"Modo mock"})]})]})]})})]})]})]})}const St=Object.freeze(Object.defineProperty({__proto__:null,default:st},Symbol.toStringTag,{value:"Module"})),ot=Cn("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),ee=x.forwardRef(({className:a,variant:n,...o},s)=>e.jsx("div",{ref:s,role:"alert",className:G(ot({variant:n}),a),...o}));ee.displayName="Alert";const ae=x.forwardRef(({className:a,...n},o)=>e.jsx("h5",{ref:o,className:G("mb-1 font-medium leading-none tracking-tight",a),...n}));ae.displayName="AlertTitle";const ne=x.forwardRef(({className:a,...n},o)=>e.jsx("div",{ref:o,className:G("text-sm [&_p]:leading-relaxed",a),...n}));ne.displayName="AlertDescription";const Pa=x.forwardRef(({className:a,orientation:n="horizontal",decorative:o=!0,...s},r)=>e.jsx(Ca,{ref:r,decorative:o,orientation:n,className:G("shrink-0 bg-border",n==="horizontal"?"h-[1px] w-full":"h-full w-[1px]",a),...s}));Pa.displayName=Ca.displayName;const oa="totum.googleDriveSkillsFolderId",tt=/\.(md|markdown|txt|json)$/i,te={green:"border-emerald-500/30 bg-emerald-500/10 text-emerald-700",yellow:"border-amber-500/30 bg-amber-500/10 text-amber-700",red:"border-destructive/30 bg-destructive/10 text-destructive"},Ne={green:{title:"Verde",description:"Pode entrar na Alexandria: Totum, skills, POPs, prompts, decisões e contexto empresarial."},yellow:{title:"Amarelo",description:"Entra só como resumo permitido: preferências, rotina de trabalho e contexto pessoal sanitizado."},red:{title:"Vermelho",description:"Não entra: finanças pessoais, saúde, família, senhas, tokens e journals brutos."}};function rt(){const a=x.useRef(null),[n,o]=x.useState(null),[s,r]=x.useState(!1),[t,c]=x.useState(null),[l,i]=x.useState(null),[m,v]=x.useState(()=>localStorage.getItem(oa)||""),[b,g]=x.useState(()=>!!Ta()),[_,k]=x.useState(!1),[E,P]=x.useState(null),[O,A]=x.useState(null),[M,U]=x.useState(null),[d,T]=x.useState(null),$=n?.files.length?Math.round(n.importableFiles.length/n.files.length*100):0;x.useEffect(()=>{function u(S){S.origin===window.location.origin&&S.data?.type==="totum-google-drive-auth"&&(g(!0),D.success("Google Drive conectado à Alexandria."))}return window.addEventListener("message",u),()=>window.removeEventListener("message",u)},[]);async function p(u){if(!u?.length)return;const S=la(u);if(!S.length){D.error("Envie arquivos Markdown, texto ou JSON.");return}try{const y=await ca(S),ie=ss(y);o(ie),T(null),D.success("Pacote analisado pela ponte da Alexandria.")}catch(y){D.error(y instanceof Error?y.message:"Não foi possível ler os arquivos selecionados.")}}async function N(u){if(!u?.length)return;const S=la(u);if(!S.length){D.error("Nenhum arquivo de skill compatível foi encontrado.");return}try{const y=await ca(S),ie=ea("logseq_local",y);c(ie),A(null),D.success(`${ie.skillCandidates.length} skill(s) detectada(s) no Logseq local.`)}catch(y){D.error(y instanceof Error?y.message:"Não foi possível ler os arquivos do Logseq.")}}function Re(){aa({accept:".md,.markdown,.txt,.json",onFiles:u=>{p(u)}})}function $e(){aa({accept:".md,.markdown,.txt,.json",onFiles:u=>{N(u)}})}function Aa(){try{window.open(hs(),"totum-google-drive-auth","width=540,height=720")||D.error("O navegador bloqueou o popup do Google Drive.")}catch(u){D.error(u instanceof Error?u.message:"Não foi possível iniciar a conexão com o Google Drive.")}}async function Ia(){try{k(!0);const u=wa(m);localStorage.setItem(oa,u),v(u);const S=await fs(u),y=ea("google_drive",S);i(y),U(null),D.success(`${y.skillCandidates.length} skill(s) detectada(s) no Google Drive.`)}catch(u){const S=u instanceof Error?u.message:"Não foi possível sincronizar skills do Google Drive.";/conecte o google drive/i.test(S)&&g(!1),D.error(S)}finally{k(!1)}}async function ze(u,S){try{P(u.source);const y=await ds(u);S({importedSkills:y.importedSkills,review:u.reviewFiles.length,blocked:u.blockedFiles.length,artifactTitle:y.artifact.title}),D.success(`${y.importedSkills} skill(s) importada(s) para a Alexandria.`)}catch(y){D.error(y instanceof Error?y.message:"Não foi possível importar as skills.")}finally{P(null)}}async function La(){if(n){r(!0);try{const u=await os(n);T({imported:n.importableFiles.length,review:n.reviewFiles,blocked:n.blockedFiles,artifactTitle:u.title}),D.success(`${n.importableFiles.length} arquivo(s) verde(s) importado(s).`)}catch(u){const S=u instanceof Error?u.message:"Falha ao importar pacote.";D.error(S)}finally{r(!1)}}}function qe(u,S,y){Le(S,u,y)}return e.jsxs(q,{children:[e.jsx(V,{}),e.jsxs("div",{className:"space-y-6 p-4 sm:p-6",children:[e.jsx(Pe,{eyebrow:"Knowledge Bridges",title:"Conexões da Alexandria",description:"Ponte segura entre Bulma/Logseq local e Alexandria. Aqui entram apenas pacotes sanitizados, com rastreio de origem e política clara de privacidade.",icon:xa,actions:e.jsxs(e.Fragment,{children:[e.jsxs(f,{variant:"outline",onClick:()=>a.current?.click(),className:"gap-2",children:[e.jsx(me,{className:"h-4 w-4"}),"Enviar arquivos"]}),e.jsxs(f,{variant:"outline",onClick:Re,className:"gap-2",children:[e.jsx(ce,{className:"h-4 w-4"}),"Abrir pasta"]}),e.jsxs(f,{variant:"outline",onClick:()=>qe("manifest.json",ts(),"application/json"),className:"gap-2",children:[e.jsx(be,{className:"h-4 w-4"}),"Manifesto modelo"]})]})}),e.jsx("input",{ref:a,type:"file",multiple:!0,accept:".md,.markdown,.txt,.json",className:"hidden",onChange:u=>p(u.target.files)}),e.jsxs("div",{className:"grid gap-4 lg:grid-cols-3",children:[e.jsx(I,{children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"grid h-10 w-10 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary",children:e.jsx(he,{className:"h-5 w-5"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold",children:"Bulma continua local"}),e.jsx("p",{className:"mt-1 text-sm text-muted-foreground",children:"A Alexandria não acessa o vault inteiro. Ela só recebe exports autorizados pela Bulma/Xavier."})]})]})}),e.jsx(I,{children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"grid h-10 w-10 shrink-0 place-items-center border border-emerald-500/30 bg-emerald-500/10 text-emerald-700",children:e.jsx(ba,{className:"h-5 w-5"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold",children:"Importação sanitizada"}),e.jsx("p",{className:"mt-1 text-sm text-muted-foreground",children:"Verde entra direto. Amarelo entra com cuidado. Vermelho é bloqueado antes de virar fonte."})]})]})}),e.jsx(I,{children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"grid h-10 w-10 shrink-0 place-items-center border border-sky-500/30 bg-sky-500/10 text-sky-700",children:e.jsx(je,{className:"h-5 w-5"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold",children:"MCP depois"}),e.jsx("p",{className:"mt-1 text-sm text-muted-foreground",children:"Esta tela define contrato, formato e privacidade. O servidor MCP usa a mesma fronteira."})]})]})})]}),e.jsxs("div",{className:"grid gap-4 xl:grid-cols-2",children:[e.jsxs(h,{children:[e.jsxs(L,{children:[e.jsx(B,{children:"Sync de skills · Logseq local"}),e.jsx(J,{children:"Escolha uma pasta do vault ou export local. A Alexandria detecta apenas arquivos que parecem skill e importa só os verdes."})]}),e.jsx(j,{className:"space-y-4",children:t?e.jsxs(e.Fragment,{children:[e.jsx(ta,{preview:t}),O?e.jsx(ra,{summary:O}):null,e.jsx("div",{className:"space-y-3",children:t.skillCandidates.slice(0,8).map(u=>e.jsx(ia,{file:u},`${u.name}-${u.sourcePath||""}`))}),e.jsxs("div",{className:"flex flex-wrap justify-end gap-2",children:[e.jsxs(f,{variant:"outline",onClick:$e,className:"gap-2",children:[e.jsx(ce,{className:"h-4 w-4"}),"Trocar pasta"]}),e.jsxs(f,{onClick:()=>ze(t,A),disabled:!t.importableSkills.length||E==="logseq_local",className:"gap-2",children:[e.jsx(We,{className:"h-4 w-4"}),E==="logseq_local"?"Importando...":"Sincronizar skills"]})]})]}):e.jsx(Me,{icon:ce,title:"Nenhuma pasta do Logseq analisada",description:"Use este fluxo para começar com skills antes de sincronizar prompts, POPs e contexto geral.",actionLabel:"Escolher pasta do Logseq",onAction:$e})})]}),e.jsxs(h,{children:[e.jsxs(L,{children:[e.jsx(B,{children:"Sync de skills · Google Drive"}),e.jsx(J,{children:"Conecte uma pasta canônica do Drive e sincronize somente os arquivos de skill na primeira fase."})]}),e.jsxs(j,{className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(C,{variant:"outline",className:b?"border-emerald-500/30 bg-emerald-500/10 text-emerald-700":"",children:b?"Conectado":"Desconectado"}),e.jsxs(f,{variant:"outline",onClick:Aa,className:"gap-2",children:[e.jsx(Te,{className:"h-4 w-4"}),b?"Reconectar Drive":"Conectar Drive"]})]}),e.jsxs("div",{className:"grid gap-3 sm:grid-cols-[1fr_auto]",children:[e.jsx(H,{value:m,onChange:u=>v(u.target.value),placeholder:"Cole o link ou ID da pasta de skills no Google Drive"}),e.jsxs(f,{onClick:Ia,disabled:_,className:"gap-2",children:[e.jsx(ge,{className:`h-4 w-4 ${_?"animate-spin":""}`}),_?"Lendo Drive...":"Ler pasta"]})]}),l?e.jsxs(e.Fragment,{children:[e.jsx(ta,{preview:l}),M?e.jsx(ra,{summary:M}):null,e.jsx("div",{className:"space-y-3",children:l.skillCandidates.slice(0,8).map(u=>e.jsx(ia,{file:u},`${u.name}-${u.externalId||""}`))}),e.jsx("div",{className:"flex flex-wrap justify-end gap-2",children:e.jsxs(f,{onClick:()=>ze(l,U),disabled:!l.importableSkills.length||E==="google_drive",className:"gap-2",children:[e.jsx(We,{className:"h-4 w-4"}),E==="google_drive"?"Importando...":"Sincronizar skills"]})})]}):e.jsxs(ee,{children:[e.jsx(Te,{className:"h-4 w-4"}),e.jsx(ae,{children:"Drive pronto para skills"}),e.jsx(ne,{children:"Comece apontando a pasta da empresa onde ficam apenas skills ou documentos equivalentes."})]})]})]})]}),e.jsxs("div",{className:"grid gap-4 lg:grid-cols-[0.9fr_1.1fr]",children:[e.jsxs(h,{children:[e.jsxs(L,{children:[e.jsx(B,{children:"Política de fronteira"}),e.jsx(J,{children:"Alexandria é operacional; Bulma é pessoal. A ponte só transporta o que foi permitido."})]}),e.jsxs(j,{className:"space-y-4",children:[Object.keys(Ne).map(u=>e.jsxs("div",{className:"border border-border p-4",children:[e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsx("p",{className:"font-medium",children:Ne[u].title}),e.jsx(C,{variant:"outline",className:te[u],children:u})]}),e.jsx("p",{className:"mt-2 text-sm text-muted-foreground",children:Ne[u].description})]},u)),e.jsx(Pa,{}),e.jsxs(f,{variant:"outline",className:"w-full gap-2",onClick:()=>qe("README-bulma-alexandria.md",rs(),"text/markdown"),children:[e.jsx(be,{className:"h-4 w-4"}),"Baixar checklist da Bulma"]})]})]}),e.jsxs(h,{children:[e.jsxs(L,{children:[e.jsx(B,{children:"Análise do pacote"}),e.jsxs(J,{children:["Envie os arquivos de ",e.jsx("span",{className:"font-medium",children:"exports/totum-os"})," para revisar antes da assimilação."]})]}),e.jsx(j,{className:"space-y-4",children:n?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex flex-col gap-3 border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-medium",children:"Pronto para importar"}),e.jsxs("p",{className:"mt-1 text-sm text-muted-foreground",children:[n.allowedFiles.length," permitido(s), ",n.blockedFiles.length," bloqueado(s)"]}),e.jsxs("p",{className:"mt-1 text-xs text-muted-foreground",children:["A assimilação automática importa apenas os ",n.importableFiles.length," verde(s). ",n.reviewFiles.length," amarelo(s) ficam para revisão."]})]}),e.jsxs("div",{className:"min-w-40",children:[e.jsxs("div",{className:"mb-2 flex justify-between text-xs text-muted-foreground",children:[e.jsx("span",{children:"Score seguro"}),e.jsxs("span",{children:[$,"%"]})]}),e.jsx(pa,{value:$})]})]}),n.blockedFiles.length>0&&e.jsxs(ee,{variant:"destructive",children:[e.jsx(ve,{className:"h-4 w-4"}),e.jsx(ae,{children:"Arquivos bloqueados não serão importados"}),e.jsx(ne,{children:"A ponte detectou sinais vermelhos. Gere resumo sanitizado na Bulma antes de reenviar."})]}),n.reviewFiles.length>0&&e.jsxs(ee,{children:[e.jsx(ve,{className:"h-4 w-4"}),e.jsx(ae,{children:"Arquivos amarelos ficarão fora da importação automática"}),e.jsxs(ne,{children:["A ponte encontrou ",n.reviewFiles.length," arquivo(s) que precisam de revisão ou resumo sanitizado antes de entrar na Alexandria."]})]}),d&&e.jsxs("div",{className:"space-y-3 border border-emerald-500/30 bg-emerald-500/10 p-4",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(re,{className:"mt-0.5 h-5 w-5 text-emerald-700"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-emerald-800",children:"Assimilação concluída"}),e.jsxs("p",{className:"mt-1 text-sm text-emerald-800",children:[d.imported," arquivo(s) verde(s) importado(s) em ",d.artifactTitle,"."]}),e.jsxs("p",{className:"mt-1 text-sm text-muted-foreground",children:[d.review.length," amarelo(s) e ",d.blocked.length," vermelho(s) não foram importados e continuam no Mac/Bulma."]})]})]}),(d.review.length>0||d.blocked.length>0)&&e.jsxs("div",{className:"max-h-44 overflow-y-auto border border-border bg-background/70 p-3",children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",children:"Não importados"}),[...d.review,...d.blocked].map(u=>e.jsxs("div",{className:"mb-2 last:mb-0",children:[e.jsx("p",{className:"truncate text-sm font-medium",children:u.name}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:[u.label,": ",u.reason]})]},`${u.name}-${u.zone}`))]})]}),e.jsx("div",{className:"space-y-3",children:n.files.map(u=>e.jsx(it,{file:u},`${u.name}-${u.zone}`))}),e.jsxs("div",{className:"flex flex-wrap justify-end gap-2 pt-2",children:[e.jsxs(f,{variant:"outline",onClick:()=>a.current?.click(),className:"gap-2",children:[e.jsx(me,{className:"h-4 w-4"}),"Trocar arquivos"]}),e.jsxs(f,{variant:"outline",onClick:Re,className:"gap-2",children:[e.jsx(ce,{className:"h-4 w-4"}),"Trocar pasta"]}),e.jsxs(f,{onClick:La,disabled:s||!n.importableFiles.length,className:"gap-2",children:[e.jsx(un,{className:"h-4 w-4"}),s?"Importando...":"Assimilar apenas o permitido"]})]})]}):e.jsx(Me,{icon:me,title:"Nenhum pacote analisado",description:"Escolha arquivos ou uma pasta exportada pela Bulma. A Alexandria lê .md, .txt e .json, preserva os caminhos da pasta e classifica a privacidade antes de salvar.",actionLabel:"Selecionar arquivos",onAction:()=>a.current?.click()})})]})]})]})]})}function it({file:a}){const n=a.zone==="red"?va:a.zone==="yellow"?ve:re;return e.jsx("div",{className:"border border-border p-4",children:e.jsxs("div",{className:"flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",children:[e.jsxs("div",{className:"flex min-w-0 items-start gap-3",children:[e.jsx("div",{className:`grid h-9 w-9 shrink-0 place-items-center border ${te[a.zone]}`,children:e.jsx(n,{className:"h-4 w-4"})}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"truncate font-medium",children:a.name}),e.jsx("p",{className:"mt-1 text-sm text-muted-foreground",children:a.reason}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:a.suggestedAction})]})]}),e.jsx(C,{variant:"outline",className:te[a.zone],children:a.label})]})})}function ta({preview:a}){const n=a.health.status==="ready"?"text-emerald-700":a.health.status==="blocked"?"text-destructive":"text-amber-700";return e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"grid gap-3 sm:grid-cols-5",children:[e.jsxs(I,{children:[e.jsx("p",{className:"text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground",children:"Arquivos lidos"}),e.jsx("p",{className:"mt-2 text-2xl font-semibold",children:a.files.length})]}),e.jsxs(I,{children:[e.jsx("p",{className:"text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground",children:"Skills detectadas"}),e.jsx("p",{className:"mt-2 text-2xl font-semibold",children:a.skillCandidates.length})]}),e.jsxs(I,{children:[e.jsx("p",{className:"text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground",children:"Verdes"}),e.jsx("p",{className:"mt-2 text-2xl font-semibold text-emerald-700",children:a.importableSkills.length})]}),e.jsxs(I,{children:[e.jsx("p",{className:"text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground",children:"Revisão/Bloqueio"}),e.jsx("p",{className:"mt-2 text-2xl font-semibold text-amber-700",children:a.reviewFiles.length+a.blockedFiles.length})]}),e.jsxs(I,{children:[e.jsx("p",{className:"text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground",children:"Score sync"}),e.jsxs("p",{className:`mt-2 text-2xl font-semibold ${n}`,children:[a.health.score,"%"]})]})]}),e.jsxs(ee,{children:[e.jsx(ba,{className:"h-4 w-4"}),e.jsxs(ae,{children:["Status da rodada: ",a.health.status]}),e.jsxs(ne,{children:[e.jsx("span",{className:"block",children:a.health.nextAction}),a.health.warnings.length?e.jsx("span",{className:"mt-2 block text-xs",children:a.health.warnings.join(" ")}):null]})]})]})}function ra({summary:a}){return e.jsx("div",{className:"space-y-3 border border-emerald-500/30 bg-emerald-500/10 p-4",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(re,{className:"mt-0.5 h-5 w-5 text-emerald-700"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-emerald-800",children:"Sincronização concluída"}),e.jsxs("p",{className:"mt-1 text-sm text-emerald-800",children:[a.importedSkills," skill(s) importada(s) em ",a.artifactTitle,"."]}),e.jsxs("p",{className:"mt-1 text-sm text-muted-foreground",children:[a.review," em revisão e ",a.blocked," bloqueada(s) ficaram fora desta rodada."]})]})]})})}function ia({file:a}){const n=a.zone==="red"?va:a.zone==="yellow"?ve:re;return e.jsx("div",{className:"border border-border p-4",children:e.jsxs("div",{className:"flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",children:[e.jsxs("div",{className:"flex min-w-0 items-start gap-3",children:[e.jsx("div",{className:`grid h-9 w-9 shrink-0 place-items-center border ${te[a.zone]}`,children:e.jsx(n,{className:"h-4 w-4"})}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"truncate font-medium",children:a.sourcePath||a.name}),e.jsx("p",{className:"mt-1 text-sm text-muted-foreground",children:a.skillReason}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:a.zoneReason})]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(C,{variant:"outline",className:te[a.zone],children:a.zoneLabel}),e.jsx(C,{variant:a.isSkillCandidate?"default":"outline",children:a.isSkillCandidate?"Skill":"Fora do escopo"}),a.isDuplicate?e.jsx(C,{variant:"outline",className:"border-amber-500/30 bg-amber-500/10 text-amber-700",children:"Duplicado"}):null]})]})})}function la(a){return Array.from(a).filter(n=>tt.test(n.webkitRelativePath||n.name))}async function ca(a){try{return await Promise.all(a.map(async n=>({name:n.webkitRelativePath||n.name,sourcePath:n.webkitRelativePath||n.name,content:await n.text()})))}catch(n){throw new Error(n instanceof Error?`Falha ao ler arquivo local: ${n.message}`:"Falha ao ler um dos arquivos locais.")}}const Dt=Object.freeze(Object.defineProperty({__proto__:null,default:rt},Symbol.toStringTag,{value:"Module"})),z=[{id:"alexandria",name:"Alexandria",path:"/alexandria",icon:se,what:"Página-mãe da biblioteca operacional do Totum OS. É o ponto de entrada para fontes, artefatos, skills, POPs, contexto e exportação.",impact:"Centraliza o conhecimento do time e reduz o tempo perdido procurando decisões, materiais e instruções espalhadas.",connections:"Conecta com Hermione, Skills Central, POPs, Context Hub, Conexões e os exports para Claude, ChatGPT e Kimi.",example:"Quando surgir uma nova capacidade ou processo, abra a Alexandria para decidir se aquilo deve virar skill, POP, contexto ou pacote exportável.",outcome:"Resultado esperado: o conhecimento entra no lugar certo e fica governado para o resto da operação."},{id:"hermione",name:"Hermione",path:"/hermione",icon:he,what:"Chat consultivo e camada de assimilação da Alexandria. Ela lê documentos, unifica conteúdos e transforma material bruto em artefatos reutilizáveis.",impact:"Acelera documentação prática, reduz retrabalho e transforma material solto de várias IAs em algo consistente para a operação.",connections:"Conecta com fontes da Alexandria, uploads locais, skill sync, Gemini e os artefatos versionados no ecossistema.",example:"Envie vários MDs sobre um processo e peça para analisar, unificar e gerar uma skill pronta para uso.",outcome:"Resultado esperado: você recebe uma versão consolidada, com lacunas e conflitos apontados, pronta para virar ativo operacional."},{id:"pops",name:"Portal POPs & SLAs",path:"/alexandria/pops",icon:oe,what:"Área dedicada a procedimentos operacionais, padrões e acordos de serviço do ecossistema Totum.",impact:"Padroniza a execução, reduz ambiguidade operacional e melhora onboarding e continuidade do trabalho.",connections:"Conecta com Hermione, Alexandria e a camada de artefatos operacionais que humanos e agentes consultam.",example:"Documente um fluxo de atendimento recorrente com etapas, responsáveis, entradas e critérios de qualidade.",outcome:"Resultado esperado: um POP reutilizável, fácil de consultar e útil tanto no treinamento quanto na execução."},{id:"context",name:"Context Hub",path:"/alexandria/context",icon:pn,what:"Painel que organiza como contexto, conhecimento e instruções circulam entre agentes, execuções e fluxos internos.",impact:"Evita que agentes trabalhem cegos ou com contexto errado, melhorando previsibilidade e consistência nas respostas.",connections:"Conecta com agentes, skills, contexto da Alexandria e a orquestração geral do Totum OS.",example:"Revise qual contexto um agente deveria consumir antes de liberar um novo fluxo ou uma nova automação.",outcome:"Resultado esperado: o agente opera com base certa, menos incoerência e menos necessidade de correção manual."},{id:"skills",name:"Skills Central",path:"/alexandria/skills",icon:xn,what:"Catálogo operacional das skills do Totum, com o skill router como skill principal e o botão único de sincronização.",impact:"Organiza capacidades da operação, facilita manutenção e distribui as skills certas para as IAs certas.",connections:"Conecta com `skills-registry`, `skill_router`, GitHub, sync para Claude, ChatGPT e Kimi e a malha de agentes.",example:"Abra a central para revisar skills ativas, validar a principal e disparar a sincronização multi-provider.",outcome:"Resultado esperado: as skills ficam organizadas, roteadas e prontas para consumo externo ou interno."},{id:"bridges",name:"Conexões da Alexandria",path:"/alexandria/bridges",icon:je,what:"Ponte segura entre Alexandria e fontes externas, como Logseq local, Google Drive e outros pacotes assimiláveis.",impact:"Traz conhecimento útil para dentro da Alexandria sem misturar conteúdo sensível, pessoal ou irrelevante.",connections:"Conecta com Logseq local, Google Drive, Hermione, política verde/amarelo/vermelho e assimilação de artefatos.",example:"Importe uma pasta de skills do Logseq ou uma pasta do Drive com documentação operacional sanitizada.",outcome:"Resultado esperado: só o conteúdo permitido entra e vira fonte rastreável dentro da Alexandria."},{id:"openclaw",name:"OpenClaw Dashboard",path:"/alexandria/openclaw",icon:Te,what:"Painel operacional da camada OpenClaw ligada à execução de agentes, contextos e skills no ecossistema.",impact:"Dá visibilidade para a operação inteligente, ajudando a identificar gargalos, dependências e oportunidades de ajuste.",connections:"Conecta com agentes, skills, fluxos internos e a infraestrutura que suporta execução de IA no Totum OS.",example:"Use o dashboard para entender como um agente está operando e se ele está consumindo as skills corretas.",outcome:"Resultado esperado: ajustes mais rápidos na orquestração e menos opacidade na execução dos agentes."},{id:"exports",name:"Exportar",path:"/alexandria?tab=exports",icon:be,what:"Área que empacota contexto e artefatos da Alexandria para uso fora do app, incluindo Claude, ChatGPT, Gemini, Kimi e fluxos locais.",impact:"Facilita continuidade de trabalho entre plataformas sem perder contexto, instrução e consistência operacional.",connections:"Conecta com skills, pacotes de contexto, GitHub e os ambientes externos de IA que consomem esse material.",example:"Monte um pacote para continuar uma tarefa fora do Totum usando a mesma base de instruções e contexto.",outcome:"Resultado esperado: a troca entre IAs fica muito mais fluida, com menos retrabalho manual de copiar e explicar."}];function lt(){const a=da(),[n,o]=x.useState(z[0].id),s=z.findIndex(i=>i.id===n),r=z[s],t=x.useMemo(()=>`${s+1} de ${z.length}`,[s]),c=()=>{s>0&&o(z[s-1].id)},l=()=>{s<z.length-1&&o(z[s+1].id)};return e.jsxs(q,{children:[e.jsx(V,{}),e.jsxs("div",{className:"space-y-6 p-4 sm:p-6",children:[e.jsx(Pe,{eyebrow:"Onboarding guiado",title:"Tutorial Interativo da Alexandria",description:"Um tour claro e amigável pelas páginas mais importantes da Alexandria, com foco em como cada área ajuda a operação, os agentes e a produtividade do dia a dia.",icon:Se,actions:e.jsxs(f,{onClick:()=>a(r.path),className:"gap-2",children:["Abrir página atual",e.jsx(fe,{className:"h-4 w-4"})]})}),e.jsxs("div",{className:"grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]",children:[e.jsx(h,{children:e.jsxs(j,{className:"space-y-4 p-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[12px] tracking-[-0.01em] text-muted-foreground",children:"Etapa atual"}),e.jsx("p",{className:"mt-1 font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-2xl font-semibold tracking-[-0.03em] text-foreground",children:t})]}),e.jsx(C,{variant:"accent",children:"Tutorial"})]}),e.jsx("div",{className:"space-y-2",children:z.map((i,m)=>{const v=i.id===n,b=i.icon;return e.jsxs("button",{onClick:()=>o(i.id),className:G("flex w-full items-start gap-3 rounded-[20px] border p-4 text-left transition-all duration-200",v?"border-primary/20 bg-primary/10 shadow-[0_20px_40px_-34px_rgba(0,113,227,0.8)]":"border-border/80 bg-white hover:bg-secondary/75"),children:[e.jsx("div",{className:G("grid h-10 w-10 shrink-0 place-items-center rounded-full border",v?"border-primary/20 bg-white text-primary":"border-border bg-secondary text-muted-foreground"),children:e.jsx(b,{className:"h-4 w-4"})}),e.jsxs("div",{className:"min-w-0",children:[e.jsxs("p",{className:"text-[12px] tracking-[-0.01em] text-muted-foreground",children:["Etapa ",m+1]}),e.jsx("p",{className:"mt-1 text-[16px] font-medium tracking-[-0.02em] text-foreground",children:i.name})]})]},i.id)})})]})}),e.jsxs("div",{className:"space-y-6",children:[e.jsx(I,{children:e.jsxs("div",{className:"flex flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-4 md:flex-row md:items-start md:justify-between",children:[e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:"grid h-14 w-14 shrink-0 place-items-center rounded-full border border-border bg-secondary text-primary",children:e.jsx(r.icon,{className:"h-6 w-6"})}),e.jsxs("div",{children:[e.jsx(C,{variant:"outline",children:"Página-chave"}),e.jsx("h2",{className:"mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground",children:r.name}),e.jsx("p",{className:"paragraph-lg mt-3 max-w-3xl",children:r.what})]})]}),e.jsxs(f,{variant:"outline",onClick:()=>a(r.path),className:"gap-2",children:["Ir para a página",e.jsx(fe,{className:"h-4 w-4"})]})]}),e.jsxs("div",{className:"grid gap-4 lg:grid-cols-2",children:[e.jsx(h,{hoverGlow:!1,className:"bg-white",children:e.jsxs(j,{className:"p-5",children:[e.jsx(Fe,{title:"Impacto no projeto e produtividade"}),e.jsx("p",{className:"text-sm leading-relaxed text-muted-foreground",children:r.impact})]})}),e.jsx(h,{hoverGlow:!1,className:"bg-white",children:e.jsxs(j,{className:"p-5",children:[e.jsx(Fe,{title:"Onde conecta e com quem conversa"}),e.jsx("p",{className:"text-sm leading-relaxed text-muted-foreground",children:r.connections})]})})]})]})}),e.jsxs("div",{className:"grid gap-4 lg:grid-cols-2",children:[e.jsx(I,{title:"Exemplo de uso",children:e.jsx("p",{className:"text-sm leading-relaxed text-muted-foreground",children:r.example})}),e.jsx(I,{title:"Resultado esperado",children:e.jsx("p",{className:"text-sm leading-relaxed text-muted-foreground",children:r.outcome})})]}),e.jsx(ct,{onPrevious:c,onNext:l,canPrevious:s>0,canNext:s<z.length-1})]})]})]})]})}function ct({onPrevious:a,onNext:n,canPrevious:o,canNext:s}){return e.jsxs("div",{className:"flex flex-col gap-3 rounded-[24px] border border-border/80 bg-card p-4 shadow-[0_20px_48px_-34px_rgba(29,29,31,0.28)] sm:flex-row sm:items-center sm:justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[12px] tracking-[-0.01em] text-muted-foreground",children:"Navegação do tutorial"}),e.jsx("p",{className:"mt-1 text-sm text-foreground",children:"Avance em ordem ou abra qualquer página direto pela lateral."})]}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs(f,{variant:"secondary",onClick:a,disabled:!o,className:"gap-2",children:[e.jsx(gn,{className:"h-4 w-4"}),"Anterior"]}),e.jsxs(f,{onClick:n,disabled:!s,className:"gap-2",children:["Próximo",e.jsx(fe,{className:"h-4 w-4"})]})]})]})}const Tt=Object.freeze(Object.defineProperty({__proto__:null,default:lt},Symbol.toStringTag,{value:"Module"}));export{Tt as A,kt as C,Dt as K,St as O,V as P,Nt as S,Xe as a,vt as b,jt as c,Ct as d,bt as e,yt as f,ft as i,aa as o,_t as s};
