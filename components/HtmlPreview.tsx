import React from 'react';

interface HtmlPreviewProps {
  html: string;
  label: string;
  isEmpty?: boolean;
}

// Simple highlighter for HTML strings
const HighlightedHtml: React.FC<{ code: string }> = ({ code }) => {
  if (!code) return null;

  // Very basic tokenizer for visualization purposes
  // Note: For a real production app, use PrismJS or similar. 
  // We do this manually to avoid heavy dependencies in this single-response constraint.
  const lines = code.split('\n');

  return (
    <div className="font-mono text-sm leading-relaxed">
      {lines.map((line, i) => {
        // Basic indentation handling
        const indent = line.search(/\S/);
        const content = line.trim();
        
        return (
          <div key={i} style={{ paddingLeft: `${indent > 0 ? indent * 8 : 0}px` }}>
            {content.split(/(<[^>]+>)/g).map((part, j) => {
              if (part.startsWith('<') && part.endsWith('>')) {
                 // It's a tag
                 const isClosing = part.startsWith('</');
                 const tagName = part.replace(/[</>]/g, '').split(' ')[0];
                 const rest = part.slice(isClosing ? 2 + tagName.length : 1 + tagName.length, -1);
                 
                 return (
                   <span key={j} className="text-gray-400">
                     &lt;{isClosing && '/'}<span className="text-blue-400 font-semibold">{tagName}</span>
                     {rest && <span className="text-sky-300 italic">{rest}</span>}
                     &gt;
                   </span>
                 )
              }
              // Text content
              return <span key={j} className="text-white">{part}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const HtmlPreview: React.FC<HtmlPreviewProps> = ({ html, label, isEmpty }) => {
  return (
    <div className="w-full h-full flex flex-col bg-gray-900 rounded-lg border border-gray-700 overflow-hidden shadow-inner">
      <div className="bg-[#252526] px-4 py-2 text-xs text-gray-400 flex items-center border-b border-gray-700 select-none">
        <span className={`mr-2 font-bold ${label === 'TARGET' ? 'text-green-500' : 'text-purple-400'}`}>
          {label}
        </span>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {isEmpty ? (
            <div className="h-full flex items-center justify-center text-gray-600 italic select-none">
                Waiting for input...
            </div>
        ) : (
            <HighlightedHtml code={html} />
        )}
      </div>
    </div>
  );
};