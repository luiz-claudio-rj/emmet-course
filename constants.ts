import { Level, UITranslation, Language } from './types';

export const TRANSLATIONS: Record<Language, UITranslation> = {
  en: {
    title: "Emmet Master",
    level: "Level",
    inputLabel: "YOUR CODE",
    inputPlaceholder: "Type Emmet abbreviation...",
    runButton: "Run Emmet",
    nextButton: "Next Level",
    processing: "Processing...",
    hintButton: "Need a hint?",
    hintPrefix: "AI Hint",
    outputLabel: "GENERATED OUTPUT",
    targetLabel: "TARGET OUTPUT",
    examplesLabel: "USAGE EXAMPLES",
    conceptLabel: "CONCEPT",
    finishTitle: "Course Completed!",
    finishDesc: "You have mastered the art of Emmet. Enter your name to receive your certification.",
    finishDescChallenge: "Challenge crushed! Enter your name to record your speed run.",
    nameLabel: "Your Name",
    generateDiploma: "Generate Diploma",
    diplomaTitle: "Certificate of Mastery",
    diplomaTitleChallenge: "Speed Demon Certificate",
    diplomaText: "This certifies that the Architect below has successfully mastered Emmet Syntax.",
    diplomaTextChallenge: "This certifies that the Architect below completed the Emmet Challenge in record time.",
    timeLabel: "Time",
    download: "Print / Save",
    restart: "Restart Track",
    backToHome: "Back to Home",
    errorInvalid: "Invalid Emmet syntax.",
    errorMismatch: "Output does not match target.",
    errorConnection: "Connection error.",
    matched: "MATCHED",
    selectTrack: "Select Your Path",
    trackLearningTitle: "Learning Track",
    trackLearningDesc: "Learn Emmet step-by-step from Junior to Senior. Perfect for beginners.",
    trackChallengeTitle: "Challenge Track",
    trackChallengeDesc: "Race against the clock! Solve all levels as fast as possible.",
    start: "Start",
    rankJunior: "Junior Developer",
    rankPleno: "Mid-Level Developer",
    rankSenior: "Senior Architect"
  },
  'pt-BR': {
    title: "Mestre Emmet",
    level: "Fase",
    inputLabel: "SEU CÓDIGO",
    inputPlaceholder: "Digite a abreviação Emmet...",
    runButton: "Executar",
    nextButton: "Próxima Fase",
    processing: "Processando...",
    hintButton: "Precisa de dica?",
    hintPrefix: "Dica da IA",
    outputLabel: "SAÍDA GERADA",
    targetLabel: "SAÍDA ALVO",
    examplesLabel: "EXEMPLOS DE USO",
    conceptLabel: "CONCEITO",
    finishTitle: "Curso Concluído!",
    finishDesc: "Você dominou a arte do Emmet. Digite seu nome para receber seu certificado.",
    finishDescChallenge: "Desafio esmagado! Digite seu nome para registrar seu tempo.",
    nameLabel: "Seu Nome",
    generateDiploma: "Gerar Diploma",
    diplomaTitle: "Certificado de Maestria",
    diplomaTitleChallenge: "Certificado de Velocidade",
    diplomaText: "Isto certifica que o Arquiteto abaixo dominou com sucesso a Sintaxe Emmet.",
    diplomaTextChallenge: "Isto certifica que o Arquiteto abaixo completou o Desafio Emmet em tempo recorde.",
    timeLabel: "Tempo",
    download: "Imprimir / Salvar",
    restart: "Reiniciar Trilha",
    backToHome: "Voltar ao Início",
    errorInvalid: "Sintaxe Emmet inválida.",
    errorMismatch: "A saída não corresponde ao alvo.",
    errorConnection: "Erro de conexão.",
    matched: "IGUAL",
    selectTrack: "Selecione sua Trilha",
    trackLearningTitle: "Trilha de Aprendizagem",
    trackLearningDesc: "Aprenda Emmet passo a passo, de Júnior a Sênior. Perfeito para iniciantes.",
    trackChallengeTitle: "Trilha de Desafio",
    trackChallengeDesc: "Corra contra o relógio! Resolva todas as fases o mais rápido possível.",
    start: "Começar",
    rankJunior: "Desenvolvedor Júnior",
    rankPleno: "Desenvolvedor Pleno",
    rankSenior: "Arquiteto Sênior"
  },
  es: {
    title: "Maestro Emmet",
    level: "Nivel",
    inputLabel: "TU CÓDIGO",
    inputPlaceholder: "Escribe la abreviación Emmet...",
    runButton: "Ejecutar",
    nextButton: "Siguiente Nivel",
    processing: "Procesando...",
    hintButton: "¿Necesitas pista?",
    hintPrefix: "Pista IA",
    outputLabel: "SALIDA GENERADA",
    targetLabel: "SALIDA META",
    examplesLabel: "EJEMPLOS DE USO",
    conceptLabel: "CONCEPTO",
    finishTitle: "¡Curso Completado!",
    finishDesc: "Has dominado el arte de Emmet. Ingresa tu nombre para recibir tu certificación.",
    finishDescChallenge: "¡Desafío superado! Ingresa tu nombre para registrar tu tiempo.",
    nameLabel: "Tu Nombre",
    generateDiploma: "Generar Diploma",
    diplomaTitle: "Certificado de Maestría",
    diplomaTitleChallenge: "Certificado de Velocidad",
    diplomaText: "Esto certifica que el Arquitecto abajo ha dominado con éxito la Sintaxis Emmet.",
    diplomaTextChallenge: "Esto certifica que el Arquitecto abajo completó el Desafío Emmet en tiempo récord.",
    timeLabel: "Tiempo",
    download: "Imprimir / Guardar",
    restart: "Reiniciar Pista",
    backToHome: "Volver al Inicio",
    errorInvalid: "Sintaxis Emmet inválida.",
    errorMismatch: "La salida no coincide con la meta.",
    errorConnection: "Error de conexión.",
    matched: "IGUAL",
    selectTrack: "Selecciona tu Camino",
    trackLearningTitle: "Ruta de Aprendizaje",
    trackLearningDesc: "Aprende Emmet paso a paso, de Junior a Senior. Perfecto para principiantes.",
    trackChallengeTitle: "Ruta de Desafío",
    trackChallengeDesc: "¡Corre contra el reloj! Resuelve todos los niveles lo más rápido posible.",
    start: "Comenzar",
    rankJunior: "Desarrollador Junior",
    rankPleno: "Desarrollador Semi-Senior",
    rankSenior: "Arquitecto Senior"
  }
};

