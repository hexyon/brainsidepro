import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisResult {
  regions: string[];
  description: string;
}

export function useAIBrainAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyze = async (query: string) => {
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-brain-activity", {
        body: { query },
      });

      if (fnError) {
        throw new Error(fnError.message || "Analysis failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const analysisResult: AnalysisResult = {
        regions: data.regions || [],
        description: data.description || "Analysis complete.",
      };

      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      toast({ title: "Analysis Error", description: msg, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { analyze, isAnalyzing, result, error, reset };
}
