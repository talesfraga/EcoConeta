import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY nao esta configurada no ambiente");
}

const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") || "*";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Metodo nao permitido" }, 405);
  }

  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return json({ error: "message e obrigatorio" }, 400);
    }

    const cleanMessage = message.trim();
    if (cleanMessage.length < 2 || cleanMessage.length > 1000) {
      return json({ error: "message deve ter entre 2 e 1000 caracteres" }, 400);
    }

    const userId = "public";

    const { data: historico } = await supabase
      .from("chat_history")
      .select("question, answer")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    const histContents = (historico || []).reverse().flatMap((h: any) => [
      { role: "user", parts: [{ text: h.question }] },
      { role: "model", parts: [{ text: h.answer }] },
    ]);

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: "Voce e o EcoChat, um assistente ambiental para usuarios de Sorocaba. Responda sempre em portugues do Brasil, com orientacoes praticas, curtas e seguras sobre reciclagem, descarte correto, ecopontos, consumo consciente e denuncias ambientais.",
          }],
        },
        contents: [
          ...histContents,
          { role: "user", parts: [{ text: cleanMessage }] },
        ],
        generationConfig: {
          temperature: 0.2,
          candidateCount: 1,
        },
      }),
    });

    const geminiData = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error("Gemini API error:", geminiData);
      return json({
        error: geminiData.error?.message || "Erro na API Gemini",
      }, 502);
    }

    const answer =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Nao consegui gerar uma resposta agora.";

    await supabase.from("chat_history").insert({
      user_id: userId,
      question: cleanMessage,
      answer,
    });

    return json({ answer });
  } catch (err: any) {
    console.error("Chat function error:", err);
    return json({ error: "Erro interno no EcoChat" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
