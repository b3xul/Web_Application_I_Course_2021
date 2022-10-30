import { useEffect, useState } from "react";

function QuickGate(props) {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setTimeout(() => { setOpen(false) }, 500);
        }
    }, [open]);


    let openGate = () => {
        setOpen(true);
    }

    return <div onClick={openGate}>{open ? <span>OPEN!</span> : <span>CLOSED</span>}</div>;

}

export default QuickGate;