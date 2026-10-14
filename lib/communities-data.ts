import type { LucideIcon } from "lucide-react"
import { Cloud, Code2, Cpu, Database, Globe2, Layers3, Network, ShieldCheck } from "lucide-react"

export type Community = {
  id: string
  name: string
  category: string
  description: string
  initials: string
  color: string
  icon: LucideIcon
  joinUrl: string
  ambassadorUrl: string
  collaborateUrl: string
  opportunities: string
}

export const communities: Community[] = [
  { id: "aws", name: "AWS Community", category: "Cloud & DevOps", description: "Aprende cloud, arquitectura, datos y DevOps junto a builders y comunidades locales.", initials: "AWS", color: "#e87519", icon: Cloud, joinUrl: "https://builder.aws.com/community", ambassadorUrl: "https://aws.amazon.com/developer/community/community-builders/", collaborateUrl: "https://aws.amazon.com/events/", opportunities: "Cloud, DevOps y datos" },
  { id: "google", name: "Google Developer Groups", category: "Desarrollo & IA", description: "Conecta con desarrolladores, participa en eventos y construye proyectos con tecnologías Google.", initials: "GDG", color: "#4285f4", icon: Globe2, joinUrl: "https://gdg.community.dev/", ambassadorUrl: "https://developers.google.com/community/gdsc", collaborateUrl: "https://developers.google.com/community", opportunities: "Android, web e IA" },
  { id: "azure", name: "Microsoft Azure", category: "Cloud & Datos", description: "Explora Azure, inteligencia artificial, seguridad y soluciones empresariales en la nube.", initials: "AZ", color: "#0078d4", icon: Network, joinUrl: "https://developer.microsoft.com/en-us/community/", ambassadorUrl: "https://mvp.microsoft.com/", collaborateUrl: "https://developer.microsoft.com/en-us/community/", opportunities: "Cloud, seguridad y datos" },
  { id: "ieee", name: "IEEE Student Branch", category: "Tecnología & Liderazgo", description: "Forma parte de una red global de estudiantes, profesionales y proyectos de innovación.", initials: "IEEE", color: "#00629b", icon: ShieldCheck, joinUrl: "https://www.ieee.org/membership/join/", ambassadorUrl: "https://students.ieee.org/", collaborateUrl: "https://www.ieee.org/about/volunteers/", opportunities: "Investigación y liderazgo" },
  { id: "supabase", name: "Supabase Community", category: "Backend & Datos", description: "Construye productos con Postgres, autenticación, APIs y tiempo real con una comunidad open source.", initials: "SB", color: "#3ecf8e", icon: Database, joinUrl: "https://supabase.com/community", ambassadorUrl: "https://supabase.com/partners", collaborateUrl: "https://github.com/supabase", opportunities: "Backend, Postgres y APIs" },
  { id: "flutter", name: "Flutter Community", category: "Apps & UI", description: "Crea aplicaciones multiplataforma y comparte componentes, experiencias y proyectos.", initials: "FL", color: "#02569b", icon: Code2, joinUrl: "https://flutter.dev/community", ambassadorUrl: "https://developers.google.com/community/gdg", collaborateUrl: "https://github.com/flutter", opportunities: "Mobile y frontend" },
  { id: "github", name: "GitHub Community", category: "Open Source", description: "Colabora en proyectos open source, mejora tu portafolio y aprende con otros developers.", initials: "GH", color: "#24292f", icon: Layers3, joinUrl: "https://github.com/community", ambassadorUrl: "https://education.github.com/pack", collaborateUrl: "https://github.com/explore", opportunities: "Open source y colaboración" },
  { id: "kubernetes", name: "Kubernetes Community", category: "Cloud Native", description: "Aprende contenedores, orquestación e infraestructura moderna con la comunidad cloud native.", initials: "K8s", color: "#326ce5", icon: Cpu, joinUrl: "https://community.cncf.io/kubernetes/", ambassadorUrl: "https://www.cncf.io/people/ambassadors/", collaborateUrl: "https://github.com/kubernetes", opportunities: "Containers y platform engineering" },
]
