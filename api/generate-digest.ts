import type { VercelRequest, VercelResponse } from '@vercel/node';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

const DIGEST_PROMPT = `You are an elite AI intelligence analyst for Vision Managers, a consulting firm specializing in Operational AI for high-trust businesses (medical clinics, legal firms, asset managers, real estate).

Generate a comprehensive "AI Intelligence Digest" — a real-time executive briefing. Use web search to find the latest developments.

Structure the digest with these exact sections:

## Executive Summary
A 2-3 sentence overview of the most significant AI developments this week that impact high-trust businesses.

## Key Developments
3-5 of the most important AI news items from the past week. For each, write a clear subsection:

### [Headline of the development]
What happened in 2-3 sentences. Then explain why it matters for high-trust businesses in 1-2 sentences.

Source: [Full clickable URL to the original article]

## Regulatory & Compliance Watch
Any new AI regulations, guidelines, or enforcement actions relevant to healthcare, legal, financial services, or real estate. Include source URLs inline as markdown links.

## Operational AI Insights
Practical takeaways — what should a clinic owner, law firm partner, or asset manager do differently this week based on these developments? Write as clear bullet points.

## Vision Managers Perspective
A brief (2-3 sentence) expert commentary tying the week's developments back to the principles of operational AI: sovereignty, verification, and measurable ROI.

## Sources
List all sources referenced in this digest as full URLs with descriptive link text, formatted as markdown links: [Article Title](https://full-url-here)

CRITICAL FORMATTING RULES:
- Do NOT use numbered citation references like [1], [2], etc. anywhere in the text.
- Do NOT put footnotes or endnotes with numbered references.
- When citing a source, either use an inline markdown link [like this](https://example.com) or put the full URL on its own line prefixed with "Source: ".
- Keep punctuation (periods, commas) attached to the preceding word. Never start a new line with punctuation.
- Write in clean, flowing paragraphs. No orphaned punctuation.
- Write in a professional, authoritative tone. Be specific with facts, companies, and dates. Avoid hype — focus on operational reality and actionable intelligence.

Today's date is provided in the user message.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Rate limiting
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  try {
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 10,
          },
        ],
        system: DIGEST_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Generate the AI Intelligence Digest for today, ${today}. Search the web for the latest AI news, regulations, and developments from the past 7 days that are relevant to high-trust businesses.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', errorText);
      return res.status(502).json({ error: 'Failed to generate digest. Please try again.' });
    }

    const data = await response.json();

    // Extract text content from the response
    const textBlocks = data.content?.filter((block: any) => block.type === 'text') || [];
    const digestText = textBlocks.map((block: any) => block.text).join('\n\n');

    return res.status(200).json({
      digest: digestText,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Digest generation error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
