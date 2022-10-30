import { Form, Button, Alert, Row, Navbar, Container, Col } from 'react-bootstrap';
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LogoName } from './NavbarElements';

function LogInForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [valid, setValid] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        let flag = true;
        const credentials = { username, password };
        setValid('');
        if (username === '' || password === '' || password.length < 8)
            flag = false;
        if (flag)
            props.logIn(credentials);
        else
            setValid("There are errors, fix them");
    }

    return (
        <>

            <Row>
                <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
                    <LogoName />
                </Navbar>
            </Row>
            <Row>

                <Col id="login_section"> {/*  className={visible ? "closer_main" : ""}> */}

                    <Container fluid="sm" className='d-flex flex-column h-100'>
                        <Form>
                            {valid ? <Alert variant="danger">{valid}</Alert> : ''}
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                            </Form.Group>
                            <Button onClick={handleSubmit} color="success">LogIn</Button>
                        </Form>

                    </Container>
                </Col>
            </Row>

        </>
    );
}

export { LogInForm };