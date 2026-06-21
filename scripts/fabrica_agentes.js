const API_KEY = "afapi_c65b6786209e30bcb2279648e28d052853869a7b0c96b4c7d79fb6707636a699";
const BASE_URL = "https://api-rest-agent-flow-528082765109.europe-west1.run.app/api/v1";

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Uso: node fabrica_agentes.js \"Nombre del Cliente\" <ventas|recepcion|soporte>");
    process.exit(1);
}

const [clientName, type] = args;

// FASE 1: LOS EMPAQUETADOS (Plantillas Maestras)
const templates = {
    "ventas": {
        name: `Cerrador de Ventas - ${clientName}`,
        description: "Agente comercial automático orientado a captura de leads y agendamiento.",
        systemPrompt: `Eres un cerrador de ventas de alta conversión para la empresa ${clientName}.\nTu objetivo principal es captar leads. Cuando el usuario pregunte por precios, inventario o servicios, da una respuesta breve y sumamente persuasiva.\nInmediatamente después, pide su nombre y teléfono para agendar una cita o enviar una cotización formal.\nSiempre usa un tono profesional, seguro y directo. NUNCA inventes precios o características que no conozcas, si no sabes algo, usa eso como excusa para pedir sus datos de contacto y que un especialista lo llame.`
    },
    "recepcion": {
        name: `Recepcionista Virtual - ${clientName}`,
        description: "Asistente de recepción para preguntas frecuentes, horarios y citas.",
        systemPrompt: `Eres el recepcionista virtual estrella de ${clientName}.\nTu objetivo es atender dudas frecuentes de los visitantes, dar horarios de atención, ubicación física y ayudar a derivar a los pacientes o clientes al departamento correcto.\nSé extremadamente amable, paciente, cálido y servicial. Si te preguntan algo fuera de tu conocimiento, discúlpate cortésmente y pide sus datos (nombre y celular) para que un humano del equipo los contacte a la brevedad.`
    },
    "soporte": {
        name: `Soporte Técnico - ${clientName}`,
        description: "Agente de atención al cliente para manejo de quejas y estado de servicios.",
        systemPrompt: `Eres el agente de soporte técnico y atención al cliente de ${clientName}.\nTu objetivo es ayudar a los clientes actuales con problemas, devoluciones o quejas operativas.\nMantén siempre la calma, sé muy empático y discúlpate si el cliente está molesto. Para poder ayudarlos, solicita siempre el número de pedido, placa o documento de identidad para revisar su caso en el sistema. Asegúrales que su problema tiene máxima prioridad.`
    }
};

const tpl = templates[type.toLowerCase()];
if (!tpl) {
    console.log("❌ Error: El tipo de agente debe ser 'ventas', 'recepcion' o 'soporte'.");
    process.exit(1);
}

// FASE 2: SCRIPT DE DESPLIEGUE MAESTRO (La Fábrica)
async function deploy() {
    console.log(`\n🏭 Iniciando la FÁBRICA DE AGENTES para: [${clientName}] (Modo: ${type.toUpperCase()})`);
    
    try {
        // 1. Crear el Agente en Botiva
        console.log("🧠 Creando y calibrando cerebro del agente...");
        const agentRes = await fetch(`${BASE_URL}/agents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Api-Key': API_KEY },
            body: JSON.stringify({
                name: tpl.name,
                systemPrompt: tpl.systemPrompt,
                description: tpl.description,
                model: "vx/gemini-3.5-flash"
            })
        });
        const agentData = await agentRes.json();
        if(!agentData.ok) throw new Error("Fallo creando agente: " + JSON.stringify(agentData));
        const agentId = agentData.data.id;
        console.log(`✅ Cerebro inicializado con éxito (ID: ${agentId})`);

        // 2. Crear y Vincular el Widget
        console.log("🎨 Generando interfaz y widget web...");
        const widgetRes = await fetch(`${BASE_URL}/widgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Api-Key': API_KEY },
            body: JSON.stringify({
                name: `Widget - ${clientName}`,
                agentId: agentId,
                handoffEnabled: true,
                handoffNotifyMode: "inbox",
                theme: "light",
                primaryColor: "#0B0F19" // Un color oscuro elegante por defecto
            })
        });
        const widgetData = await widgetRes.json();
        if(!widgetData.ok) throw new Error("Fallo creando widget: " + JSON.stringify(widgetData));
        const token = widgetData.data.token;
        console.log(`✅ Widget web empaquetado (Token: ${token})`);

        // 3. Output del Producto Final
        console.log("\n=======================================================");
        console.log("🎉 ¡PRODUCTO LISTO PARA ENTREGAR AL CLIENTE! 🎉");
        console.log("=======================================================\n");
        console.log("Instrucciones para el cliente:");
        console.log("Copia y pega este código justo antes de cerrar la etiqueta </body> en tu sitio web:\n");
        
        console.log(`<!-- BotIvA AI Agent: ${clientName} -->`);
        console.log(`<script src="https://botiva.space/widget.js"></script>`);
        console.log(`<script>`);
        console.log(`  window.AgentFlowhub.init({`);
        console.log(`    token: '${token}',`);
        console.log(`    host:  'https://botiva.space'`);
        console.log(`  });`);
        console.log(`</script>`);
        console.log(`<!-- End BotIvA AI Agent -->\n`);
        
    } catch (err) {
        console.error("❌ Error Crítico en la Fábrica:", err.message);
    }
}

deploy();
