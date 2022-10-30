import { useEffect, useState } from 'react';

function Flipper(props) {

    const [text, setText] = useState('');
    const [flipped, setFlipped] = useState('');

    useEffect(() => {
        /*definition of async function*/
        async function loadFlipped() {
            /* N.B. NOT A GOOD PRACTICE TO HAVE API CODE INSIDE COMPONENTS BECAUSE IT CREATES A BINDING! Better have them in a different file*/
            /*Package.json is modified to have react dev server as client towards our express API server*/
            const response = await fetch('/api/flip?text=' + text); /* Internal call to the API url*/
            const flippedText = await response.json(); /* Can only be executed after response will be available (promise fulfilled) */
            setFlipped(flippedText.text); /* We need to extract the text property of the object returned by response.json, and this will trigger an asynchrounous change of the flipped state variable */
        }
        /*invocation of async function*/
        loadFlipped();
    }, [text]); /* This useEffect will be called whenever text changes its value*/

    return <div>
        {/* Normal management of text area with React */}
        Text: <input type='text' value={text} onChange={(ev) => setText(ev.target.value)}></input><br />
        Flipped: {flipped}
    </div>;
}

/* Timeline(...=asynch): click->... run onChange callback (setText)->updating-rendering with different value for text state variable-> updating-commit ...run useEffect callback (fetch)->updating-rendering with different value for flipped->updating-commit nothing is run...*/
export default Flipper;