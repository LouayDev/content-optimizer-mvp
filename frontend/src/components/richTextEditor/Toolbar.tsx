import { Editor } from '@tiptap/react';
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading1,
  Download,
  Redo,
  Undo,
  ImagePlus,
} from 'lucide-react';
import { Toggle } from '../ui/toggle';
Toggle;
import { useCallback } from 'react';
import { Button } from '../ui/button';

type Props = {
  editor: Editor | null;
};
const Toolbar = ({ editor }: Props) => {
  const exportContent = () => {
    const content = editor?.getHTML() || '';
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editor-content.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!editor) {
    return null;
  }

  const addImage = useCallback(() => {
    const imageUrl = window.prompt('URL');

    if (imageUrl) {
      editor.commands.setImage({ src: imageUrl });
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-transparent rounded-br-md">
      <button
        className="p-2 hover:bg-accent"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </button>
      <button
        className="p-2 border-r-2 border-r-gray-300  hover:bg-accent"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive('heading', { level: 1 })
            ? 'is-active p-2   hover:bg-accent'
            : 'p-2   hover:bg-accent'
        }
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive('heading', { level: 2 })
            ? 'is-active p-2 border-r border-r-black hover:bg-accent'
            : 'p-2 border-r-2 border-r-gray-300 hover:bg-accent'
        }
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <Toggle
        size="sm"
        className="rounded-none"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="rounded-none"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="rounded-none border-r-2 border-r-gray-300 "
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="rounded-none"
        pressed={editor.isActive('BulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        className="rounded-none border-r-2 border-r-gray-300"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <button
        className="p-2 border-r-2 border-r-gray-300   hover:bg-accent "
        onClick={addImage}
      >
        <ImagePlus className="h-4 w-4" />
      </button>

      <Button
        size="sm"
        onClick={exportContent}
        className="bg-transparent text-black rounded-none border-none shadow-none text-center font-medium hover:bg-accent"
      >
        <Download className="h-4 w-4 mr-1" />
        Export
      </Button>
    </div>
  );
};

export default Toolbar;

//TODO: complete adding all the function in the toolbar based on marketmuse toolbar.
//TODO: make the export button work only if there are some content on the editor,
// otherwies just disable the button or show a messgae "there's no content".
//TODO: make the undo btn disabled when the website first load
//
//
