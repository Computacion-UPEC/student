#!/usr/bin/env bash
# Se mantiene por compatibilidad (el runner de COMPUMAX-EC/oportunidades-runner y tarea-windows.cmd lo llaman):
# ahora publica todas las fuentes que solo responden desde Ecuador (CNT, Educa Empleo y Netlife).
exec bash "$(dirname "$0")/../ecuador/publicar.sh" "$@"
