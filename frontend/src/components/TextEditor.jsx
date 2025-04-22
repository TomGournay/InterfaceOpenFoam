import React from "react";
import Editor from '@monaco-editor/react'

function CodeEditor({ value, onChange, language = "cpp", height="500px"}){
    return (
        <Editor
        height={height}
        defaultLanguage={language}
        defaultValue={value}
        onChange={onChange}
        theme="vs-dark"
      />
    );
  }

  export default CodeEditor

/*   exemple : 
        <Editor
        height="600px"
        language="plaintext" // ou "yaml" ou "cpp" selon le format du fichier
        value={content}
        onChange={handleEditorChange}
        theme="vs-dark"
      /> 
*/