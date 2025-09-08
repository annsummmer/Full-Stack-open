import { useState } from 'react'

const StatisticLine = ({text, value}) => {
  return <>
    <tr>
      <td>{text}</td>
      <td>{text === 'positive' ? value + '%' : value}</td>
    </tr>
  </>
}

const Button = ({text, handleClick}) => <button onClick={handleClick}>{text}</button>

const Statistics = ({good, neutral, bad, average, all, positive}) => (<div>
    <table>
      <tbody>
        <StatisticLine text="good" value ={good} />
        <StatisticLine text="neutral" value ={neutral} />
        <StatisticLine text="bad" value ={bad} />
        <StatisticLine text="all" value ={all} />
        <StatisticLine text="average" value ={average} />
        <StatisticLine text="positive" value ={positive} />
      </tbody>
    </table>
  </div>);

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + neutral + bad;
  const average = (good + bad * -1) / all;
  const positive = (good * 100 / all);

  const addGoodScore = () => {
    setGood(good + 1);
  }

  const addNeutralScore = () => {
    setNeutral(neutral + 1);
  }

  const addBadScore = () => {
    setBad(bad + 1);
  }

  let statistics = <p>No feedback given</p>;
  if (all !== 0) {
    statistics = <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>;
  }

  return (
    <>
      <div>
        <h2>give feedback</h2>
        <Button text={'good'} handleClick={addGoodScore} />
        <Button text={'neutral'} handleClick={addNeutralScore} />
        <Button text={'bad'} handleClick={addBadScore} />
      </div>
      <h2>Statistics:</h2>
      {statistics}
    </>
  );
}

export default App