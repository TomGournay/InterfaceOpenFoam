import React from 'react';

const InputFile = ({ id, label, size = 'default', onChange }) => {
    let sizeClass = 'form-control';
    if (size === 'sm') sizeClass += ' form-control-sm';
    if (size === 'lg') sizeClass += ' form-control-lg';

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <input
        className={sizeClass}
        id={id}
        type="file"
        onChange={onChange}
      />
    </div>
  );
};

export default InputFile;

/* Exemple : 
          <InputFile
            id="Maillage"
            label="Format .msh"
            size="lg"
            onChange={handleFileChange}
          />
          */