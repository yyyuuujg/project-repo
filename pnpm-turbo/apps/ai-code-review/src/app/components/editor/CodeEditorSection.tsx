import { EditableCodeEditor } from '@/app/components/EditableCodeEditor';
import { Button } from '@/app/components/ui/button';
import { Play, RotateCcw, Trash2 } from 'lucide-react';
import { Issue } from '@/types/code-review';

interface CodeEditorSectionProps {
  code: string;
  onCodeChange: (code: string) => void;
  onFileUpload: (content: string, filename: string) => void;
  highlightedLine: number | null;
  highlightType: Issue['type'] | null;
  onAnalyze: () => void;
  onRetry: () => void;
  onReset: () => void;
  onLoadSample: () => void;
  isAnalyzing: boolean;
  hasAnalyzed: boolean;
  canAnalyze: boolean;
}

export function CodeEditorSection({
  code,
  onCodeChange,
  onFileUpload,
  highlightedLine,
  highlightType,
  onAnalyze,
  onRetry,
  onReset,
  onLoadSample,
  isAnalyzing,
  hasAnalyzed,
  canAnalyze,
}: CodeEditorSectionProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {code.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadSample}
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Load Sample Code
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasAnalyzed && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                disabled={!canAnalyze}
                className="border-zinc-700 hover:bg-zinc-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Analysis
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="border-zinc-700 hover:bg-zinc-800 text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={onAnalyze}
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

      {/* Editor */}
      <div className="flex-1">
        <EditableCodeEditor
          code={code}
          onChange={onCodeChange}
          onFileUpload={onFileUpload}
          highlightedLine={highlightedLine}
          highlightType={highlightType}
        />
      </div>
    </div>
  );
}
