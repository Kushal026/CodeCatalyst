import { HistoryEntry } from "@/types/analysis";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryListProps {
  history: HistoryEntry[];
  onClear: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

const riskBadge = {
  Safe: "bg-safe/15 text-safe border-safe/30",
  Suspicious: "bg-warning/15 text-warning border-warning/30",
  "High-Risk": "bg-danger/15 text-danger border-danger/30",
};

const HistoryList = ({ history, onClear, onSelect }: HistoryListProps) => {
  if (history.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <h3 className="text-sm font-semibold">Recent Analyses</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Clear
        </Button>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {history.slice(0, 5).map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              layout
            >
              <Card
                className="glass-card cursor-pointer transition-colors hover:border-primary/30"
                onClick={() => onSelect(entry)}
              >
                <CardContent className="flex items-center justify-between p-3">
                  <p className="max-w-[70%] truncate text-sm text-muted-foreground">
                    {entry.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${riskBadge[entry.result.risk_level]}`}>
                      {entry.result.risk_level}
                    </Badge>
                    <span className="text-xs text-muted-foreground/60">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryList;
