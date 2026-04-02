import { AlertCircle, Zap, Eye } from "lucide-react";
import { motion } from "motion/react";

import { Card } from "@repo/util/ui/card";
import { Badge } from "@repo/util/ui/badge";
import { Progress } from "@repo/util/ui/progress";

export interface Issue {
  id: string;
  type: "bug" | "performance" | "readability";
  line: number;
  message: string;
  suggestion: string;
  confidence: number;
}

interface IssueItemProps {
  issue: Issue;
  onClick: () => void;
  isActive: boolean;
  delay?: number;
}

export function IssueItem({ issue, onClick, isActive, delay = 0 }: IssueItemProps) {
  const getTypeConfig = (type: Issue["type"]) => {
    switch (type) {
      case "bug":
        return {
          icon: AlertCircle,
          color: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          badge: "bg-red-500/20 text-red-400 hover:bg-red-500/20",
        };
      case "performance":
        return {
          icon: Zap,
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          badge: "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20",
        };
      case "readability":
        return {
          icon: Eye,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
          border: "border-blue-500/20",
          badge: "bg-blue-500/20 text-blue-400 hover:bg-blue-500/20",
        };
    }
  };

  const config = getTypeConfig(issue.type);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card
        className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
          isActive
            ? `${config.bg} ${config.border} border-2`
            : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
        }`}
        onClick={onClick}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${config.bg} ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={config.badge}>
                {issue.type}
              </Badge>
              <span className="text-xs text-zinc-500">Line {issue.line}</span>
            </div>
            <p className="text-sm text-zinc-200 mb-2">{issue.message}</p>
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-md p-3 mb-3">
              <p className="text-xs text-zinc-400 mb-1">Suggestion:</p>
              <p className="text-sm text-zinc-300">{issue.suggestion}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Confidence:</span>
              <Progress value={issue.confidence} className="h-1.5 flex-1" />
              <span className="text-xs text-zinc-400">{issue.confidence}%</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
