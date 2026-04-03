export interface Issue {
  id: string;
  type: 'bug' | 'performance' | 'readability';
  line: number;
  message: string;
  suggestion: string;
  confidence: number;
}

export interface CodeReviewResponse {
  issues: Issue[];
  summary: string;
}

export type ReviewStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ReviewState {
  status: ReviewStatus;
  data: CodeReviewResponse | null;
  error: string | null;
}
