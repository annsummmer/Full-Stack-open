import {useState} from "react";

export function useNotification () {
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const showNotification = (message, status) => {
    if (status === 'success') {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      console.log(successMessage, message, status);
    } else {
      setErrorMessage(message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return {
    showNotification,
    errorMessage,
    successMessage
  };
}
