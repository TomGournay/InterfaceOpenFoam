import { useState } from "react";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";

const FileManager = ({ files, onFileClick, level = 0 }) => {
  if (!files || files.length === 0) {
    return <p style={{ color: 'gray' }}>Aucun fichier à afficher.</p>;
  }

  return (
    <div style={{ marginLeft: level * 16 }}>
      {files.map((file, index) => {
        if (file.type === "folder") {
          return (
            <Folder
              key={index}
              folder={file}
              onFileClick={onFileClick}
              level={level}
            />
          );
        }

        return (
          <div
            key={index}
            onClick={() => onFileClick(file)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "2px 0",
              color: "#f0f0f0",
              fontSize: '20px'
            }}
            className="file-item"
          >
            <span style={{ marginRight: 8 }}>
            </span>
            {file.name}
          </div>
        );
      })}
    </div>
  );
};

const Folder = ({ folder, onFileClick, level }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          color: "lightgray",
          fontWeight: "bold",
          padding: "4px 0",
          fontSize: '20px'
        }}
        className="folder-title"
      >
        <span style={{ marginRight: 8 }}>
          {isOpen ? <FaFolderOpen /> : <FaFolder />}
        </span>
        {folder.name}
      </div>

      {isOpen && (
        <div style={{ marginLeft: 16, borderLeft: '1px solid #555', paddingLeft: 8 }}>
          <FileManager
            files={folder.items}
            onFileClick={onFileClick}
            level={level + 1}
          />
        </div>
      )}
    </div>
  );
};

export default FileManager;
