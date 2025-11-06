import { useState } from 'react';

const Togglable = ({ showButtonLabel, hideButtonLabel, children }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // ASK: key={visible}
  return <div>
    <div style={hideWhenVisible}>
      <button onClick={toggleVisibility}>{showButtonLabel}</button>
    </div>
    <div key={visible} style={showWhenVisible}>
      {children}
      <button onClick={toggleVisibility}>{hideButtonLabel}</button>
    </div>
  </div>;
};


export default Togglable;