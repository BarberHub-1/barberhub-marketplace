export async function handler(event, context) {
  try {
    // Monta a URL do backend
    const backendUrl = `https://barberhub-backend.onrender.com${event.path.replace("/.netlify/functions/proxy", "")}`;

    // Copia headers do frontend
    const headers = { ...event.headers };

    // Se houver token no frontend (localStorage), você pode enviar via header Authorization
    // Caso use frontend em Netlify, geralmente passa token via header 'Authorization' na requisição
    // headers['Authorization'] = headers['Authorization'] || `Bearer ${token}`;

    // Faz a requisição para o backend
    const response = await fetch(backendUrl, {
      method: event.httpMethod,
      headers,
      body: event.body ? event.body : undefined,
    });

    // Converte resposta para texto
    const text = await response.text();

    // Retorna para o frontend
    return {
      statusCode: response.status,
      headers: {
        "Access-Control-Allow-Origin": "https://barberhub-marketplace.netlify.app", // seu frontend
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
      body: text,
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro no proxy", error: error.message }),
    };
  }
}
