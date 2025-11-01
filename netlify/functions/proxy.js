import fetch from "node-fetch";

export async function handler(event, context) {
  const backendUrl = `https://barberhub-backend.onrender.com${event.path.replace("/.netlify/functions/proxy", "")}`;

  const response = await fetch(backendUrl, {
    method: event.httpMethod,
    headers: {
      ...event.headers,
      host: "barberhub-backend.onrender.com"
    },
    body: event.body ? event.body : undefined,
  });

  const text = await response.text();

  return {
    statusCode: response.status,
    headers: {
    "Access-Control-Allow-Origin": "https://barberhub-marketplace.netlify.app",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH",
    "Access-Control-Allow-Headers": "Authorization,Content-Type",
    "Content-Type": response.headers.get("content-type") || "application/json",
  },
    body: text,
  };
}
