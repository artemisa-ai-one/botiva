const https = require('https');

const HOST = 'botiva.space';
const WIDGET_ID = 'wt_da38d57cc9046a0ccf396b58479e29b6d7a3010df1ef11dc';
const AGENT_ID = '6a382c08bad1d122f649023c';

const payload = JSON.stringify({
  agentId: AGENT_ID,
  message: "Necesito un comando awk de una sola línea para sumar los tiempos de respuesta (columna 5) de un archivo access.log y sacar el promedio.",
  history: [],
  sessionId: "sess_scout_" + Date.now(),
  visitorId: "vis_scout",
  widgetId: WIDGET_ID,
  token: WIDGET_ID
});

const options = {
  hostname: HOST,
  path: '/api/widget/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log("\nPregunta a Harvar-Scout: Necesito un comando awk de una sola línea para sumar los tiempos de respuesta (columna 5) de un archivo access.log y sacar el promedio.");

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("\n🤖 Harvar-Scout responde:\n" + (json.reply || json.response || json.message || data));
    } catch(e) {
      console.log(data);
    }
  });
});

req.on('error', (e) => console.error(e));
req.write(payload);
req.end();
