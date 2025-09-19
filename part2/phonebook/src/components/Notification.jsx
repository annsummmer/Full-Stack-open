const Notification = ({message}) => {
  return message.text ? (
    <div className={`${message.status} message`}>
      {message.text}
    </div>
  ) : null;
}

export default Notification;