import { useState, useCallback } from 'react';
import { ReviewState, CodeReviewResponse } from '@/types/code-review';
import { analyzeCode } from '@/services/ai-review.service';

/**
 * Custom hook for managing code review state and API calls
 */
export function useCodeReview() {
  const [reviewState, setReviewState] = useState<ReviewState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const analyzeCodeReview = useCallback(async (code: string) => {
    if (!code.trim()) {
      setReviewState({
        status: 'error',
        data: null,
        error: 'Please enter some code to analyze',
      });
      return;
    }

    setReviewState({
      status: 'loading',
      data: null,
      error: null,
    });

    try {
      const result = await analyzeCode(code);
      
      setReviewState({
        status: 'success',
        data: result,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred during analysis';
      
      setReviewState({
        status: 'error',
        data: null,
        error: errorMessage,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setReviewState({
      status: 'idle',
      data: null,
      error: null,
    });
  }, []);

  const retry = useCallback((code: string) => {
    analyzeCodeReview(code);
  }, [analyzeCodeReview]);

  return {
    reviewState,
    analyzeCodeReview,
    reset,
    retry,
    isLoading: reviewState.status === 'loading',
    isSuccess: reviewState.status === 'success',
    isError: reviewState.status === 'error',
    isIdle: reviewState.status === 'idle',
  };
}
