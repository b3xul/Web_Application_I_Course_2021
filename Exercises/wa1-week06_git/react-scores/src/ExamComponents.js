import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Col, Form, Table } from 'react-bootstrap';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { iconDelete, iconEdit } from './icons'

function Title(props) {
    return (<Col>
        <h1>Your Exams</h1>
    </Col>)
}

function ExamTable(props) {

    const [exams, setExams] = useState(props.exams);

    const examCodes = exams.map(exam => exam.coursecode);

    const deleteExam = (code) => {
        setExams(oldExams => oldExams.filter(exam => exam.coursecode !== code));
    }

    const addExam = (newExam) => {
        // exams.push(exam) ; NOOO
        setExams(oldExams => [...oldExams, newExam]);
    };

    const updateExam = (newExam) => {
        setExams( oldState => oldState.map( 
            (exam) => exam.coursecode===newExam.coursecode ? newExam : exam
            ) ) ;
    }

    return (<Switch>
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
        </Route>
        <Route path='/update'>
            <ExamForm courses={props.courses} addOrUpdateExam={updateExam}/>
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
    </>)
}

function ExamControls(props) {
    return <td>
        <Link to={{pathname:'/update', state: {exam: props.exam} }}>{iconEdit}</Link>
        <span onClick={() => props.deleteExam(props.exam.coursecode)}>{iconDelete}</span>
        </td>;
}

function ExamForm(props) {
    const location = useLocation() ;
    // location.state is defined => we are in Update mode, and location.state.exam has the starting values
    // location.state is undefined => we are in Add mode

    const [course, setCourse] = useState(location.state ? location.state.exam.coursecode : '');  // props.courses[0].coursecode
    const [score, setScore] = useState(location.state ? location.state.exam.score : '');
    const [date, setDate] = useState(location.state ? location.state.exam.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));
    const [errorMessage, setErrorMessage] = useState();

    const [submitted, setSubmitted] = useState(false) ;

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
            setErrorMessage('')
            const exam = { coursecode: course, score: scorenumber, date: dayjs(date) };
            props.addOrUpdateExam(exam);

            // GO BACK TO THE HOME PAGE
            setSubmitted(true) ;

            // setCourse('');
            // setScore('');
            // setDate('');
        } else {
            setErrorMessage('Error in the form...');
        }

    };

    return (<>
        {submitted && <Redirect to='/'></Redirect>}
        <Form>
            <span style={{ color: 'red' }}>{errorMessage}</span>
            <Form.Group controlId='selectedCourse'>
                <Form.Label>Course</Form.Label>
                <Form.Control as="select" value={course}
                    disabled={location.state}
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
            <Link to='/'><Button variant='secondary' >Cancel</Button></Link>
        </Form></>);
}

export { Title, ExamTable };