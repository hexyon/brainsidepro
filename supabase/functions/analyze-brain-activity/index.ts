import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const brainRegions = [
  { id: "prefrontal", name: "Prefrontal Cortex", description: "Executive functions, planning, decision-making, problem-solving, personality expression" },
  { id: "motor", name: "Motor Cortex", description: "Planning, controlling, and executing voluntary movements" },
  { id: "sensory", name: "Somatosensory Cortex", description: "Processing touch, temperature, pain, and body position awareness" },
  { id: "visual", name: "Visual Cortex", description: "Processing visual information, colors, shapes, motion" },
  { id: "auditory", name: "Auditory Cortex", description: "Processing sounds, speech, and music" },
  { id: "broca", name: "Broca's Area", description: "Speech production and language processing" },
  { id: "wernicke", name: "Wernicke's Area", description: "Language comprehension, understanding spoken and written language" },
  { id: "hippocampus", name: "Hippocampus", description: "Memory formation, converting short-term to long-term memories, spatial navigation" },
  { id: "amygdala", name: "Amygdala", description: "Processing emotions, especially fear, anxiety, and emotional memories" },
  { id: "cerebellum", name: "Cerebellum", description: "Coordination, balance, motor learning, precise timing" },
  { id: "thalamus", name: "Thalamus", description: "Relay station for sensory signals, consciousness, sleep, alertness" },
  { id: "hypothalamus", name: "Hypothalamus", description: "Regulating hunger, thirst, temperature, sleep cycles, hormones" },
  { id: "brainstem", name: "Brain Stem", description: "Controls vital life functions including breathing, heart rate, blood pressure, consciousness, and sleep-wake cycles" },
  { id: "parietal", name: "Parietal Lobe", description: "Processes spatial information, integrates sensory input, crucial for navigation, mathematical reasoning, and spatial awareness" },
  { id: "temporal", name: "Temporal Lobe", description: "Essential for processing auditory information, memory formation, language comprehension, face recognition, and emotional processing" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing brain activity for query:", query);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a neuroscience expert analyzing brain activity. Your task is to identify ALL relevant brain regions that would be active during a described activity, mental state, or behavior.

Available brain regions:
${brainRegions.map(r => `- ${r.id}: ${r.name} - ${r.description}`).join("\n")}

IMPORTANT INSTRUCTIONS:
1. Analyze the ENTIRE sentence carefully for ALL aspects: physical actions, emotions, cognitive processes, sensory input, and memory
2. Consider both explicit and implicit brain activities (e.g., "focused" = prefrontal cortex, "remember" = hippocampus, "playing piano" = motor cortex + cerebellum + auditory cortex)
3. Don't limit yourself - include ALL relevant regions (typically 3-9 regions for complex activities)
4. Look for:
   - Physical movements → motor cortex, cerebellum, sensory cortex
   - Emotions (fear, joy, anxiety, etc.) → amygdala, prefrontal cortex
   - Memory (remembering, recalling, nostalgia) → hippocampus, temporal lobe
   - Thinking/planning → prefrontal cortex
   - Sensory input (seeing, hearing, feeling) → visual, auditory, sensory cortex
   - Body regulation (heart rate, temperature) → hypothalamus, brainstem

Respond with a JSON object containing:
1. "regions": an array of ALL relevant region IDs (be comprehensive, don't skip regions)
2. "description": a detailed explanation of why each major region is involved

Example for "I was focused while playing piano":
{"regions": ["motor", "cerebellum", "auditory", "prefrontal", "sensory"], "description": "Playing piano activates motor cortex for finger movements and cerebellum for precise coordination and timing. The auditory cortex processes the music being played, while the prefrontal cortex maintains focus and attention. The somatosensory cortex processes the tactile feedback from the keys."}

Always respond with valid JSON only, no additional text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze which brain regions are active when: "${query}"` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI response:", content);

    let result;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      result = {
        regions: ["prefrontal"],
        description: "The prefrontal cortex is involved in most cognitive activities."
      };
    }

    const validRegions = result.regions.filter((id: string) =>
      brainRegions.some(r => r.id === id)
    );

    return new Response(
      JSON.stringify({
        regions: validRegions,
        description: result.description || "Brain activity analysis complete."
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in analyze-brain-activity:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
