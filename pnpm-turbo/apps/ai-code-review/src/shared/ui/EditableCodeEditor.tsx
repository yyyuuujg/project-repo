import { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Upload, FileCode } from "lucide-react";

import { Card } from "@repo/util/ui/card";
import { Button } from "@repo/util/ui/button";

interface EditableCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onFileUpload: (content: string, filename: string) => void;
  highlightedLine: number | null;
  highlightType: "bug" | "performance" | "readability" | null;
}

export function EditableCodeEditor({
  code,
  onChange,
  onFileUpload,
  highlightedLine,
  highlightType,
}: EditableCodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [language, setLanguage] = useState("javascript");

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (editorRef.current && highlightedLine !== null) {
      const editor = editorRef.current;

      // Remove previous decorations
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);

      // Get the background color based on issue type
      const getBackgroundColor = () => {
        switch (highlightType) {
          case "bug":
            return "rgba(239, 68, 68, 0.15)"; // red
          case "performance":
            return "rgba(234, 179, 8, 0.15)"; // yellow
          case "readability":
            return "rgba(59, 130, 246, 0.15)"; // blue
          default:
            return "rgba(255, 255, 255, 0.1)";
        }
      };

      const getBorderColor = () => {
        switch (highlightType) {
          case "bug":
            return "#ef4444";
          case "performance":
            return "#eab308";
          case "readability":
            return "#3b82f6";
          default:
            return "#ffffff";
        }
      };

      // Add new decorations
      const newDecorations = editor.deltaDecorations(
        [],
        [
          {
            range: {
              startLineNumber: highlightedLine,
              startColumn: 1,
              endLineNumber: highlightedLine,
              endColumn: 1,
            },
            options: {
              isWholeLine: true,
              className: "highlighted-line",
              glyphMarginClassName: "highlighted-line-glyph",
              backgroundColor: getBackgroundColor(),
              marginClassName: "highlighted-line-margin",
            },
          },
        ],
      );

      decorationsRef.current = newDecorations;

      // Scroll to the highlighted line
      editor.revealLineInCenter(highlightedLine);

      // Add custom CSS for the border
      const styleId = "monaco-line-highlight-style";
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = `
        .highlighted-line {
          border-left: 3px solid ${getBorderColor()} !important;
        }
      `;
    } else if (editorRef.current) {
      // Clear decorations when no line is highlighted
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [highlightedLine, highlightType]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onFileUpload(content, file.name);

        // Detect language from file extension
        const extension = file.name.split(".").pop()?.toLowerCase();
        const languageMap: { [key: string]: string } = {
          js: "javascript",
          jsx: "javascript",
          ts: "typescript",
          tsx: "typescript",
          py: "python",
          java: "java",
          cpp: "cpp",
          c: "c",
          go: "go",
          rs: "rust",
          rb: "ruby",
          php: "php",
          html: "html",
          css: "css",
          json: "json",
          xml: "xml",
          sql: "sql",
          sh: "shell",
          md: "markdown",
        };
        if (extension && languageMap[extension]) {
          setLanguage(languageMap[extension]);
        }
      };
      reader.readAsText(file);
    }
    // Reset input so the same file can be uploaded again
    e.target.value = "";
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  return (
    <Card className="h-full overflow-hidden bg-[#1e1e1e] border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <FileCode className="w-4 h-4 text-zinc-400 ml-2" />
          <span className="text-sm text-zinc-400">Code Editor</span>
          <span className="text-xs text-zinc-600 ml-2">({language})</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rs,.rb,.php,.html,.css,.json,.txt,.sql,.sh,.xml,.md"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
          >
            <Upload className="w-3.5 h-3.5 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            wrappingIndent: "indent",
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            padding: {
              top: 16,
              bottom: 16,
            },
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            contextmenu: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            tabCompletion: "on",
            wordBasedSuggestions: "matchingDocuments",
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>

      {code.length > 0 && (
        <div className="px-4 py-2 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {code.split("\n").length} lines • {code.length} characters
          </span>
          <span className="text-xs text-zinc-500">Tab size: 2 spaces</span>
        </div>
      )}
    </Card>
  );
}
