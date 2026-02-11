export interface Speaker {
  name: string
  title: string
  photo: string
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
    speakers: [
      {
        name: "Anthony Quiranza",
        title: "CEO & Founder @Cloudsofts | Software Developer @UPEC",
        photo: "/images/image.png",
        linkedin: "https://linkedin.com/in/anthonyquiranza",
        github: "https://github.com/anthonyquiranza",
        website: "https://cloudsofts.com",
      },
    ],
    tags: ["AI", "OpenClaw", "GitHub Copilot", "Agentes Autonomos"],
  },
  {
    id: "intro-optimizacion-lineal",
    title: "Introduccion a la Optimizacion Lineal",
    description:
      "Taller introductorio sobre los fundamentos de la optimizacion lineal, metodo simplex y sus aplicaciones en problemas reales de ingenieria y ciencias de la computacion.",
    date: "Ene 25, 2026",
    time: "4:00 PM",
    timezone: "GMT-5",
    location: "Laboratorio de Computacion - UPEC",
    type: "Charla",
    organization: "COMC",
    speakers: [
      {
        name: "Maria Fernanda Lopez",
        title: "Docente de Matematicas Aplicadas @UPEC",
        photo: "/speakers/maria-lopez.jpg",
        linkedin: "https://linkedin.com/in/mariaflopez",
      },
    ],
    tags: ["Optimizacion", "Matematicas", "Simplex", "Programacion Lineal"],
  },
  {
    id: "machine-learning-basics",
    title: "Machine Learning: De la Teoria a la Practica",
    description:
      "Seminario sobre los conceptos fundamentales de Machine Learning con demostraciones practicas usando Python y scikit-learn. Desde regresion lineal hasta redes neuronales basicas.",
    date: "Dic 10, 2025",
    time: "3:00 PM",
    timezone: "GMT-5",
    location: "Auditorio Principal - UPEC",
    type: "Seminario",
    organization: "IEEE",
    speakers: [
      {
        name: "Carlos Andres Mena",
        title: "Data Scientist @TechCorp | IEEE Member",
        photo: "/speakers/carlos-mena.jpg",
        linkedin: "https://linkedin.com/in/carlosmena",
        github: "https://github.com/carlosmena",
      },
    ],
    tags: ["Machine Learning", "Python", "scikit-learn", "IA"],
  },
  {
    id: "hackathon-innovacion-2025",
    title: "Hackathon de Innovacion Tecnologica 2025",
    description:
      "Primer Hackathon organizado por el COMC y IEEE Student Branch UPEC. 24 horas de desarrollo de soluciones tecnologicas para problemas de la comunidad local.",
    date: "Nov 15, 2025",
    time: "8:00 AM",
    timezone: "GMT-5",
    location: "Campus UPEC - Edificio de Ingenieria",
    type: "Hackathon",
    organization: "COMC & IEEE",
    speakers: [
      {
        name: "Diego Ruiz",
        title: "Full Stack Developer @StartupEC | Mentor",
        photo: "/speakers/diego-ruiz.jpg",
        linkedin: "https://linkedin.com/in/diegoruiz",
        github: "https://github.com/diegoruiz",
        website: "https://diegoruiz.dev",
      },
      {
        name: "Laura Castillo",
        title: "UX Designer @DesignStudio | IEEE UPEC",
        photo: "/speakers/laura-castillo.jpg",
        linkedin: "https://linkedin.com/in/lauracastillo",
        website: "https://lauracastillo.design",
      },
    ],
    tags: ["Hackathon", "Innovacion", "Desarrollo", "Comunidad"],
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
