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

  // Vídeo de lançamento: botão de play próprio até o primeiro clique, depois os controles do navegador.
  // Sem JavaScript, o vídeo já aparece com os controles nativos.
  const screen = document.getElementById('launchScreen');
  if (screen) {
    const video = screen.querySelector('video');
    const play = screen.querySelector('.play');
    video.controls = false;
    play.hidden = false;
    play.addEventListener('click', () => {
      play.hidden = true;
      video.controls = true;
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
      video.focus();
    });
  }


// Formulário de contato (Web3Forms): envia sem recarregar a página.
// Sem JavaScript, o formulário faz o envio normal via POST.
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const status = document.getElementById('formStatus');
  const submit = contactForm.querySelector('button[type="submit"]');
  const label = submit.innerHTML;
  const done = document.getElementById('formDone');
  document.getElementById('formAgain').addEventListener('click', () => {
    done.hidden = true;
    contactForm.hidden = false;
    contactForm.querySelector('input[name="name"]').focus();
  });
  // o hCaptcha (carregado pelo script da Web3Forms) cria esse campo ao ser resolvido
  const resetCaptcha = () => { if (window.hcaptcha) window.hcaptcha.reset(); };
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';
    const captcha = contactForm.querySelector('[name="h-captcha-response"]');
    if (!captcha || !captcha.value) {
      status.classList.add('err');
      status.textContent = 'Confirme que você não é um robô antes de enviar.';
      return;
    }
    submit.textContent = 'Enviando…';
    submit.disabled = true;
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      contactForm.reset();
      contactForm.hidden = true;
      done.hidden = false;
    } catch (err) {
      status.classList.add('err');
      status.textContent = 'Não foi possível enviar. Tente de novo ou use o e-mail ao lado.';
    } finally {
      // cada token do captcha vale para um único envio
      resetCaptcha();
      submit.innerHTML = label;
      submit.disabled = false;
    }
  });
}
