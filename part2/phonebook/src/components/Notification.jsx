const Notification = ({message}) => {
  // why do we need both !message || !message.text
  return message.text ? (
    <div className={`${message.status} message`}>
      {message.text}
    </div>
  ) : null;
}

export default Notification;