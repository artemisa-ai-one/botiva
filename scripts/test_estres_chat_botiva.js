const https = require('https');

const HOST = 'botiva.space';
const WIDGET_ID = 'wt_fc75ddb5253e192e0611a1d88257ab038c9edcb0e680ea62';
const AGENT_ID = '69d5084c78e0af3d5536fe95';

// 10 preguntas complejas diseñadas para estresar al agente "Carlos" de Apex Motors:
// - Obligan a buscar en su base de conocimiento (RAG).
// - Obligan a hacer comparaciones de datos.
// - Obligan a calcular planes de financiación.
// - Obligan a usar diferentes tonos o intenciones (compras, quejas, cotizaciones).
const questions = [
  "Quiero agendar una prueba de manejo para el Ford Mustang GT 5.0 para mañana a las 3 PM, ¿está disponible?",
  "¿Tienen pastillas de freno Brembo cerámicas y discos ventilados compatibles con un BMW M3 2021?",
  "Si doy un 30% de pie para el Mercedes Benz C300 AMG, ¿cuáles son mis opciones de financiamiento a 60 meses?",
  "Explícame en detalle qué cubre y qué no cubre la garantía post-venta de 12 meses en la transmisión.",
  "Necesito importar un motor completo para un Audi R8, ¿ustedes hacen pedidos especiales de alto rendimiento?",
  "¿Aceptan mi Toyota Corolla 2019 en parte de pago para comprar el BMW Serie 4 Coupe M?",
  "Tengo un problema urgente: mi batería AGM falló. ¿Tienen envíos nacionales inmediatos a Medellín?",
  "Compara detalladamente el rendimiento, motor y consumo del Ford Mustang GT versus el Mercedes Benz C300 AMG.",
  "¿Cómo funciona exactamente el descuento en mano de obra en el taller si compro amortiguadores regulables con ustedes?",
  "Quiero una cotización al por mayor: 4 llantas deportivas, un kit de embrague y filtros de alto grado para una Hilux."
];

let completed = 0;
const startTotal = Date.now();

console.log("🚀 Iniciando prueba de estrés: 10 chats concurrentes (10 peticiones/segundo)...");
console.log("Agente objetivo: Carlos (Asesor Taller / Apex Motors)\n");

questions.forEach((q, index) => {
  // Simulamos 10 usuarios/sesiones totalmente distintas al mismo milisegundo
  const sessionId = "stress_sess_" + Date.now() + "_" + index;
  const visitorId = "stress_vis_" + Date.now() + "_" + index;

  const payload = JSON.stringify({
    agentId: AGENT_ID,
    message: q,
    history: [],
    sessionId: sessionId,
    visitorId: visitorId,
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

  const start = Date.now();
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      const elapsed = Date.now() - start;
      let replyText = "[Error procesando respuesta]";
      try {
        const json = JSON.parse(data);
        replyText = json.reply || json.response || json.message || data;
        // Limpiar saltos de línea para la consola
        replyText = replyText.replace(/\n/g, ' ').substring(0, 120) + "..."; 
      } catch(e) {}
      
      console.log(`[Chat ${index+1}] HTTP ${res.statusCode} | Tiempo: ${elapsed}ms`);
      console.log(`👤 P: ${q}`);
      console.log(`🤖 R: ${replyText}\n`);
      
      completed++;
      if(completed === questions.length) {
        console.log(`🏁 Prueba finalizada. Tiempo total de resolución de la ráfaga: ${Date.now() - startTotal}ms`);
      }
    });
  });

  req.on('error', (e) => console.error(`[Chat ${index+1}] Error:`, e.message));
  req.write(payload);
  req.end();
});
