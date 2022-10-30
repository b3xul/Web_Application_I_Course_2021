import dayjs from 'dayjs';
import { useState } from 'react';
import { Col, Table } from 'react-bootstrap';
import { iconDelete, iconEdit } from './icons';

function Title(props) {
    return (<Col>
        <h1>Your Exams</h1>
    </Col>);
}

function ExamTable(props) {

    // If we want to be able to modify which exams will appear, the exams cannot be a property, since they are read only, but they must be a state variable!
    const [exams, setExams] = useState(props.exams); // Could be dangerous with database

    const examCodes = exams.map(exam => exam.coursecode);

    const deleteExam = (code) => {  // code contains the props.exam.coursecode of the exam inserted in the ExamRow containing the span that was clicked.
        setExams(oldExams => oldExams.filter(exam => exam.coursecode !== code));
        // N.B. We cannot delete 1 line, we must recreate a new array, where that line disappeared!!! But since we are creating an array that depends on the previous array (newstate that depends on the oldstate), we must do that inside a callback! When it is executed, ExamTable will be re-rendered, React notice which child ExamRow key is missing in the re-rendered version and propagates that difference to all its children, deleting only all the children of the removed component automatically. Everything is regenerated from the state every time, so once we have the mechanism for generating one snapshot of the application starting from a state, then we only need to care about how to modify the state according to user action.
    };

    const addExam = (newExam) => {
        // exams.push(exam) ; NOOO!!! We can't modify exams directly! We need to start from old value of the state and create the new value of the state
        setExams(oldExams => [...oldExams, newExam]);
    };

    return (
        <>
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
                    {/* First version: no states 
                {props.exams.map(
                    (exam => <ExamRow key={exam.coursecode} exam={exam}
                        examName={props.courses.filter(c=>c.coursecode === exam.coursecode)[0].name}/>))
                }*/}

                    {exams.map((exam => <ExamRow key={exam.coursecode} exam={exam}
                        examName={props.courses.filter(c => c.coursecode === exam.coursecode)[0].name}
                        deleteExam={deleteExam}
                    />))}
                </tbody>
            </Table>
            <ExamForm courses={props.courses.filter(course => !examCodes.includes(course.coursecode))} addExam={addExam} />
            {/* Prevent the user to select courses present in the current list of exams. This is also updated every time a new exam is added, thanks to the upward propagation that happens when the re-rendering is triggered! */}
        </>
    );
}

function ExamRow(props) {
    return (<tr>
        <ExamInfo {...props} /> {/* Propagate the properties (key and exam, which is the object that contains all the field of THAT exam) expanded using ... */}
        <ExamControls exam={props.exam} deleteExam={props.deleteExam} /> {/* Propagate the exam and the reference to the function, defined in the father, that the child ExamControl will need to call */}
    </tr>
    );
}

function ExamInfo(props) {
    // (It will later get information from the server, but now it gets them statically) from App.js->App()->ExamTable->ExamRow->ExamInfo. N.B. Only App() knows that they are static and not received from server. We will only need to change it later.
    return (<>
        <td>{props.examName}</td>
        <td>{props.exam.score}</td>
        <td>{props.exam.date.format('DD MMM YYYY')}</td>
    </>);
}

function ExamControls(props) {
    return <td>{iconEdit} <span onClick={() => props.deleteExam(props.exam.coursecode)}>{iconDelete}</span></td>;   // we add span so that we can attach the event handler 
}

function ExamForm(props) {
    //Form containing input elements for creating a new exam
    /* Static version:
    <form> <Form> similar behaviour!
    <select>=dropdown menu 
    especially date are very different in different browsers! 
    return (
        <form>
            Exam: <select><option>Exam1</option><option>Exam2</option> </select><br />
            Score: <input type="text"><br />
            Date: <input type="date"><br />
                    <button>Add</button>
        </form>
    );*/


    /* N.B. Detail: if useState(), the state value is undefined at the start of the function. This is equivalent to not setting the value of the state, and for this reason it is still possible to alter the DOM element directly, even without the event handler. Even just with an empty string, the value of the DOM element is fixed, and we need the onChange handler to be able to modify it. We also have a warning: you provided a value propt to a form field without an onChange handler: this will render a read-only field! For uncontrolled elements use defaultValue, otherways set onChange or readOnly! defaultValue only set the starting value and then let the element run uncontrolled, which is not what we want with controlled components. If we want to use a starting value we can just change the useState value! If we want to use the element as a controlled one, we MUST provide an initial default value different from undefined, otherways React would consider that element as uncontrolled, and then it will become controlled! Problems! */
    const [course, setCourse] = useState('');  // props.courses[0].coursecode instead of '' (possible error)
    const [score, setScore] = useState('');
    const [date, setDate] = useState('');   //date is a string
    const [errorMessage, setErrorMessage] = useState();

    const handleAdd = (event) => {
        event.preventDefault(); //!!!

        // MUST DO VALIDATION!!!!
        let valid = true;   // not a state variable!
        if (course === '' || score === '' || date === '')
            valid = false;
        const scorenumber = +score; // Convert string to integer
        if (scorenumber < 18 || scorenumber > 30)
            valid = false;
        // ADD MORE CHECKS.... date not in the future..

        if (valid) {
            setErrorMessage('');
            const exam = { coursecode: course, score: scorenumber, date: dayjs(date) }; // Just use internal states!
            props.addExam(exam);
            // Reset exam so that it would be impossible for a user to re-create it, since it would then disappear from the dropdown menu! 
            setCourse('');
            setScore('');
            setDate('');
        } else {
            setErrorMessage('Error in the form...'); //Set error inside the component itself! (customize directly when setting valid=false!) also place error close to wrong field!
        }

    };


    return (
        <form>
            Exam: <select value={course} onChange={ev => setCourse(ev.target.value)}>   {/* The value attribute of the select contains a copy of the value attribute of the option that has currently being selected by the user */}
                <option value='' disabled>Choose one...</option> {/* This is essential if we use as useState the empty string, because otherways the internal state will be '', but the empty string can't be displayed since it is not one of the available options for the select element, so the browser will pick the first one available! Displayed name won't correspond to real state value! */}
                {props.courses.map(course => <option key={course.coursecode} value={course.coursecode}>{course.name}</option>)}
            </select><br />
            {/* How to avoid the possibility to the user to select an exam already present in the exam table? It would be an expensive check to do at runtime, but we can anticipate it in the ExamTable! */}
            Score: <input type='number' min={18} max={30} value={score} onChange={(event) => { setScore(event.target.value); }} /><br />
            {/* Since we are not considering the old score value, we do not need a different updateScore function. Could also use a dropdown menu */}
            Date: <input type='date' value={date} onChange={ev => setDate(ev.target.value)} /><br />
            <button onClick={handleAdd}>Add</button><br /> {/* We need to prevents default behaviour! (see handleAdd function) */}
            <span style={{ color: 'red' }}>{errorMessage}</span>
            {/* N.B. DO NOT PUT (valid)?..:.. BECAUSE IT WOULD REFER TO THE VALUE OF VALID WHEN THE ExamForm function is called, not to the value when the eventHandler is called, because valid IS NOT A STATE VARIABLE! Inside the rendering return part, only PROPERTIES AND STATE FUNCTIONS MUST APPEAR! We also can't transform valid into a state function, because otherways setState will be executed asynchronously, and if(valid) would lose meaning since it would not have been updated yet!!! */}
        </form>);
}

export { Title, ExamTable };