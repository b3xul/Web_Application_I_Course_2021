import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

const games = ['Poker', 'Black Jack', 'Chess', 'Tetris']; // info only available to the application (will be on server)

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
    //ButtonGroup is the responsible for selecting/deselecting buttons because it is the only one that knows all
    const [selected, setSelected] = useState('Poker');

    const updateSelected = (name) => setSelected(name);
    //This function doesn't know who called it, it is the component that must tell to it, passing its name. This function can also use other state variables, but they will be read-only! React re-renders the component only at the end of the synchronous function that contains the set function.

    return (
        <div>
            {props.names.map(n => <SimpleButton key={n} name={n} chosen={n === selected} updateSelected={updateSelected} />)}
            {/* For each string we create a simple button with that name. N.B. each time we return an array of elements we need to assign an unique name to each one!
            chosen is true if selected===name of the button*/}
        </div>
    );
}

function SimpleButton(props) {
    if (props.chosen)
        return (<button>**{props.name}**</button>);
    else
        return (<button onClick={() => props.updateSelected(props.name)}>{props.name}</button>);
    // The only way for a child to update the state of a parent is for the parent to pass the set function reference to the child using a property, and then for the child to use that function to modify the state!!! (ask the parent to modify the state) (in this easy case we can directly pass setSelected, but usually more checks from the father would be needed inside the updateSelected function N.B. the function is executed inside the father!)

    //When I click on 1 unselected button as soon as it is its turn to execute, the updateSelected (setSelected) functions will be executed, so React will know that it need to re-render the ButtonGroup and all of its children. Thanks to the key group React knows that it doesn't need to re-render all the children, but only the ones that changed (who changed chosen properties). The data flow (rendering) is top-down while the control flow is bottom-up, but everything is summarized in state changes.
}

function Counter(props) {   //write props even if not used for consistency
    /* without state variable 
    let count = 33;
    return (<p>{count}
        <button onClick={count++}>+</button>
        {/*this will increase count, but when react will re-render this component (it doesn't know the value has changed and it needs to do it as soon as possible), it will execute let count=33 again, so it will never display 34! useState has a behaviour similar to C static functions. }
    </p >);
    */
    const [count, setCount] = useState(props.start); //this will only take the initial props.start value

    //Thanks to const we are sure to avoid using count++ (modify count directly)
    const increaseSlow = () => {
        setTimeout(() => { setCount(oldCount => oldCount + 1); }, 500); //always use this when we need the previous value of the state variable because oldCount will refer to the actual value of the state variable when the callback is executed

        //setTimeout(() => { setCount(count+1); }, 500); would be wrong because it will first take the value of count at the scheduling of the callback, but while the callback is waiting to be executed, the count value may have been changed, so when it will be re-rendered, it would refer to a previous value which is not the current anymore! We could click and nothing changes because it was too fast! Using the oldCount argument instead, we won't lose any click, because every time the function is executed, it will take the current value!

    };
    //Since increase is slower, 0->increaseSlow1->increaseSlow2->decreaseFast->(-1)->execution1(0)->execution2(1) : correct behaviour

    return (<p>{count}
        <button onClick={increaseSlow}>+</button>
        {/* this schedules the event */}
        <button onClick={() => { setCount(oldCount => oldCount - 1); }}>-</button>
        <button onClick={() => { setCount(props.start); }}>X</button> {/* This will take the value of props.start when the re-render happens */}
        {/*setCount will force the execution of the Counter function again, but this time without initializing count again, since the Counter has not been destroyed in the meantime, it has just been re-evaluated! (re-rendered) (if we refresh the page, all will be destroyed and then re-created) */}
        {/*<button onClick={setCount(props.start)}}></button> assigns to the onClick property the return value of the setCount(0) function. But I do not want to call the setCount(0) while I'm returning what to render, I want to call it when someone clicks on the button: I want to assign to the onClick property the callback to execute when someone clicks on the button. When they click, then the setCount(0) function will be executed*/}
    </p>);
}

export default App;
