import { ReviewPanel } from '@/app/components/ReviewPanel';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ReviewState, Issue } from '@/types/code-review';

interface ReviewSectionProps {
  reviewState: ReviewState;
  onIssueClick: (line: number, type: Issue['type']) => void;
  activeIssueLine: number | null;
}

export function ReviewSection({
  reviewState,
  onIssueClick,
  activeIssueLine,
}: ReviewSectionProps) {
  const { status, data, error } = reviewState;

  return (
    <div className="h-full flex flex-col">
      {/* Error Display */}
      {status === 'error' && error && (
        <div className="mb-4">
          <Alert variant="destructive" className="bg-red-950/50 border-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Review Panel */}
      <div className="flex-1 overflow-hidden">
        <ReviewPanel
          isLoading={status === 'loading'}
          hasAnalyzed={status === 'success' || status === 'error'}
          issues={data?.issues || []}
          summary={data?.summary || ''}
          onIssueClick={onIssueClick}
          activeIssueLine={activeIssueLine}
          hasError={status === 'error'}
        />
      </div>
    </div>
  );
}
