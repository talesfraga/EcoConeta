import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const GEMINI_API_KEY = Deno.env.get("AIzaSyAsfEN3BRLGnyroy76mAx7cTkIHLkD0JeI")!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, message } = await req.json();

    if (!userId || !message) {
      return new Response(JSON.stringify({ error: "userId e message são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Busca histórico das últimas 5 trocas
    const { data: historico } = await supabase
      .from("chat_history")
      .select("question, answer")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Monta histórico no formato do Gemini
    const histContents = (historico || []).reverse().flatMap((h: any) => [
      { role: "user", parts: [{ text: h.question }] },
      { role: "model", parts: [{ text: h.answer }] },
    ]);

    const contents = [
      ...histContents,
      { role: "user", parts: [{ text: message }] },
    ];

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: "Você é um assistente focado em questões ambientais. Responda sempre em português." }]
        },
        contents,
      }),
    });

    const geminiData = await geminiRes.json();
    console.log("Gemini response:", JSON.stringify(geminiData));
    const answer = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "Não consegui gerar uma resposta.";

    await supabase.from("chat_history").insert({
      user_id: userId,
      question: message,
      answer,
    });

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Erro interno: " + err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});