import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ArrowRight } from "lucide-react";

import { Card } from "@repo/util/ui/card";

interface DiffViewerProps {
  before: string;
  after: string;
  language: string;
}

export function DiffViewer({ before, after, language }: DiffViewerProps) {
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-zinc-800">
        <div>
          <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800">
            <span className="text-xs text-zinc-400">Before</span>
          </div>
          <div className="overflow-auto max-h-[300px]">
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              showLineNumbers
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "transparent",
                fontSize: "0.75rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
              lineNumberStyle={{
                minWidth: "2em",
                paddingRight: "0.5em",
                color: "#858585",
                fontSize: "0.75rem",
              }}
            >
              {before}
            </SyntaxHighlighter>
          </div>
        </div>
        <div>
          <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
            <ArrowRight className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-zinc-400">After (Suggested)</span>
          </div>
          <div className="overflow-auto max-h-[300px]">
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              showLineNumbers
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "rgba(16, 185, 129, 0.05)",
                fontSize: "0.75rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
              lineNumberStyle={{
                minWidth: "2em",
                paddingRight: "0.5em",
                color: "#858585",
                fontSize: "0.75rem",
              }}
            >
              {after}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </Card>
  );
}
