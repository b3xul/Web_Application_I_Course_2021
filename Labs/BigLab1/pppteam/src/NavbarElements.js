/* React imports */
import { Link } from "react-router-dom";

/* Bootstrap imports */
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

/* Bootstrap icons imports */
import { BsCheckAll, BsPeopleCircle } from "react-icons/bs";

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

function UserIcon(props) {
    return (
        <Nav className="order-sm-4 ml-sm-auto">
            <Link to='/'>
                <BsPeopleCircle id="User_Icon" size={32}>
                    <title>User Icon</title>
                </BsPeopleCircle>
            </Link>
        </Nav>
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

export { Toggler, LogoName, UserIcon, SearchBar };