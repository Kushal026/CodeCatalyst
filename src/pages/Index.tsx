import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { analyzeMessage } from "@/lib/api";
import { addToHistory, getHistory, clearHistory } from "@/lib/history";
import { AnalysisResult, HistoryEntry } from "@/types/analysis";
import ResultsCard from "@/components/ResultsCard";
import HistoryList from "@/components/HistoryList";
import Header from "@/components/Header";

const Index = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory());
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!message.trim()) {
      toast({ title: "Empty message", description: "Please paste a message to analyze.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await analyzeMessage(message.trim());
      setResult(res);
      setCurrentMessage(message.trim());
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        message: message.trim(),
        result: res,
        timestamp: Date.now(),
      };
      setHistory(addToHistory(entry));
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setMessage(entry.message);
    setResult(entry.result);
    setCurrentMessage(entry.message);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 pt-28 pb-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/30">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Fraud Detection
            <span className="block text-primary">Assistant</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Paste any suspicious message below for instant AI-powered risk analysis
          </p>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-4"
        >
          <Textarea
            placeholder="Paste a suspicious SMS, email, or message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[140px] resize-none glass-card border-border/50 bg-card/40 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
            disabled={loading}
          />
          <Button
            onClick={handleAnalyze}
            disabled={loading || !message.trim()}
            size="lg"
            className="w-full font-display font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Analyze Message
              </>
            )}
          </Button>
        </motion.div>

        {/* Results */}
        <div className="mt-8 space-y-8">
          {result && <ResultsCard result={result} message={currentMessage} />}
          <HistoryList history={history} onClear={handleClearHistory} onSelect={handleHistorySelect} />
        </div>
      </main>
    </div>
  );
};

export default Index;
