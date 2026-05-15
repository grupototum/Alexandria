const state = {
  documents: [],
  overview: null
};

const tutorialItems = [
  ['Alexandria', 'Página-mãe da biblioteca operacional do Totum. Organiza fontes, artefatos, POPs, skills, contexto e exportações.'],
  ['Hermione', 'Chat consultivo e camada de assimilação. Transforma documentos soltos em conhecimento reutilizável.'],
  ['POPs & SLAs', 'Procedimentos claros para execução, qualidade, onboarding e continuidade operacional.'],
  ['Context Hub', 'Mostra como contexto e conhecimento circulam entre agentes, fluxos e decisões.'],
  ['Skills Central', 'Catálogo de capacidades para agentes e IAs externas, com foco em roteamento e reuso.'],
  ['Conexões', 'Ponte segura para Logseq, Drive e pacotes locais usando política verde, amarelo e vermelho.'],
  ['Exports IA', 'Pacotes em Markdown ou JSON para continuar tarefas no Claude, ChatGPT, Gemini, Kimi ou MCP local.']
];

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(value) {
  if (!value) return '--';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Erro HTTP ${response.status}`);
  return payload;
}

function setView(view) {
  const next = view || 'dashboard';
  qsa('.view').forEach((node) => node.classList.toggle('active', node.dataset.view === next));
  qsa('[data-view-link]').forEach((node) => node.classList.toggle('active', node.dataset.viewLink === next));
  if (location.hash.replace('#', '') !== next) history.replaceState(null, '', `#${next}`);
}

async function loadHealth() {
  try {
    const health = await requestJson('/health');
    qs('#api-status').textContent = 'API online';
    qs('#api-status-detail').textContent = `${health.service} · ${formatDate(health.ts)}`;
  } catch (error) {
    qs('#api-status').textContent = 'API indisponível';
    qs('#api-status-detail').textContent = error.message;
  }
}

async function loadOverview() {
  const overview = await requestJson('/alexandria/overview');
  state.overview = overview;
  state.documents = overview.documents || [];

  qs('#metric-documents').textContent = overview.stats.totalDocuments;
  qs('#metric-skills').textContent = overview.stats.skills;
  qs('#metric-pops').textContent = overview.stats.pops;
  qs('#metric-updated').textContent = formatDate(overview.stats.updatedAt);

  renderRecent();
  renderTypedLists();
  renderLibrary(state.documents);
}

function renderRecent() {
  const recent = state.documents.slice(0, 8);
  qs('#recent-list').innerHTML = recent.length ? recent.map(renderListItem).join('') : renderEmpty('Nenhum documento encontrado ainda.');
}

function renderListItem(doc) {
  return `
    <article class="item-row">
      <strong>${escapeHtml(doc.title || 'Sem título')}</strong>
      <div class="item-meta">
        <span class="pill">${escapeHtml(doc.doc_type || 'doc')}</span>
        <span>${escapeHtml(doc.path || 'sem caminho')}</span>
        <span>${formatDate(doc.updated_at)}</span>
      </div>
    </article>
  `;
}

function renderCard(doc) {
  const content = doc.content || doc.metadata?.summary || doc.path || 'Sem resumo disponível.';
  return `
    <article class="doc-card">
      <span class="pill">${escapeHtml(doc.doc_type || 'doc')}</span>
      <h3>${escapeHtml(doc.title || 'Sem título')}</h3>
      <p>${escapeHtml(String(content).slice(0, 220))}${String(content).length > 220 ? '...' : ''}</p>
      <small class="item-meta">${escapeHtml(doc.path || 'Alexandria')} · ${formatDate(doc.updated_at)}</small>
    </article>
  `;
}

function renderLibrary(documents) {
  qs('#library-list').innerHTML = documents.length ? documents.map(renderCard).join('') : renderEmpty('Nada encontrado para esse filtro.');
}

function renderTypedLists() {
  const pops = state.documents.filter((doc) => doc.doc_type === 'pop');
  const skills = state.documents.filter((doc) => doc.doc_type === 'skill');
  qs('#pops-list').innerHTML = pops.length ? pops.map(renderCard).join('') : renderEmpty('Nenhum POP catalogado ainda.');
  qs('#skills-list').innerHTML = skills.length ? skills.map(renderCard).join('') : renderEmpty('Nenhuma skill catalogada ainda.');
}

function renderEmpty(text) {
  return `<div class="item-row"><strong>${escapeHtml(text)}</strong><span class="item-meta">Use a Hermione para consultar ou assimilar novas fontes.</span></div>`;
}

async function searchLibrary() {
  const query = qs('#library-query').value.trim();
  const type = qs('#library-type').value;
  const params = new URLSearchParams({ limit: '80' });
  if (query) params.set('query', query);
  if (type) params.set('doc_type', type);
  const payload = await requestJson(`/alexandria/documents?${params}`);
  renderLibrary(payload.documents || []);
}

function addMessage(role, content, context = []) {
  const node = document.createElement('div');
  node.className = `message ${role}`;
  node.innerHTML = `
    <strong>${role === 'user' ? 'Você' : 'Hermione'}</strong>
    <p>${escapeHtml(content)}</p>
    ${context.length ? `<div class="item-meta">${context.map((item) => `<span class="pill">${escapeHtml(item.title || item.type || 'fonte')}</span>`).join('')}</div>` : ''}
  `;
  qs('#chat-log').appendChild(node);
  node.scrollIntoView({ block: 'end', behavior: 'smooth' });
}

