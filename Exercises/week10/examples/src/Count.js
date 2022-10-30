import { useEffect } from "react";

function Count(props) {
    useEffect(()=> {console.log('Always '+props.num)}) ;
    useEffect(()=> {console.log('Once   '+props.num)}, []) ;
    useEffect(()=> {console.log('On Demand '+props.num)}, [props.num]) ;


    return <h2>{props.num}</h2>
}

export default Count ;