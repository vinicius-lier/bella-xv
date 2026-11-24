(() => {
  const V = window.VALSA || {};
  const ICONE_ZAP = '<svg class="icone-zap" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.1c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6S23 3 16 3Zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.2 1.3-4-.3-.4a10.4 10.4 0 0 1-1.6-5.6C5.5 9.8 10.2 5.2 16 5.2s10.5 4.6 10.5 10.4S21.8 26.1 16 26.1Zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.4 1.4.6 1.9.7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg>';
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => [...el.querySelectorAll(q)];
  const reduzir = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const corpo = document.body;
  const abertura = $("#abertura");
  const largo = () => innerWidth >= 900;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  /* ── Pétala (pétala-guia e pétalas que caem) ──────────────────────────── */
  const petala = (() => {
    const s = document.createElement("canvas"); s.width = 44; s.height = 54;
    const g = s.getContext("2d");
    g.beginPath(); g.moveTo(22, 52); g.bezierCurveTo(-4, 34, 2, 4, 22, 2); g.bezierCurveTo(42, 4, 48, 34, 22, 52); g.closePath();
    const gr = g.createRadialGradient(17, 17, 2, 22, 28, 30);
    gr.addColorStop(0, "#E4575F"); gr.addColorStop(.55, "#B3202A"); gr.addColorStop(1, "#6A0F15");
    g.fillStyle = gr; g.fill();
    g.strokeStyle = "rgba(255,225,225,.28)"; g.lineWidth = 1.1; g.beginPath(); g.moveTo(22, 47); g.quadraticCurveTo(19, 26, 22, 9); g.stroke();
    return s;
  })();
  document.documentElement.style.setProperty("--petala", `url(${petala.toDataURL()})`);

  /* ── Poeira dourada e pétalas, com moderação ──────────────────────────── */
  const poeira = (() => {
    const cv = $(".poeira");
    if (reduzir) return { burst() {}, travessia() {}, petalas() {} };
    const ctx = cv.getContext("2d");
    const sprites = ["#FFF3DA", "#F0CB87", "#E3B76A", "#FFFFFF"].map((c) => {
      const s = document.createElement("canvas"); s.width = s.height = 32;
      const g = s.getContext("2d"), gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      gr.addColorStop(0, "#fff"); gr.addColorStop(.3, c); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return s;
    });
    let ps = [], pet = [], petOn = false, prox = 0, vivo = false, dpr = 1, W = 0, H = 0;
    const medir = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; };
    medir(); addEventListener("resize", medir);
    const acordar = () => { if (!vivo) { vivo = true; requestAnimationFrame(passo); } };
    const nova = (x, y, vx, vy, vida, t) => { if (ps.length > 200) ps.shift(); ps.push({ x, y, vx, vy, vida, max: vida, t, s: sprites[(Math.random() * 4) | 0], f: Math.random() * 6.3 }); acordar(); };
    function passo() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      const agora = performance.now();
      if (petOn && !document.hidden && pet.length < 3 && agora > prox) {
        prox = agora + 4200 + Math.random() * 4200;
        const lado = Math.random() < .5 ? .02 : .88;
        pet.push({ x: W * (lado + Math.random() * .1), y: -30, vy: .5 + Math.random() * .35, f: Math.random() * 6.3, giro: Math.random() * 6.3, vg: (Math.random() - .5) * .025, t: .36 + Math.random() * .22, a: .5 + Math.random() * .3 });
      }
      pet.forEach((p) => { if (p.saindo) p.a -= .03; });
      pet = pet.filter((p) => p.y < H + 40 && p.a > 0);
      for (const p of pet) {
        p.f += .016; p.giro += p.vg; p.y += p.vy; p.x += Math.sin(p.f) * .55;
        ctx.save(); ctx.globalAlpha = p.a; ctx.translate(p.x * dpr, p.y * dpr); ctx.rotate(p.giro);
        ctx.scale(p.t * dpr, p.t * dpr * (.35 + .65 * Math.abs(Math.cos(p.f * 1.6)))); ctx.drawImage(petala, -22, -27); ctx.restore();
      }
      ps = ps.filter((p) => --p.vida > 0);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.vy += .008; p.vx *= .99; p.f += .2;
        const a = Math.min(1, p.vida / (p.max * .45)) * (.6 + .4 * Math.sin(p.f)), r = p.t * (.55 + .45 * p.vida / p.max);
        ctx.globalAlpha = a; ctx.drawImage(p.s, (p.x - r) * dpr, (p.y - r) * dpr, 2 * r * dpr, 2 * r * dpr);
      }
      ctx.globalAlpha = 1;
      if (ps.length || pet.length || petOn) requestAnimationFrame(passo); else { vivo = false; ctx.clearRect(0, 0, cv.width, cv.height); }
    }
    return {
      burst(x, y, n = 40, f = 3.5) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = Math.random() * f; nova(x, y, Math.cos(a) * v, Math.sin(a) * v - .8, 45 + Math.random() * 55, 2 + Math.random() * 4.5); } },
      travessia(n = 60) { for (let i = 0; i < n; i++) setTimeout(() => nova(-10, H * (.1 + Math.random() * .45), 3 + Math.random() * 4, (Math.random() - .6) * 1.2, 110 + Math.random() * 80, 1.5 + Math.random() * 3.5), i * 22); },
      petalas(on) { petOn = on; if (on) acordar(); else pet.forEach((p) => (p.saindo = true)); },
    };
  })();

  /* ── Música (só depois do primeiro toque) ─────────────────────────────── */
  const audio = $(".trilha"), som = $(".som");
  let querMusica = false;
  const marcarSom = () => { const p = audio.paused; som.setAttribute("aria-pressed", String(p)); som.setAttribute("aria-label", p ? "Retomar música" : "Pausar música"); $(".som-txt", som).textContent = p ? "música" : "pausar"; };
  const tocarMusica = () => {
    if (!V.musica) return;
    if (!audio.getAttribute("src")) { audio.src = V.musica.arquivo; audio.volume = V.musica.volume ?? .7; }
    querMusica = true; som.hidden = false;
    audio.play().catch(() => {}).finally(marcarSom);
  };
  audio.addEventListener("play", marcarSom); audio.addEventListener("pause", marcarSom);
  som.addEventListener("click", () => { if (audio.paused) tocarMusica(); else { querMusica = false; audio.pause(); } });
  document.addEventListener("visibilitychange", () => { if (document.hidden) audio.pause(); else if (querMusica) audio.play().catch(() => {}); });

  /* ── Prólogo: o feixe de luz encontra a rosa ──────────────────────────── */
  const clarao = document.createElement("div"); clarao.className = "clarao"; corpo.appendChild(clarao);
  const passagem = document.createElement("div"); passagem.className = "passagem"; corpo.appendChild(passagem);
  requestAnimationFrame(() => setTimeout(() => { abertura.classList.add("acende"); setTimeout(() => poeira.travessia(56), reduzir ? 0 : 2100); }, 120));

  let aberto = false;
  // limpa a marca antiga de "já aberto" (versões anteriores pulavam a abertura na volta)
  try { localStorage.removeItem("bellaxv-aberto"); } catch {}
  // Enquanto a abertura está travada, o resto da página fica fora do alcance do teclado
  const travaveis = () => [$(".topo"), $(".haste"), $(".abertura-atalhos"), ...$$("main > .cap:not(#abertura)")];
  const travar = (on) => travaveis().forEach((el) => el && (el.inert = on));
  function abrirSemRitual() {
    aberto = true;
    travar(false);
    corpo.classList.remove("portao");
    abertura.classList.add("acende", "aberto"); abertura.classList.remove("abrindo");
    $(".abertura-atalhos").hidden = false;
    som.hidden = false; marcarSom();
    atualizarPetalas();
  }
  function liberar(rolar = true) {
    abrirSemRitual();
    if (rolar) irPara("#debutante", false);
  }
  function tocarRosa(comMusica = true) {
    if (aberto) return; aberto = true;
    if (comMusica) tocarMusica(); else som.hidden = false;
    const q = $(".abertura-quadro").getBoundingClientRect();
    const x = q.left + q.width / 2, y = q.top + q.height * .5;
    abertura.classList.add("abrindo");
    clarao.style.background = `radial-gradient(circle at ${x}px ${y}px, #fff 0%, rgb(255 240 210 / .95) 22%, rgb(227 183 106 / .5) 45%, transparent 75%)`;
    clarao.classList.remove("vai"); void clarao.offsetWidth; clarao.classList.add("vai");
    poeira.burst(x, y, 80, 5); setTimeout(() => poeira.burst(x, y, 44, 8), 280);
    const vid = V.video || {};
    const arquivo = largo() && vid.arquivoDesktop ? vid.arquivoDesktop : vid.arquivo;
    if (arquivo && !reduzir) setTimeout(() => tocarVideo(arquivo), 1100);
    else setTimeout(liberar, reduzir ? 0 : 1500);
  }
  // Vídeo do ORI na abertura: uma vez, pode pular; se falhar ou demorar, segue a história
  function tocarVideo(arquivo) {
    const camada = $(".video-camada"), video = $("video", camada);
    let fim = false;
    // o vídeo se dissolve no título (o título já está revelado por baixo)
    const terminar = () => { if (fim) return; fim = true; video.pause(); liberar(); camada.classList.add("saindo"); setTimeout(() => (camada.hidden = true), reduzir ? 0 : 800); };
    camada.hidden = false;
    if (V.video.poster) video.poster = V.video.poster;
    video.src = arquivo;
    video.addEventListener("ended", terminar, { once: true });
    video.addEventListener("error", terminar, { once: true });
    $(".pular", camada).addEventListener("click", terminar, { once: true });
    video.play().catch(terminar);
    setTimeout(() => { if (!fim && video.readyState < 2) terminar(); }, 6000);
  }
  $("[data-tocar]").addEventListener("click", () => tocarRosa(true));
  $("[data-sem-som]").addEventListener("click", () => tocarRosa(false));
  // Atalho de acessibilidade: entra no convite sem ritual e sem música
  $(".pular-conteudo").addEventListener("click", () => { if (!aberto) liberar(false); });

  /* ── Navegação ────────────────────────────────────────────────────────── */
  function irPara(sel, comLuz = true) {
    const alvo = $(sel); if (!alvo) return;
    const cap = alvo.closest(".cap") || alvo;
    // o capítulo de destino chega pronto para ler: fotos carregadas e texto revelado
    $$("img[data-src]", cap).slice(0, cap.id === "memorias" ? 3 : 99).forEach(carregar);
    if (cap !== abertura) cap.classList.add("visto");
    else if (aberto && !reduzir) setTimeout(() => { // rever a história: a luz volta a encontrar a rosa
      abertura.classList.add("reacende"); abertura.classList.toggle("acende", false); void abertura.offsetWidth; abertura.classList.add("acende");
      setTimeout(() => poeira.travessia(40), 1200);
    }, 500);
    if (comLuz && !reduzir) { passagem.classList.remove("vai"); void passagem.offsetWidth; passagem.classList.add("vai"); }
    alvo.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
  }
  $$("[data-ir]").forEach((b) => b.addEventListener("click", () => irPara(b.dataset.ir)));
  $$(".haste a").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); if (!corpo.classList.contains("portao")) irPara(a.getAttribute("href")); }));

  // Índice de capítulos
  const indice = $("#indice"), indiceBtn = $(".indice-btn");
  const foraDoIndice = () => [$("main"), $(".haste"), som, $(".pular-conteudo")];
  const fecharIndice = () => {
    indice.hidden = true; indiceBtn.setAttribute("aria-expanded", "false");
    foraDoIndice().forEach((el) => el && (el.inert = false));
  };
  indiceBtn.addEventListener("click", () => {
    if (!indice.hidden) { fecharIndice(); return; }
    indice.hidden = false; indiceBtn.setAttribute("aria-expanded", "true");
    foraDoIndice().forEach((el) => el && (el.inert = true)); // o foco não escapa para trás do índice
    ($("a.ativo", indice) || $("a", indice)).focus();
  });
  $("[data-fechar-indice]").addEventListener("click", () => { fecharIndice(); indiceBtn.focus(); });
  $$("a", indice).forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); fecharIndice(); irPara(a.getAttribute("href"), false); }));
  indice.addEventListener("click", (e) => { if (e.target === indice) fecharIndice(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !indice.hidden) { fecharIndice(); indiceBtn.focus(); } });

  /* ── Capítulos: carregar antes, revelar ao entrar, marcar posição ─────── */
  const caps = $$(".cap");
  const carregar = (img) => { if (img && img.dataset.src) { img.src = img.dataset.src; img.removeAttribute("data-src"); } };
  const temIO = "IntersectionObserver" in window;
  if (!temIO) { caps.forEach((c) => { c.classList.add("visto"); $$("img[data-src]", c).forEach(carregar); }); }

  const perto = temIO && new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    $$("img[data-src]", e.target).slice(0, e.target.id === "memorias" ? 3 : 99).forEach(carregar);
    perto.unobserve(e.target);
  }), { rootMargin: "120% 0px" });

  const cenasVideo = (V.video && V.video.cenas) || {};
  const revelar = temIO && new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting || e.target === abertura) return;
    e.target.classList.add("visto"); revelar.unobserve(e.target);
    $$("img[data-src]", e.target).slice(0, 3).forEach(carregar);
    // clipe do ORI para o capítulo (se houver): toca uma vez, a foto aprovada fica como pôster
    const fig = $("[data-video]", e.target), arq = fig && cenasVideo[fig.dataset.video];
    if (arq && !reduzir) {
      const v = document.createElement("video");
      Object.assign(v, { muted: true, playsInline: true, preload: "auto", src: arq });
      v.setAttribute("aria-hidden", "true"); v.poster = $("img", fig).currentSrc || "";
      v.addEventListener("error", () => v.remove(), { once: true });
      fig.appendChild(v); v.play().catch(() => v.remove());
    }
    const h = $("h2", e.target) || $(".marca-creditos", e.target);
    if (h) setTimeout(() => { const r = h.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) poeira.burst(r.left + r.width * .5, r.top + r.height * .5, 22, 2.4); }, 1300);
  }), { rootMargin: "0px 0px -28% 0px" });
  if (temIO) caps.forEach((c) => { perto.observe(c); revelar.observe(c); });

  // Capítulo atual: pontos da haste, item do índice e nome no botão do topo
  const pontos = [...$$(".haste a"), ...$$("a", indice)];
  const nomeAtual = $(".indice-atual");
  const nomes = Object.fromEntries($$("a", indice).map((a) => [a.getAttribute("href").slice(1), a.lastChild.textContent.trim()]));
  const marcarAtual = (id) => {
    pontos.forEach((p) => p.classList.toggle("ativo", p.getAttribute("href") === `#${id}`));
    if (nomes[id] && nomeAtual.textContent !== nomes[id]) { nomeAtual.textContent = nomes[id]; indiceBtn.setAttribute("aria-label", `Capítulos. Atual: ${nomes[id]}`); }
  };
  const ativo = temIO && new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) marcarAtual(e.target.id || "final");
  }), { rootMargin: "-45% 0px -45% 0px" });
  if (temIO) caps.forEach((c) => ativo.observe(c));

  // Rolagem: véu do topo, barra de progresso e garantia de revelação
  const barra = $(".progresso-leitura i");
  let rafR = 0;
  const aoRolar = () => {
    corpo.classList.toggle("rolou", scrollY > innerHeight * .5);
    const total = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${total > 0 ? Math.min(1, scrollY / total) : 0})`;
    // se algum navegador embutido não avisar a entrada do capítulo, revela mesmo assim
    for (const c of caps) {
      if (c === abertura || c.classList.contains("visto")) continue;
      const r = c.getBoundingClientRect();
      if (r.top < innerHeight * .85 && r.bottom > 0) { c.classList.add("visto"); $$("img[data-src]", c).slice(0, c.id === "memorias" ? 3 : 99).forEach(carregar); }
    }
  };
  addEventListener("scroll", () => { cancelAnimationFrame(rafR); rafR = requestAnimationFrame(aoRolar); }, { passive: true });
  addEventListener("resize", aoRolar);

  /* ── Galeria ──────────────────────────────────────────────────────────── */
  const filme = $(".filme"), quadros = $$("figure", filme), cont = $(".filme-contador b");
  let atualF = -1;
  const carregarF = (i) => quadros[i] && carregar($("img", quadros[i]));
  const marcarF = () => {
    const centro = filme.scrollLeft + filme.clientWidth / 2;
    let melhor = 0, dist = Infinity;
    quadros.forEach((q, i) => { const d = Math.abs(q.offsetLeft + q.offsetWidth / 2 - centro); if (d < dist) { dist = d; melhor = i; } });
    if (melhor === atualF) return;
    atualF = melhor; quadros.forEach((q, i) => q.classList.toggle("atual", i === melhor));
    cont.textContent = String(melhor + 1).padStart(2, "0");
    [melhor - 1, melhor, melhor + 1, melhor + 2].forEach(carregarF);
  };
  let rafF = 0;
  filme.addEventListener("scroll", () => { cancelAnimationFrame(rafF); rafF = requestAnimationFrame(marcarF); }, { passive: true });
  const moverF = (d) => {
    const i = Math.max(0, Math.min(quadros.length - 1, atualF + d)); carregarF(i);
    filme.scrollTo({ left: quadros[i].offsetLeft + quadros[i].offsetWidth / 2 - filme.clientWidth / 2, behavior: reduzir ? "auto" : "smooth" });
  };
  $$("[data-filme]").forEach((b) => b.addEventListener("click", () => moverF(Number(b.dataset.filme))));
  filme.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") { e.preventDefault(); moverF(1); } if (e.key === "ArrowLeft") { e.preventDefault(); moverF(-1); } });
  quadros.forEach((q, i) => q.addEventListener("click", () => i !== atualF && moverF(i - atualF)));
  $(".filme-contador").lastChild.textContent = ` / ${String(quadros.length).padStart(2, "0")}`;
  marcarF();

  /* ── Dados do evento (só o que existe aparece) ────────────────────────── */
  const ev = V.evento || {};
  $$("[data-evento]").forEach((el) => { el.textContent = String(ev[el.dataset.evento] || "").trim(); });
  $$("[data-linha]").forEach((l) => (l.hidden = !String(ev[l.dataset.linha] || "").trim()));
  $(".recados").hidden = !ev.traje && !ev.presente;
  $(".quando").hidden = !ev.data;
  $(".hora").hidden = !ev.horario;
  $(".onde").hidden = !ev.local && !ev.endereco;
  const dataAlvo = ev.dataISO ? new Date(ev.dataISO) : null;
  if (dataAlvo && !isNaN(dataAlvo)) {
    const dia = new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "America/Sao_Paulo" }).format(dataAlvo);
    if (ev.data) $("[data-quando]").textContent = `${dia.charAt(0).toUpperCase()}${dia.slice(1)}, ${ev.data}`;
    const caixa = $(".contagem"), dois = (n) => String(n).padStart(2, "0");
    const el = { d: $("[data-cd=d]"), h: $("[data-cd=h]"), m: $("[data-cd=m]"), s: $("[data-cd=s]") };
    let t;
    const tic = () => {
      const ms = dataAlvo - Date.now();
      if (ms <= 0) { caixa.hidden = true; return clearInterval(t); }
      caixa.hidden = false; const s = Math.floor(ms / 1000);
      el.d.textContent = dois(Math.floor(s / 86400)); el.h.textContent = dois(Math.floor(s / 3600) % 24);
      el.m.textContent = dois(Math.floor(s / 60) % 60); el.s.textContent = dois(s % 60);
    };
    t = setInterval(tic, 1000); tic();
  }
  const maps = $("[data-maps]");
  if (/^https:\/\//.test(ev.mapsUrl || "")) maps.href = ev.mapsUrl; else maps.hidden = true;
  if (ev.prazoConfirmacao) $$(".prazo").forEach((p) => { p.textContent = `Por favor, responda ${ev.prazoConfirmacao}.`; p.hidden = false; });
  const contatoNum = String(ev.contato || "").replace(/\D/g, "");
  if (contatoNum.length >= 12 && contatoNum.length <= 13) { const c = $("[data-contato]"); c.href = `https://wa.me/${contatoNum}`; c.hidden = false; }

  /* ── Pétalas: param perto do formulário e das informações do baile ───── */
  const calmos = new Set();
  const zonasPetala = new Set();
  function atualizarPetalas() { poeira.petalas(aberto && !corpo.classList.contains("portao") && zonasPetala.size > 0 && calmos.size === 0); }
  if (temIO) {
    const ioZona = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? zonasPetala.add(e.target) : zonasPetala.delete(e.target)));
      atualizarPetalas();
    }, { threshold: .35 });
    $$("#abertura, #final, .cap--creditos").forEach((el) => ioZona.observe(el));
    const ioCalmo = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? calmos.add(e.target) : calmos.delete(e.target)));
      atualizarPetalas();
    });
    $$(".rsvp, .texto--baile").forEach((el) => ioCalmo.observe(el));
  }

  /* ── Confirmação de presença ──────────────────────────────────────────── */
  const R = V.rsvp || {};
  const form = $(".rsvp"), estado = $(".estado", form), lista = $(".nomes-lista", form), saida = $("#r-acomp");
  const campo = (n) => $(`[data-campo="${n}"]`, form);
  const maxAc = Math.max(0, Number(R.maxAcompanhantes ?? 5));
  let acomp = 0;
  const destino = (() => {
    const zap = String(R.whatsapp || ev.contato || "").replace(/\D/g, "");
    if (R.destino === "whatsapp" && zap.length >= 12 && zap.length <= 13) return { tipo: "whatsapp", zap };
    if (R.destino === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(R.email || "")) return { tipo: "email", email: R.email };
    if (R.destino === "formulario" && /^https:\/\//.test(R.endpoint || "")) return { tipo: "formulario", url: R.endpoint };
    return null;
  })();
  if (maxAc === 0) campo("acompanhantes").remove();
  // O botão diz o que realmente acontece
  if (destino && destino.tipo === "whatsapp") {
    $(".enviar-rotulo", form).innerHTML = `${ICONE_ZAP}Confirmar pelo WhatsApp`;
    const c = $(".como-envia", form); c.textContent = "Vamos abrir o WhatsApp com sua resposta pronta — é só tocar em Enviar."; c.hidden = false;
  }
  const presenca = () => (form.elements.presenca.value || "");
  const desenharAcomp = () => {
    const n = presenca() === "sim" ? acomp : 0;
    saida.value = saida.textContent = String(acomp);
    $$("[data-acomp]", form).forEach((b) => (b.disabled = (b.dataset.acomp === "-1" && acomp <= 0) || (b.dataset.acomp === "1" && acomp >= maxAc)));
    const atuais = $$("input", lista);
    for (let k = atuais.length; k < n; k++) {
      const i = document.createElement("input");
      i.name = "acompanhante"; i.autocomplete = "off"; i.autocapitalize = "words"; i.enterKeyHint = "next";
      i.placeholder = `Nome do acompanhante ${k + 1}`; i.setAttribute("aria-label", `Nome do acompanhante ${k + 1}`);
      lista.appendChild(i);
    }
    atuais.slice(n).forEach((i) => i.remove());
    campo("nomes").hidden = n === 0;
  };
  $$("[data-acomp]", form).forEach((b) => b.addEventListener("click", () => {
    acomp = Math.max(0, Math.min(maxAc, acomp + Number(b.dataset.acomp)));
    desenharAcomp();
    if (Number(b.dataset.acomp) > 0) { const ult = $$("input", lista).pop(); ult && ult.focus({ preventScroll: true }); }
  }));
  function marcar(nome, msg) {
    const c = campo(nome); if (!c) return;
    c.classList.toggle("invalido", !!msg);
    const p = $(".erro", c); if (p) p.textContent = msg;
    $$("input:not([type=radio])", c).forEach((i) => i.setAttribute("aria-invalid", msg && !i.value.trim() ? "true" : "false"));
  }
  const nomeOk = (v) => v.trim().split(/\s+/).filter((p) => p.length > 1).length >= 2;
  form.addEventListener("change", (e) => {
    if (e.target.name === "presenca") {
      const c = campo("acompanhantes"); if (c) c.hidden = presenca() !== "sim";
      marcar("presenca", ""); desenharAcomp();
    }
  });
  form.addEventListener("input", (e) => {
    const c = e.target.closest("[data-campo]"); if (!c || !c.classList.contains("invalido")) return;
    if (c.dataset.campo === "nome" && nomeOk(e.target.value)) marcar("nome", "");
    if (c.dataset.campo === "nomes" && $$("input", lista).every((i) => i.value.trim())) marcar("nomes", "");
  });
  function validar() {
    let primeiro = null;
    const nome = form.elements.nome.value;
    const mN = !nome.trim() ? "Informe seu nome completo." : !nomeOk(nome) ? "Escreva nome e sobrenome." : "";
    marcar("nome", mN); if (mN) primeiro = $("#r-nome");
    const mP = presenca() ? "" : "Escolha uma das opções.";
    marcar("presenca", mP); if (mP && !primeiro) primeiro = $("input[name=presenca]", form);
    const vazios = $$("input", lista).filter((i) => !i.value.trim());
    const mA = vazios.length ? (vazios.length > 1 ? "Preencha o nome de cada acompanhante." : "Preencha o nome do acompanhante.") : "";
    marcar("nomes", mA); if (mA && !primeiro) primeiro = vazios[0];
    if (primeiro) primeiro.focus();
    return !primeiro;
  }
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const mostrar = (html, tipo) => { estado.innerHTML = html; estado.className = `estado ${tipo}`; estado.scrollIntoView({ block: "nearest", behavior: reduzir ? "auto" : "smooth" }); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.elements._site.value) return;
    if (!validar()) return mostrar("Confira os campos destacados.", "falha");
    const sim = presenca() === "sim";
    const dados = {
      nome: form.elements.nome.value.trim().replace(/\s+/g, " "),
      presenca: sim ? "Sim, estarei presente" : "Não poderei comparecer",
      acompanhantes: sim ? acomp : 0,
      nomes_acompanhantes: $$("input", lista).map((i) => i.value.trim()),
      recado: form.elements.recado.value.trim(),
      evento: "Bella XV",
    };
    if (!destino) return mostrar("A confirmação on-line ainda não foi ativada pela família. <strong>Sua resposta não foi enviada.</strong> Tente novamente mais tarde.", "falha");

    if (destino.tipo === "whatsapp") {
      const txt = [
        "*Confirmação de presença · Bella XV*", `Nome: ${dados.nome}`, `Resposta: ${dados.presenca}`,
        sim ? `Acompanhantes: ${dados.acompanhantes}${dados.acompanhantes ? ` (${dados.nomes_acompanhantes.join(", ")})` : ""}` : "",
        dados.recado ? `Recado: ${dados.recado}` : "",
      ].filter(Boolean).join("\n");
      const link = `https://wa.me/${destino.zap}?text=${encodeURIComponent(txt)}`;
      const abriu = window.open(link, "_blank", "noopener");
      return mostrar(`${abriu ? "Abrimos o WhatsApp com sua resposta." : "Sua resposta está pronta."} <strong>Toque em Enviar na conversa para concluir.</strong><a class="botao botao--claro botao--inteiro" href="${esc(link)}" target="_blank" rel="noopener">${ICONE_ZAP}Abrir o WhatsApp</a>`, "pendente");
    }

    const botao = $("button[type=submit]", form);
    botao.disabled = true; mostrar("Enviando sua confirmação…", "enviando");
    try {
      const corpoJson = destino.tipo === "email"
        ? { _subject: `RSVP Bella XV · ${dados.nome} · ${sim ? "SIM" : "NÃO"}`, _template: "table", _captcha: "false", ...dados, nomes_acompanhantes: dados.nomes_acompanhantes.join(", ") }
        : dados;
      const url = destino.tipo === "email" ? `https://formsubmit.co/ajax/${encodeURIComponent(destino.email)}` : destino.url;
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(corpoJson) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.success === false || j.success === "false") throw new Error(j.message || r.status);
      const primeiro = esc(dados.nome.split(" ")[0]);
      form.reset(); acomp = 0; desenharAcomp(); const c = campo("acompanhantes"); if (c) c.hidden = true;
      mostrar(sim ? `Confirmação recebida. Obrigada, ${primeiro}! Até o grande baile.` : `Resposta recebida. Obrigada por avisar, ${primeiro}.`, "ok");
      const b = botao.getBoundingClientRect(); poeira.burst(b.left + b.width / 2, b.top, 44, 4);
    } catch (err) {
      console.warn("RSVP:", err);
      mostrar("Não foi possível enviar agora. Verifique sua conexão e tente de novo.", "falha");
    } finally { botao.disabled = false; }
  });
  desenharAcomp();

  // Conferência: ?previa pula o prólogo (sem música)
  if (new URLSearchParams(location.search).has("previa")) {
    abrirSemRitual();
    if (location.hash) setTimeout(() => $(location.hash) && $(location.hash).scrollIntoView(), 60);
  }
  // a tela inicial sempre mostra "Tocar a rosa", também na volta ao convite
  if (corpo.classList.contains("portao")) travar(true);
  aoRolar();
})();
