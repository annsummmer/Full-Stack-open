import Course from "./Course.jsx";

const Courses = ({ courses}) => {
  return <>
    {courses.map(course => (
      <Course key={course.id} course={course}/>
      ))}
  </>;
}

export default Courses;