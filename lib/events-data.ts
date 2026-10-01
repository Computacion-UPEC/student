export interface Speaker {
  name: string
  title: string
  topic: string
  image?: string
  /** optional CSS object-position value, e.g. `"center 60%"` — controls vertical/horizontal focal point */
  imagePosition?: string
  // Optional legacy cropBox retained for compatibility with older components
  cropBox?: { cx: number; cy: number; zoom: number }
  linkedin?: string
  github?: string
  website?: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  timezone: string
  location: string
  type: "Workshop" | "Charla" | "Hackathon" | "Seminario" | "Meetup" | "Club"
  organization: "COMC" | "IEEE" | "COMC & IEEE"
  speakers: Speaker[]
  posterImage?: string
  galleryImages?: string[]
  tags: string[]
}

// All speakers with their data
// Stars: 3 = linkedin + github + website, 2 = linkedin + github OR linkedin + website, 1 = linkedin only, 0 = none
export function getSpeakerStars(speaker: Speaker): number {
  let stars = 0
  if (speaker.linkedin) stars++
  if (speaker.github) stars++
  if (speaker.website) stars++
  return stars
}

export const allSpeakers: Speaker[] = [
  {
    name: "Angelo Benavides",
    title: "Developer",
    topic: "Git - Github",
    image: "/images/speakers/angelo.png",
    imagePosition: "center 10%",
    linkedin: "https://www.linkedin.com/in/angelobenavidesa/",
    github: "https://github.com/AngeloAlexanderBenavides",
    website: "https://angeloalexanderbenavides.github.io/",
  },
  {
    name: "Edison Lopez",
    title: "Developer",
    topic: "Fundamentos HTML",
    image: "/images/speakers/edison.png",
    imagePosition: "center 5%",
    linkedin: "https://www.linkedin.com/in/edison-l%C3%B3pez-6b69b4343/",
  },
  {
    name: "Geovanny Basantes",
    title: "Developer",
    topic: "API Development",
    image: "/images/speakers/Geovany.png",
    imagePosition: "center 1%",
    linkedin: "https://www.linkedin.com/in/geovanny-basantes-0471b123a/",
    github: "https://github.com/COMPUMAX-EC",
    website: "https://geobas.compumax.tech/",
  },
  {
    name: "Erika Delgado",
    title: "Developer",
    topic: "API Development",
    image: "/images/speakers/Erika.png",
    imagePosition: "center 5%",
    linkedin: "https://www.linkedin.com/in/erika-delgado-30113a380/",
  },
  {
    name: "Luis Valverde",
    title: "Developer",
    topic: "Git - Github",
    image: "/images/speakers/Luis.png",
    imagePosition: "center 5%",
    linkedin: "https://www.linkedin.com/in/luis-valverde-102653216/",
  },
  {
    name: "Alexa Domiguez",
    title: "Developer",
    topic: "Docker",
    image: "/images/speakers/Alexa.png",
    linkedin: "https://www.linkedin.com/in/alexadm0402/",
  },
  {
    name: "Luis Guerrero",
    title: "Developer",
    topic: "Soft Skills",
    image: "/images/speakers/Lguerrero.png",
    imagePosition: "center 10%",
    linkedin: "https://www.linkedin.com/in/ilukas/",
  },
  {
    name: "Cristian Baraja",
    title: "Developer",
    topic: "Web App with Docker",
    image: "/images/speakers/cristianb.png",
    imagePosition: "center 0%",
    linkedin: "https://www.linkedin.com/in/cristian-baraja-85a9a129a/",
    github: "https://github.com/baraja-cristian",
  },
  {
    name: "Luis Martinez",
    title: "Developer",
    topic: "Python Asynchronous",
    image: "/images/speakers/luism.png",
    imagePosition: "center 0%",
  },
  {
    name: "Anthony Quiranza",
    title: "Developer",
    topic: "AI Agents OpenClaw - Copilot",
    image: "/images/speakers/antoni.jpeg",
    linkedin: "https://www.linkedin.com/in/anthonyquiranza/",
    github: "https://github.com/AnthonyQuiranza",
    website: "https://www.cloudsofts.net/",
  },
  {
    name: "John Cortez",
    title: "Developer",
    topic: "FastAPI",
    image: "/images/speakers/john.png",
    imagePosition: "center 0%",
    github: "https://github.com/johncortes117",
    linkedin: "https://www.linkedin.com/in/john-cortes-pozo/",
    website: "https://johncp.dev/",
  },
  {
    name: "Michael Paredes",
    title: "Developer",
    topic: "Notion",
    image: "/images/speakers/michaelc.png",
    imagePosition: "center 0%",
    linkedin: "https://www.linkedin.com/in/michael-paredes-a9a5a033b/",
  },
]

