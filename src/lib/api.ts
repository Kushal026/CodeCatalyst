import { supabase } from "@/integrations/supabase/client";
import { AnalysisResult } from "@/types/analysis";

export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke("analyze-message", {
    body: { message },
  });

  if (error) {
    throw new Error(error.message || "Failed to analyze message");
  }

  return data as AnalysisResult;
}
