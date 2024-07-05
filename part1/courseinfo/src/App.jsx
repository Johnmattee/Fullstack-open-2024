const Header = (props)=>{
  return(
<h1>{props.course}</h1>
  )
}

const Content = ({parts})=>{
return(
  <>
  {
    parts.map((part)=>{
      let {name, exercises} = part
      return <Part name ={name} exercise = {exercises}/>
    })
  }
  </>
)   
}

const Part = (props)=>{
  return(
    <p>{props.name} {props.exercise}</p>
  )
}

const Total = ({parts})=>{
  let exerciseArray = parts.map((part)=>part.exercises)
  let sum = exerciseArray.reduce((a,b)=>a+b)
  return(
    <p>{sum}</p>
  )
}

const App = () => {
  
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course = {course.name}/>
      <Content parts = {course.parts}/>
      <Total parts = {course.parts} />
    </div>
  )
}

export default App
