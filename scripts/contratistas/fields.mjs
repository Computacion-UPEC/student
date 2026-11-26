// Campos de trabajo de los contratistas: los usan collect.mjs y links.mjs.
// Campos de trabajo que suelen subcontratarse y en los que cabe un perfil de Computación o afín
export const FIELDS = [
  ["Telecomunicaciones", /telecomunicaci|fibra [oó]ptica|radioenlace|enlaces? de (datos|comunicaci)|networking|redes? (de datos|lan|wan|inal[aá]mbrica)|\bswitch|antenas?|microondas|telefon[ií]a ip|cableado estructurado/i],
  ["Automatización y control", /\bscada\b|\bplc\b|automatizaci|sistemas? de control|instrumentaci|telemetr|\bdcs\b|protecciones el[eé]ctricas|medidores inteligentes|\bami\b/i],
  ["TI y software", /software|licenciamiento|licencias? (de )?(software|uso|antivirus|microsoft|oracle|vmware|sap)|plataforma tecnol|sistema inform[aá]tico|servidor(es)?(?! p[uú]blic)|data ?center|centro de datos|ciberseguridad|firewall|almacenamiento|respaldo|nube|equipos? inform[aá]tic|computador|soporte t[eé]cnico|desarrollo de (sistema|aplicaci)|base de datos|hiperconverg|virtualizaci/i],
  ["Seguridad industrial y electrónica", /seguridad industrial|contra ?incendios?|detecci[oó]n de (gas|incendio)|cctv|videovigilancia|c[aá]maras de seguridad|control de acceso|alarmas?/i],
  ["Mantenimiento electromecánico", /mantenimiento.{0,60}(el[eé]ctric|electr[oó]nic|electromec|generador|turbina|transformador|\bups\b|subestaci|motores?|bombas?|tableros?|precisi[oó]n)/i],
]
export const EXCLUDE = /publicidad|agencia de (publicidad|medios)|comunicaci[oó]n audiovisual|cargadora|cabezal|calibraci[oó]n de tanques|bombas sumergibles|equipos de protecci[oó]n personal|alimentaci|transporte|licencia ambiental|impacto ambiental|catering|limpieza|uniformes?|veh[ií]cul|combustible|seguros? de|p[oó]liza|arrendamiento|pasajes|vigilancia y seguridad f[ií]sica|guardian[ií]a|obra civil|asfalt|papeler[ií]a|silla|mobiliario/i

/** Campos de un proceso según su descripción (vacío si es un servicio que no nos interesa). */
export const fieldsOf = (text) => EXCLUDE.test(text) ? [] : FIELDS.filter(([, regex]) => regex.test(text)).map(([name]) => name)

/** Campo en el que la empresa ganó más contratos: su producto o servicio principal ante las operadoras. */
export function mainField(contracts) {
  const counts = new Map()
  for (const contract of contracts) for (const field of fieldsOf(contract.description)) counts.set(field, (counts.get(field) ?? 0) + 1 + contract.amount / 1e7)
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}
