// Menu mobile
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle && toggle.addEventListener('click', () => links.classList.toggle('open'));
  links && links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // Log de vigilância "ao vivo"
  const term = document.getElementById('termBody');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const events = [
    ['ok','Porta 443 verificada — TLS válido'],
    ['info','Scan de dependências concluído — 0 críticas'],
    ['ok','Login autenticado · 2FA confirmado'],
    ['warn','Tentativa de phishing detectada — isolada'],
    ['info','Backup automático finalizado'],
    ['ok','Endpoint /api/users — íntegro'],
    ['warn','IP fora do padrão bloqueado · 203.0.113.* '],
    ['info','Prompt suspeito barrado no agente LLM'],
    ['ok','Deploy v1.65.1 em produção · estável'],
    ['info','Varredura de vulnerabilidades agendada'],
    ['ok','Certificado renovado automaticamente'],
    ['warn','Rate-limit acionado · brute force contido'],
  ];
  const tag = {ok:'[ OK ]', warn:'[ ! ]', info:'[ i ]'};
  let i = 0;
  function ts(){
    const d = new Date();
    const p = n => String(n).padStart(2,'0');
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  function addLine(){
    const [type,msg] = events[i % events.length];
    i++;
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = `<span class="ts">${ts()}</span><span class="${type}">${tag[type]}</span><span class="msg">${msg}</span>`;
    term.appendChild(line);
    while (term.children.length > 9) term.removeChild(term.firstChild);
  }
  // semente inicial
  for (let k=0;k<8;k++) addLine();
  if (!reduce) setInterval(addLine, 2600);
