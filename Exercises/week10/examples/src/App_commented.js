import logo from './logo.svg';
import './App.css';
import Greet from './Greet';
import { useState } from 'react';
import Count from './Count';
import QuickGate from './QuickGate';

function App() {
  const [num, setNum] = useState(3);
  const [fake, setFake] = useState(3);

  return (
    <div className="App">
      <Count num={num} fake={fake} />
      <button onClick={() => { setNum(n => n + 1); }}>+</button>
      {/* This will execute the Always and the OnDemand hooks! */}

      <button onClick={() => { setFake(n => n + 1); }}>+</button>
      {/* This will only execute the Always hook, since OnDemand has only the num prop as a dependancy!
      N.B. Even if the component is not using the fake prop, since one of its properties changed React decides to re-render it anyway, so the Always hook is called! During the re-rendering, React will compare the new value with the previous one and only execute that hook if they are different */}
      <hr />
      <QuickGate />
    </div>
  );
}

export default App;
