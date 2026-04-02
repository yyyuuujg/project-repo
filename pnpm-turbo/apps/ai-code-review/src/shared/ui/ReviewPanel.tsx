import { useState, useEffect } from "react";

import { Sparkles, CheckCircle2, AlertTriangle, Info, FileQuestion } from "lucide-react";
import { motion } from "motion/react";

import { Card } from "@repo/util/ui/card";
import { Badge } from "@repo/util/ui/badge";
import { Skeleton } from "@repo/util/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/util/ui/tabs";

import { IssueItem, type Issue } from "@src/shared/ui/IssueItem";
import { DiffViewer } from "@src/shared/ui/DiffViewer";

interface ReviewPanelProps {
  isLoading: boolean;
  hasAnalyzed: boolean;
  onIssueClick: (line: number, type: Issue["type"]) => void;
  activeIssueLine: number | null;
}

const MOCK_ISSUES: Issue[] = [
  {
    id: "1",
    type: "bug",
    line: 5,
    message: "Potential null reference error",
    suggestion: "Add null check before accessing user.name property",
    confidence: 92,
  },
  {
    id: "2",
    type: "bug",
    line: 12,
    message: "Missing error handling in async operation",
    suggestion: "Wrap await call in try-catch block to handle potential errors",
    confidence: 88,
  },
  {
    id: "3",
    type: "performance",
    line: 8,
    message: "Unnecessary re-renders detected",
    suggestion: "Use useMemo to memoize expensive calculations",
    confidence: 85,
  },
  {
    id: "4",
    type: "performance",
    line: 15,
    message: "Multiple array iterations",
    suggestion: "Combine filter and map operations into a single reduce call",
    confidence: 78,
  },
  {
    id: "5",
    type: "readability",
    line: 3,
    message: "Magic number detected",
    suggestion: "Extract number to a named constant (e.g., MAX_RETRIES)",
    confidence: 95,
  },
  {
    id: "6",
    type: "readability",
    line: 18,
    message: "Complex conditional logic",
    suggestion: "Extract condition to a well-named helper function",
    confidence: 82,
  },
];

const DIFF_BEFORE = `async function fetchUserData(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
}`;

const DIFF_AFTER = `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}`;

