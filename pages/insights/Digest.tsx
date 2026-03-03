import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Loader2, Download, RefreshCw } from 'lucide-react';

function renderMarkdown(md: string): string {
  // Normalize line endings
  let text = md.replace(/\r\n/g, '\n');

  // Remove numbered citation refs like [1], [2] etc.
  text = text.replace(/\[(\d+)\]/g, '');

  // Clean up orphaned punctuation (period/comma at start of line)
  text = text.replace(/\n\s*([.,;:!?])/g, '$1');

  // Split into lines for block-level processing
  const lines = text.split('\n');
  const htmlParts: string[] = [];
  let inList = false;
  let listType = '';

  const closePendingList = () => {
    if (inList) {
      htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>');
      inList = false;
      listType = '';
    }
  };

  const inlineFormat = (line: string): string => {
    return line
      // Links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-vmTeal underline underline-offset-2 hover:text-vmNavy transition-colors">$1</a>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-vmNavy font-medium">$1</strong>')
      // Italic
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
      // Bare URLs on "Source:" lines
      .replace(/^(Source:\s*)(https?:\/\/\S+)/gi, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-vmTeal underline underline-offset-2 hover:text-vmNavy transition-colors break-all">$2</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      closePendingList();
      continue;
    }

    // H2
    if (trimmed.startsWith('## ')) {
      closePendingList();
      const heading = inlineFormat(trimmed.slice(3));
      htmlParts.push(`<h2 class="text-2xl font-serif text-vmNavy mt-12 mb-4 pb-2 border-b border-slate-100">${heading}</h2>`);
      continue;
    }

    // H3
    if (trimmed.startsWith('### ')) {
      closePendingList();
      const heading = inlineFormat(trimmed.slice(4));
      htmlParts.push(`<h3 class="text-xl font-serif text-vmNavy mt-8 mb-3">${heading}</h3>`);
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      closePendingList();
      htmlParts.push('<hr class="my-10 border-slate-200" />');
      continue;
    }

    // Unordered list item
    if (/^[-*]\s/.test(trimmed)) {
      if (!inList || listType !== 'ul') {
        closePendingList();
        htmlParts.push('<ul class="space-y-2 my-4 ml-1">');
        inList = true;
        listType = 'ul';
      }
      const content = inlineFormat(trimmed.replace(/^[-*]\s+/, ''));
      htmlParts.push(`<li class="flex items-start gap-2"><span class="text-vmTeal mt-1.5 shrink-0">•</span><span>${content}</span></li>`);
      continue;
    }

    // Ordered list item
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList || listType !== 'ol') {
        closePendingList();
        htmlParts.push('<ol class="space-y-2 my-4 ml-1 list-none">');
        inList = true;
        listType = 'ol';
      }
      const num = trimmed.match(/^(\d+)\./)?.[1] || '';
      const content = inlineFormat(trimmed.replace(/^\d+\.\s+/, ''));
      htmlParts.push(`<li class="flex items-start gap-3"><span class="text-vmTeal font-bold shrink-0">${num}.</span><span>${content}</span></li>`);
      continue;
    }

    // Source line
    if (/^source:\s/i.test(trimmed)) {
      closePendingList();
      const content = inlineFormat(trimmed);
      htmlParts.push(`<p class="text-xs text-slate-400 mb-6 break-all">${content}</p>`);
      continue;
    }

    // Regular paragraph
    closePendingList();
    const content = inlineFormat(trimmed);
    htmlParts.push(`<p class="mb-4 leading-relaxed">${content}</p>`);
  }

  closePendingList();
  return htmlParts.join('\n');
}

function renderDownloadHtml(digest: string): string {
  // Simpler HTML conversion for the download file
  let html = digest
    .replace(/\r\n/g, '\n')
    .replace(/\[(\d+)\]/g, '')
    .replace(/\n\s*([.,;:!?])/g, '$1')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/^---+$/gm, '<hr>')
    .replace(/^source:\s*(https?:\/\/\S+)/gim, '<p style="font-size:12px;color:#94a3b8;">Source: <a href="$1" style="color:#0B4C83;">$1</a></p>');

  // Wrap loose text in paragraphs
  html = html.split('\n\n').map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (/^<[h123olup]|^<li|^<hr/i.test(trimmed)) return trimmed;
    return `<p>${trimmed}</p>`;
  }).join('\n');

  return html;
}

