import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const games = ['Poker', 'Black Jack', 'Chess', 'Tetris'];

function App() {
  return (<>
    <Counter start={10} />
    <Counter start={20} />
    <Counter start={-1} />

    <ButtonGroup names={games} />

  </>
  );
}

function ButtonGroup(props) {
  const [selected, setSelected] = useState('Poker');

  const updateSelected = (name)=>setSelected(name) ;

  return (<div>{props.names.map(n => <SimpleButton key={n} name={n} chosen={n === selected} 
      updateSelected={updateSelected} />)}</div>);
}

function SimpleButton(props) {
  if (props.chosen)
    return (<button>**{props.name}**</button>);
  else
    return (<button onClick={()=>props.updateSelected(props.name)}>{props.name}</button>);
}

function Counter(props) {
  const [count, setCount] = useState(props.start);

  const increaseSlow = () => {
    setTimeout(() => { setCount(oldCount => oldCount + 1) }, 500);
  }

  return (<p>{count}
    <button onClick={increaseSlow}>+</button>
    <button onClick={() => { setCount(oldCount => oldCount - 1) }}>-</button>
    <button onClick={() => { setCount(props.start) }}>X</button>
  </p>);
}

export default App;
