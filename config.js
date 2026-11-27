/* ════════════════════════════════════════════════════════════════════════
   Bella XV · A Valsa da Rosa — ÚNICO arquivo para editar dados do convite.
   Campo vazio ("") = o item some do convite. Nada é inventado.
   ════════════════════════════════════════════════════════════════════════ */
window.VALSA = {
  evento: {
    // Data/hora ISO 8601 com fuso: liga a contagem regressiva. Vazio = sem contagem.
    dataISO: "2026-12-12T19:00:00-03:00",
    data: "12 de dezembro de 2026",
    horario: "19h",
    local: "Espaço Joaquim Jacinto",
    endereco: "Rua Maria Sabino de Almeida, lote 13, Bracuí",
    cidade: "Angra dos Reis · RJ",
    // Busca montada a partir do endereço. Se tiver o link exato (Maps → Compartilhar), cole aqui.
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua%20Maria%20Sabino%20de%20Almeida%2C%20Bracu%C3%AD%2C%20Angra%20dos%20Reis%20-%20RJ",
    prazoConfirmacao: "até 1º de dezembro",
    traje: "Pedimos que não usem vermelho nem dourado.",
    presente: "Maquiagem, calça 38, calçado 37/38, camisa ou vestido M.",
    contato: "5524998383097", // WhatsApp da família (só dígitos). Vazio = sem botão de contato.
  },

  /* Confirmação de presença. Escolha UM destino:
       "link"       → os botões "Confirmar presença" abrem a página externa em `link` (o formulário some)
       "whatsapp"   → abre o WhatsApp da família com a resposta pronta (o convidado toca em Enviar)
       "email"      → envia ao e-mail abaixo via FormSubmit (o 1º envio pede ativação no e-mail)
       "formulario" → envia JSON a um serviço próprio (Formspree, Google Apps Script etc.)
     Destino vazio ou incompleto: o formulário avisa que NÃO enviou. */
  rsvp: {
    destino: "link",
    link: "https://assessoriavip.com.br/rsvpUnico/5138ca10df5011f1ae604f6afd42d3ad", // confirmação da assessoria
    whatsapp: "",   // vazio = usa evento.contato
    email: "",      // ainda não informado
    endpoint: "",
    maxAcompanhantes: 5,
  },

  /* Vídeo produzido no ORI (ver ORIENTACAO-VIDEO-ORI.md).
     Enquanto "arquivo" estiver vazio, a abertura usa a sequência fotográfica com luz. */
  video: {
    arquivo: "",          // ex.: "assets/video/abertura.mp4"  (vertical 9:16)
    arquivoDesktop: "",   // opcional: versão 16:9 para computador
    poster: "assets/img/valsa-abertura.webp",
    /* Opcional: clipes curtos do ORI para capítulos (a foto aprovada fica como pôster).
       Cada clipe toca uma vez, sem som, quando o capítulo aparece; o texto fica no site. */
    cenas: {
      debutante: "",  // ex.: "assets/video/debutante.mp4"
      novo: "",
      convite: "",
      final: "",
    },
  },

  musica: { arquivo: "assets/audio/tema.mp3", volume: 0.7 },
};