const Digest: React.FC = () => {
  const [digest, setDigest] = useState('');
  const [generatedAt, setGeneratedAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const digestRef = useRef<HTMLDivElement>(null);

  const generateDigest = async () => {
    setLoading(true);
    setError('');
    setDigest('');

    try {
      const response = await fetch('/api/generate-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        let message = 'Failed to generate digest';
        try {
          const data = await response.json();
          message = data.error || message;
        } catch {
          // Response wasn't JSON
        }
        throw new Error(message);
      }

      const text = await response.text();
      if (!text) throw new Error('Empty response from server');
      const data = JSON.parse(text);
      setDigest(data.digest);
      setGeneratedAt(data.generated_at);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Intelligence Digest — ${today}</title>
  <style>
    body { font-family: 'Georgia', serif; max-width: 700px; margin: 40px auto; padding: 20px; color: #1e293b; line-height: 1.8; }
    h1 { color: #0B4C83; border-bottom: 3px solid #00E5D1; padding-bottom: 16px; font-size: 28px; }
    h2 { color: #0B4C83; margin-top: 32px; font-size: 22px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    h3 { color: #0B4C83; margin-top: 24px; font-size: 18px; }
    strong { color: #0B4C83; }
    a { color: #0B4C83; }
    li { margin-bottom: 8px; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 32px 0; }
    .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
    .footer a { color: #0B4C83; }
  </style>
</head>
<body>
  <h1>AI Intelligence Digest</h1>
  <p style="color: #64748b; font-size: 14px; margin-bottom: 32px;">${today} — Generated by Vision Managers</p>
  ${renderDownloadHtml(digest)}
  <div class="footer">
    <p>Generated by <a href="https://visionmanagers.com">Vision Managers</a> — Operational AI for High-Trust Businesses</p>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VM-Intelligence-Digest-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-40 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/insights" className="inline-flex items-center gap-2 text-slate-400 hover:text-vmNavy transition-colors mb-12 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>

        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="w-16 h-16 bg-vmTeal/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-vmTeal" />
          </div>
          <span className="text-vmTeal font-black text-xs uppercase tracking-[0.3em] mb-4 block">AI-Powered Intelligence</span>
          <h1 className="text-5xl md:text-6xl font-serif text-vmNavy mb-8 leading-tight italic">Intelligence Digest.</h1>
          <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">
            Real-time executive briefing powered by AI web research. The latest AI developments analyzed through the lens of high-trust business operations.
          </p>
        </header>

        {/* Generate button */}
        {!digest && !loading && !error && (
          <div className="max-w-lg mx-auto mb-20 text-center">
            <button
              onClick={generateDigest}
              className="inline-flex items-center gap-3 px-10 py-5 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all group"
            >
              <Zap className="w-5 h-5" /> Generate This Week's Digest
            </button>
            <p className="text-slate-400 text-sm mt-4">Takes 30-60 seconds. Powered by real-time AI web research.</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="max-w-lg mx-auto mb-20">
            <div className="bg-vmSlate p-12 rounded-sm text-center">
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-vmTeal/20 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-vmTeal/40 animate-ping" style={{ animationDelay: '200ms' }} />
                <div className="absolute inset-0 rounded-full bg-vmNavy/5 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-vmTeal animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-serif text-vmNavy mb-3 italic">Generating your digest...</h3>
              <p className="text-slate-400 text-sm">Searching the web and analyzing the latest AI developments. This may take 30-60 seconds.</p>
              <div className="mt-6 flex gap-1.5 h-2 items-center justify-center">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1.5 h-full bg-vmTeal rounded-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="max-w-lg mx-auto mb-20">
            <div className="bg-red-50 border border-red-200 p-8 rounded-sm text-center">
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={generateDigest}
                className="inline-flex items-center gap-2 px-6 py-3 bg-vmNavy text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          </div>
        )}

        {/* Digest display */}
        {digest && (
          <div ref={digestRef}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-vmTeal font-black text-[10px] uppercase tracking-widest block mb-1">Generated Report</span>
                {generatedAt && (
                  <span className="text-xs text-slate-400">
                    {new Date(generatedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={generateDigest}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[10px] rounded-sm hover:border-vmTeal hover:text-vmNavy transition-all"
                >
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-vmNavy text-white font-bold uppercase tracking-widest text-[10px] rounded-sm hover:bg-vmTeal hover:text-vmNavy transition-all"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </div>

            <div
              className="bg-white border border-slate-200 rounded-sm p-8 md:p-12 text-slate-700 leading-relaxed font-light"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(digest) }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Digest;
