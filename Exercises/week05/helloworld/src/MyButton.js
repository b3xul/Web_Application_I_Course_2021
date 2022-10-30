import { useState } from "react";
import Button from 'react-bootstrap/Button';

const messages = {
    'en': 'Hello World',
    'it': 'Ciao Mondo'
}

function MyButton(props) {

    let [lang, setLang] = useState(props.lang || 'en');

    return (
        <Button onClick={(event) => {
            if (lang === 'it')
                setLang('en');
                // lang = 'en' ; // WROOOONG
            else
                setLang('it');
        }}>
            {messages[lang]}
        </Button>
    );

}

export default MyButton;