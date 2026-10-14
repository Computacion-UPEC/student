import type { LucideIcon } from "lucide-react"
import { Bot, Cloud, Code2, Cpu, Database, Globe2, Layers3, Network, ShieldCheck, Sparkles } from "lucide-react"

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
  logoUrl: string
  /** Full-color logo shown as-is on a white tile instead of a white silhouette. */
  colorLogo?: boolean
  extraLinks: { label: string; url: string }[]
}

const icon = (name: string) => `https://cdn.simpleicons.org/${name}`

export const communities: Community[] = [
  { id: "aws", name: "AWS Community Ecuador", category: "Cloud & DevOps", description: "Aprende cloud, arquitectura, datos y DevOps junto a builders y comunidades locales.", initials: "AWS", color: "#e87519", icon: Cloud, logoUrl: "/images/communities/aws.png", joinUrl: "https://awsugecuador.com", ambassadorUrl: "https://aws.amazon.com/developer/community/community-builders/", collaborateUrl: "https://aws.amazon.com/events/", opportunities: "Cloud, DevOps y datos", extraLinks: [{ label: "Instagram Ecuador AWS", url: "https://instagram.com/ecuadoraws" }] },
  { id: "google", name: "Google Developer Groups", category: "Desarrollo & IA", description: "Conecta con desarrolladores, participa en eventos y construye proyectos con tecnologías Google.", initials: "GDG", color: "#4285f4", icon: Globe2, logoUrl: "/images/communities/gdg.png", colorLogo: true, joinUrl: "https://gdg.community.dev/", ambassadorUrl: "https://developers.google.com/community/gdsc", collaborateUrl: "https://developers.google.com/community", opportunities: "Android, web e IA", extraLinks: [{ label: "Discord Google", url: "https://discord.gg/HJV29A3bf" }] },
  { id: "azure", name: "Microsoft Azure", category: "Cloud & Datos", description: "Explora Azure, inteligencia artificial, seguridad y soluciones empresariales en la nube.", initials: "AZ", color: "#0078d4", icon: Network, logoUrl: "/images/communities/microsoft.png", colorLogo: true, joinUrl: "https://developer.microsoft.com/en-us/community/", ambassadorUrl: "https://mvp.microsoft.com/es-ES/studentambassadors", collaborateUrl: "https://developer.microsoft.com/en-us/community/", opportunities: "Cloud, seguridad y datos", extraLinks: [{ label: "Discord Microsoft Ambassadors", url: "https://discord.gg/RzE7HaSN" }] },
  { id: "ieee", name: "IEEE Student Branch", category: "Tecnología & Liderazgo", description: "Forma parte de una red global de estudiantes, profesionales y proyectos de innovación.", initials: "IEEE", color: "#00629b", icon: ShieldCheck, logoUrl: icon("ieee"), joinUrl: "https://www.ieee.org/membership/join/", ambassadorUrl: "https://students.ieee.org/", collaborateUrl: "https://www.ieee.org/about/volunteers/", opportunities: "Investigación y liderazgo", extraLinks: [{ label: "Instagram IEEE Students EC", url: "https://instagram.com/ieee_students_ec" }] },
  { id: "supabase", name: "Supabase Community", category: "Backend & Datos", description: "Construye productos con Postgres, autenticación, APIs y tiempo real con una comunidad open source.", initials: "SB", color: "#3ecf8e", icon: Database, logoUrl: icon("supabase"), joinUrl: "https://supabase.com/community", ambassadorUrl: "https://supabase.com/partners", collaborateUrl: "https://github.com/supabase", opportunities: "Backend, Postgres y APIs", extraLinks: [] },
  { id: "flutter", name: "Flutter Community", category: "Apps & UI", description: "Crea aplicaciones multiplataforma y comparte componentes, experiencias y proyectos.", initials: "FL", color: "#02569b", icon: Code2, logoUrl: icon("flutter"), joinUrl: "https://flutter.dev/community", ambassadorUrl: "https://developers.google.com/community/gdg", collaborateUrl: "https://github.com/flutter", opportunities: "Mobile y frontend", extraLinks: [] },
  { id: "github", name: "GitHub Community", category: "Open Source", description: "Colabora en proyectos open source, mejora tu portafolio y aprende con otros developers.", initials: "GH", color: "#24292f", icon: Layers3, logoUrl: icon("github"), joinUrl: "https://github.com/community", ambassadorUrl: "https://education.github.com/pack", collaborateUrl: "https://github.com/explore", opportunities: "Open source y colaboración", extraLinks: [] },
  { id: "kubernetes", name: "Kubernetes Community", category: "Cloud Native", description: "Aprende contenedores, orquestación e infraestructura moderna con la comunidad cloud native.", initials: "K8s", color: "#326ce5", icon: Cpu, logoUrl: icon("kubernetes"), joinUrl: "https://community.cncf.io/kubernetes/", ambassadorUrl: "https://www.cncf.io/people/ambassadors/", collaborateUrl: "https://github.com/kubernetes", opportunities: "Containers y platform engineering", extraLinks: [] },
  { id: "cursor", name: "Cursor Community", category: "IA para programar", description: "Aprende a programar con IA, comparte flujos de trabajo y participa en meetups y talleres de Cursor.", initials: "CR", color: "#111111", icon: Bot, logoUrl: icon("cursor"), joinUrl: "https://forum.cursor.com/", ambassadorUrl: "https://cursor.com/campus-leads", collaborateUrl: "https://luma.com/cursorcommunity", opportunities: "IA aplicada al desarrollo", extraLinks: [{ label: "Discord Cursor", url: "https://discord.gg/cursor" }, { label: "Cursor Ambassadors", url: "https://cursor.com/ambassadors" }] },
  { id: "claude", name: "Claude Community", category: "IA & Agentes", description: "Construye con Claude, crea agentes y únete a clubes estudiantiles de IA con apoyo de Anthropic.", initials: "CL", color: "#d97757", icon: Sparkles, logoUrl: icon("claude"), joinUrl: "https://claude.com/community", ambassadorUrl: "https://claude.com/programs/campus", collaborateUrl: "https://claude.com/community", opportunities: "IA, agentes y APIs", extraLinks: [] },
]
