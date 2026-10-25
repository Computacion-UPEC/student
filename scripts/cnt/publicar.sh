#!/usr/bin/env bash
# Recolecta las vacantes de CNT EP y publica los cambios con un PR (que se fusiona cuando pasa el check de Vercel).
#
# CNT Empleo rechaza las conexiones desde GitHub Actions, así que este script corre en un computador en Ecuador
# (tarea-windows.cmd en el Programador de tareas, o la tarea nocturna de BecasChamba). No toca nada si el repositorio tiene cambios sin guardar, y al terminar vuelve a
# la rama en la que estaba.
# Uso (Git Bash, desde cualquier carpeta):  bash scripts/cnt/publicar.sh
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

node scripts/cnt/collect.mjs
if git diff --quiet -- lib/data/cnt-jobs.json; then
  echo "CNT: sin cambios, no hace falta un PR."
  exit 0
fi

stamp=$(date +%Y-%m-%d-%H%M)
branch="data/cnt-$stamp"
git checkout -q -b "$branch"
git add lib/data/cnt-jobs.json
git commit -q -m "Update CNT jobs ($stamp)"
git push -q -u origin "$branch"
gh pr create --base main --head "$branch" --title "Update CNT jobs ($stamp)" \
  --body "Vacantes de CNT Empleo recolectadas en un computador en Ecuador con \`scripts/cnt/publicar.sh\` (el portal rechaza las conexiones desde GitHub Actions)."

# Se fusiona solo si el despliegue de Vercel pasa; si falla, el PR queda abierto para revisarlo
# Vercel encola sus builds y tarda en registrar su check: se espera a que aparezca (hasta ~15 min)
for _ in $(seq 1 60); do
  sleep 15
  gh pr checks "$branch" 2>&1 | grep -q "no checks reported" || break
done
if gh pr checks "$branch" --watch --interval 20; then
  gh pr merge "$branch" --merge --delete-branch
  echo "CNT: PR fusionado."
else
  echo "CNT: el check de Vercel falló; el PR $branch queda abierto." >&2
  exit 1
fi
git checkout -q main
git pull -q --ff-only
