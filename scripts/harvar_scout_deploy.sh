#!/bin/bash
# Script para desplegar o recuperar a Harvar-Scout desde la API de Botiva

API_KEY="afapi_c65b6786209e30bcb2279648e28d052853869a7b0c96b4c7d79fb6707636a699"
URL_BASE="https://api-rest-agent-flow-528082765109.europe-west1.run.app/api/v1"

echo "Verificando si Harvar-Scout ya existe..."
AGENT_ID="6a382c08bad1d122f649023c"

# Intentamos actualizar el agente directamente para asegurar que sus instrucciones estén intactas
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$URL_BASE/agents/$AGENT_ID" \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: $API_KEY" \
  -d '{"name": "Harvar-Scout", "model": "vx/gemini-3.5-flash", "systemPrompt": "Eres el sub-agente técnico de Harvar. Tu trabajo es asistir a Harvar analizando logs, generando expresiones regulares, comandos bash y fragmentos de código. Responde de manera cruda, ultra-concisa, solo con el código o dato exacto solicitado. Cero saludos, cero despedidas, cero explicaciones innecesarias. Harvar no tiene tiempo que perder."}')

if [ "$HTTP_STATUS" == "200" ]; then
    echo "¡Harvar-Scout confirmado y actualizado (ID: $AGENT_ID)!"
else
    echo "Agente no encontrado o error (HTTP $HTTP_STATUS). Se recomienda crearlo desde cero."
fi

echo "Widget Token asignado: wt_da38d57cc9046a0ccf396b58479e29b6d7a3010df1ef11dc"
