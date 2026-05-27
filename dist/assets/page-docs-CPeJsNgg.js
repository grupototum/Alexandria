import{r as u,j as n,R as B}from"./vendor-react-Bz9B1RWF.js";import{s as F,L as H,B as Q,a as V,A as R,P as $}from"./page-dashboard-CJ6xbCKe.js";import{_ as k,I as K,B as Y}from"./page-agents-DeZsz5jS.js";import{c as Z,F as J,n as X,Z as E,a7 as nn,P as en,a6 as tn,j as P,X as on,a8 as an}from"./vendor-icons-amnWLyN6.js";import{m as w,A as sn}from"./vendor-motion-BlnQqqQC.js";import"./vendor-supabase-5-s6eCJd.js";import"./vendor-visuals-CselT4Bf.js";const rn={"getting-started":()=>k(()=>Promise.resolve().then(()=>yn),void 0),"agents-guide":()=>k(()=>Promise.resolve().then(()=>xn),void 0),"workflows-guide":()=>k(()=>Promise.resolve().then(()=>bn),void 0),"alexandria-guide":()=>k(()=>Promise.resolve().then(()=>An),void 0),troubleshooting:()=>k(()=>Promise.resolve().then(()=>Cn),void 0),"api-reference":()=>k(()=>Promise.resolve().then(()=>In),void 0)},D=["getting-started","agents-guide","workflows-guide","alexandria-guide","troubleshooting","api-reference"];class ln{docs={};loaded=!1;async load(){if(!this.loaded)try{const e=D.map(async(a,t)=>{const s=rn[a];if(!s){console.warn(`No module found for ${a}`);return}const o=await s(),r=typeof o.default=="string"?o.default:"",d=this.extractTitle(r)||this.slugToTitle(a),c=this.extractSections(r);this.docs[a]={id:a,title:d,slug:a,content:r,order:t,sections:c}});await Promise.all(e),this.loaded=!0}catch(e){console.error("Failed to load documentation:",e),this.loaded=!1}}getDoc(e){return this.docs[e]||null}getAllDocs(){return D.map(e=>this.docs[e]).filter(Boolean)}search(e){const a=e.toLowerCase();return this.getAllDocs().filter(t=>t.title.toLowerCase().includes(a)||t.content.toLowerCase().includes(a))}extractTitle(e){const a=e.match(/^#\s+(.+)$/m);return a?a[1].trim():null}extractSections(e){const a=[],t=/^(#+)\s+(.+)$/gm;let s;for(;(s=t.exec(e))!==null;){const o=s[1].length,r=s[2].trim();a.push({id:this.slugify(r),title:r,level:o,content:""})}return a}slugToTitle(e){return e.split("-").map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" ")}slugify(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")}}let v=null;function j(){return v||(v=new ln),v}function I(){try{const l=localStorage.getItem("totum-api-keys");if(l){const e=JSON.parse(l);if(e.ollamaHost)return e.ollamaHost+"/api"}}catch{}return"http://localhost:11434/api"}function cn(){return typeof window<"u"&&window.location.protocol==="https:"}function dn(l){try{const e=new URL(l);return e.protocol==="http:"&&["localhost","127.0.0.1","::1"].includes(e.hostname)}catch{return!1}}function C(){const l=I();return!(cn()&&dn(l))}class un{ollamaAvailable=!0;checkInterval=null;constructor(){if(!C()){this.ollamaAvailable=!1;return}this.checkOllamaHealth(),this.checkInterval=setInterval(()=>this.checkOllamaHealth(),3e4)}async checkOllamaHealth(){if(!C()){this.ollamaAvailable=!1;return}try{const e=await fetch(`${I()}/tags`);this.ollamaAvailable=e.ok}catch{this.ollamaAvailable=!1}}isOllamaAvailable(){return this.ollamaAvailable}async chat(e,a){if(this.ollamaAvailable)try{return await this.chatWithOllama(e,a)}catch(t){return console.error("Ollama failed, falling back to Groq:",t),this.ollamaAvailable=!1,await this.chatWithGroq(e)}return await this.chatWithGroq(e)}async chatWithOllama(e,a){let t="";try{if(!C())throw new Error("Ollama local indisponível em página HTTPS");const s=await fetch(`${I()}/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"qwen2.5:7b",messages:e,stream:!0,options:{temperature:.7,num_ctx:2048,top_p:.9,top_k:40}})});if(!s.ok)throw new Error(`Ollama API error: ${s.status}`);const o=s.body?.getReader();if(!o)throw new Error("No response body");const r=new TextDecoder;let d="";for(;;){const{done:c,value:i}=await o.read();if(c)break;d+=r.decode(i,{stream:!0});const p=d.split(`
`);d=p.pop()||"";for(const h of p)if(h.trim())try{const y=JSON.parse(h);y.message?.content&&(t+=y.message.content,a?.(y.message.content))}catch{}}return t}catch(s){throw console.error("Ollama chat error:",s),s}}async chatWithGroq(e){throw new Error("Groq API key not configured")}destroy(){this.checkInterval&&clearInterval(this.checkInterval)}}let T=null;function W(){return T||(T=new un),T}function pn(){const[l,e]=u.useState([]),[a,t]=u.useState(null),[s,o]=u.useState(!0),[r,d]=u.useState([]),[c,i]=u.useState(!1),[p,h]=u.useState(!0),[y,O]=u.useState(null);u.useEffect(()=>{(async()=>{try{o(!0);const g=j();await g.load();const x=g.getAllDocs();e(x),x.length>0&&t(x[0])}catch(g){console.error("Failed to initialize documentation:",g)}finally{o(!1)}})()},[]),u.useEffect(()=>{(async()=>{const{data:g}=await F.auth.getUser();O(g.user?.id||null)})()},[]),u.useEffect(()=>{const f=W();h(f.isOllamaAvailable())},[]);const _=u.useCallback(async()=>{},[y]),S=u.useCallback(async(f,g,x)=>{},[y]),M=u.useCallback(async f=>{try{i(!0);const g={id:Date.now().toString(),role:"user",content:f,timestamp:new Date};d(m=>[...m,g]),await S("user",f);const b=j().search(f),U=[{role:"system",content:`You are a helpful documentation assistant for elizaOS. Answer questions based on the provided documentation. If the answer is not in the documentation, say so clearly.

Documentation context:
${b.slice(0,3).map(m=>`${m.title}:
${m.content}`).join(`

`)}`},...r.slice(-5).map(m=>({role:m.role,content:m.content})),{role:"user",content:f}],q=W();let A="";A=await q.chat(U,m=>{});const z={id:(Date.now()+1).toString(),role:"assistant",content:A,timestamp:new Date,sources:b.map(m=>m.title)};d(m=>[...m,z]),await S("assistant",A,b.map(m=>m.id))}catch(g){console.error("Failed to send message:",g);const x={id:(Date.now()+1).toString(),role:"assistant",content:`Sorry, I encountered an error: ${g instanceof Error?g.message:"Unknown error"}. Please try again.`,timestamp:new Date};d(b=>[...b,x])}finally{i(!1)}},[r,S]),L=u.useCallback(f=>{t(f)},[]),G=u.useCallback(()=>{d([])},[]);return{docs:l,selectedDoc:a,selectDoc:L,loading:s,chatMessages:r,chatLoading:c,sendMessage:M,clearChat:G,loadChatHistory:_,ollamaAvailable:p}}function mn({docs:l,selectedDoc:e,onSelectDoc:a,loading:t}){return n.jsxs("div",{className:"flex h-full flex-col overflow-hidden bg-card",role:"navigation","aria-label":"Navegação da documentação",children:[n.jsxs("div",{className:"sticky top-0 z-10 border-b border-border bg-card p-4",children:[n.jsxs("h2",{className:"flex items-center gap-2 text-sm font-semibold text-foreground",children:[n.jsx(Z,{className:"w-4 h-4 text-primary"}),"Documentação"]}),n.jsx("p",{className:"text-xs text-muted-foreground mt-1",children:"Base de conhecimento Totum"})]}),n.jsx("div",{className:"flex-1 overflow-y-auto p-2",role:"list",children:t?n.jsx("div",{className:"space-y-2 p-2",children:[...Array(6)].map((s,o)=>n.jsx("div",{className:"h-10 animate-pulse bg-muted"},o))}):n.jsx(w.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.3},className:"space-y-1",children:l.map((s,o)=>n.jsxs(w.button,{initial:{opacity:0,x:-10},animate:{opacity:1,x:0},transition:{delay:o*.05},onClick:()=>a(s),className:`group flex min-h-[48px] w-full items-center justify-between border px-3 py-3 text-left text-sm transition-all duration-200 active:scale-[0.99] ${e?.id===s.id?"border-primary/60 bg-primary/10 text-foreground":"border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground"}`,"aria-current":e?.id===s.id?"page":void 0,"aria-label":`Ver documentação ${s.title}`,children:[n.jsx(J,{className:"mr-2 h-4 w-4 shrink-0 text-primary/80"}),n.jsx("span",{className:"flex-1 truncate font-medium",children:s.title}),e?.id===s.id&&n.jsx(X,{className:"ml-2 h-4 w-4 flex-shrink-0 text-primary"})]},s.id))})}),n.jsx("div",{className:"border-t border-border bg-background/50 p-3 text-xs text-muted-foreground",children:n.jsx("p",{children:"Clique em um doc para visualizar ou pergunte à IA"})})]})}function N({messages:l,loading:e,onSendMessage:a,onClearChat:t,ollamaAvailable:s}){const[o,r]=u.useState(""),d=u.useRef(null);u.useEffect(()=>{d.current?.scrollIntoView({behavior:"smooth"})},[l]);const c=i=>{i.preventDefault(),o.trim()&&!e&&(a(o),r(""))};return n.jsxs("div",{className:"flex h-full flex-col border-l border-border bg-card",children:[n.jsxs("div",{className:"sticky top-0 z-10 border-b border-border bg-card p-4",children:[n.jsxs("div",{className:"mb-3 flex items-center justify-between",children:[n.jsxs("h2",{className:"flex items-center gap-2 text-sm font-semibold text-foreground",children:[n.jsx(E,{className:"w-4 h-4 text-primary"}),"IA da documentação"]}),l.length>0&&n.jsx("button",{onClick:t,className:"flex min-h-[44px] min-w-[44px] items-center justify-center p-2 transition-colors hover:bg-muted active:scale-95",title:"Limpar histórico","aria-label":"Limpar histórico",children:n.jsx(nn,{className:"h-4 w-4 text-muted-foreground hover:text-foreground"})})]}),n.jsxs("div",{className:"flex items-center gap-2 text-xs",children:[n.jsx("div",{className:`w-2 h-2 rounded-full ${s?"bg-emerald-500":"bg-primary"}`}),n.jsx("span",{className:"text-muted-foreground",children:s?"Ollama Ativo":"Usando Fallback"})]})]}),n.jsxs("div",{className:"flex-1 space-y-4 overflow-y-auto p-4",children:[n.jsxs(sn,{initial:!1,children:[l.length===0?n.jsxs(w.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"flex h-full flex-col items-center justify-center text-center",children:[n.jsx("div",{className:"mb-3 flex h-12 w-12 items-center justify-center border border-border bg-muted",children:n.jsx(E,{className:"w-6 h-6 text-primary"})}),n.jsx("p",{className:"text-sm text-muted-foreground mb-2",children:"Pergunte-me qualquer coisa sobre a Totum"}),n.jsx("p",{className:"text-xs text-muted-foreground/70 max-w-xs",children:"Posso ajudar com agentes, workflows, Alexandria, troubleshooting e referência de API."})]}):l.map(i=>n.jsx(w.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.2},className:`flex ${i.role==="user"?"justify-end":"justify-start"}`,children:n.jsxs("div",{className:`max-w-xs border px-4 py-2.5 ${i.role==="user"?"border-primary/60 bg-primary/15 text-foreground":"border-border bg-muted text-foreground"}`,children:[n.jsx("p",{className:"text-sm leading-relaxed whitespace-pre-wrap break-words",children:i.content}),i.sources&&i.sources.length>0&&n.jsxs("div",{className:"mt-2 border-t border-border pt-2",children:[n.jsx("p",{className:"mb-1 text-xs text-muted-foreground",children:"Fontes:"}),n.jsx("div",{className:"flex flex-wrap gap-1",children:i.sources.map(p=>n.jsx("span",{className:"border border-border bg-background px-2 py-0.5 text-xs",children:p},p))})]})]})},i.id)),e&&n.jsx(w.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"flex justify-start",children:n.jsx("div",{className:"bg-muted px-4 py-2.5 text-foreground",children:n.jsx(H,{size:"sm"})})})]}),n.jsx("div",{ref:d})]}),n.jsxs("div",{className:"sticky bottom-0 border-t border-border bg-card p-4",children:[!s&&n.jsxs("div",{className:"mb-3 flex items-center gap-2 border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary",children:[n.jsx(en,{className:"w-3.5 h-3.5 flex-shrink-0"}),n.jsx("span",{children:"IA local indisponível; respostas seguem em modo seguro."})]}),n.jsxs("form",{onSubmit:c,className:"flex gap-2 items-end",children:[n.jsx(K,{value:o,onChange:i=>r(i.target.value),placeholder:"Pergunte sobre a documentação...",disabled:e,className:"min-h-[48px] flex-1 border-border bg-background py-3 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"}),n.jsx(Q,{type:"submit",disabled:e||!o.trim(),className:"min-h-[48px] min-w-[48px] bg-primary px-3 py-3 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-95 disabled:opacity-50","aria-label":"Enviar mensagem",children:n.jsx(tn,{className:"w-4 h-4"})})]}),n.jsx("p",{className:"mt-2 text-center text-xs text-muted-foreground",children:"IA local quando disponível · sem histórico remoto por padrão"})]})]})}function gn({content:l}){const e=l.split(`
`),a=[];let t=0;const s=o=>{const r=[],d=/(\*\*(.+?)\*\*|`(.+?)`)/g;let c=0,i,p=0;for(;(i=d.exec(o))!==null;)i.index>c&&r.push(o.slice(c,i.index)),i[2]?r.push(n.jsx("strong",{className:"font-semibold text-foreground",children:i[2]},p++)):i[3]&&r.push(n.jsx("code",{className:"border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground",children:i[3]},p++)),c=i.index+i[0].length;return c<o.length&&r.push(o.slice(c)),r.length===1?r[0]:n.jsx(n.Fragment,{children:r})};for(;t<e.length;){const o=e[t];if(o.startsWith("### "))a.push(n.jsx("h3",{className:"mb-2 mt-6 text-base font-semibold text-foreground",children:o.slice(4)},t));else if(o.startsWith("## "))a.push(n.jsx("h2",{className:"mb-3 mt-8 border-b border-border pb-2 text-lg font-semibold text-foreground",children:o.slice(3)},t));else if(o.startsWith("# "))a.push(n.jsx("h1",{className:"mb-4 mt-6 text-2xl font-semibold text-foreground",children:o.slice(2)},t));else if(o.startsWith("- ")||o.startsWith("* ")){const r=[];for(;t<e.length&&(e[t].startsWith("- ")||e[t].startsWith("* "));)r.push(e[t].slice(2)),t++;a.push(n.jsx("ul",{className:"my-3 ml-4 list-disc space-y-1.5",children:r.map((d,c)=>n.jsx("li",{className:"pl-1 text-sm leading-relaxed text-muted-foreground",children:s(d)},c))},`ul-${t}`));continue}else if(/^\d+\. /.test(o)){const r=[];for(;t<e.length&&/^\d+\. /.test(e[t]);)r.push(e[t].replace(/^\d+\. /,"")),t++;a.push(n.jsx("ol",{className:"my-3 ml-4 list-decimal space-y-1.5",children:r.map((d,c)=>n.jsx("li",{className:"pl-1 text-sm leading-relaxed text-muted-foreground",children:s(d)},c))},`ol-${t}`));continue}else if(o.startsWith("```")){o.slice(3).trim();const r=[];for(t++;t<e.length&&!e[t].startsWith("```");)r.push(e[t]),t++;a.push(n.jsx("pre",{className:"my-4 overflow-x-auto border border-border bg-muted p-4 font-mono text-xs leading-relaxed text-foreground",children:n.jsx("code",{children:r.join(`
`)})},`code-${t}`))}else o.startsWith("> ")?a.push(n.jsx("blockquote",{className:"my-3 border-l-2 border-primary/60 bg-primary/5 py-2 pl-4 text-sm italic text-muted-foreground",children:s(o.slice(2))},t)):o.trim()===""||o.trim()==="---"?o.trim()==="---"&&a.push(n.jsx("hr",{className:"my-6 border-border"},t)):a.push(n.jsx("p",{className:"my-2 text-sm leading-7 text-muted-foreground",children:s(o)},t));t++}return n.jsx(n.Fragment,{children:a})}function fn({docs:l,selectedDoc:e,docsLoading:a,onSelectDoc:t,messages:s,chatLoading:o,onSendMessage:r,onClearChat:d,ollamaAvailable:c}){const[i,p]=B.useState(!1);return n.jsxs("div",{className:"flex h-full flex-col overflow-hidden bg-background",children:[n.jsx("div",{className:"shrink-0 border-b border-border bg-background p-4 sm:p-5",children:n.jsx(V,{eyebrow:"Central de conhecimento",title:"Documentação",description:"Guias operacionais, referência de agentes e suporte de IA no mesmo padrão visual do command center.",icon:P,actions:n.jsx(Y,{variant:c?"success":"warning",children:c?"IA local ativa":"Fallback seguro"})})}),n.jsxs("div",{className:"flex min-h-0 flex-1 flex-col lg:flex-row",children:[n.jsx("div",{className:"hidden w-80 flex-shrink-0 flex-col overflow-hidden border-r border-border lg:flex",children:n.jsx(mn,{docs:l,selectedDoc:e,onSelectDoc:t,loading:a})}),n.jsxs("div",{className:"flex min-h-0 w-full flex-1 flex-col lg:flex-row",children:[n.jsx(w.div,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.3},className:"min-h-0 flex-1 overflow-y-auto border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r lg:p-8",children:a?n.jsx("div",{className:"space-y-4 max-w-3xl",children:[...Array(5)].map((h,y)=>n.jsx("div",{className:"h-4 w-3/4 animate-pulse bg-muted"},y))}):e?n.jsxs("article",{className:"max-w-3xl",children:[n.jsxs("div",{className:"mb-6 border border-border bg-card p-5",children:[n.jsx("p",{className:"mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary",children:"Documento"}),n.jsx("h1",{className:"text-2xl font-semibold text-foreground sm:text-3xl",children:e.title})]}),n.jsx("div",{children:n.jsx(gn,{content:e.content})})]}):n.jsxs("div",{className:"h-full flex flex-col items-center justify-center text-center",children:[n.jsx("div",{className:"mb-4 flex h-16 w-16 items-center justify-center border border-border bg-muted text-primary",children:n.jsx(P,{className:"h-7 w-7"})}),n.jsx("p",{className:"mb-2 text-lg font-semibold text-foreground",children:"Documentação Totum"}),n.jsx("p",{className:"text-sm text-muted-foreground max-w-sm",children:"Selecione um documento na sidebar para começar, ou pergunte à IA sobre qualquer assunto da plataforma."})]})}),n.jsx("div",{className:"hidden min-h-0 w-96 flex-shrink-0 flex-col overflow-hidden border-l border-border lg:flex",children:n.jsx(N,{messages:s,loading:o,onSendMessage:r,onClearChat:d,ollamaAvailable:c})})]})]}),n.jsx(w.button,{initial:{scale:0},animate:{scale:1},transition:{delay:.2},onClick:()=>p(!i),className:"fixed bottom-6 right-6 z-40 flex h-16 min-h-[44px] w-16 min-w-[44px] items-center justify-center bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 active:scale-95 lg:hidden","aria-label":i?"Fechar chat":"Abrir chat",children:i?n.jsx(on,{className:"w-6 h-6"}):n.jsx(an,{className:"h-6 w-6"})}),i&&n.jsx(w.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"absolute inset-0 z-40 bg-black/80 lg:hidden",onClick:()=>p(!1),children:n.jsx(w.div,{initial:{y:"100%"},animate:{y:0},exit:{y:"100%"},transition:{type:"spring",damping:30},onClick:h=>h.stopPropagation(),className:"absolute bottom-0 left-0 right-0 h-3/4 bg-background shadow-2xl",children:n.jsx(N,{messages:s,loading:o,onSendMessage:r,onClearChat:d,ollamaAvailable:c})})})]})}function _n(){const{docs:l,selectedDoc:e,selectDoc:a,loading:t,chatMessages:s,chatLoading:o,sendMessage:r,clearChat:d,loadChatHistory:c,ollamaAvailable:i}=pn(),[p,h]=u.useState(!1);return u.useEffect(()=>{c(),l.length>0&&h(!0)},[c,l]),u.useEffect(()=>{const y=setTimeout(()=>{h(!0)},1e3);return()=>clearTimeout(y)},[]),!p&&t?n.jsx(R,{children:n.jsx($,{})}):n.jsx(R,{children:n.jsx(w.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.15},className:"h-[calc(100vh-4rem)] overflow-hidden bg-background",children:n.jsx(fn,{docs:l,selectedDoc:e,docsLoading:t,onSelectDoc:a,messages:s,chatLoading:o,onSendMessage:r,onClearChat:d,ollamaAvailable:i})})})}const hn=`# Getting Started with elizaOS

## Welcome to elizaOS

elizaOS is an AI-powered agent orchestration platform that automates complex business processes through intelligent, specialized agents working together seamlessly.

Think of it as building a team of AI specialists, each with specific skills, who can collaborate to accomplish your business goals automatically.

## What You'll Learn

In this guide, you'll understand:
- **Agents**: Autonomous AI workers with specific roles
- **Workflows**: Automated sequences combining multiple agents
- **Alexandria**: Your AI-powered knowledge management system
- **How to get started**: Your first steps into elizaOS

## Key Concepts Explained

### Agents

Agents are autonomous AI specialists designed to perform specific tasks. Each agent:
- Has a defined role and expertise area
- Can work independently or collaborate with other agents
- Executes tasks based on your input and objectives
- Learns from interactions and improves over time

**Examples of agents:**
- Content Writer Agent: Creates marketing copy
- Data Analyst Agent: Analyzes metrics and generates reports
- Customer Support Agent: Handles inquiries and provides solutions
- SDR Agent: Identifies and qualifies leads

### Workflows

Workflows are orchestrated sequences where multiple agents work together. They:
- Define step-by-step automation sequences
- Handle complex business processes
- Manage dependencies between agents
- Run on schedules or on-demand

**Example workflow:**
\`\`\`
Lead Discovery → Qualification → Email Outreach → Meeting Scheduling
(Agent 1)      (Agent 2)      (Agent 3)         (Agent 4)
\`\`\`

### Alexandria

Alexandria is your intelligent knowledge base. It:
- Stores documents, processes, and institutional knowledge
- Searches using AI (not just keywords)
- Allows you to chat with GILES (AI librarian)
- Keeps your team's knowledge organized and accessible

### Command Center

The Command Center is your control hub where you:
- View system metrics and agent status
- Monitor active executions
- Access dashboards and reports
- Manage configurations

## Quick Start: 5 Minutes

### Step 1: Login
\`\`\`
URL: http://187.127.4.140:3002/
Enter your credentials
\`\`\`

### Step 2: Explore the Dashboard
You'll see:
- Key metrics (agents active, workflows running, documents stored)
- Recent activity feed
- System health status
- Quick action buttons

### Step 3: Visit Agent Lab
\`\`\`
Click: Agent Lab (left sidebar)
Browse available agents
View their descriptions and capabilities
\`\`\`

### Step 4: Execute Your First Agent
\`\`\`
1. Click on an agent (e.g., "Content Writer")
2. Enter your objective (e.g., "Write a product announcement")
3. Click Execute
4. Wait for results
5. Review the output
\`\`\`

### Step 5: Explore Alexandria
\`\`\`
1. Click: Alexandria (left sidebar)
2. Upload a document (PDF, TXT, MD)
3. Ask GILES a question about your documents
4. See AI-powered search results
\`\`\`

## Understanding the Interface

### Left Sidebar
Your navigation hub:
- **Command Center**: Dashboard and metrics
- **Agent Lab**: Create and execute agents
- **Workflow Studio**: Design and run workflows
- **Alexandria**: Knowledge base and search
- **Settings**: Configuration and preferences

### Main Area
- Dashboard: Overview and metrics
- Agent pages: Create, edit, execute agents
- Workflow pages: Design and manage automations
- Alexandria: Upload and search documents

### Top Right
- Your profile
- Notifications
- Help and documentation (?)
- Settings

## Common Tasks

### Creating an Agent
1. Go to Agent Lab
2. Click "New Agent"
3. Fill in details:
   - Name: Unique identifier
   - Role: What it does (e.g., "Content Creator")
   - Description: How it works
   - Skills: Select from available skills
4. Configure settings:
   - Model (Groq, Gemini, etc)
   - Temperature (creativity level: 0-1)
   - Max tokens (response length)
5. Save and test

### Building a Workflow
1. Go to Workflow Studio
2. Click "New Workflow"
3. Add steps by selecting agents
4. Configure input/output mapping
5. Set execution rules (sequential or parallel)
6. Test and deploy

### Uploading Documents
1. Go to Alexandria
2. Click "Upload"
3. Select file
4. Add metadata (title, tags, category)
5. Upload
6. Search immediately or ask GILES

## Best Practices

### For Agents
- Start with simple agents before complex ones
- Test agent outputs before using in workflows
- Document agent purpose for team reference
- Monitor execution times and costs
- Use appropriate models for task complexity

### For Workflows
- Design workflows to handle errors gracefully
- Log important steps for debugging
- Test workflows with sample data first
- Schedule workflows during off-peak hours if possible
- Monitor workflow performance regularly

### For Knowledge Management
- Keep documents organized with clear tags
- Update documents regularly
- Use consistent naming conventions
- Leverage GILES for searching and insights
- Archive outdated information

## System Architecture Overview

elizaOS runs on a modern stack:
- **Frontend**: React 18 with Tailwind CSS
- **Backend**: Node.js with orchestration
- **Database**: Supabase (PostgreSQL + vector search)
- **Local AI**: Ollama (Qwen3 for quick responses)
- **Cloud AI**: Groq, Gemini, GPT models (for complex tasks)

This hybrid approach means:
- Fast local responses when possible
- Powerful cloud models when needed
- No data leaves your servers unnecessarily
- Cost-optimized for scale

## Getting Help

### Documentation
- Check the **Documentation** section for detailed guides
- Use the **Troubleshooting** guide if you hit issues

### Chat Assistant
- Click the **?** button (top right) on any page
- Ask questions about the system
- Get step-by-step guidance
- Get context-aware help

### Common Issues
- Agent not executing? → See Troubleshooting guide
- Documents not found? → Check search terms and metadata
- Workflow stuck? → Monitor individual agents

## What's Next?

Now that you understand the basics:

1. **Explore Agents**: Visit Agent Lab and try different agents
2. **Build Your First Workflow**: Automate a simple process
3. **Upload Documents**: Build your knowledge base
4. **Invite Your Team**: Add colleagues and collaborate
5. **Scale Up**: Create more complex automations

## Important Reminders

- elizaOS learns from your usage patterns
- More specific objectives yield better results
- Monitor costs if using premium models
- Keep your documents updated for better search
- Save important workflows for reuse

---

**Ready to dive deeper?**

- Next: [Agents Guide](./02-agents-guide.md) - Learn everything about agents
- Or: [Workflows Guide](./03-workflows-guide.md) - Master workflow automation
- Or: [Alexandria Guide](./04-alexandria-guide.md) - Knowledge management secrets
`,yn=Object.freeze(Object.defineProperty({__proto__:null,default:hn},Symbol.toStringTag,{value:"Module"})),wn=`# Agents Guide: Master Your AI Specialists

## What Are Agents?

Agents are autonomous AI specialists trained to perform specific tasks. In elizaOS, agents are your team of AI workers that can:
- Work independently on their assigned tasks
- Collaborate with other agents in workflows
- Learn from feedback and improve
- Execute 24/7 without human intervention

Think of an agent like hiring a specialized consultant for a specific job.

## Agent Types in elizaOS

### Content Agents
- **Content Writer**: Creates articles, blog posts, social media content
- **Copywriter**: Writes marketing copy, headlines, call-to-actions
- **Script Generator**: Creates video and podcast scripts
- **Email Composer**: Drafts email campaigns and templates

### Analysis Agents
- **Data Analyst**: Analyzes metrics, trends, and insights
- **Sentiment Analyzer**: Reads customer feedback and extracts insights
- **Competitor Analyst**: Researches competitors and market trends
- **Report Generator**: Creates summaries and reports

### Sales & Marketing Agents
- **Lead Prospector**: Identifies and qualifies potential leads
- **Email Outreach**: Sends personalized outreach messages
- **Social Media Manager**: Plans and schedules content
- **Campaign Optimizer**: Tests and improves campaigns

### Operations Agents
- **Task Scheduler**: Schedules and manages recurring tasks
- **Document Processor**: Extracts and processes document information
- **Quality Checker**: Reviews outputs for quality and compliance
- **Integration Manager**: Connects with external systems

## Creating an Agent

### Step-by-Step Process

**1. Navigate to Agent Lab**
\`\`\`
Click: Agent Lab (left sidebar)
Click: "New Agent" (top right)
\`\`\`

**2. Basic Information**
\`\`\`
Name: Unique identifier
  - Use lowercase, hyphens ok
  - Example: "content-writer-v1"

Role: What this agent does
  - Example: "Content Creator"

Description: How it works
  - Explain its purpose and capabilities
  - 1-2 sentences
\`\`\`

**3. Select Skills**
\`\`\`
Choose which skills this agent has:
- Writing
- Analysis
- Research
- Scheduling
- Integration
- Etc.

Each skill adds capability
You can add/remove skills later
\`\`\`

**4. Model Configuration**
\`\`\`
Model: Which AI powers this agent
- Groq (fast, free tier)
- Gemini (powerful, flexible)
- GPT-4 (advanced reasoning)
- Local Ollama (fast, no cost)

Temperature: Creativity vs consistency
- 0.0 = Very consistent, factual
- 0.5 = Balanced
- 1.0 = Creative, varied responses
  
Max Tokens: Response length
- 500 = Short responses
- 2000 = Medium responses  
- 4000+ = Long-form content

Context Window: How much history it remembers
- More = better quality, higher cost
\`\`\`

**5. Custom Instructions (Optional)**
\`\`\`
Add specific instructions:
- Writing style preferences
- Brand voice guidelines
- Specific formats to follow
- Things to avoid
\`\`\`

**6. Review & Save**
\`\`\`
Review all settings
Click: Save Agent
Agent is now available to use
\`\`\`

## Executing an Agent

### From Agent Lab

**Step 1: Select Agent**
\`\`\`
Go to: Agent Lab
Find your agent in the list
Click on it
\`\`\`

**Step 2: Enter Objective**
\`\`\`
Click: Execute
Enter your request/objective:
- Be specific about what you want
- Provide context if needed
- Example: "Write a LinkedIn post about AI automation, casual tone, 150 words"
\`\`\`

**Step 3: Provide Input (Optional)**
\`\`\`
Add relevant information:
- Source material
- Data to analyze
- Context or background
- Any constraints
\`\`\`

**Step 4: Execute**
\`\`\`
Click: Run
Agent processes your request
You see: Status, progress, ETA
\`\`\`

**Step 5: Review Output**
\`\`\`
Agent returns results
Review for quality
Options:
- Accept and use
- Regenerate with different settings
- Edit and refine
- Save as template
\`\`\`

## From Workflows

Agents in workflows execute automatically based on:
- Triggers (schedule, webhook, manual)
- Inputs from previous steps
- Configured settings
- Error handling rules

See: [Workflows Guide](./03-workflows-guide.md)

## Advanced Agent Usage

### Chaining Agents
Combine multiple agents sequentially:
\`\`\`
Agent 1 (Research) → Agent 2 (Analyze) → Agent 3 (Summarize)
     Input              Output from 1         Output from 2
\`\`\`

### Parallel Execution
Run agents simultaneously for speed:
\`\`\`
Agent A ─┐
Agent B ─┤─→ Combine Results
Agent C ─┘
\`\`\`

### Conditional Logic
Route based on conditions:
\`\`\`
If quality > threshold → Use output
Else → Re-run with different parameters
\`\`\`

### Error Handling
Agents can recover from errors:
\`\`\`
Try Agent with Model A
If fails → Try with Model B
If still fails → Use fallback output
\`\`\`

## Agent Performance Metrics

Monitor your agents:

### Execution Time
- Average time per execution
- Trend over time
- Performance by model

### Success Rate
- Successful executions
- Failed executions
- Retry rate

### Cost
- Tokens used
- Model costs
- Cost per execution

### Quality
- User ratings
- Output consistency
- Improvement over time

## Best Practices for Agents

### Design Principles
1. **Single Responsibility**: Each agent does one thing well
2. **Clear Purpose**: Define exactly what it does
3. **Consistent Output**: Similar inputs produce similar quality outputs
4. **Proper Scoping**: Don't make agents do too much

### Configuration Tips
1. **Start Simple**: Basic settings first, optimize later
2. **Test Before Deploy**: Always test new agents
3. **Monitor Performance**: Track quality and costs
4. **Update Regularly**: Refine instructions based on results
5. **Document Everything**: Record agent purpose and usage

### Prompt Engineering
Write clear agent instructions:
\`\`\`
✓ GOOD: "Analyze sales data for Q3 and identify top 3 trends"
✗ BAD: "Analyze data"

✓ GOOD: "Write friendly, casual tone. Max 150 words. Include emoji."
✗ BAD: "Write something"

✓ GOOD: "Return response in JSON format with these fields: ..."
✗ BAD: "Return response"
\`\`\`

### Resource Management
- Use Groq/Ollama for simple tasks (faster, cheaper)
- Use Gemini/GPT-4 for complex reasoning
- Reuse agents across workflows (cost efficient)
- Monitor token usage (can add up quickly)

## Troubleshooting Agents

### Agent Not Executing
**Symptoms**: Execution stuck or fails immediately

**Solutions**:
1. Check agent status in dashboard
2. Verify model is available (check API keys)
3. Review error message carefully
4. Test with simpler objective first
5. Check input format (does agent expect JSON? Plain text?)

### Poor Quality Output
**Symptoms**: Agent output is irrelevant, inconsistent, or wrong

**Solutions**:
1. Refine agent instructions (be more specific)
2. Lower temperature (more consistent)
3. Provide better context/examples
4. Try different model
5. Break complex task into multiple agents
6. Add validation step after agent

### Unexpected Results
**Symptoms**: Agent producing weird or off-topic responses

**Solutions**:
1. Check agent instructions (any ambiguity?)
2. Review input provided to agent
3. Increase context window (more memory)
4. Test with different examples
5. Consider if task is too complex for agent

### Performance Issues
**Symptoms**: Agent runs slowly or times out

**Solutions**:
1. Reduce max tokens (shorter responses)
2. Use faster model (Groq instead of GPT-4)
3. Reduce context window
4. Break task into smaller pieces
5. Check for external API delays

## Agent Examples

### Example 1: Content Writer Agent

\`\`\`
Name: content-writer-blog
Role: Blog Post Writer
Model: Gemini (creative, good writing)
Temperature: 0.7 (balanced)
Max Tokens: 2000

Custom Instructions:
- Write in casual, engaging tone
- Include examples and analogies
- Structure with clear headings
- Add call-to-action at end
- Target: Marketing professionals
\`\`\`

Usage:
\`\`\`
Input: "Write blog post about AI automation benefits"
Output: 1500-word blog post, ready to publish
\`\`\`

### Example 2: Data Analyst Agent

\`\`\`
Name: data-analyst-metrics
Role: Metrics Analyzer
Model: GPT-4 (reasoning, analysis)
Temperature: 0.3 (consistent, analytical)
Max Tokens: 1000

Custom Instructions:
- Identify trends in data
- Highlight anomalies
- Suggest improvements
- Use percentages and comparisons
- Focus on actionable insights
\`\`\`

Usage:
\`\`\`
Input: Sales data CSV
Output: Analysis report with 3 key insights and recommendations
\`\`\`

### Example 3: Email Outreach Agent

\`\`\`
Name: email-outreach-sales
Role: Sales Email Writer
Model: Groq (fast, efficient)
Temperature: 0.6 (personalized)
Max Tokens: 500

Custom Instructions:
- Personalize with prospect name
- Keep to 3-4 sentences
- Include specific value proposition
- Add soft CTA (not pushy)
- Professional but friendly tone
\`\`\`

Usage:
\`\`\`
Input: Prospect name, company, role, pain point
Output: Personalized email ready to send
\`\`\`

## Integration with Workflows

Agents power workflows. Example:
\`\`\`
Workflow: "Weekly Report Generation"

Step 1: Data Collector Agent
- Gathers metrics from all sources
- Output: Structured data

Step 2: Data Analyst Agent  
- Analyzes data
- Output: Insights and trends

Step 3: Report Writer Agent
- Creates formatted report
- Output: Polished report document

Step 4: Email Agent
- Sends to stakeholders
- Output: Confirmation
\`\`\`

## Next Steps

- **Run Your First Agent**: Pick an agent and execute it
- **Create Custom Agent**: Design one for your specific need
- **Explore Workflows**: Combine agents for automation
- **Monitor Performance**: Track quality and costs

---

**Need help?** Use the chat assistant to ask about agents or specific tasks.
`,xn=Object.freeze(Object.defineProperty({__proto__:null,default:wn},Symbol.toStringTag,{value:"Module"})),kn=`# Workflows Guide: Automate Everything

## What Are Workflows?

Workflows are multi-step automation sequences where agents work together to accomplish complex business processes. Instead of running agents manually, workflows run automatically based on triggers and conditions.

Think of a workflow as a recipe: specific steps in a specific order, with agents handling each step.

## Workflow Concepts

### Components

**1. Trigger**: What starts the workflow
- Schedule (every day, week, month)
- Manual (click to run)
- Webhook (external system triggers)
- Event (something happens in elizaOS)

**2. Steps**: Sequential or parallel agent executions
- Each step uses one or more agents
- Steps can have conditions
- Steps can have error handling

**3. Data Flow**: How data moves between steps
- Output from step 1 → Input to step 2
- Mapping ensures correct format
- Transformations available if needed

**4. Actions**: What happens when workflow completes
- Save results to database
- Send email with results
- Update external system
- Trigger next workflow
- Store in Alexandria

### Workflow Patterns

**Sequential**: One step after another
\`\`\`
Step 1 → Step 2 → Step 3 → Step 4
\`\`\`
Best for: Step-by-step processes with dependencies

**Parallel**: Multiple steps at once
\`\`\`
        ┌─ Step 2 ─┐
Step 1 ─┤         ├─ Step 4
        └─ Step 3 ─┘
\`\`\`
Best for: Independent tasks that can run simultaneously

**Conditional**: Different paths based on conditions
\`\`\`
Step 1 ─ If condition A → Step 2A → Step 3
      └─ If condition B → Step 2B → Step 3
\`\`\`
Best for: Different processing based on input

**Looping**: Repeat steps until condition met
\`\`\`
Step 1 → Step 2 (Loop until done) → Step 3
\`\`\`
Best for: Processing variable amounts of data

## Creating a Workflow

### Step 1: Define Purpose
Before building, clarify:
- What problem does it solve?
- What triggers it?
- What's the desired output?
- How often runs it?

### Step 2: Plan Steps
List the agents/actions needed:
\`\`\`
Example: Lead Qualification Workflow

1. Receive lead data
2. Validate contact information
3. Check against CRM (already customer?)
4. Score lead quality
5. Send notification to sales
6. Schedule follow-up
\`\`\`

### Step 3: Create in Workflow Studio

**1. New Workflow**
\`\`\`
Click: Workflow Studio
Click: New Workflow
Enter name and description
\`\`\`

**2. Add Trigger**
\`\`\`
Choose trigger type:
- Schedule: Daily at 9 AM
- Manual: Click to run
- Webhook: External system calls
- Event: Specific event occurs

Configure trigger details
\`\`\`

**3. Add Steps**
\`\`\`
Click: Add Step
Select agent or action
Configure:
- Input mapping (where does data come from?)
- Settings (temperature, tokens, etc)
- Timeout (how long to wait?)
- Error handling (what if it fails?)
- Output mapping (what to pass to next step?)

Repeat for each step
\`\`\`

**4. Configure Data Flow**
\`\`\`
Connect step outputs to next step inputs
Example:
- Step 1 output "emails" → Step 2 input "contact_list"
- Step 2 output "validated_emails" → Step 3 input "emails"

Ensure data types match
\`\`\`

**5. Add Post-Actions**
\`\`\`
When workflow completes:
- Save results where?
- Notify whom?
- Trigger other workflows?
- Update external systems?
\`\`\`

**6. Test & Deploy**
\`\`\`
Click: Test
Run with sample data
Review results
If ok: Click Deploy
If not: Fix and test again
\`\`\`

## Workflow Examples

### Example 1: Daily Content Generation

\`\`\`
Name: Daily Blog Post Generator
Schedule: Every weekday at 8 AM

Step 1: Topic Selector
- Agent: Topic Researcher
- Input: Blog category, target keywords
- Output: 5 topic ideas ranked by relevance

Step 2: Content Writer
- Agent: Blog Post Writer
- Input: Selected topic from Step 1
- Output: 1500+ word blog post

Step 3: Quality Check
- Agent: Content Reviewer
- Input: Blog post from Step 2
- Output: Quality score, suggestions

Step 4: Post Action
- If quality score > 0.8: Save to Alexandria
- Send email to content team
\`\`\`

### Example 2: Lead Qualification Workflow

\`\`\`
Name: Lead Auto-Qualification
Trigger: New lead submitted via web form

Step 1: Data Validation
- Agent: Data Validator
- Input: Form submission
- Output: Validated contact info

Step 2: CRM Check (Parallel)
- Agent: CRM Lookup
- Input: Email from Step 1
- Output: Is existing customer?

Step 3: Lead Scoring (Parallel)
- Agent: Lead Scorer
- Input: Validated data from Step 1
- Output: Lead quality score (1-100)

Step 4: Route Decision
- If existing customer: Route to Account Manager
- If high quality (>80): Route to Sales
- If medium quality: Add to nurture sequence
- If low quality: Archive

Step 5: Notify
- Agent: Email Sender
- Input: Routing decision
- Output: Email sent to appropriate team
\`\`\`

### Example 3: Weekly Report Generation

\`\`\`
Name: Weekly Performance Report
Schedule: Every Monday at 9 AM

Step 1: Data Collection (Parallel)
- Agent 1: Collect Sales Metrics
- Agent 2: Collect Marketing Metrics  
- Agent 3: Collect Operations Metrics
- Output: Three data sets

Step 2: Analysis (Parallel)
- Agent 1: Analyze Sales Data
- Agent 2: Analyze Marketing Data
- Agent 3: Analyze Operations Data
- Output: Three analysis reports

Step 3: Consolidation
- Agent: Report Consolidator
- Input: Three reports from Step 2
- Output: Single comprehensive report

Step 4: Distribution
- Send to leadership team
- Save to Alexandria
- Create Slack notification
\`\`\`

## Advanced Workflow Features

### Error Handling

\`\`\`
For each step, configure what happens if it fails:

Option 1: Retry
- Retry up to 3 times
- Wait 60 seconds between retries
- Then fail or use fallback

Option 2: Fallback
- If Step 2 fails, use static/default data
- Continue to Step 3 with fallback

Option 3: Notify & Stop
- Send alert to admin
- Stop workflow
- Require manual intervention

Option 4: Alternative Path
- If Step 2 fails, go to Step 2B instead
- Continue normally
\`\`\`

### Conditional Logic

\`\`\`
After Step 2, check condition:

If lead_score > 80:
  → Route to sales team
Else if lead_score > 50:
  → Add to nurture sequence  
Else:
  → Archive

Different agents or paths based on conditions
\`\`\`

### Data Transformation

\`\`\`
Between steps, transform data if needed:

Step 1 output format:
{
  "name": "John Doe",
  "email": "john@example.com"
}

Transform to Step 2 input format:
{
  "customer_name": "John Doe",
  "contact_email": "john@example.com"
}
\`\`\`

### Scheduling

\`\`\`
Choose when workflow runs:

- One time: "Run once at 2 PM next Tuesday"
- Recurring: 
  - Every day at 9 AM
  - Every Monday at 8 AM
  - Every 1st of month at 9 AM
  - Every 4 hours
  - Custom cron expression

Timezone-aware scheduling
Avoid peak hours if cost-conscious
\`\`\`

## Monitoring Workflows

### Dashboard

View for each workflow:
- Last run time
- Status (success/failed/running)
- Duration (how long it took)
- Results (what was output)
- Cost (tokens used, API charges)

### Execution History

See past executions:
- When it ran
- How long it took
- What errors occurred
- What was output

### Performance Metrics

Track over time:
- Average execution time
- Success rate
- Cost per execution
- Most common errors

## Best Practices

### Design
1. Keep workflows focused (one business process per workflow)
2. Use parallel steps when possible (faster)
3. Add error handling (don't let workflows silently fail)
4. Test with real data before deploying
5. Document purpose and expected outputs

### Execution
1. Schedule computationally intensive workflows during off-peak hours
2. Monitor costs, especially with expensive models
3. Use notifications for important workflows
4. Archive results for auditability
5. Regularly review and optimize

### Optimization
1. Reduce token usage (shorter outputs = cheaper)
2. Use faster models for simple tasks
3. Combine steps when possible
4. Cache results when applicable
5. Monitor and alert on failures

## Workflow Performance Tips

### Speed Up
- Use parallel steps instead of sequential
- Use faster models (Groq instead of GPT-4)
- Reduce max_tokens in agent config
- Simplify data transformations

### Save Money
- Use Groq/Ollama for simple tasks
- Reduce token usage (shorter prompts/outputs)
- Schedule during lower-demand times
- Reuse workflows (don't rebuild)

### Improve Reliability
- Add error handling to all steps
- Test before deploying
- Monitor execution history
- Set up alerts for failures
- Have fallback options

## Common Patterns

### Content Pipeline
\`\`\`
Topic Research → Write → Edit → Publish → Social Promotion
\`\`\`

### Lead Management
\`\`\`
Lead Received → Validate → Score → Qualify → Route → Notify
\`\`\`

### Data Pipeline
\`\`\`
Extract → Transform → Analyze → Report → Distribute
\`\`\`

### Customer Support
\`\`\`
Ticket Received → Categorize → Route → Respond → Follow-up
\`\`\`

## Troubleshooting

### Workflow Not Running
**Check**:
- Trigger configured correctly?
- Workflow deployed?
- Trigger conditions met?
- Permissions set correctly?

### Workflow Fails at Step 2
**Check**:
- Data format from Step 1 correct?
- Step 2 input mapping correct?
- Step 2 agent available?
- Error message in logs?

### Poor Output Quality
**Check**:
- Agent instructions clear?
- Input data good quality?
- Temperature appropriate?
- Try different model?

### Workflow Too Slow
**Check**:
- Are steps sequential unnecessarily?
- Can any run in parallel?
- Can you use faster model?
- Reduce max_tokens?

## Next Steps

- **Build Your First Workflow**: Automate a manual process
- **Monitor Performance**: Track costs and execution time
- **Optimize**: Improve speed and quality
- **Scale**: Add more workflows as you succeed

---

**Need help?** Use the chat to ask about workflow design or troubleshooting.
`,bn=Object.freeze(Object.defineProperty({__proto__:null,default:kn},Symbol.toStringTag,{value:"Module"})),Sn=`# Alexandria Guide: Master Your Knowledge Base

## What Is Alexandria?

Alexandria is your intelligent knowledge management system. It stores, organizes, and makes searchable all your business documents, processes, and institutional knowledge.

Unlike traditional file storage, Alexandria uses AI to understand content, making it searchable by meaning (not just keywords) and queryable through natural language.

Think of Alexandria as a library where the librarian (GILES) understands every book and can answer any question about them.

## Key Features

### AI-Powered Search
- Search by meaning, not just keywords
- Find similar documents automatically
- Discover related information
- Get ranked results by relevance

### Document Management
- Upload any file type (PDF, Word, Excel, TXT, MD, etc)
- Organize with tags and categories
- Add metadata (title, author, date, etc)
- Version history tracking
- Full-text search

### Chat with GILES
- Ask questions about your documents
- Get cited answers with sources
- Conversational search
- Context-aware responses

### Skills Library
- Browse available AI skills
- Understand what each can do
- See usage examples
- Create custom skills

## Uploading Documents

### Basic Upload

**1. Navigate to Alexandria**
\`\`\`
Click: Alexandria (left sidebar)
\`\`\`

**2. Click Upload**
\`\`\`
Click: Upload Documents
Select file(s) to upload
\`\`\`

**3. Add Metadata**
\`\`\`
Document Title: Clear, descriptive name
Author/Source: Who created it?
Category: What type? (Policy, Process, Guide, etc)
Tags: Search keywords
Date: When created or updated?
Description: 1-2 sentence summary
\`\`\`

**4. Upload**
\`\`\`
Click: Upload
File processes (may take time for large files)
Document becomes searchable
\`\`\`

### Bulk Upload

\`\`\`
Click: Bulk Upload
Select multiple files at once
Set default category/tags
All files upload together
Saves time for large document migrations
\`\`\`

### Supported Formats

\`\`\`
Text:
- .txt (plain text)
- .md (Markdown)
- .csv (data)

Documents:
- .pdf (scanned or digital)
- .docx (Word)
- .doc (older Word)
- .xlsx (Excel)

Web:
- .html (web pages)
- .json (data)
\`\`\`

## Searching Documents

### Simple Search

\`\`\`
Click: Search (Alexandria)
Type your query:
- Keywords: "Q3 budget"
- Questions: "What was our Q3 revenue?"
- Topics: "customer retention"

Results show:
- Matching documents
- Relevant snippets
- Confidence score
- Date added
\`\`\`

### Advanced Search

\`\`\`
Use filters:
- Category: (Policy, Process, Meeting Notes, etc)
- Date range: (last month, custom dates)
- Author/Source: (specific person/team)
- Tags: (filter by tags)

Combine filters for precision:
- Category: Process + Tag: Customer Service + Date: 2024
\`\`\`

### AI-Powered Features

\`\`\`
Alexandria understands:
- Similar documents (even if worded differently)
- Related concepts
- Contextual meaning
- Document relationships

Examples:
- Search "staff retention" also finds "employee turnover"
- Search "ROI improvement" finds all related analytics
- Search "onboarding process" finds policies, guides, templates
\`\`\`

## Chat with GILES

GILES is your AI librarian. Ask questions about your documents.

### Basic Questions

\`\`\`
"What is our refund policy?"
→ GILES finds policy document, extracts relevant section, answers

"Who is the lead for the Q3 project?"
→ GILES searches project docs, identifies project lead

"Summarize Q4 performance"
→ GILES finds relevant reports, synthesizes summary
\`\`\`

### Complex Questions

\`\`\`
"What are our key product differentiation points vs competitor X?"
→ GILES searches strategy docs, competitive analysis, messaging docs

"List all action items from 2024 board meetings"
→ GILES searches meeting notes, extracts action items, lists them

"What are our top customer pain points and how do we address them?"
→ GILES searches feedback, support tickets, case studies, solutions
\`\`\`

### Tips for Better Results

\`\`\`
✓ Be specific: "Customer support workflow for billing questions"
✗ Vague: "How do we handle stuff"

✓ Ask in natural language: "What's our policy on work from home?"
✗ Keyword only: "wfh policy document"

✓ Provide context: "For new hires, what's our onboarding timeline?"
✗ No context: "Onboarding timeline?"

✓ Ask follow-ups: GILES remembers previous questions
✗ Ask unrelated questions (start new chat)
\`\`\`

## Organizing Documents

### Categories

Create a structure:
\`\`\`
Policies
├─ HR Policies
├─ Finance Policies
├─ Security Policies
└─ Sales Policies

Processes
├─ Customer Onboarding
├─ Support Workflow
├─ Approval Process
└─ Data Entry

Templates
├─ Email Templates
├─ Contract Templates
├─ Proposal Templates
└─ Meeting Agendas

Reference
├─ Product Info
├─ Competitor Analysis
├─ Case Studies
└─ Contact Lists
\`\`\`

### Naming Conventions

Use consistent naming:

\`\`\`
✓ GOOD:
- "2024-Q1-Sales-Performance-Report"
- "HR-Handbook-2024-v3"
- "Customer-Onboarding-Workflow"

✗ BAD:
- "Report"
- "Handbook"
- "Workflow"
- "Document123"
- "FINALdraft_FINAL_2"
\`\`\`

### Tagging Strategy

\`\`\`
Tag by:
- Department: Sales, Marketing, Operations, HR
- Document Type: Policy, Process, Template, Report, Analysis
- Priority: Critical, Important, Reference, Deprecated
- Status: Current, Draft, Outdated, Archived
- Topic: Leadership, Customer, Product, Security

Examples:
- "Policy + HR + 2024 + Current"
- "Process + Sales + Important"
- "Report + Q4 + Analysis + Competitive"
\`\`\`

## Skills Library

Alexandria includes pre-built skills for common tasks.

### Available Skills

**Content Skills**
- Article Writer
- Summary Generator
- Translator
- Outline Creator

**Analysis Skills**
- Data Analyzer
- Sentiment Analyzer
- Trend Identifier
- Pattern Detector

**Utility Skills**
- Text Formatter
- Data Extractor
- Document Converter
- Metadata Generator

### Using Skills

\`\`\`
1. Navigate to: Alexandria → Skills
2. Choose skill
3. Click "Use This Skill"
4. Provide input (document, data, text)
5. Skill processes
6. Get output
7. Save or export
\`\`\`

### Creating Custom Skills

\`\`\`
For advanced users:
1. Click: Create Custom Skill
2. Define:
   - Input format
   - Processing logic
   - Output format
3. Test with samples
4. Save for reuse

Custom skills appear in Skills Library
Available to all team members
\`\`\`

## Integration with Workflows

### Document Processing Workflow

\`\`\`
Example: Auto-Summary Generation

1. New document uploaded to Alexandria
2. Trigger: Document Added
3. Workflow Step 1: Extract text from document
4. Workflow Step 2: Generate summary (Summarizer agent)
5. Workflow Step 3: Save summary back to Alexandria
6. Workflow Step 4: Notify content team
\`\`\`

### Document Analysis Workflow

\`\`\`
Example: Competitive Analysis

1. Competitor documents uploaded
2. Trigger: Documents tagged "competitor"
3. Workflow Step 1: Extract key info
4. Workflow Step 2: Analyze vs our product
5. Workflow Step 3: Generate report
6. Workflow Step 4: Email to leadership
\`\`\`

## Best Practices

### Organization
1. Use consistent naming conventions
2. Apply meaningful tags
3. Keep categories clean and logical
4. Archive outdated documents
5. Update important docs regularly

### Search & Discovery
1. Use descriptive titles (searchable)
2. Add summaries (helps search)
3. Tag relevant topics
4. Link related documents
5. Maintain clean metadata

### GILES Queries
1. Ask specific questions
2. Provide relevant context
3. Use natural language
4. Follow up for clarification
5. Save useful Q&As

### Maintenance
1. Monthly: Review and tag new docs
2. Quarterly: Archive outdated content
3. Semi-annually: Reorganize if needed
4. Annually: Audit categories and tags
5. Always: Update important docs

## Security & Access

### Document Security
- Documents encrypted at rest
- Access controlled per document
- Audit trail of who accessed what
- Time-based expiration optional

### Sharing
\`\`\`
Share documents:
- With specific users
- With teams/departments
- With external partners (limited)
- Via secure link

Control:
- View only (no download)
- Can download
- Can edit/modify
- Time-limited access
\`\`\`

## Common Tasks

### Task 1: Build a Knowledge Base

\`\`\`
1. Gather all important docs
   - Policies, processes, templates
   - Meeting notes, reports, analysis
   - How-to guides, FAQs

2. Organize
   - Create meaningful categories
   - Assign descriptive titles
   - Apply relevant tags

3. Upload
   - Batch upload by category
   - Add metadata
   - Verify searchability

4. Test
   - Ask GILES common questions
   - Verify answers are accurate
   - Add missing documents

5. Share
   - Give team access
   - Train on how to use
   - Encourage GILES usage
\`\`\`

### Task 2: Enable AI-Powered Support

\`\`\`
1. Upload support documentation
   - FAQs, troubleshooting guides
   - Product information
   - Common issues & solutions

2. Create Support Agent
   - Powers support chatbot
   - Uses Alexandria docs
   - Learns from interactions

3. Monitor & Improve
   - Track unanswered questions
   - Add missing documentation
   - Refine agent responses
\`\`\`

### Task 3: Create Executive Briefings

\`\`\`
1. Upload source documents
   - Reports, analysis, data
   - Market research, surveys
   - Performance metrics

2. Use Analysis Agents
   - Extract key insights
   - Generate summaries
   - Create visualizations

3. Compile Briefing
   - Combine analyses
   - Add context and recommendations
   - Format for leadership

4. Distribute
   - Email or store in Alexandria
   - Provide with briefing context
\`\`\`

## Troubleshooting

### Document Not Appearing in Search
**Check**:
- Upload completed successfully?
- Document has text (not just image)?
- Sufficient metadata for search?
- Try searching by filename?

### GILES Gives Wrong Answer
**Solutions**:
- Ask more specific question
- Provide more context
- Check if document actually contains info
- Upload clarifying document
- Manually correct for GILES learning

### Can't Find Document
**Try**:
- Different search terms
- Search by different aspect (author, date)
- Browse by category
- Check document tags
- Ask GILES to find it

### Upload Fails
**Check**:
- File format supported?
- File size reasonable (<100MB)?
- Sufficient storage space?
- File not corrupted?

## Next Steps

- **Upload Your Documents**: Start building knowledge base
- **Ask GILES Questions**: Test intelligent search
- **Create Workflows**: Automate document processing
- **Share with Team**: Get feedback and usage patterns

---

**Need help?** Ask GILES or use the documentation chat.
`,An=Object.freeze(Object.defineProperty({__proto__:null,default:Sn},Symbol.toStringTag,{value:"Module"})),vn=`# Troubleshooting Guide

## Quick Diagnosis

**First Steps**:
1. Check elizaOS status: Command Center → Metrics (green = healthy)
2. Refresh page: Clear cache and reload
3. Check browser console: F12 → Console tab for errors
4. Try incognito mode: Eliminates cookie/cache issues
5. Check documentation: Your issue might be covered here

---

## Common Issues & Solutions

### Can't Login

**Symptom**: Login button doesn't work or gives error

**Solutions**:
1. Verify username/password (case-sensitive)
2. Check if account is active (contact admin if unsure)
3. Reset password if forgotten
   - Click "Forgot Password"
   - Enter email
   - Check inbox for reset link
4. Clear cookies and cache (Ctrl+Shift+Delete)
5. Try different browser
6. Check internet connection

**Still stuck**?: Contact system administrator

---

### Agent Not Executing

**Symptom**: Agent execution stuck, doesn't start, or fails immediately

**Diagnosis**:
1. Check agent status in dashboard
2. Review error message (look for clues)
3. Check input format (is it what agent expects?)
4. Verify model is available
5. Check API keys if using external model

**Solutions**:

**Error: "Model not available"**
- Agent's configured model offline or API key invalid
- Check API credentials in agent settings
- Try different model
- Use local Ollama if cloud model down

**Error: "Timeout"**
- Agent took too long
- Try reducing max_tokens
- Use faster model
- Test with simpler input

**Error: "Invalid input"**
- Agent expecting different format
- Check agent description for expected format
- Provide cleaner input
- Add context if needed

**Agent starts but no output**
- Check model output
- Agent might be running (wait longer)
- Check system resources (might be slow)
- Monitor in background

**Status "Running" for hours**
- Agent likely stuck
- Cancel execution
- Try with different settings
- Check system health

---

### Poor Quality Output

**Symptom**: Agent output is wrong, irrelevant, or low quality

**Root Causes & Solutions**:

**Vague input**
\`\`\`
✗ "Write something"
✓ "Write LinkedIn post about AI automation, casual tone, 150 words"

✗ "Analyze data"
✓ "Analyze Q3 sales data and identify top 3 revenue trends"
\`\`\`

**Wrong agent for task**
- Complex task needing reasoning? Use GPT-4, not Groq
- Simple task? Use fast Groq, not slow models
- Match agent capability to task complexity

**Temperature too high**
- Temperature 1.0 = very creative, inconsistent
- Temperature 0.0 = consistent, repetitive
- Try 0.6-0.7 for balanced results

**Token limit too low**
- max_tokens 500 = very short responses
- Response gets cut off?
- Increase max_tokens to 2000+

**Unclear instructions**
- Agent instructions ambiguous?
- Make instructions specific and detailed
- Add examples of desired output
- Clarify constraints

**Bad input data**
- Garbage in = garbage out
- Verify input quality
- Provide clean, complete data
- Add context if needed

---

### Workflow Issues

**Symptom**: Workflow fails, doesn't run, or produces wrong results

**Workflow Not Starting**

Check:
- Is workflow deployed?
- Trigger configured correctly?
- Trigger conditions met? (time, event, etc)
- Sufficient permissions?

**Solution**:
- Click "Test Workflow" to run manually
- If test works, trigger might have issue
- Re-configure trigger
- Check workflow logs for clues

**Workflow Fails at Specific Step**

Diagnosis:
- Check step error message
- Verify output from previous step
- Input mapping correct?
- Agent available/API key valid?

Solutions:
1. Check data format from Step N-1 matches Step N input
2. Add error handling (retry, fallback)
3. Test agent independently (run outside workflow)
4. Increase step timeout if data processing takes long

**Wrong Output from Workflow**

Causes:
- Agent quality issues (see above)
- Data mapping errors
- Wrong agent selected
- Agent settings wrong

Solutions:
1. Test each agent individually
2. Verify data transformations
3. Check input to each step
4. Add validation steps
5. Review agent outputs

**Workflow Too Slow**

Causes:
- Sequential steps that could parallel
- Expensive model choices
- Large token counts

Solutions:
- Run independent steps in parallel
- Use faster models (Groq vs GPT-4)
- Reduce max_tokens
- Reduce context window
- Schedule during off-peak

---

### Document/Alexandria Issues

**Documents Not Searchable**

Check:
- Upload completed?
- Document has text (not image-only PDF)?
- Sufficient metadata (title, tags)?

Solutions:
1. Re-upload document
2. Extract text from image PDF
3. Add meaningful title and tags
4. Use different search terms
5. Ask GILES directly

**GILES Gives Wrong Answer**

Causes:
- Question unclear
- Document doesn't contain answer
- Answer in different wording
- Multiple interpretations

Solutions:
1. Ask more specific question
2. Provide context
3. Suggest document to check
4. Upload clarifying document
5. Ask follow-up for clarification

**Can't Find Document**

Try:
- Different search terms
- Search by author/date
- Browse categories
- Check document tags
- Ask GILES to find it
- Check if document uploaded

**Upload Fails**

Check:
- File format supported?
- File size < 100MB?
- Document has text?
- Storage space available?
- File not corrupted?

---

### Performance Issues

**Page Loads Slowly**

Causes:
- Large amount of data
- Network latency
- Browser cache full
- Too many tabs open

Solutions:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Close other tabs
3. Try different browser
4. Check internet speed
5. Reload page (F5)

**System Running Slow**

Check:
- CPU usage (Command Center → Metrics)
- Memory usage
- Network status
- Number of active agents/workflows

Solutions:
1. Stop unnecessary workflows
2. Schedule heavy tasks off-peak
3. Restart if needed
4. Check for resource leaks
5. Contact admin if persists

**API Calls Timing Out**

Causes:
- External API down
- Network latency
- Large data transfer
- Rate limiting

Solutions:
1. Check if external service status
2. Increase timeout settings
3. Reduce data size
4. Batch requests
5. Use retry logic

---

### Authentication & Permission Issues

**Error: "Unauthorized"**

Cause: Missing permissions

Solutions:
1. Check if you have access to this feature
2. Admin might need to grant permissions
3. Ask admin to add you to appropriate team/role
4. Verify account is active

**Can't Edit Agent/Workflow**

Cause: Insufficient permissions

Solutions:
1. Check if you're owner/admin
2. Ask owner to grant edit access
3. Duplicate and create your own version
4. Contact admin for access

**Session Expired**

Cause: Logged out due to inactivity

Solutions:
1. Login again
2. Refresh page (F5)
3. Clear cookies if problems persist
4. Contact admin if keeps happening

---

### Data & Integration Issues

**External API Not Responding**

Check:
- Is external service online?
- API credentials valid?
- Rate limits hit?
- Firewall/network issues?

Solutions:
1. Check service status page
2. Verify API keys in settings
3. Reset rate limiter or wait
4. Check network connectivity
5. Use retry logic

**Data Sync Not Working**

Causes:
- API connection failed
- Data format mismatch
- Credentials invalid
- Rate limit exceeded

Solutions:
1. Test connection
2. Verify data format
3. Check credentials
4. Add error logging
5. Retry with exponential backoff

**Wrong Data Format**

Cause: Integration expecting different format

Solutions:
1. Check expected format in documentation
2. Add transformation step in workflow
3. Map fields correctly
4. Test with sample data
5. Validate before sending

---

## Advanced Troubleshooting

### Checking Logs

**View execution logs**:
\`\`\`
1. Find your agent/workflow
2. Click "History" or "Logs"
3. Select execution
4. View detailed logs
5. Look for error messages
\`\`\`

**Common log indicators**:
- [ERROR]: Something failed
- [WARN]: Potential issue
- [DEBUG]: Detailed info for troubleshooting
- [INFO]: General information
- Timestamp: When issue occurred

### Testing in Isolation

\`\`\`
Instead of running full workflow:

1. Test agent alone
2. Test with sample data
3. Verify output format
4. Check step by step
5. Then integrate into workflow
\`\`\`

### Performance Profiling

\`\`\`
Track metrics:
- Execution time per step
- Token usage per agent
- Cost per execution
- Success rate per agent
- Error frequency

Use to optimize:
- Identify slow steps
- Find expensive agents
- Detect patterns in failures
- Plan improvements
\`\`\`

---

## When to Contact Admin

**Contact admin if**:
- System down or very slow
- Can't access features others can
- Security concern
- Need new model/API access
- Large-scale issues
- Permission problems

**Have ready**:
- Error messages (screenshot or text)
- Steps to reproduce
- When did it start?
- Your username
- Affected feature

---

## Prevention Tips

1. **Monitor regularly**: Check dashboard for issues
2. **Test before deploy**: Always test workflows
3. **Add error handling**: Configure retries and fallbacks
4. **Document processes**: Know how your automations work
5. **Regular backups**: Save important outputs
6. **Update regularly**: Keep agents and configs current
7. **Performance monitoring**: Track metrics over time
8. **Train your team**: Know how to use features

---

## Getting More Help

**In-app help**:
- Click "?" button on any page
- Use Documentation Chat
- Ask GILES about docs

**Documentation**:
- Check relevant guide (Agents, Workflows, etc)
- Read Getting Started
- Review examples

**Contact Support**:
- Use help form with details
- Include error messages
- Describe steps to reproduce

---

*Remember: Most issues have simple solutions. Start with basics (refresh, restart, check settings) before escalating.*
`,Cn=Object.freeze(Object.defineProperty({__proto__:null,default:vn},Symbol.toStringTag,{value:"Module"})),Tn=`# API Reference

## Overview

elizaOS provides a comprehensive REST API for programmatic access to all features. Use the API to build custom integrations, automate workflows, or embed elizaOS functionality into your applications.

**Base URL**: \`https://api.elizaos.io/v1\`  
**Authentication**: Bearer token (JWT)  
**Rate Limit**: 100 requests/minute (standard tier)  
**Response Format**: JSON

---

## Authentication

All API requests require an authentication token.

### Getting Your API Key

\`\`\`
1. Go to Settings → API Keys
2. Click "Generate New Key"
3. Name the key (e.g., "Mobile App Integration")
4. Copy key (shown only once)
5. Use in requests
\`\`\`

### Using API Key

\`\`\`bash
# Include in header
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.elizaos.io/v1/agents

# Or in request body
{
  "api_key": "YOUR_API_KEY"
}
\`\`\`

### Token Expiration

- API keys don't expire
- Tokens from login expire in 24 hours
- Refresh token to get new access token

---

## Agents API

### List All Agents

\`\`\`
GET /agents
\`\`\`

**Parameters**:
\`\`\`
- limit: Max results (default: 20, max: 100)
- offset: Pagination offset (default: 0)
- category: Filter by category
- status: Filter by status (active, inactive)
- search: Search by name/description
\`\`\`

**Response**:
\`\`\`json
{
  "agents": [
    {
      "id": "agent-123",
      "name": "content-writer",
      "role": "Blog Post Writer",
      "description": "Writes blog posts",
      "model": "gemini",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "config": {
        "temperature": 0.7,
        "max_tokens": 2000
      }
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
\`\`\`

### Get Agent Details

\`\`\`
GET /agents/{agentId}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "agent-123",
  "name": "content-writer",
  "role": "Blog Post Writer",
  "description": "Writes blog posts",
  "model": "gemini",
  "status": "active",
  "config": {
    "temperature": 0.7,
    "max_tokens": 2000,
    "system_prompt": "You are a..."
  },
  "skills": ["writing", "seo"],
  "executions_count": 156,
  "success_rate": 0.94,
  "avg_execution_time": 12.5
}
\`\`\`

### Create Agent

\`\`\`
POST /agents
\`\`\`

**Request Body**:
\`\`\`json
{
  "name": "my-new-agent",
  "role": "Content Creator",
  "description": "Creates content",
  "model": "gemini",
  "config": {
    "temperature": 0.7,
    "max_tokens": 2000
  },
  "skills": ["writing"],
  "system_prompt": "You are a..."
}
\`\`\`

**Response**: Agent object with ID

### Execute Agent

\`\`\`
POST /agents/{agentId}/execute
\`\`\`

**Request Body**:
\`\`\`json
{
  "objective": "Write a blog post about AI",
  "input": "Optional input data",
  "config": {
    "temperature": 0.8,
    "max_tokens": 1500
  }
}
\`\`\`

**Response**:
\`\`\`json
{
  "execution_id": "exec-456",
  "status": "running",
  "started_at": "2024-01-15T10:35:00Z",
  "model_used": "gemini",
  "tokens_estimated": 1200
}
\`\`\`

### Get Execution Status

\`\`\`
GET /executions/{executionId}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "exec-456",
  "agent_id": "agent-123",
  "status": "completed",
  "result": "Blog post content here...",
  "started_at": "2024-01-15T10:35:00Z",
  "completed_at": "2024-01-15T10:38:30Z",
  "duration_seconds": 210,
  "tokens_used": 1150,
  "cost_usd": 0.23
}
\`\`\`

### Update Agent

\`\`\`
PATCH /agents/{agentId}
\`\`\`

**Request Body**: Any fields to update
\`\`\`json
{
  "description": "Updated description",
  "config": {
    "temperature": 0.5
  }
}
\`\`\`

### Delete Agent

\`\`\`
DELETE /agents/{agentId}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "message": "Agent deleted"
}
\`\`\`

---

## Workflows API

### List Workflows

\`\`\`
GET /workflows
\`\`\`

**Parameters**:
\`\`\`
- limit: Max results
- offset: Pagination offset
- status: active, paused, archived
- search: Search by name
\`\`\`

**Response**:
\`\`\`json
{
  "workflows": [
    {
      "id": "workflow-789",
      "name": "Daily Content Pipeline",
      "description": "Generates daily content",
      "status": "active",
      "trigger": "schedule",
      "created_at": "2024-01-15T10:30:00Z",
      "last_run": "2024-01-18T09:00:00Z",
      "next_run": "2024-01-19T09:00:00Z"
    }
  ],
  "total": 15
}
\`\`\`

### Get Workflow Details

\`\`\`
GET /workflows/{workflowId}
\`\`\`

### Create Workflow

\`\`\`
POST /workflows
\`\`\`

**Request Body**:
\`\`\`json
{
  "name": "Lead Qualification",
  "description": "Auto-qualify leads",
  "trigger": {
    "type": "webhook",
    "url": "/webhook/lead-received"
  },
  "steps": [
    {
      "name": "Validate",
      "agent_id": "agent-123",
      "input_mapping": { "data": "$.body" }
    },
    {
      "name": "Score",
      "agent_id": "agent-456",
      "input_mapping": { "validated_data": "$.steps.0.result" }
    }
  ]
}
\`\`\`

### Execute Workflow

\`\`\`
POST /workflows/{workflowId}/execute
\`\`\`

**Request Body**:
\`\`\`json
{
  "input": {
    "lead_email": "person@example.com",
    "lead_company": "Acme Inc"
  }
}
\`\`\`

**Response**:
\`\`\`json
{
  "execution_id": "workflow-exec-123",
  "workflow_id": "workflow-789",
  "status": "running",
  "started_at": "2024-01-18T14:30:00Z"
}
\`\`\`

### Get Workflow Execution

\`\`\`
GET /workflow-executions/{executionId}
\`\`\`

**Response**:
\`\`\`json
{
  "id": "workflow-exec-123",
  "workflow_id": "workflow-789",
  "status": "completed",
  "started_at": "2024-01-18T14:30:00Z",
  "completed_at": "2024-01-18T14:35:42Z",
  "duration_seconds": 342,
  "results": {
    "lead_score": 85,
    "recommendation": "route_to_sales"
  },
  "step_results": [
    {
      "step": "Validate",
      "status": "completed",
      "output": { "valid": true }
    }
  ]
}
\`\`\`

### Update Workflow

\`\`\`
PATCH /workflows/{workflowId}
\`\`\`

### Delete Workflow

\`\`\`
DELETE /workflows/{workflowId}
\`\`\`

---

## Alexandria API

### List Documents

\`\`\`
GET /alexandria/documents
\`\`\`

**Parameters**:
\`\`\`
- limit: Max results (default: 20)
- offset: Pagination offset
- category: Filter by category
- tags: Filter by tags (comma-separated)
- search: Search query
\`\`\`

**Response**:
\`\`\`json
{
  "documents": [
    {
      "id": "doc-111",
      "title": "Q3 Sales Report",
      "category": "reports",
      "tags": ["sales", "q3", "2024"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "size_bytes": 245680,
      "content_preview": "Q3 showed strong growth..."
    }
  ],
  "total": 237
}
\`\`\`

### Get Document

\`\`\`
GET /alexandria/documents/{documentId}
\`\`\`

**Parameters**:
\`\`\`
- include_content: Include full content (true/false)
\`\`\`

### Upload Document

\`\`\`
POST /alexandria/documents
\`\`\`

**Headers**:
\`\`\`
Content-Type: multipart/form-data
\`\`\`

**Body**:
\`\`\`
- file: File to upload
- title: Document title
- category: Document category
- tags: Comma-separated tags
- description: Document description
\`\`\`

**Response**:
\`\`\`json
{
  "id": "doc-112",
  "title": "New Document",
  "status": "processing",
  "upload_date": "2024-01-18T14:30:00Z"
}
\`\`\`

### Search Documents

\`\`\`
POST /alexandria/search
\`\`\`

**Request Body**:
\`\`\`json
{
  "query": "Q3 revenue trends",
  "limit": 10,
  "filters": {
    "category": "reports",
    "date_from": "2024-01-01"
  }
}
\`\`\`

**Response**:
\`\`\`json
{
  "results": [
    {
      "document_id": "doc-111",
      "title": "Q3 Sales Report",
      "relevance_score": 0.94,
      "snippet": "Q3 revenue increased 23% YoY to $4.2M..."
    }
  ],
  "total": 5
}
\`\`\`

### Chat with GILES

\`\`\`
POST /alexandria/chat
\`\`\`

**Request Body**:
\`\`\`json
{
  "message": "What was our Q3 revenue?",
  "context": "alexandria"
}
\`\`\`

**Response**:
\`\`\`json
{
  "answer": "According to the Q3 Sales Report, revenue was $4.2M, representing a 23% increase year-over-year.",
  "sources": [
    {
      "document_id": "doc-111",
      "title": "Q3 Sales Report",
      "relevance": 0.98
    }
  ],
  "confidence": 0.92
}
\`\`\`

### Delete Document

\`\`\`
DELETE /alexandria/documents/{documentId}
\`\`\`

---

## Skills API

### List Skills

\`\`\`
GET /skills
\`\`\`

**Response**:
\`\`\`json
{
  "skills": [
    {
      "id": "skill-001",
      "name": "Article Writer",
      "category": "content",
      "description": "Writes articles",
      "version": "1.0"
    }
  ],
  "total": 42
}
\`\`\`

### Get Skill Details

\`\`\`
GET /skills/{skillId}
\`\`\`

### Use Skill

\`\`\`
POST /skills/{skillId}/execute
\`\`\`

**Request Body**:
\`\`\`json
{
  "input": "Data for the skill"
}
\`\`\`

---

## Error Handling

### Error Response Format

\`\`\`json
{
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent with ID 'xyz' not found",
    "details": {
      "agent_id": "xyz"
    }
  }
}
\`\`\`

### Common Error Codes

\`\`\`
200 OK - Success
201 Created - Resource created
400 Bad Request - Invalid input
401 Unauthorized - Missing/invalid auth
403 Forbidden - Insufficient permissions
404 Not Found - Resource not found
429 Too Many Requests - Rate limited
500 Server Error - Internal error
\`\`\`

### Handling Errors

\`\`\`javascript
try {
  const response = await fetch('/api/agents/123', {
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.error.code);
    // Handle error appropriately
  }
  
  const data = await response.json();
} catch (error) {
  console.error('Network error:', error);
}
\`\`\`

---

## Rate Limiting

### Headers

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705602000
\`\`\`

### Handling Rate Limits

\`\`\`javascript
if (response.status === 429) {
  const resetTime = response.headers['X-RateLimit-Reset'];
  const waitSeconds = resetTime - Math.floor(Date.now() / 1000);
  console.log(\`Rate limited. Wait \${waitSeconds} seconds\`);
  
  // Implement exponential backoff
  setTimeout(() => retryRequest(), waitSeconds * 1000);
}
\`\`\`

---

## Examples

### Example 1: Create and Execute Agent

\`\`\`javascript
const apiKey = 'your-api-key';

// 1. Create agent
const createResponse = await fetch('https://api.elizaos.io/v1/agents', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'blog-writer',
    role: 'Content Writer',
    model: 'gemini',
    config: { temperature: 0.7, max_tokens: 2000 }
  })
});

const { id: agentId } = await createResponse.json();

// 2. Execute agent
const execResponse = await fetch(
  \`https://api.elizaos.io/v1/agents/\${agentId}/execute\`,
  {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      objective: 'Write blog post about AI'
    })
  }
);

const { execution_id } = await execResponse.json();

// 3. Poll for results
let status = 'running';
while (status === 'running') {
  const statusResponse = await fetch(
    \`https://api.elizaos.io/v1/executions/\${execution_id}\`,
    { headers: { 'Authorization': \`Bearer \${apiKey}\` } }
  );
  
  const execution = await statusResponse.json();
  status = execution.status;
  
  if (status === 'completed') {
    console.log('Result:', execution.result);
  }
  
  await new Promise(r => setTimeout(r, 1000)); // Wait 1s
}
\`\`\`

### Example 2: Search Alexandria

\`\`\`javascript
const searchResponse = await fetch(
  'https://api.elizaos.io/v1/alexandria/search',
  {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: 'Q3 sales performance',
      filters: { category: 'reports' }
    })
  }
);

const { results } = await searchResponse.json();
results.forEach(result => {
  console.log(\`\${result.title}: \${result.snippet}\`);
});
\`\`\`

### Example 3: Webhook Integration

\`\`\`javascript
// Receive webhook from external system
app.post('/webhook/lead', async (req, res) => {
  const lead = req.body;
  
  // Execute workflow
  const response = await fetch(
    'https://api.elizaos.io/v1/workflows/lead-qualification/execute',
    {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: {
          email: lead.email,
          company: lead.company,
          role: lead.role
        }
      })
    }
  );
  
  const { execution_id } = await response.json();
  res.json({ execution_id });
});
\`\`\`

---

## SDK

### JavaScript/Node.js

\`\`\`bash
npm install elizaos
\`\`\`

\`\`\`javascript
import { ElizaOS } from 'elizaos';

const client = new ElizaOS({
  apiKey: 'your-api-key'
});

// List agents
const agents = await client.agents.list();

// Execute agent
const execution = await client.agents.execute('agent-123', {
  objective: 'Write blog post'
});

// Poll for results
const result = await execution.wait();
console.log(result);
\`\`\`

### Python

\`\`\`bash
pip install elizaos
\`\`\`

\`\`\`python
from elizaos import ElizaOS

client = ElizaOS(api_key='your-api-key')

# List agents
agents = client.agents.list()

# Execute agent
execution = client.agents.execute('agent-123', {
    'objective': 'Write blog post'
})

# Wait for results
result = execution.wait()
print(result)
\`\`\`

---

## Webhooks

### Event Types

\`\`\`
agent.execution.started
agent.execution.completed
agent.execution.failed
workflow.execution.completed
document.uploaded
search.completed
\`\`\`

### Setting Up Webhook

\`\`\`
1. Go to Settings → Webhooks
2. Click "Add Webhook"
3. Enter URL to receive events
4. Select events to subscribe
5. Save
\`\`\`

### Webhook Payload

\`\`\`json
{
  "event": "agent.execution.completed",
  "timestamp": "2024-01-18T14:35:42Z",
  "data": {
    "execution_id": "exec-456",
    "agent_id": "agent-123",
    "result": "..."
  }
}
\`\`\`

---

## Best Practices

1. **Always use HTTPS** for API calls
2. **Never commit API keys** to version control
3. **Implement retry logic** for failed requests
4. **Respect rate limits** - use exponential backoff
5. **Cache responses** when possible
6. **Monitor costs** - track token usage
7. **Use webhooks** for asynchronous processing
8. **Validate input** before sending to API

---

## Support

- **API Status**: https://status.elizaos.io
- **Documentation**: https://docs.elizaos.io
- **Support Email**: api-support@elizaos.io

---

*Last Updated: January 2024*
`,In=Object.freeze(Object.defineProperty({__proto__:null,default:Tn},Symbol.toStringTag,{value:"Module"}));export{_n as default};
