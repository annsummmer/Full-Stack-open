const Input = ({ label, value, onChange }) => (
  <div>
    <label>
      {label}:
      <input
        value={value}
        name={label}
        onChange={e => onChange(e.target.value)}
        type="text"
      />
    </label>
  </div>
);

export default Input;
