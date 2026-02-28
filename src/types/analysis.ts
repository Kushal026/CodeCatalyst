export interface AnalysisResult {
  risk_level: "Safe" | "Suspicious" | "High-Risk";
  risk_score: number;
  explanation: string[];
  suggested_action: string;
}

export interface HistoryEntry {
  id: string;
  message: string;
  result: AnalysisResult;
  timestamp: number;
}
