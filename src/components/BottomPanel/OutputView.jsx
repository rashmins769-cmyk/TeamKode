import React, { useRef, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Copy, Check, Loader2, Terminal } from 'lucide-react';

export const OutputView = () => {
  const { output, isRunning, activeFile } = useEditor();
  const [copied, setCopied] = React.useState(false);
  const outputRef = useRef(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Colorize output lines
  const renderLine = (line, idx) => {
    let color = '#cccccc';
    if (line.startsWith('✖') || line.toLowerCase().startsWith('error') || line.toLowerCase().startsWith('runtime error') || line.toLowerCase().startsWith('compilation error')) {
      color = '#f14c4c';
    } else if (line.startsWith('⚠') || line.toLowerCase().startsWith('warning')) {
      color = '#f5c842';
    } else if (line.startsWith('(Program exited') || line.startsWith('(no output)')) {
      color = '#858585';
    }
    return (
      <div key={idx} style={{ color, lineHeight: '1.6', minHeight: '1.2em' }}>
        {line || '\u00A0'}
      </div>
    );
  };

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', background: '#0d0d0d',
      fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
      fontSize: 13, overflow: 'hidden', position: 'relative',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '4px 12px', borderBottom: '1px solid #1e1e1e', flexShrink: 0,
        background: '#111',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#858585', fontSize: 12 }}>
          <Terminal size={13} />
          {activeFile?.name ? `Running: ${activeFile.name}` : 'Output'}
        </div>
        <button
          onClick={handleCopy}
          disabled={!output}
          title="Copy output"
          style={{
            background: 'none', border: 'none', cursor: output ? 'pointer' : 'default',
            color: output ? '#cccccc' : '#444', padding: '3px 6px', borderRadius: 4,
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 11,
          }}
          onMouseEnter={e => { if (output) e.currentTarget.style.background = '#2a2d2e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
        >
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>

      {/* Output area */}
      <div
        ref={outputRef}
        style={{
          flex: 1, overflowY: 'auto', padding: '12px 16px',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}
      >
        {isRunning ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#007acc' }}>
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Executing code...</span>
          </div>
        ) : output ? (
          output.split('\n').map((line, idx) => renderLine(line, idx))
        ) : (
          <div style={{ color: '#444', fontStyle: 'italic' }}>
            Press the ▶ Run button to execute your code here.
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
