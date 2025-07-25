"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useMemo } from "react";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Toolbar } from "./tiptap/Toolbar";
import Underline from "@tiptap/extension-underline";
import { lowlight } from "@/lib/tiptap-lowlight";

interface Props {
  value: string;
  onChange: (html: string, json?: any) => void;
  placeholder?: string;
  minHeightPx?: number;
}

export default function TiptapEditor({
  value,
  onChange,
  placeholder = "Write your blog content here...",
  minHeightPx = 400,
}: Props) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
      }),
      TextStyle,
      Color,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({
        resizable: true,
        lastColumnResizable: true,
        HTMLAttributes: { class: "tiptap-table" },
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext",
      }),
      Placeholder.configure({ placeholder }),
    ],
    [placeholder]
  );

  const editor = useEditor({
    extensions,
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = editor.getJSON();
      onChange(html, json);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="tiptap-editor-wrapper border border-border rounded-lg overflow-hidden flex flex-col h-full">
      <Toolbar editor={editor} />
      <div
        style={{ minHeight: minHeightPx }}
        className="tiptap-editor-body p-4 prose prose-sm max-w-none dark:prose-invert focus:outline-none flex-1 h-full"
      >
        <EditorContent editor={editor} className="h-full w-full" />
      </div>
    </div>
  );
}
