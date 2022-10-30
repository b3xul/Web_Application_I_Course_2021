import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Col, Form, Table } from 'react-bootstrap';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { iconDelete, iconEdit } from './icons';

function Title(props) {
    return (<Col>
        <h1>Your Exams</h1>
    </Col>);
}

function ExamTable(props) {

    const [exams, setExams] = useState(props.exams);

    const examCodes = exams.map(exam => exam.coursecode);

    const deleteExam = (code) => {
        setExams(oldExams => oldExams.filter(exam => exam.coursecode !== code));
    };

    const addExam = (newExam) => {
        // exams.push(exam) ; NOOO
        setExams(oldExams => [...oldExams, newExam]);
    };

    const updateExam = (newExam) => {
        setExams(oldState => oldState.map(
            (exam) => exam.coursecode === newExam.coursecode ? newExam : exam
            //We create and return a new array where all elements (exams) are equal to the old ones, except for the one that we just modified. N.B. since we're using the coursecode to identify which element to change, we cannot allow to modify the coursecode in edit mode, otherways it will be a mess!
        ));
    };

    return (
        <Switch>
            <Route path='/' exact>
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Exam</th>
                            <th>Score</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam => <ExamRow key={exam.coursecode} exam={exam}
                            examName={props.courses.filter(c => c.coursecode === exam.coursecode)[0].name}
                            deleteExam={deleteExam}
                        />))}
                    </tbody>
                </Table>
                <Link to='/add'><Button variant='success'>Add</Button></Link>
            </Route>
            <Route path='/add'>
                <ExamForm courses={props.courses.filter(course => !examCodes.includes(course.coursecode))} addOrUpdateExam={addExam} />
                {/* We call it addOrUpdate so that the ExamForm doesn't need to distinguish between the 2 different properties that are being passed, but it just needs to call that function, then the right one will be called since we passed the right one. */}
            </Route>
            <Route path='/update'>
                <ExamForm courses={props.courses} addOrUpdateExam={updateExam} />
            </Route>
        </Switch>
    );
}

function ExamRow(props) {
    return (<tr>
        <ExamInfo {...props} />
        <ExamControls exam={props.exam} deleteExam={props.deleteExam} />
    </tr>
    );
}

function ExamInfo(props) {
    return (<>
        <td>{props.examName}</td>
        <td>{props.exam.score}</td>
        <td>{props.exam.date.format('DD MMM YYYY')}</td>
    </>);
}

function ExamControls(props) {
    return <td>
        <Link to={{ pathname: '/update', state: { exam: props.exam } }}>{iconEdit}</Link>
        {/* Pass parameters to the receiving component, through the Router and store into location.state.exam
        For now it is easier to just pass the object around since we already have it in memory. When we'll have a server though, we could use parametric URLs to choose exactly which exam to fetch from the server: /update/01FXYOV  (Route path='/update/:coursecode' -> information embedded in the url instead of passing information as a link state)
        */}
        <span onClick={() => props.deleteExam(props.exam.coursecode)}>{iconDelete}</span>
    </td>;
}

function ExamForm(props) {
    const location = useLocation();
    // if location.state is defined => we are in Update mode-> location.state.exam has the starting values for the state variables
    // if location.state is undefined => we are in Add mode-> empty state variables

    const [course, setCourse] = useState(location.state ? location.state.exam.coursecode : '');  // props.courses[0].coursecode
    const [score, setScore] = useState(location.state ? location.state.exam.score : '');
    const [date, setDate] = useState(location.state ? location.state.exam.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const [errorMessage, setErrorMessage] = useState();

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        // MUST DO VALIDATION!!!!
        let valid = true;
        if (course === '' || score === '' || date === '')
            valid = false;
        const scorenumber = +score;
        if (scorenumber < 18 || scorenumber > 30)
            valid = false;
        // ADD MORE CHECKS....

        if (valid) {
            setErrorMessage('');
            const exam = { coursecode: course, score: scorenumber, date: dayjs(date) };
            props.addOrUpdateExam(exam);    //The form only knows that when the data is valid it should call this callback, whichever it might be!

            // GO BACK TO THE HOME PAGE: we don't set location.history.push(), we just use the normal react behaviour: we set a state variable using a callback, which will trigger React to re-render the component, which will be re-rendered differently since one of its state variables has changed ({submitted && <Redirect to='/'></Redirect>}), trying to render a Redirect, which will then force a redirection! Functional way to redirect!
            setSubmitted(true); //N.B. we don't setSubmitted(false) anywhere, because after this we are sure that this component disappeared, so the next time it will be rendered, it will be rendered from scratch, using values provided by the useState() hook! For this same reason we don't need to reset the values of the field

            // setCourse('');
            // setScore('');
            // setDate('');
        } else {
            setErrorMessage('Error in the form...');
        }

    };

    return (
        <>
            {submitted && <Redirect to='/'></Redirect>}
            {/* WHEN submitted===true, we try to render the Redirect component! (and all the others, but as soon as we try to render it, the page will change, so it doesn't matter) We could also modify the code to render either the Redirect OR the Form depending on the value of submitted, but the result is the same! */}
            <Form>
                <span style={{ color: 'red' }}>{errorMessage}</span>
                <Form.Group controlId='selectedCourse'>
                    <Form.Label>Course</Form.Label>
                    <Form.Control as="select" value={course}
                        disabled={location.state}
                        // If location.state is defined, we are in update mode, so we need to disable that element, while in add mode it should be editable
                        onChange={ev => setCourse(ev.target.value)}>
                        <option disabled hidden value=''>choose...</option>
                        {props.courses.map(course => <option key={course.coursecode} value={course.coursecode}>{course.name}</option>)}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId='selectedScore'>
                    <Form.Label>Score</Form.Label>
                    <Form.Control type='number' min={18} max={31} value={score} onChange={ev => setScore(ev.target.value)} />
                </Form.Group>
                <Form.Group controlId='selectedDate'>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type='date' value={date} onChange={ev => setDate(ev.target.value)} />
                </Form.Group>
                <Button onClick={handleSubmit}>Save</Button>
                {/* I can't just insert this button inside a Link, otherways the callback won't execute! We need a button to call the callback, and then, after it is executed, the redirection is done automatically! */}
                <Link to='/'><Button variant='secondary' >Cancel</Button></Link>
            </Form></>);
}

export { Title, ExamTable };