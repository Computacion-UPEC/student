// Cuentas oficiales de las instituciones con vacantes en Oportunidades, para seguirlas y conocer su entorno.
// Cada enlace sale del pie de página del sitio oficial de la institución (verificado en octubre de 2026); no se
// incluyen cuentas de agencias de marketing que aparecen en algunos pies de página.
// "authorities" es la página oficial de autoridades o gobierno corporativo, cuando la institución la publica.

export type SocialNetwork = "LinkedIn" | "X" | "Facebook" | "Instagram" | "YouTube" | "TikTok"

export type InstitutionSocials = {
  id: string
  name: string
  sector: "Energía" | "Telecomunicaciones" | "Sector público" | "Financiero" | "Software"
  website: string
  authorities?: string
  accounts: Partial<Record<SocialNetwork, string>>
}

export const institutionSocials: InstitutionSocials[] = [
  { id: "celec", name: "CELEC EP", sector: "Energía", website: "https://www.celec.gob.ec", authorities: "https://www.celec.gob.ec/autoridades/", accounts: { X: "https://twitter.com/CELECEPOficial", Facebook: "https://www.facebook.com/CELEC.GOB.EC/" } },
  { id: "petroecuador", name: "EP Petroecuador", sector: "Energía", website: "https://www.eppetroecuador.ec", accounts: { X: "https://twitter.com/eppetroecuador", Facebook: "https://www.facebook.com/PetroecuadorEP/", YouTube: "https://www.youtube.com/user/petroecuadorEP" } },
  { id: "cnt", name: "CNT EP", sector: "Telecomunicaciones", website: "https://www.cnt.com.ec", accounts: { LinkedIn: "https://www.linkedin.com/company/cnt-ecuador/", X: "https://twitter.com/CNT_EC", Facebook: "https://www.facebook.com/CNTEcuador", Instagram: "https://www.instagram.com/cnt.ec/", YouTube: "https://www.youtube.com/channel/UCWUe62T_Lmuk76bILKMRhTw" } },
  { id: "inec", name: "INEC", sector: "Sector público", website: "https://www.ecuadorencifras.gob.ec", accounts: { X: "https://twitter.com/ecuadorencifras", Facebook: "https://www.facebook.com/InecEcuador", YouTube: "https://www.youtube.com/user/INECEcuador" } },
  { id: "sri", name: "SRI", sector: "Sector público", website: "https://www.sri.gob.ec", accounts: { X: "https://twitter.com/SRIoficialEc", Facebook: "https://www.facebook.com/SRIoficialECUADOR/", YouTube: "https://www.youtube.com/user/sricomunicacion" } },
  { id: "ecu911", name: "ECU 911", sector: "Sector público", website: "https://www.ecu911.gob.ec", authorities: "https://www.ecu911.gob.ec/autoridades/", accounts: { X: "https://twitter.com/ECU911_", Facebook: "https://www.facebook.com/ECU911/", YouTube: "https://www.youtube.com/user/911ecuador" } },
  { id: "registro-civil", name: "Registro Civil", sector: "Sector público", website: "https://www.registrocivil.gob.ec", accounts: { X: "https://twitter.com/registrocivilec", Facebook: "https://www.facebook.com/registrocivilec", YouTube: "https://www.youtube.com/user/registrocivilecuado" } },
  { id: "pichincha", name: "Banco Pichincha", sector: "Financiero", website: "https://www.pichincha.com", accounts: { LinkedIn: "https://www.linkedin.com/company/banco-pichincha-ca", X: "https://twitter.com/BancoPichincha", Facebook: "https://www.facebook.com/BancoPichinchaEcuador/", Instagram: "https://www.instagram.com/bancopichincha/", TikTok: "https://www.tiktok.com/@bancopichincha", YouTube: "https://www.youtube.com/user/BancoPichinchaCA" } },
  { id: "produbanco", name: "Produbanco", sector: "Financiero", website: "https://www.produbanco.com.ec", authorities: "https://www.produbanco.com.ec/quienes-somos/gobierno-corporativo/", accounts: { LinkedIn: "https://www.linkedin.com/company/produbanco", Facebook: "https://www.facebook.com/Produbanco", Instagram: "https://www.instagram.com/produbancoec", TikTok: "https://www.tiktok.com/@produbancoec", YouTube: "https://www.youtube.com/user/ProdubancoEC" } },
  { id: "banecuador", name: "BanEcuador", sector: "Financiero", website: "https://www.banecuador.fin.ec", authorities: "https://www.banecuador.fin.ec/historia-banecuador/nuestras-autoridades/", accounts: { LinkedIn: "https://www.linkedin.com/company/banecuador-oficial", X: "https://twitter.com/BanEcuadorBP", Facebook: "https://www.facebook.com/BanEcuador", Instagram: "https://www.instagram.com/banecuador_bp/", TikTok: "https://www.tiktok.com/@banecuadorbp", YouTube: "https://www.youtube.com/channel/UCeK0QR_s_njFFjE6LGZtoyg" } },
  { id: "jep", name: "Cooperativa JEP", sector: "Financiero", website: "https://www.jep.coop", authorities: "https://www.jep.coop/la-jep/institucion/equipo-administrativo", accounts: { X: "https://twitter.com/CooperativaJEP", Facebook: "https://www.facebook.com/coopjep", Instagram: "https://www.instagram.com/cooperativa_jep", YouTube: "https://www.youtube.com/user/cooperativajep" } },
  { id: "tulcan", name: "Cooperativa Tulcán", sector: "Financiero", website: "https://www.cooptulcan.fin.ec", accounts: { LinkedIn: "https://www.linkedin.com/company/cooperativa-de-ahorro-y-crédito-tulcán/", X: "https://twitter.com/cooptulcan", Facebook: "https://www.facebook.com/CoopTulcanEc", Instagram: "https://www.instagram.com/cooptulcan/" } },
  { id: "devsu", name: "Devsu", sector: "Software", website: "https://devsu.com", accounts: { LinkedIn: "https://www.linkedin.com/company/devsu/", X: "https://x.com/devsullc", Facebook: "https://www.facebook.com/DevsuSoftware/", Instagram: "https://www.instagram.com/devsullc/", YouTube: "https://www.youtube.com/@DevsuLLC" } },
  { id: "stackbuilders", name: "Stack Builders", sector: "Software", website: "https://www.stackbuilders.com", accounts: { LinkedIn: "https://www.linkedin.com/company/stack-builders/", X: "https://x.com/StackBuilders/", Facebook: "https://www.facebook.com/stackbuildersinc/" } },
]
