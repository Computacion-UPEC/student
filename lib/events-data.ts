export interface Speaker {
  name: string
  title: string
  topic: string
  image?: string
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
  type: "Workshop" | "Charla" | "Hackathon" | "Seminario" | "Meetup"
  organization: "COMC" | "IEEE" | "COMC & IEEE"
  speakers: Speaker[]
  posterImage?: string
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
    linkedin: "https://www.linkedin.com/in/angelobenavidesa/",
    github: "https://github.com/AngeloAlexanderBenavides",
    website: "https://angeloalexanderbenavides.github.io/",
  },
  {
    name: "Edison Lopez",
    title: "Developer",
    topic: "Fundamentos HTML",
    image: "/images/speakers/edison.png",
    linkedin: "https://www.linkedin.com/in/edison-l%C3%B3pez-6b69b4343/",
  },
  {
    name: "Geovanny Basantes",
    title: "Developer",
    topic: "API Development",
    image: "/images/speakers/Geovany.png",
    linkedin: "https://www.linkedin.com/in/geovanny-basantes-0471b123a/",
    github: "https://github.com/COMPUMAX-EC",
    website: "https://geobas.compumax.tech/",
  },
  {
    name: "Erika Delgado",
    title: "Developer",
    topic: "API Development",
    image: "/images/speakers/Erika.png",
    linkedin: "https://www.linkedin.com/in/erika-delgado-30113a380/",
  },
  {
    name: "Luis Valverde",
    title: "Developer",
    topic: "Git - Github",
    image: "/images/speakers/Luis.png",
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
    linkedin: "https://www.linkedin.com/in/ilukas/",
  },
  {
    name: "Cristian Baraja",
    title: "Developer",
    topic: "Web App with Docker",
    image: "/images/speakers/composite.jpg",
    linkedin: "https://www.linkedin.com/in/cristian-baraja-85a9a129a/",
    github: "https://github.com/baraja-cristian",
  },
  {
    name: "Luis Martinez",
    title: "Developer",
    topic: "Python Asynchronous",
    image: "/images/speakers/Frame 26.png",
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
    linkedin: "https://www.linkedin.com/in/john-cortes-pozo/",
    website: "https://johncp.dev/",
  },
  {
    name: "Michael Paredes",
    title: "Developer",
    topic: "Notion",
    image: "/images/speakers/Michael.png",
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
