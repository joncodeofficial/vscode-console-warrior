#!/bin/bash

# Verificar argumentos
if [ $# -lt 1 ]; then
    echo "Uso: $0 <version>"
    echo "Ejemplo: $0 1.2.3"
    exit 1
fi

ARCHIVO="./dist/plugins/vitePlugin.js"
TEXTO_BUSCAR="jonpena.console-warrior-logs-"
VERSION="$1"

# Verificar si el archivo existe
if [ ! -f "$ARCHIVO" ]; then
    echo "Error: El archivo '$ARCHIVO' no existe"
    exit 1
fi

# Buscar y reemplazar usando sed (compatible con macOS)
sed -i '' "s/${TEXTO_BUSCAR}/${TEXTO_BUSCAR}${VERSION}\/dist\/injectionCode.js/g" "$ARCHIVO"
# ...existing code...
# ...existing code...

# Mostrar líneas modificadas
echo -e "\nLíneas modificadas:"
grep -n "${TEXTO_BUSCAR} ${VERSION}" "$ARCHIVO" || echo "No se encontraron coincidencias"