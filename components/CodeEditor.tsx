import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  onEnter: () => void;
  disabled?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, onEnter, disabled }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col font-mono text-sm bg-editor-bg rounded-lg border border-gray-700 overflow-hidden shadow-inner">
      <div className="bg-[#252526] px-4 py-2 text-xs text-gray-400 flex items-center border-b border-gray-700 select-none">
        <span className="mr-2 text-blue-400">INPUT</span>
        <span className="italic opacity-50">Type Emmet abbreviation...</span>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full h-full bg-transparent text-editor-fg p-4 outline-none resize-none font-mono leading-relaxed"
          spellCheck={false}
          autoFocus
          placeholder="e.g. div.container>ul>li*3"
        />
      </div>
      <div className="bg-[#252526] px-4 py-1 text-[10px] text-gray-500 border-t border-gray-700 flex justify-between">
         <span>UTF-8</span>
         <span>Press ENTER to run</span>
      </div>
    </div>
  );
};