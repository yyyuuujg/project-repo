import { useState } from "react";
import { Sparkles, Play, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@repo/util/src/ui/button";

import { EditableCodeEditor } from "@src/shared/ui/EditableCodeEditor";
import { ReviewPanel } from "@src/shared/ui/ReviewPanel";
import { type Issue } from "@src/shared/ui/IssueItem";

const SAMPLE_CODE = `import React, { useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  const name = user.name; // Potential null reference
  
  const expensiveCalculation = () => {
    return Array(1000).fill(0).reduce((acc, val) => acc + val, 0);
  };
  
  async function loadUser() {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    setUser(data);
  }
  
  const filtered = data.filter(item => item.active)
                      .map(item => item.value);
  
  if (value > 0 && status === 'active' && type === 'premium') {
    return <div>Premium Active User</div>;
  }
  
  return (
    <div>
      <h1>{name}</h1>
      <p>User ID: {userId}</p>
      <button onClick={loadUser}>Load User</button>
    </div>
  );
}

export default UserProfile;`;

export default function App() {
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [highlightType, setHighlightType] = useState<Issue["type"] | null>(null);

  const handleAnalyze = () => {
    if (!code.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setHasAnalyzed(false);
    setHighlightedLine(null);
    setHighlightType(null);

    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 2500);
  };

  const handleReset = () => {
    setCode("");
    setIsAnalyzing(false);
    setHasAnalyzed(false);
    setHighlightedLine(null);
    setHighlightType(null);
  };

  const handleRetry = () => {
    handleAnalyze();
  };

  const handleIssueClick = (line: number, type: Issue["type"]) => {
    setHighlightedLine(line);
    setHighlightType(type);
  };

  const handleFileUpload = (content: string, filename: string) => {
    setCode(content);
    setHasAnalyzed(false);
    setHighlightedLine(null);
    setHighlightType(null);
  };

  const handleLoadSample = () => {
    setCode(SAMPLE_CODE);
    setHasAnalyzed(false);
    setHighlightedLine(null);
    setHighlightType(null);
  };

  const canAnalyze = code.trim().length > 0 && !isAnalyzing;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl text-zinc-100">AI Code Review</h1>
                <p className="text-xs text-zinc-500">Instant code analysis & suggestions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {code.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadSample}
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  Load Sample Code
                </Button>
              )}
              {hasAnalyzed && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    disabled={!canAnalyze}
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retry Analysis
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="border-zinc-700 hover:bg-zinc-800 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </>
              )}
              <Button
                size="sm"
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Analyze Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Editable Code Editor */}
          <EditableCodeEditor
            code={code}
            onChange={setCode}
            onFileUpload={handleFileUpload}
            highlightedLine={highlightedLine}
            highlightType={highlightType}
          />

          {/* Right Panel - Review Results */}
          <ReviewPanel
            isLoading={isAnalyzing}
            hasAnalyzed={hasAnalyzed}
            onIssueClick={handleIssueClick}
            activeIssueLine={highlightedLine}
          />
        </div>
      </main>
    </div>
  );
}
