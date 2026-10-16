// Rol de TI según el título del cargo, no según la carrera aceptada: muchos cargos administrativos
// aceptan "Sistemas" entre varias carreras sin ser de TI. Lo usan export-celec.mjs y collect-petroecuador.mjs.
export const IT_ROLE = /tecnolog[ií]as? de (la )?informaci[oó]n|\bTICS?\b|inform[aá]tic|software|desarrollador|programador|ciberseguridad|seguridad de la informaci[oó]n|base de datos|redes y comunicaciones|telecomunicaciones|soporte t[eé]cnico|servicios tecnol[oó]gicos|infraestructura tecnol[oó]gica|analista de aplicaciones/i

export const isITRole = (title) => IT_ROLE.test(title)
