import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';
import OrderedList from '@tiptap/extension-ordered-list';
import Image from '@tiptap/extension-image';

import './editorStyle.css';
const Tiptap = () => {
  const [content, setContent] = useState('You can type Anything...');
  const contentRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, OrderedList, Image],
    content: content,
    editorProps: {
      attributes: {
        class:
          ' prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-10 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/get-content');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched content:', data);
        setContent(data.htmlContent);
        if (editor) {
          editor.commands.setContent(data.htmlContent);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, [editor]);

  return (
    <>
      <Toolbar editor={editor} />
      <EditorContent ref={contentRef} editor={editor} />
    </>
  );
};

export default Tiptap;
