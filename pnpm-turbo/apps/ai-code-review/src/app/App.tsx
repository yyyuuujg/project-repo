import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useCodeReview } from '@/hooks/useCodeReview';
import { CodeEditorSection } from '@/app/components/editor/CodeEditorSection';
import { ReviewSection } from '@/app/components/review/ReviewSection';
import { Issue } from '@/types/code-review';

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
  const [code, setCode] = useState('');
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [highlightType, setHighlightType] = useState<Issue['type'] | null>(null);
  
  const { reviewState, analyzeCodeReview, reset, retry, isLoading } = useCodeReview();

  const handleAnalyze = () => {
    if (!code.trim()) return;
    setHighlightedLine(null);
    setHighlightType(null);
    analyzeCodeReview(code);
  };

  const handleReset = () => {
    setCode('');
    setHighlightedLine(null);
    setHighlightType(null);
    reset();
  };

  const handleRetry = () => {
    setHighlightedLine(null);
    setHighlightType(null);
    retry(code);
  };

  const handleIssueClick = (line: number, type: Issue['type']) => {
    setHighlightedLine(line);
    setHighlightType(type);
  };

  const handleFileUpload = (content: string, filename: string) => {
    setCode(content);
    setHighlightedLine(null);
    setHighlightType(null);
    reset();
  };

  const handleLoadSample = () => {
    setCode(SAMPLE_CODE);
    setHighlightedLine(null);
    setHighlightType(null);
    reset();
  };

  const canAnalyze = code.trim().length > 0 && !isLoading;
  const hasAnalyzed = reviewState.status === 'success' || reviewState.status === 'error';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-zinc-100">AI Code Review</h1>
              <p className="text-xs text-zinc-500">Instant code analysis powered by Groq AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Code Editor */}
          <CodeEditorSection
            code={code}
            onCodeChange={setCode}
            onFileUpload={handleFileUpload}
            highlightedLine={highlightedLine}
            highlightType={highlightType}
            onAnalyze={handleAnalyze}
            onRetry={handleRetry}
            onReset={handleReset}
            onLoadSample={handleLoadSample}
            isAnalyzing={isLoading}
            hasAnalyzed={hasAnalyzed}
            canAnalyze={canAnalyze}
          />

          {/* Right Panel - Review Results */}
          <ReviewSection
            reviewState={reviewState}
            onIssueClick={handleIssueClick}
            activeIssueLine={highlightedLine}
          />
        </div>
      </main>
    </div>
  );
}