export function ReviewPanel({
  isLoading,
  hasAnalyzed,
  onIssueClick,
  activeIssueLine,
}: ReviewPanelProps) {
  const [streamedText, setStreamedText] = useState("");
  const [showIssues, setShowIssues] = useState(false);
  const summaryText =
    "Analysis complete. Found 6 issues across your code: 2 potential bugs, 2 performance optimizations, and 2 readability improvements. Overall code quality is good with a few areas for enhancement.";

  useEffect(() => {
    if (!isLoading && hasAnalyzed) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < summaryText.length) {
          setStreamedText(summaryText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowIssues(true), 300);
        }
      }, 20);
      return () => clearInterval(interval);
    } else {
      setStreamedText("");
      setShowIssues(false);
    }
  }, [isLoading, hasAnalyzed]);

  const issuesByType = {
    bug: MOCK_ISSUES.filter((i) => i.type === "bug"),
    performance: MOCK_ISSUES.filter((i) => i.type === "performance"),
    readability: MOCK_ISSUES.filter((i) => i.type === "readability"),
  };

  return (
    <Card className="h-full overflow-hidden bg-zinc-950 border-zinc-800">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg text-zinc-100">AI Code Review</h2>
        </div>
        <p className="text-sm text-zinc-500">Powered by advanced static analysis</p>
      </div>

      <div className="overflow-auto h-[calc(100%-80px)] p-4 space-y-4">
        {/* Empty State */}
        {!isLoading && !hasAnalyzed && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="p-4 bg-zinc-900/50 rounded-full mb-4">
              <FileQuestion className="w-12 h-12 text-zinc-600" />
            </div>
            <h3 className="text-lg text-zinc-300 mb-2">No Analysis Yet</h3>
            <p className="text-sm text-zinc-500 max-w-sm">
              Enter or upload your code in the editor, then click "Analyze Code" to receive
              AI-powered feedback and suggestions.
            </p>
          </div>
        )}

        {/* Summary Section */}
        {(isLoading || hasAnalyzed) && (
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                <h3 className="text-zinc-200">Summary</h3>
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-5/6 bg-zinc-800" />
                  <Skeleton className="h-4 w-4/6 bg-zinc-800" />
                </div>
              ) : (
                <motion.p
                  className="text-sm text-zinc-300 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {streamedText}
                  {streamedText.length < summaryText.length && (
                    <span className="inline-block w-1 h-4 bg-purple-500 ml-1 animate-pulse" />
                  )}
                </motion.p>
              )}
            </div>
          </Card>
        )}

        {/* Statistics */}
        {!isLoading && showIssues && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 gap-3"
          >
            <Card className="bg-red-500/10 border-red-500/20 p-3">
              <AlertTriangle className="w-4 h-4 text-red-400 mb-1" />
              <div className="text-2xl text-red-400">{issuesByType.bug.length}</div>
              <div className="text-xs text-zinc-400">Bugs</div>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500/20 p-3">
              <Sparkles className="w-4 h-4 text-yellow-400 mb-1" />
              <div className="text-2xl text-yellow-400">{issuesByType.performance.length}</div>
              <div className="text-xs text-zinc-400">Performance</div>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/20 p-3">
              <Info className="w-4 h-4 text-blue-400 mb-1" />
              <div className="text-2xl text-blue-400">{issuesByType.readability.length}</div>
              <div className="text-xs text-zinc-400">Readability</div>
            </Card>
          </motion.div>
        )}

        {/* Issues Tabs */}
        {!isLoading && showIssues && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="all" className="flex-1">
                All Issues
              </TabsTrigger>
              <TabsTrigger value="bugs" className="flex-1">
                Bugs
                <Badge variant="secondary" className="ml-2 bg-red-500/20 text-red-400">
                  {issuesByType.bug.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex-1">
                Performance
                <Badge variant="secondary" className="ml-2 bg-yellow-500/20 text-yellow-400">
                  {issuesByType.performance.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="readability" className="flex-1">
                Readability
                <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-400">
                  {issuesByType.readability.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {MOCK_ISSUES.map((issue, index) => (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  onClick={() => onIssueClick(issue.line, issue.type)}
                  isActive={activeIssueLine === issue.line}
                  delay={index * 0.1}
                />
              ))}
            </TabsContent>

            <TabsContent value="bugs" className="space-y-3 mt-4">
              {issuesByType.bug.map((issue, index) => (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  onClick={() => onIssueClick(issue.line, issue.type)}
                  isActive={activeIssueLine === issue.line}
                  delay={index * 0.1}
                />
              ))}
            </TabsContent>

            <TabsContent value="performance" className="space-y-3 mt-4">
              {issuesByType.performance.map((issue, index) => (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  onClick={() => onIssueClick(issue.line, issue.type)}
                  isActive={activeIssueLine === issue.line}
                  delay={index * 0.1}
                />
              ))}
            </TabsContent>

            <TabsContent value="readability" className="space-y-3 mt-4">
              {issuesByType.readability.map((issue, index) => (
                <IssueItem
                  key={issue.id}
                  issue={issue}
                  onClick={() => onIssueClick(issue.line, issue.type)}
                  isActive={activeIssueLine === issue.line}
                  delay={index * 0.1}
                />
              ))}
            </TabsContent>
          </Tabs>
        )}

        {/* Diff Section */}
        {!isLoading && showIssues && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <h3 className="text-sm text-zinc-400 mb-3">Suggested Fix Example</h3>
            <DiffViewer before={DIFF_BEFORE} after={DIFF_AFTER} language="javascript" />
          </motion.div>
        )}
      </div>
    </Card>
  );
}
