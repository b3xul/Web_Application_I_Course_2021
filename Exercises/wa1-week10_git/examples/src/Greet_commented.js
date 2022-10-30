import { useEffect } from 'react';

function Greet(props) {
    const message = 'Hello, ' + props.name;

    useEffect(() => { // thanks to closure we can see the message from the callback
        console.log(message);   // this will be executed during the commit phase (second)
    });

    console.log("HERE"); // this will be executed during the rendering phase (first, controlled by react!)

    return <h1>{message}</h1>;
}

export default Greet;