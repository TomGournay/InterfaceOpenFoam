function Inputtext({ text, onChange, placeholder }) {
    return (
      <input
        type="text"
        placeholder={placeholder}
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  export default Inputtext;

  // exemple : <Inputtext text={caseName} onChange={setCaseName placeholder="nom de la simulation" />