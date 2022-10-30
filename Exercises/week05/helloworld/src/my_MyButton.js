import { useState } from "react";
import Button from 'react-bootstrap/Button';

const messages = {
    'en': 'Hello World',
    'it': 'Ciao Mondo'
};

function MyButton(props) {

    /*1. 
    <MyButton text='Hello World'/>
    <MyButton text='Ciao Mondo'/>
    ----------------------------------------------------------------
    return (<button> {props.text || "Hi!"} </button>); (if props.text is undefined)
    */

    /*2.
    <MyButton lang='en'/>
    <MyButton lang='it'/>
    ---------------
    const messages = {
    'en': 'Hello World',
    'it': 'Ciao Mondo'
    };

    let text="Hi!"
    if(props.lang) text=messages[props.lang];
    return (<button> {text} </button>);
    */

    /*3.
    <MyButton lang='en'/>
    <MyButton lang='it'/>
    ---------------
    const messages = {
    'en': 'Hello World',
    'it': 'Ciao Mondo'
    };
    let [lang, setLang] = useState(props.lang || 'en');
    // useState returns a state variable (with initial value=props.lang||'en') and the method that MUST BE USED to change the value of that state variable (seLang)

    // from now on the button can render itself only watching its current STATE (lang), which may be modified many times during execution,
    // while in the previous cases we could not have any dynamic behavior!
    return (<button> {messages[lang]} </button>);
    */

    /*4.*/
    //<MyButton lang='en' size={2}/> -> props.lang='en' props.size=2 (Only strings can be inside "", other types of values must be interpreted by js using {} )
    // Also expression can be used inside {}
    let [lang, setLang] = useState(props.lang || 'en');
    return (
        //onClick can easily associate an event handler to any component 
        <Button onClick={(event) => {   // { -> identifies start of JS code instead of JSX! 
            if (lang === 'it')
                setLang('en');  // asynchronously called. When it will be called, the page will be "completely" re-rendered
            // lang = 'en' ; // WROOOONG
            else
                setLang('it');
        }}>
            {messages[lang]}
        </Button>
    );

}

export default MyButton;