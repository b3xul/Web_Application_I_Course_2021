import { useEffect, useState } from "react";

function QuickGate(props) {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) { /* we don't need the timeout when the gate becomes closed */
            setTimeout(() => { setOpen(false); }, 500);
            /* setOpen(s=>!s); infinite loop!!! */
        }
    }, [open]); /* Consequences of changing the state of the open variable: setting timeout */


    let openGate = () => {
        setOpen(true);
        /* I don't want to set the timer here, because here we are in the render function, we don't want any side effect here! The timer would be a side effect because it depends on time, which can't be directly controlled by react! We want to set the timer only during the commit phase, when the component has already been handled and rendered by react! From that point (useEffect during commit phase), we want to start the timer!)
        Even for simply updating another state variable AFTER another updated it would be required!
        */
    };

    return <div onClick={openGate}>{open ? <span>OPEN!</span> : <span>CLOSED</span>}</div>;

}

export default QuickGate;