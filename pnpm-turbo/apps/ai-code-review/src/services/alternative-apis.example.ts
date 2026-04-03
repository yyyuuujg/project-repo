/**
 * Alternative AI API Integration Examples
 * 
 * This file contains example implementations for different AI providers.
 * Copy the desired implementation to ai-review.service.ts to use it.
 */

import { CodeReviewResponse } from '@/types/code-review';

// ============================================================================
// Example 1: OpenRouter (Multiple free models available)
// ============================================================================

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = 'YOUR_OPENROUTER_KEY'; // Get free key at openrouter.ai

export async function analyzeCodeWithOpenRouter(code: string): Promise<CodeReviewResponse> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Code Review',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct:free', // Free model
      messages: [
        {
          role: 'system',
          content: 'You are a code review expert. Return JSON with issues and summary.',
        },
        {
          role: 'user',
          content: `Analyze this code and return JSON:\n\n${code}`,
        },
      ],
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// ============================================================================
// Example 2: Hugging Face Inference API
// ============================================================================

const HF_API_URL = 'https://api-inference.huggingface.co/models/';
const HF_API_KEY = 'YOUR_HF_TOKEN'; // Get free token at huggingface.co

export async function analyzeCodeWithHuggingFace(code: string): Promise<CodeReviewResponse> {
  const response = await fetch(`${HF_API_URL}mistralai/Mistral-7B-Instruct-v0.2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${HF_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: `Analyze this code and return JSON with issues:\n\n${code}`,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.3,
      },
    }),
  });

  const data = await response.json();
  // Parse response and format to CodeReviewResponse
  return parseHuggingFaceResponse(data);
}

function parseHuggingFaceResponse(data: any): CodeReviewResponse {
  // Custom parsing logic based on HF response format
  return {
    issues: [],
    summary: 'Analysis complete',
  };
}

// ============================================================================
// Example 3: Together AI (Fast and affordable)
// ============================================================================

const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const TOGETHER_API_KEY = 'YOUR_TOGETHER_KEY'; // Get at together.ai

export async function analyzeCodeWithTogether(code: string): Promise<CodeReviewResponse> {
  const response = await fetch(TOGETHER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3-8b-chat-hf',
      messages: [
        {
          role: 'system',
          content: 'Code review expert. Return JSON format.',
        },
        {
          role: 'user',
          content: `Analyze:\n\n${code}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// ============================================================================
// Example 4: Local LLM (Ollama)
// ============================================================================

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export async function analyzeCodeWithOllama(code: string): Promise<CodeReviewResponse> {
  // Requires Ollama running locally with a model installed
  // Install: https://ollama.ai
  // Run: ollama run codellama
  
  const response = await fetch(OLLAMA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'codellama',
      prompt: `Analyze this code and return JSON with issues:\n\n${code}`,
      format: 'json',
      stream: false,
    }),
  });

  const data = await response.json();
  return JSON.parse(data.response);
}

// ============================================================================
// Provider Comparison
// ============================================================================

/*
GROQ (Current):
  ✅ Fast inference (< 2 seconds)
  ✅ Generous free tier
  ✅ Great for demos
  ✅ No credit card required
  ⚠️  Rate limits on free tier

OPENROUTER:
  ✅ Access to many models
  ✅ Some free models available
  ✅ Good for experimentation
  ⚠️  Slower than Groq

HUGGING FACE:
  ✅ Completely free
  ✅ Many open models
  ⚠️  Can be slow
  ⚠️  May need custom parsing

TOGETHER AI:
  ✅ Very fast
  ✅ Competitive pricing
  ⚠️  Requires payment method

OLLAMA (Local):
  ✅ 100% private
  ✅ No API limits
  ✅ Works offline
  ⚠️  Requires local setup
  ⚠️  GPU recommended
*/
