const Notification = ({ message, status }) => {
  const classes = `notification ${status}`;
  return <div className={classes}>{message}</div>;
};

export default Notification;