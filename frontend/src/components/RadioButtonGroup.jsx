import React, { useState } from 'react';

function RadioButtons({ options, onChange }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    if (onChange) onChange(value); // transmettre au parent
  };

  return (
    <div>
      {options.map((option, index) => (
        <div className="form-check form-check-inline" key={index}>
          <input
            className="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            id={`inlineRadio${index}`}
            value={option.value}
            checked={selectedOption === option.value}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor={`inlineRadio${index}`}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}

export default RadioButtons;

//exemple : <RadioButtons options={solverlist} onChange={handleSolverChange} />

/* 
avec   const solverlist = [
    { label: 'icoFoam', value: 'icoFoam' },
    { label: 'pisoFoam', value: 'pisoFoam' }
  ];
*/