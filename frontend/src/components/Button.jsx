import React from 'react';
import '../css/global.css'

function Button({ label, color = '#007bff', onClick }) {
  const style = {
    '--btn-color': color
  };

  return (
    <button className="btn" style={style} onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
