import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export type AIProvider = 'openai' | 'anthropic' | 'local';

export type AIModel = {
  provider: AIProvider;
  model: string;
  maxTokens: number;
  temperature?: number;
};

// Model configurations for different tasks
export const AI_MODELS = {
  // Document analysis - Claude is better for legal/safety
  documentAnalysis: {
    provider: 'anthropic' as AIProvider,
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4096,
    temperature: 0.3,
  },
  // Fast tasks - GPT-4 Turbo
  chatbot: {
    provider: 'openai' as AIProvider,
    model: 'gpt-4-turbo-preview',
    maxTokens: 2048,
    temperature: 0.7,
  },
  // Case predictions - Claude for reasoning
  casePrediction: {
    provider: 'anthropic' as AIProvider,
    model: 'claude-3-opus-20240229',
    maxTokens: 4096,
    temperature: 0.2,
  },
  // Quick classifications - GPT-3.5 for cost efficiency
  classification: {
    provider: 'openai' as AIProvider,
    model: 'gpt-3.5-turbo',
    maxTokens: 1024,
    temperature: 0.1,
  },
  // Summaries
  summarization: {
    provider: 'anthropic' as AIProvider,
    model: 'claude-3-haiku-20240307',
    maxTokens: 2048,
    temperature: 0.3,
  },
  // Creative content
  contentGeneration: {
    provider: 'openai' as AIProvider,
    model: 'gpt-4-turbo-preview',
    maxTokens: 4096,
    temperature: 0.8,
  },
};

// Generic completion function
export async function generateCompletion(
  prompt: string,
  systemPrompt: string,
  modelConfig: AIModel
): Promise<string> {
  if (modelConfig.provider === 'openai' && openai) {
    const response = await openai.chat.completions.create({
      model: modelConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: modelConfig.maxTokens,
      temperature: modelConfig.temperature ?? 0.7,
    });
    return response.choices[0]?.message?.content || '';
  }

  if (modelConfig.provider === 'anthropic' && anthropic) {
    const response = await anthropic.messages.create({
      model: modelConfig.model,
      max_tokens: modelConfig.maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });
    const content = response.content[0];
    return content.type === 'text' ? content.text : '';
  }

  throw new Error(`AI provider ${modelConfig.provider} not configured`);
}

// Streaming completion
export async function* streamCompletion(
  prompt: string,
  systemPrompt: string,
  modelConfig: AIModel
): AsyncGenerator<string> {
  if (modelConfig.provider === 'openai' && openai) {
    const stream = await openai.chat.completions.create({
      model: modelConfig.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: modelConfig.maxTokens,
      temperature: modelConfig.temperature ?? 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
    return;
  }

  if (modelConfig.provider === 'anthropic' && anthropic) {
    const stream = await anthropic.messages.stream({
      model: modelConfig.model,
      max_tokens: modelConfig.maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        const delta = event.delta;
        if ('text' in delta) {
          yield delta.text;
        }
      }
    }
    return;
  }

  throw new Error(`AI provider ${modelConfig.provider} not configured`);
}

// JSON completion with structured output
export async function generateJSONCompletion<T>(
  prompt: string,
  systemPrompt: string,
  modelConfig: AIModel
): Promise<T> {
  const jsonSystemPrompt = `${systemPrompt}\n\nYou must respond with valid JSON only. No explanations or markdown.`;

  const response = await generateCompletion(prompt, jsonSystemPrompt, modelConfig);

  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    return JSON.parse(response) as T;
  } catch (error) {
    throw new Error(`Failed to parse AI response as JSON: ${response.slice(0, 200)}`);
  }
}

export { openai, anthropic };
