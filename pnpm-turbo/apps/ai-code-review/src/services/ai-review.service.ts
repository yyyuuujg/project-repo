import { CodeReviewResponse } from '@/types/code-review';

/**
 * AI Code Review Service
 * Uses Groq's free API (llama-3.3-70b-versatile model)
 * No authentication required for basic usage
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = 'gsk_8xO8h9Y3K4L2M6N1P5Q7R9T0U3V6W8X2Y4Z7A1B3C5D8E0F2'; // Free tier API key

const SYSTEM_PROMPT = `You are an expert code reviewer. Analyze the provided code and identify issues in these categories:
1. BUGS: Potential runtime errors, null references, type mismatches, logic errors
2. PERFORMANCE: Inefficient algorithms, unnecessary re-renders, memory leaks, optimization opportunities
3. READABILITY: Code clarity, naming conventions, complex logic, magic numbers

For each issue found, provide:
- type: "bug", "performance", or "readability"
- line: exact line number where the issue occurs
- message: brief description of the issue
- suggestion: specific actionable fix
- confidence: your confidence level (0-100)

Return ONLY valid JSON in this exact format:
{
  "issues": [
    {
      "id": "unique-id",
      "type": "bug",
      "line": 5,
      "message": "Brief issue description",
      "suggestion": "How to fix it",
      "confidence": 85
    }
  ],
  "summary": "Overall analysis summary in 2-3 sentences"
}

Be thorough but concise. Find real, actionable issues.`;

export async function analyzeCode(code: string): Promise<CodeReviewResponse> {
  if (!code.trim()) {
    throw new Error('No code provided for analysis');
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: `Analyze this code:\n\n\`\`\`\n${code}\n\`\`\``,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from AI');
    }

    // Parse the JSON response
    const result = JSON.parse(content);

    // Validate and transform the response
    if (!result.issues || !Array.isArray(result.issues)) {
      throw new Error('Invalid response format: missing issues array');
    }

    // Ensure all issues have required fields and generate IDs
    const validatedIssues = result.issues.map((issue: any, index: number) => ({
      id: issue.id || `issue-${Date.now()}-${index}`,
      type: issue.type || 'readability',
      line: parseInt(issue.line) || 1,
      message: issue.message || 'Issue detected',
      suggestion: issue.suggestion || 'Review and fix this section',
      confidence: Math.min(100, Math.max(0, parseInt(issue.confidence) || 50)),
    }));

    return {
      issues: validatedIssues,
      summary: result.summary || 'Code analysis completed.',
    };
  } catch (error) {
    console.error('Code analysis error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to analyze code. Please try again.');
  }
}
