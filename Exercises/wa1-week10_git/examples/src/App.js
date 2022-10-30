import logo from './logo.svg';
import './App.css';
import Greet from './Greet';
import { useState } from 'react' ;
import Count from './Count';
import QuickGate from './QuickGate';

function App() {
  const [num, setNum] = useState(3) ;
  const [fake, setFake] = useState(3) ;

  return (
    <div className="App">
      <Count num={num} fake={fake}/>
      <button onClick={()=>{ setFake(n=>n+1)}}>+</button>
      <hr/>
      <QuickGate/>
    </div>
  );
}

export default App;
