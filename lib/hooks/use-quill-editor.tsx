import React, { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css"; // Stellen Sie sicher, dass der Quill-CSS importiert ist.

const editorOptions = {
  toolbarOptions: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],
    ["clean"], // remove formatting button
  ],
};

interface UseEditorProps {
  containerId: string;
  onTextChange: (delta: any, oldDelta: any, source: string) => void;
  onSelectionChange: (range: any, oldRange: any, source: string) => void;
}

export const useEditor = ({
  containerId,
  onTextChange,
  onSelectionChange,
}: UseEditorProps) => {
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    const Quill = require("quill").default;
    const editor = new Quill(containerId, {
      theme: "snow",
      modules: {
        toolbar: editorOptions.toolbarOptions,
      },
    });

    editor.on("text-change", onTextChange);
    editor.on("selection-change", onSelectionChange);

    setEditor(editor);

    return () => {
      editor.off("text-change", onTextChange);
    };
  }, [containerId, onTextChange]);

  return editor;
};
