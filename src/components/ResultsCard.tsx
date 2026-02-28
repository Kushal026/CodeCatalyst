import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnalysisResult } from "@/types/analysis";
import { AlertTriangle, CheckCircle, ShieldAlert, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ResultsCardProps {
  result: AnalysisResult;
  message: string;
}

const riskConfig = {
  Safe: {
    icon: CheckCircle,
    badgeClass: "bg-safe/15 text-safe border-safe/30",
    progressClass: "[&>div]:bg-safe",
    glowClass: "glow-safe gradient-safe",
    color: "text-safe",
  },
  Suspicious: {
    icon: AlertTriangle,
    badgeClass: "bg-warning/15 text-warning border-warning/30",
    progressClass: "[&>div]:bg-warning",
    glowClass: "glow-warning gradient-warning",
    color: "text-warning",
  },
  "High-Risk": {
    icon: ShieldAlert,
    badgeClass: "bg-danger/15 text-danger border-danger/30",
    progressClass: "[&>div]:bg-danger",
    glowClass: "glow-danger gradient-danger",
    color: "text-danger",
  },
};

const ResultsCard = ({ result, message }: ResultsCardProps) => {
  const [copied, setCopied] = useState(false);
  const config = riskConfig[result.risk_level];
  const Icon = config.icon;

  const handleCopy = async () => {
    const text = `Codecatalyst Analysis
Risk Level: ${result.risk_level}
Risk Score: ${result.risk_score}%
Explanation: ${result.explanation.join("; ")}
Suggested Action: ${result.suggested_action}
Message: ${message}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className={`glass-card ${config.glowClass} overflow-hidden`}>
        <CardContent className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className={`h-6 w-6 ${config.color}`} />
              <Badge className={config.badgeClass}>{result.risk_level}</Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* Risk Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Risk Score</span>
              <motion.span
                className={`font-display text-2xl font-bold ${config.color}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {result.risk_score}%
              </motion.span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Progress
                value={result.risk_score}
                className={`h-2.5 bg-muted ${config.progressClass}`}
              />
            </motion.div>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Risk Factors</h4>
            <ul className="space-y-1.5">
              {result.explanation.map((exp, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${config.color.replace("text-", "bg-")}`} />
                  {exp}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Suggested Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-lg border border-border/50 bg-muted/50 p-4"
          >
            <h4 className="mb-1 text-sm font-semibold text-foreground">Suggested Action</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.suggested_action}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultsCard;
