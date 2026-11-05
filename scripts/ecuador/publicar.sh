#!/usr/bin/env bash
# Recolecta las fuentes que rechazan servidores fuera de Ecuador y publica los cambios con un PR (que se fusiona cuando
# pasa el check de Vercel). Desde GitHub Actions estas fuentes no responden (se agota el tiempo de conexión):
#   - CNT EP (CNT Empleo)
#   - Educa Empleo (Ministerio de Educación)
#   - Netlife (portal de TalentRoom), con el recolector de empresas privadas en modo --ecuador
#
# Corre en el runner propio de COMPUMAX-EC/oportunidades-runner (en un computador en Ecuador) a las 08:20 y 18:20, o a
# mano con scripts/cnt/tarea-windows.cmd. No toca nada si el repositorio tiene cambios sin guardar, y al terminar vuelve
# a la rama en la que estaba. Si una fuente falla, las demás igual se publican y el script termina con error.
# Uso (Git Bash, desde cualquier carpeta):  bash scripts/ecuador/publicar.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

if [ -n "$(git status --porcelain)" ]; then
  echo "El repositorio tiene cambios sin guardar: no se publica nada." >&2
  exit 1
fi

original=$(git rev-parse --abbrev-ref HEAD)
trap 'git checkout -q "$original" 2>/dev/null || true' EXIT
git checkout -q main
git pull -q --ff-only

fallas=()
node scripts/cnt/collect.mjs || fallas+=(CNT)
if node scripts/educa-empleo/collect.mjs; then educa=success; else educa=failure; fallas+=(Educa-Empleo); fi
node scripts/record-status.mjs "Educa-Empleo=$educa"
# Netlife se lee con el navegador sin interfaz del recolector de Petroecuador (Chrome del computador)
(cd scripts/petroecuador && { [ -d node_modules ] || npm ci --no-audit --no-fund --silent; })
PW_CHANNEL=${PW_CHANNEL:-chrome} node scripts/private/collect.mjs --ecuador || fallas+=(Netlife)

DATOS=(lib/data/cnt-jobs.json lib/data/educa-empleo.json lib/data/private-jobs.json lib/data/scrape-status.json)
if git diff --quiet -- "${DATOS[@]}"; then
  echo "Ecuador: sin cambios, no hace falta un PR."
else
  stamp=$(date +%Y-%m-%d-%H%M)
  branch="data/ecuador-$stamp"
  git checkout -q -b "$branch"
  git add "${DATOS[@]}"
  git commit -q -m "Update CNT, Educa Empleo and Netlife jobs ($stamp)"
  git push -q -u origin "$branch"
  gh pr create --base main --head "$branch" --title "Update CNT, Educa Empleo and Netlife jobs ($stamp)" \
    --body "Recolectado en un computador en Ecuador con \`scripts/ecuador/publicar.sh\` (estos portales rechazan las conexiones desde GitHub Actions)."

  # Se fusiona solo si el despliegue de Vercel pasa; si falla, el PR queda abierto para revisarlo
  # Vercel encola sus builds y tarda en registrar su check: se espera a que aparezca (hasta ~15 min)
  for _ in $(seq 1 60); do
    sleep 15
    gh pr checks "$branch" 2>&1 | grep -q "no checks reported" || break
  done
  if gh pr checks "$branch" --watch --interval 20; then
    gh pr merge "$branch" --merge --delete-branch
    echo "Ecuador: PR fusionado."
  else
    echo "Ecuador: el check de Vercel falló; el PR $branch queda abierto." >&2
    exit 1
  fi
  git checkout -q main
  git pull -q --ff-only
fi

if [ ${#fallas[@]} -gt 0 ]; then
  echo "Ecuador: fallaron ${fallas[*]}." >&2
  exit 1
fi
