/* React imports */
import { Link } from "react-router-dom";

/* Bootstrap imports */
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

/* Bootstrap icons imports */
import { BsCheckAll } from "react-icons/bs";

function Toggler(props) {
    return (
        <Navbar.Toggle as="button" onClick={props.toggleVisibility} label="Toggle searchbar and sidebar" aria-controls=".toToggle" aria-expanded={props.visible} />
    );
}

function LogoName(props) {
    /* User functionalities not yet implemented */
    return (
        <Link to='/'>
            <Navbar.Brand id="App_Logo_and_Name" aria-label="To Do Manager Logo">
                <BsCheckAll size={32}>
                    <title>App_Logo</title>
                </BsCheckAll>
                My Task Manager
            </Navbar.Brand>
        </Link>
    );
}

function SearchBar(props) {
    return (
        <Navbar.Collapse>
            <Form id="Search_Form" className="toToggle ml-auto mr-auto">
                <FormControl className="order-sm-3 mr-sm-3" type="search" placeholder="Search" aria-label="Search" />
            </Form>
        </Navbar.Collapse>
    );
}

export { Toggler, LogoName, SearchBar };