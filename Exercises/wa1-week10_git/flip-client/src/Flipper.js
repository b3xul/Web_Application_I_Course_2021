import { useEffect, useState } from 'react' ;

function Flipper(props) {

    const [text, setText] = useState('') ;
    const [flipped, setFlipped] = useState('') ;

    useEffect(()=>{
        async function loadFlipped() {
            const response = await fetch('/api/flip?text='+text) ;
            const flippedText = await response.json() ;
            setFlipped(flippedText.text) ;
        }
        loadFlipped() ;
    }, [text]) ;

    return <div>
        Text: <input type='text' value={text} onChange={(ev)=>setText(ev.target.value)}></input><br/>
        Flipped: {flipped}
    </div>
}

export default Flipper ;