async function handleQuestion(event) {
  event.preventDefault();
  const input = qs('#question-input');
  const question = input.value.trim();
  if (!question) return;
  input.value = '';
  addMessage('user', question);
  addMessage('assistant', 'Consultando a Alexandria...');

  try {
    const payload = await requestJson('/alexandria/discover', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: question, types: ['skill', 'pop', 'doc'], limit: 5 })
    });
    qs('#chat-log .message:last-child').remove();
    const discovered = payload.discovered || [];
    if (!discovered.length) {
      addMessage('assistant', 'Não encontrei fontes fortes para essa pergunta. Recomendo seguir com cautela ou assimilar um documento sobre o tema.');
      return;
    }
    const lines = discovered.map((item, index) => `${index + 1}. ${item.title || item.path || item.type} (${Math.round((item.relevance || 0) * 100)}%)`).join('\n');
    addMessage('assistant', `Encontrei estas fontes mais relevantes:\n\n${lines}\n\nAção recomendada: ${payload.recommended_action}.`, discovered);
  } catch (error) {
    qs('#chat-log .message:last-child')?.remove();
    addMessage('assistant', error.message);
  }
}

async function handleIngest(event) {
  event.preventDefault();
  const token = qs('#token-input').value.trim();
  const payload = {
    title: qs('#doc-title').value.trim(),
    doc_type: qs('#doc-type').value,
    path: qs('#doc-path').value.trim(),
    content: qs('#doc-content').value.trim(),
    metadata: { source: 'alexandria-ui' }
  };
  qs('#ingest-feedback').textContent = 'Assimilando fonte...';
  try {
    const result = await requestJson('/alexandria/ingest', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-alexandria-token': token },
      body: JSON.stringify(payload)
    });
    localStorage.setItem('alexandria-token', token);
    qs('#ingest-feedback').textContent = `Fonte assimilada com sucesso: ${result.id || payload.title}`;
    event.target.reset();
    qs('#token-input').value = token;
    await loadOverview();
  } catch (error) {
    qs('#ingest-feedback').textContent = error.message;
  }
}

function classifyBridgeText(name, content) {
  const text = `${name} ${content}`.toLowerCase();
  if (/(senha|token|secret|health|família|familia|financeiro pessoal|cart[aã]o|cpf)/.test(text)) return ['red', 'Não importar'];
  if (/(di[aá]rio|rotina|prefer[eê]ncia|pessoal|nota privada)/.test(text)) return ['yellow', 'Importar só como resumo sanitizado'];
  return ['green', 'Pode entrar na Alexandria'];
}

async function handleBridgeFiles(event) {
  const files = Array.from(event.target.files || []);
  const rows = await Promise.all(files.map(async (file) => {
    const content = await file.text();
    const [zone, action] = classifyBridgeText(file.name, content);
    return `<article class="item-row"><strong>${escapeHtml(file.name)}</strong><div class="item-meta"><span class="pill">${zone}</span><span>${action}</span><span>${content.length} caracteres</span></div></article>`;
  }));
  qs('#bridge-results').innerHTML = rows.length ? rows.join('') : renderEmpty('Selecione arquivos Markdown, texto ou JSON.');
}

function renderTutorial() {
  qs('#tutorial-list').innerHTML = tutorialItems.map((item, index) => `
    <article class="tutorial-step">
      <span class="tutorial-index">${index + 1}</span>
      <div>
        <h3>${escapeHtml(item[0])}</h3>
        <p>${escapeHtml(item[1])}</p>
      </div>
    </article>
  `).join('');
}

function copyPromptPack() {
  const text = `Use a Alexandria como fonte de verdade. Consulte documentos, POPs e skills antes de responder. Se a evidência for fraca, diga que não encontrou contexto suficiente. Preserve rastreabilidade, aponte lacunas e gere saídas reutilizáveis.`;
  navigator.clipboard?.writeText(text);
  qs('#copy-pack span').textContent = 'Prompt copiado para a área de transferência.';
}

function bindEvents() {
  qsa('[data-view-link]').forEach((link) => link.addEventListener('click', () => setView(link.dataset.viewLink)));
  qsa('[data-jump]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.jump)));
  qsa('[data-question]').forEach((button) => button.addEventListener('click', () => {
    qs('#question-input').value = button.dataset.question;
    qs('#question-form').requestSubmit();
  }));
  qs('#refresh-button').addEventListener('click', () => Promise.all([loadHealth(), loadOverview()]));
  qs('#question-form').addEventListener('submit', handleQuestion);
  qs('#ingest-form').addEventListener('submit', handleIngest);
  qs('#library-search').addEventListener('click', searchLibrary);
  qs('#library-query').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchLibrary();
  });
  qs('#bridge-files').addEventListener('change', handleBridgeFiles);
  qs('#copy-pack').addEventListener('click', copyPromptPack);
}

async function init() {
  bindEvents();
  renderTutorial();
  qs('#token-input').value = localStorage.getItem('alexandria-token') || '';
  setView(location.hash.replace('#', '') || 'dashboard');
  await loadHealth();
  try {
    await loadOverview();
  } catch (error) {
    qs('#recent-list').innerHTML = renderEmpty(error.message);
    qs('#library-list').innerHTML = renderEmpty(error.message);
  }
}

window.addEventListener('hashchange', () => setView(location.hash.replace('#', '') || 'dashboard'));
window.addEventListener('DOMContentLoaded', init);