export const getLevels = (lang: Language): Level[] => {
  const isPt = lang === 'pt-BR';
  const isEs = lang === 'es';

  return [
    // --- JUNIOR (Levels 1-4) ---
    {
      id: 1,
      difficulty: 'JUNIOR',
      title: isPt ? "Tag Básica" : isEs ? "Etiqueta Básica" : "Basic Tag",
      description: "",
      concept: isPt ? "Nome da Tag" : isEs ? "Nombre de Etiqueta" : "Tag Name",
      examples: ["div", "h1", "p", "section"],
      hint: isPt ? "Digite apenas 'div'." : isEs ? "Escribe solo 'div'." : "Just type 'div'.",
      targetHtml: `<div></div>`
    },
    {
      id: 2,
      difficulty: 'JUNIOR',
      title: isPt ? "Classes" : isEs ? "Clases" : "Classes",
      description: "",
      concept: ".className",
      examples: ["div.box", "span.text-red", "p.intro"],
      hint: "element.class",
      targetHtml: `<div class="container"></div>`
    },
    {
      id: 3,
      difficulty: 'JUNIOR',
      title: isPt ? "IDs" : isEs ? "IDs" : "IDs",
      description: "",
      concept: "#idName",
      examples: ["div#main", "section#hero", "h1#title"],
      hint: "element#id",
      targetHtml: `<section id="hero"></section>`
    },
    {
      id: 4,
      difficulty: 'JUNIOR',
      title: isPt ? "Filhos" : isEs ? "Hijos" : "Children",
      description: "",
      concept: "> (Child/Filho)",
      examples: ["div>p", "ul>li", "nav>a"],
      hint: "parent>child",
      targetHtml: `<nav>
  <ul></ul>
</nav>`
    },

    // --- PLENO (Levels 5-8) ---
    {
      id: 5,
      difficulty: 'PLENO',
      title: isPt ? "Irmãos" : isEs ? "Hermanos" : "Siblings",
      description: "",
      concept: "+ (Sibling/Irmão)",
      examples: ["h1+p", "div+footer", "a+a"],
      hint: "element+element",
      targetHtml: `<h1></h1>
<p></p>`
    },
    {
      id: 6,
      difficulty: 'PLENO',
      title: isPt ? "Multiplicação" : isEs ? "Multiplicación" : "Multiplication",
      description: "",
      concept: "* (Multiply)",
      examples: ["li*3", "div*2", "p*5"],
      hint: "element*number",
      targetHtml: `<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>`
    },
    {
      id: 7,
      difficulty: 'PLENO',
      title: isPt ? "Agrupamento" : isEs ? "Agrupación" : "Grouping",
      description: "",
      concept: "() (Group)",
      examples: ["div>(header>h1)+main", "(div>dl)+(div>dl)"],
      hint: "div>(header>h1)+footer",
      targetHtml: `<div>
  <header>
    <h1></h1>
  </header>
  <footer></footer>
</div>`
    },
    {
      id: 8,
      difficulty: 'PLENO',
      title: isPt ? "Atributos" : isEs ? "Atributos" : "Attributes",
      description: "",
      concept: "[attr=value]",
      examples: ["a[href='url']", "input[type='text']", "td[colspan=2]"],
      hint: "a[href='#']",
      targetHtml: `<a href="#"></a>`
    },

    // --- SENIOR (Levels 9-12) ---
    {
      id: 9,
      difficulty: 'SENIOR',
      title: isPt ? "Conteúdo de Texto" : isEs ? "Contenido de Texto" : "Text Content",
      description: "",
      concept: "{Text}",
      examples: ["p{Hello World}", "a{Click me}", "li{Item}"],
      hint: "h1{Title}",
      targetHtml: `<h1>Welcome</h1>`
    },
    {
      id: 10,
      difficulty: 'SENIOR',
      title: isPt ? "Numeração de Itens" : isEs ? "Numeración" : "Item Numbering",
      description: "",
      concept: "$ (Numbering)",
      examples: ["li.item$*3", "h$*3", "img[src=image$.jpg]*2"],
      hint: "ul>li.item$*3",
      targetHtml: `<ul>
  <li class="item1"></li>
  <li class="item2"></li>
  <li class="item3"></li>
</ul>`
    },
    {
      id: 11,
      difficulty: 'SENIOR',
      title: isPt ? "Tags Implícitas" : isEs ? "Etiquetas Implícitas" : "Implicit Tags",
      description: "",
      concept: "Context-aware",
      examples: [".class (div)", "em>.class (span)", "ul>.item (li)"],
      hint: "table>.row>.col",
      targetHtml: `<table>
  <tr class="row">
    <td class="col"></td>
  </tr>
</table>`
    },
    {
      id: 12,
      difficulty: 'SENIOR',
      title: isPt ? "O Arquiteto" : isEs ? "El Arquitecto" : "The Architect",
      description: "",
      concept: "Full Complex Syntax",
      examples: ["#page>(header>h1{Logo})+main#content+footer"],
      hint: isPt ? "Combine classes, ids, multiplicação, conteúdo e agrupamento." : "Combine classes, ids, multiply, content and grouping.",
      targetHtml: `<div class="card">
  <div class="card-header">
    <h3 class="title">Product 1</h3>
  </div>
  <div class="card-body">
    <p>Description</p>
    <button class="btn-primary">Buy</button>
  </div>
</div>`
    }
  ];
};