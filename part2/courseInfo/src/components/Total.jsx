const Total = ({parts}) => {
  const total = parts.reduce((res, part) => {
    return res + part.exercises;
  }, 0);

  return <div><b>Total of {total} exercises</b></div>;
}

export default Total;