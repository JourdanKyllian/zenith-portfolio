"use client";

import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, minHeight = "150px" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFocused = useRef(false);

  // Synchronisation sécurisée pour éviter que le curseur ne saute
  useEffect(() => {
    if (editorRef.current && !isFocused.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const emitChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleCommand = (command: string, e: React.MouseEvent) => {
    e.preventDefault(); // Empêche la perte de focus
    document.execCommand(command, false, undefined);
    emitChange();
    editorRef.current?.focus();
  };

  return (
    <div className="w-full bg-z-bg border border-z-border rounded-lg overflow-hidden focus-within:border-z-blue transition-colors">
      <div className="flex items-center gap-1 p-2 border-b border-z-border bg-z-card/80">
        <button 
          type="button" 
          onMouseDown={(e) => handleCommand('bold', e)} 
          className="p-1.5 hover:bg-white/10 rounded text-z-muted hover:text-white transition-colors cursor-pointer" 
          title="Gras"
        >
          <Bold size={14} />
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => handleCommand('italic', e)} 
          className="p-1.5 hover:bg-white/10 rounded text-z-muted hover:text-white transition-colors cursor-pointer" 
          title="Italique"
        >
          <Italic size={14} />
        </button>
        <button 
          type="button" 
          onMouseDown={(e) => handleCommand('underline', e)} 
          className="p-1.5 hover:bg-white/10 rounded text-z-muted hover:text-white transition-colors cursor-pointer" 
          title="Souligné"
        >
          <Underline size={14} />
        </button>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        onFocus={() => { isFocused.current = true; }}
        onBlur={() => { isFocused.current = false; emitChange(); }}
        onInput={emitChange}
        className="p-4 text-sm focus:outline-none text-z-text rich-editor-content leading-relaxed"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
