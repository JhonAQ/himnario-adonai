#!/usr/bin/env bash
if [ -z "$(git status --porcelain)" ]; then
  echo "No hay cambios para commitear."
  exit 0
fi

git add -A
git commit -m "Hymns correction in progress.. this commit its automatically generated"