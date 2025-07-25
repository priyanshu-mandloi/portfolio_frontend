"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Braces,
  ChevronDown,
  Code,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2Off,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Table as TableIcon,
  Type as UnderlineIcon,
} from "lucide-react";
import { useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";
import type { Editor } from "@tiptap/react";
import { SUPPORTED_LANGUAGES } from "@/lib/tiptap-lowlight";
import { Separator } from "@/components/ui/separator";

interface Props {
  editor: Editor | null;
}

export function Toolbar({ editor }: Props) {
  const colorRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  if (!editor) return null;

  /* ---------- Language handling ---------- */
  const setLang = useCallback(
    (lang: string) => {
      if (editor.isActive("codeBlock")) {
        editor
          .chain()
          .focus()
          .updateAttributes("codeBlock", { language: lang })
          .run();
      } else {
        editor.chain().focus().setCodeBlock({ language: lang }).run();
      }
    },
    [editor]
  );

  /* ---------- Alignment ---------- */
  const align = (dir: "left" | "center" | "right" | "justify") => {
    (editor.chain() as any).focus().setTextAlign(dir).run();
  };
  const isAligned = (dir: string) => editor.isActive({ textAlign: dir as any });

  /* ---------- Links ---------- */
  const setLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };
  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  /* ---------- Text Color ---------- */
  const setColor = (val: string) => {
    editor.chain().focus().setColor(val).run();
  };

  /* ---------- Highlight ---------- */
  const toggleHighlight = () => {
    editor.chain().focus().toggleHighlight().run();
  };

  /* ---------- Image ---------- */
  const triggerImage = () => imageRef.current?.click();
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ---------- Table ---------- */
  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };
  const addColBefore = () => editor.chain().focus().addColumnBefore().run();
  const addColAfter = () => editor.chain().focus().addColumnAfter().run();
  const delCol = () => editor.chain().focus().deleteColumn().run();
  const addRowBefore = () => editor.chain().focus().addRowBefore().run();
  const addRowAfter = () => editor.chain().focus().addRowAfter().run();
  const delRow = () => editor.chain().focus().deleteRow().run();
  const delTable = () => editor.chain().focus().deleteTable().run();
  const mergeCells = () => editor.chain().focus().mergeCells().run();
  const splitCell = () => editor.chain().focus().splitCell().run();
  const toggleHeaderRow = () => editor.chain().focus().toggleHeaderRow().run();
  const toggleHeaderCol = () =>
    editor.chain().focus().toggleHeaderColumn().run();

  const inTable = editor.isActive("table");

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-1 border-b border-border p-2 text-sm min-w-max">
        {/* Marks */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive("bold")}
          aria-label="Bold"
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive("italic")}
          aria-label="Italic"
        >
          <Italic className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          data-active={editor.isActive("underline")}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-active={editor.isActive("strike")}
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-3 w-3" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Headings */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          data-active={editor.isActive("heading", { level: 1 })}
        >
          H1
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          data-active={editor.isActive("heading", { level: 2 })}
        >
          H2
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          data-active={editor.isActive("heading", { level: 3 })}
        >
          H3
        </Button>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Blockquote / Lists */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-active={editor.isActive("blockquote")}
          aria-label="Blockquote"
        >
          <Quote className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive("bulletList")}
          aria-label="Bulleted list"
        >
          <List className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive("orderedList")}
          aria-label="Numbered list"
        >
          <ListOrdered className="h-3 w-3" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Alignment */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => align("left")}
          data-active={isAligned("left")}
          aria-label="Align left"
        >
          <AlignLeft className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => align("center")}
          data-active={isAligned("center")}
          aria-label="Align center"
        >
          <AlignCenter className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => align("right")}
          data-active={isAligned("right")}
          aria-label="Align right"
        >
          <AlignRight className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => align("justify")}
          data-active={isAligned("justify")}
          aria-label="Justify"
        >
          <AlignJustify className="h-3 w-3" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Links */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={setLink}
          data-active={editor.isActive("link")}
          aria-label="Set link"
        >
          <LinkIcon className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={unsetLink}
          aria-label="Remove link"
        >
          <Link2Off className="h-3 w-3" />
        </Button>

        {/* Color */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => colorRef.current?.click()}
          aria-label="Text color"
        >
          A
        </Button>
        <input
          ref={colorRef}
          type="color"
          className="hidden"
          onChange={(e) => setColor(e.target.value)}
          defaultValue="#000000"
        />

        {/* Highlight */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={toggleHighlight}
          data-active={editor.isActive("highlight")}
          aria-label="Highlight"
        >
          <Highlighter className="h-3 w-3" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Inline code / Code block */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleCode().run()}
          data-active={editor.isActive("code")}
          aria-label="Inline code"
        >
          <Code className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          data-active={editor.isActive("codeBlock")}
          aria-label="Code block"
        >
          <Braces className="h-3 w-3" />
        </Button>

        {/* Code language dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="ml-1 flex items-center gap-1"
            >
              Lang
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={4}
              className="z-50 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <DropdownMenu.Item
                  key={l.value}
                  onSelect={() => setLang(l.value)}
                  className="cursor-pointer rounded px-2 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
                >
                  {l.label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Image */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={triggerImage}
          aria-label="Insert image"
        >
          <ImageIcon className="h-3 w-3" />
        </Button>
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImage}
        />

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Table operations */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
              data-active={inTable}
            >
              <TableIcon className="h-3 w-3" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={4}
              className="z-50 w-40 rounded-md border bg-popover p-1 text-popover-foreground shadow-md text-xs"
            >
              <DropdownMenu.Item
                onSelect={insertTable}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Insert 3x3 Table
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                onSelect={addRowBefore}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Add Row Before
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={addRowAfter}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Add Row After
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={delRow}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Delete Row
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                onSelect={addColBefore}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Add Col Before
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={addColAfter}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Add Col After
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={delCol}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Delete Column
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                onSelect={mergeCells}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Merge Cells
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={splitCell}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Split Cell
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                onSelect={toggleHeaderRow}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Toggle Header Row
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={toggleHeaderCol}
                className="cursor-pointer rounded px-2 py-1 hover:bg-accent hover:text-accent-foreground"
              >
                Toggle Header Column
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-border" />
              <DropdownMenu.Item
                onSelect={delTable}
                className="cursor-pointer rounded px-2 py-1 text-destructive hover:bg-destructive/20"
              >
                Delete Table
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {/* Clear */}
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