export const events: Event[] = [
  {
    id: "autonomous-agents-openclaw",
    title: "Autonomous Agents with OpenClaw and Copilot",
    description:
      "Learn how to deploy OpenClaw, an open-source agent engine that enables AI to interact with the operating system and local tools, and integrate GitHub Copilot as the agent's brain.",
    date: "Feb 13, 2026",
    time: "5:15 PM",
    timezone: "GMT-5",
    location: "Online",
    type: "Workshop",
    organization: "COMC & IEEE",
    speakers: [allSpeakers[9]], // Anthony Quiranza
    posterImage: "/images/image.png",
    tags: ["AI", "OpenClaw", "GitHub Copilot", "Agentes Autonomos"],
  },
  {
    id: "git-github-workshop",
    title: "Git & GitHub Workshop",
    description:
      "Taller practico sobre control de versiones con Git y colaboracion en GitHub. Aprende las mejores practicas para trabajar en equipo.",
    date: "Ene 20, 2026",
    time: "4:00 PM",
    timezone: "GMT-5",
    location: "Laboratorio de Computacion - UPEC",
    type: "Workshop",
    organization: "COMC & IEEE",
    speakers: [allSpeakers[0], allSpeakers[4]], // Angelo Benavides, Luis Valverde
    tags: ["Git", "GitHub", "Control de Versiones"],
  },
  {
    id: "api-development",
    title: "API Development",
    description:
      "Aprende los fundamentos del desarrollo de APIs RESTful, mejores practicas de diseno y documentacion.",
    date: "Dic 15, 2025",
    time: "3:00 PM",
    timezone: "GMT-5",
    location: "Auditorio Principal - UPEC",
    type: "Charla",
    organization: "IEEE",
    speakers: [allSpeakers[2], allSpeakers[3]], // Geovanny Basantes, Erika Delgado
    tags: ["API", "REST", "Backend", "Desarrollo Web"],
  },
  {
    id: "fundamentos-html",
    title: "Fundamentos de HTML",
    description:
      "Introduccion a HTML, la base de toda pagina web. Estructura semantica, etiquetas esenciales y buenas practicas.",
    date: "Nov 28, 2025",
    time: "4:00 PM",
    timezone: "GMT-5",
    location: "Online",
    type: "Charla",
    organization: "COMC",
    speakers: [allSpeakers[1]], // Edison Lopez
    tags: ["HTML", "Web", "Frontend", "Fundamentos"],
  },
  {
    id: "docker-workshop",
    title: "Docker: Contenedores en la Practica",
    description:
      "Taller sobre Docker y contenedores. Desde la instalacion hasta el despliegue de aplicaciones web completas.",
    date: "Nov 10, 2025",
    time: "5:00 PM",
    timezone: "GMT-5",
    location: "Laboratorio de Computacion - UPEC",
    type: "Workshop",
    organization: "COMC & IEEE",
    speakers: [allSpeakers[5], allSpeakers[7]], // Alexa Domiguez, Cristian Baraja
    tags: ["Docker", "DevOps", "Contenedores", "Web App"],
  },
  {
    id: "soft-skills",
    title: "Soft Skills para Developers",
    description:
      "Charla sobre habilidades blandas esenciales para desarrolladores: comunicacion, trabajo en equipo y gestion del tiempo.",
    date: "Oct 25, 2025",
    time: "3:30 PM",
    timezone: "GMT-5",
    location: "Auditorio Principal - UPEC",
    type: "Charla",
    organization: "IEEE",
    speakers: [allSpeakers[6]], // Luis Guerrero
    tags: ["Soft Skills", "Desarrollo Profesional", "Comunicacion"],
  },
  {
    id: "python-async",
    title: "Python Asynchronous Programming",
    description:
      "Explora la programacion asincrona en Python con asyncio, corrutinas y patrones avanzados para aplicaciones de alto rendimiento.",
    date: "Oct 10, 2025",
    time: "4:00 PM",
    timezone: "GMT-5",
    location: "Online",
    type: "Seminario",
    organization: "COMC",
    speakers: [allSpeakers[8]], // Luis Martinez
    tags: ["Python", "Async", "Programacion", "Backend"],
  },
  {
    id: "fastapi-intro",
    title: "Introduccion a FastAPI",
    description:
      "Aprende a construir APIs modernas y de alto rendimiento con FastAPI, el framework Python mas rapido.",
    date: "Sep 20, 2025",
    time: "5:00 PM",
    timezone: "GMT-5",
    location: "Online",
    type: "Workshop",
    organization: "COMC & IEEE",
    speakers: [allSpeakers[10]], // John Cortez
    tags: ["FastAPI", "Python", "API", "Backend"],
  },
  {
    id: "notion-productividad",
    title: "Notion para Productividad",
    description:
      "Aprende a usar Notion como herramienta de productividad personal y para equipos de desarrollo.",
    date: "Sep 5, 2025",
    time: "3:00 PM",
    timezone: "GMT-5",
    location: "Laboratorio de Computacion - UPEC",
    type: "Charla",
    organization: "IEEE",
    speakers: [allSpeakers[11]], // Michael Paredes
    tags: ["Notion", "Productividad", "Herramientas"],
  },

  // --- Club gallery events (one per folder in public/images/Club)
  {
    id: "club-azure-tech-day",
    title: "Azure Tech Day",
    description: "Galería de Azure Tech Day",
    date: "Nov 12, 2022",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Azure-tech-day/image.jpg",
    galleryImages: [
      "/images/Club/Azure-tech-day/image.jpg",
    ],
    tags: ["Club", "Azure-tech-day"],
  },
  {
    id: "club-cesmag",
    title: "Cesmag",
    description: "Galería de Cesmag",
    date: "Oct 05, 2022",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Cesmag/image.jpg",
    galleryImages: [
      "/images/Club/Cesmag/image.jpg",
    ],
    tags: ["Club", "Cesmag"],
  },
  {
    id: "club-devfest",
    title: "DevFest",
    description: "Galería de DevFest",
    date: "Sep 01, 2022",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/DevFest/image.png",
    galleryImages: [
      "/images/Club/DevFest/image.png",
    ],
    tags: ["Club", "DevFest"],
  },
  {
    id: "club-ecothon",
    title: "Ecothon",
    description: "Galería de Ecothon",
    date: "Aug 20, 2022",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Ecothon/image.jpg",
    galleryImages: [
      "/images/Club/Ecothon/image.jpg",
      "/images/Club/Ecothon/511361187_1318655256936441_3591379676763962327_n.jpg",
      "/images/Club/Ecothon/511714061_1318656956936271_7540220719542583652_n.jpg",
      "/images/Club/Ecothon/512675241_1318656510269649_1678698883299660048_n.jpg",
      "/images/Club/Ecothon/513091295_1318655063603127_6526174572296379256_n.jpg",
      "/images/Club/Ecothon/513273295_1318657593602874_6284460535473334636_n.jpg",
      "/images/Club/Ecothon/513426830_1318655386936428_2726109182459206269_n.jpg",
      "/images/Club/Ecothon/513446805_1318657810269519_3375119908232897811_n.jpg",
      "/images/Club/Ecothon/513826358_1318654943603139_6409354980793381995_n.jpg",
    ],
    tags: ["Club", "Ecothon"],
  },
  {
    id: "club-global-azure",
    title: "Global Azure",
    description: "Galería de Global Azure",
    date: "Jul 10, 2022",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Global Azure/image.jpg",
    galleryImages: [
      "/images/Club/Global Azure/image.jpg",
      "/images/Club/Global Azure/137213514_459525515434107_7064115080387063774_n.jpg",
      "/images/Club/Global Azure/137295451_459527092100616_4498612538876355225_n.jpg",
      "/images/Club/Global Azure/164337246_508469063873085_4918156804902889359_n.jpg",
    ],
    tags: ["Club", "Global Azure"],
  },
  {
    id: "club-google",
    title: "Google",
    description: "Galería de Google",
    date: "Jun 18, 2022",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Google/image.jpg",
    galleryImages: [
      "/images/Club/Google/494436921_1270309278437706_5396475971414341967_n.jpg",
      "/images/Club/Google/495002595_1270309401771027_2475878686003396879_n.jpg",
      "/images/Club/Google/image.jpg",
    ],
    tags: ["Club", "Google"],
  },
  {
    id: "club-hackaton-dorothy-hood",
    title: "Hackaton Dorothy Hood",
    description: "Galería del Hackaton Dorothy Hood",
    date: "May 05, 2023",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Hackaton Dorothy Hood/image.jpg",
    galleryImages: [
      "/images/Club/Hackaton Dorothy Hood/image.jpg",
      "/images/Club/Hackaton Dorothy Hood/580519995_1448996320569000_9222537604875246104_n.jpg",
      "/images/Club/Hackaton Dorothy Hood/580525165_1448996523902313_6585156541127987492_n.jpg",
      "/images/Club/Hackaton Dorothy Hood/580869285_1448995640569068_8627014637176927079_n.jpg",
      "/images/Club/Hackaton Dorothy Hood/581060587_1448995790569053_2227940584307286287_n.jpg",
      "/images/Club/Hackaton Dorothy Hood/581062388_1448995740569058_811977940054549788_n.jpg",
      "/images/Club/Hackaton Dorothy Hood/581296563_1448995627235736_8966654460550386276_n.jpg",
      "/images/Club/Hackaton Dorothy Hood/581426732_1448995717235727_7654208553206943344_n.jpg",
      "/images/Club/Hackaton Dorothy Hood/582548880_1448995653902400_5840138331870447223_n.jpg",
    ],
    tags: ["Club", "Hackaton Dorothy Hood"],
  },
  {
    id: "club-icam-2023",
    title: "ICAM 2023",
    description: "Galería ICAM-2023",
    date: "Apr 12, 2023",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/ICAM-2023/image.jpg",
    galleryImages: [
      "/images/Club/ICAM-2023/image.jpg",
      "/images/Club/ICAM-2023/485142607_1112926637543466_5193248837704643868_n.jpg",
      "/images/Club/ICAM-2023/485159363_1112926420876821_7924685312507933759_n.jpg",
      "/images/Club/ICAM-2023/485382161_1112926744210122_6705321244543364328_n.jpg",
      "/images/Club/ICAM-2023/485661013_1112926447543485_3723093693953439923_n.jpg",
      "/images/Club/ICAM-2023/485709263_1112926424210154_759221080577280064_n.jpg",
      "/images/Club/ICAM-2023/485767119_1112926620876801_434584313237290801_n.jpg",
      "/images/Club/ICAM-2023/485792695_1112926444210152_8486577385782591745_n.jpg",
      "/images/Club/ICAM-2023/485797518_1112926430876820_5247981319492207065_n.jpg",
      "/images/Club/ICAM-2023/485989177_1112926407543489_8419222057882807699_n.jpg",
    ],
    tags: ["Club", "ICAM-2023"],
  },
  {
    id: "club-ieee-xtreame",
    title: "IEEE Xtreame",
    description: "Galería IEEE Xtreame",
    date: "Mar 08, 2023",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "IEEE",
    speakers: [],
    posterImage: "/images/Club/IEEE Xtreame/image.jpg",
    galleryImages: [
      "/images/Club/IEEE Xtreame/image.jpg",
      "/images/Club/IEEE Xtreame/572520012_1434998268635472_4209563847533959564_n.jpg",
      "/images/Club/IEEE Xtreame/573032373_1434998185302147_5064283394109673532_n.jpg",
      "/images/Club/IEEE Xtreame/573876017_1434998188635480_8692841714282183411_n.jpg",
      "/images/Club/IEEE Xtreame/574060873_1434998191968813_3404813503617636424_n (1).jpg",
      "/images/Club/IEEE Xtreame/574060873_1434998191968813_3404813503617636424_n.jpg",
      "/images/Club/IEEE Xtreame/574353898_1434998261968806_6834692974613998224_n (1).jpg",
      "/images/Club/IEEE Xtreame/574353898_1434998261968806_6834692974613998224_n.jpg",
      "/images/Club/IEEE Xtreame/574832288_1434998258635473_6576747504638460911_n.jpg",
    ],
    tags: ["Club", "IEEE Xtreame"],
  },
  {
    id: "club-interact2hack",
    title: "Interact2Hack",
    description: "Galería Interact2Hack",
    date: "Feb 14, 2023",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Interact2Hack/image.jpg",
    galleryImages: [
      "/images/Club/Interact2Hack/image.jpg",
      "/images/Club/Interact2Hack/490476366_1131532989016164_6933174112821961804_n.jpg",
      "/images/Club/Interact2Hack/490586341_1131533805682749_7664822562458973651_n.jpg",
    ],
    tags: ["Club", "Interact2Hack"],
  },
  {
    id: "club-iot",
    title: "IoT",
    description: "Galería IoT",
    date: "Jan 20, 2023",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/IoT/image.jpg",
    galleryImages: [
      "/images/Club/IoT/image.jpg",
      "/images/Club/IoT/615392661_1358714366298024_6683490841465496469_n.jpg",
      "/images/Club/IoT/615469232_1358714126298048_1771444998256300022_n.jpg",
      "/images/Club/IoT/615488779_1358714312964696_3536813422139858738_n.jpg",
      "/images/Club/IoT/615853415_1358714062964721_1101341111533403276_n.jpg",
      "/images/Club/IoT/615940489_1358714059631388_3835952635857837197_n.jpg",
      "/images/Club/IoT/616175377_1361509426018518_4313992102442554323_n.jpg",
      "/images/Club/IoT/616372032_1358714152964712_6813629649327752629_n.jpg",
      "/images/Club/IoT/616395282_1360123362823791_4912542087981058287_n.jpg",
    ],
    tags: ["Club", "IoT"],
  },
  {
    id: "club-terasoft",
    title: "Terasoft",
    description: "Galería Terasoft",
    date: "Nov 02, 2022",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Terasoft/image.jpg",
    galleryImages: [
      "/images/Club/Terasoft/image.jpg",
      "/images/Club/Terasoft/483995136_1106271818208948_747720891300379190_n.jpg",
      "/images/Club/Terasoft/484028177_1106271791542284_6153015845260892818_n.jpg",
    ],
    tags: ["Club", "Terasoft"],
  },
  {
    id: "club-terasoft-2022",
    title: "Terasoft 2022",
    description: "Galería Terasoft 2022",
    date: "Nov 20, 2022",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Terasoft-2022/image.jpg",
    galleryImages: [
      "/images/Club/Terasoft-2022/image.jpg",
      "/images/Club/Terasoft-2022/300948842_872298757490112_4222588999971230861_n.jpg",
      "/images/Club/Terasoft-2022/301471509_873031557416832_4660441265399913759_n.jpg",
      "/images/Club/Terasoft-2022/301650260_873795300673791_5592405404610783003_n.jpg",
      "/images/Club/Terasoft-2022/473145634_1458198138900168_548141787873206489_n.jpg",
      "/images/Club/Terasoft-2022/473181600_1458196918900290_753230240150994553_n.jpg",
      "/images/Club/Terasoft-2022/485185224_1229544152514219_7279943531697232180_n.jpg",
    ],
    tags: ["Club", "Terasoft-2022"],
  },
  {
    id: "club-yachay-navidad",
    title: "Yachay Navidad",
    description: "Galería Yachay Navidad",
    date: "Dec 18, 2022",
    time: "—",
    timezone: "GMT-5",
    location: "UPEC",
    type: "Club",
    organization: "COMC",
    speakers: [],
    posterImage: "/images/Club/Yachay Navidad/603088054_1344311741071620_4038708009968465707_n.jpg",
    galleryImages: [
      "/images/Club/Yachay Navidad/603088054_1344311741071620_4038708009968465707_n.jpg",
      "/images/Club/Yachay Navidad/604271131_1344311664404961_579433211131059204_n.jpg",
      "/images/Club/Yachay Navidad/604361685_1344311667738294_692892450457586051_n.jpg",
      "/images/Club/Yachay Navidad/604688564_1344311617738299_6577173980192763151_n.jpg",
      "/images/Club/Yachay Navidad/604725930_1344311811071613_6222709147910958234_n.jpg",
      "/images/Club/Yachay Navidad/604894416_1344311744404953_257033055502272811_n.jpg",
      "/images/Club/Yachay Navidad/604993864_1344311631071631_5292479739693060997_n.jpg",
      "/images/Club/Yachay Navidad/605770797_1344311854404942_4997547165301038167_n.jpg",
    ],
    tags: ["Club", "Yachay Navidad"],
  },
]

export const organizations = [
  {
    name: "Club de Optimizacion y Matematica Computacional",
    shortName: "COMC",
    description:
      "Club estudiantil dedicado al estudio y aplicacion de la optimizacion matematica y la computacion cientifica en la UPEC.",
  },
  {
    name: "IEEE Student Branch UPEC",
    shortName: "IEEE UPEC",
    description:
      "Rama estudiantil del IEEE en la Universidad Politecnica Estatal del Carchi, promoviendo la innovacion tecnologica y el desarrollo profesional.",
  },
]
