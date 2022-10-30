import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row } from 'react-bootstrap';
import { ExamScores, ExamForm } from './ExamComponents.js';
import AppTitle from './AppTitle.js';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import API from './API';


function App() {
  const [courses, setCourses] = useState([]); // substitute the fakeCourses list
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(true); // loading at mount, after courses are loaded it remains false forever
  const [dirty, setDirty] = useState(true); // exams are dirty. true at mount time because I need to execute the rehydrating at mount time. Only flag used to manage the run of the rehydrating, but only works if there is a single operation in progress, while with multiple operations some updates may be lost because we only have a boolean. If we can make it difficult for the user to try to perform multiple operations before the previous one completed, then this is a good solution (but real concurrency can't ever be achieved! Only better approssimations!)

  // Rehydrate courses at mount time
  useEffect(() => {
    API.loadAllCourses().then(newC => setCourses(newC)); //catch and all error handling only after the functional behaviour is correct! To handle errors reload from the server whenever possible!
  }, []);

  // Rehydrate exams at mount time, and when courses are updated. After courses are loaded we want to refresh the exams because they are using information from the courses!
  useEffect(() => {
    // the only hook used to rehydrate the exams from the server any time the courses or the exams are updated (add/update/delete)!!

    // the first time this is executed at mount time but no information are yet available at that moment, because the list of courses hasn't been rehydrated yet! We can avoid this execution adding this check on courses.length!

    if (courses.length && dirty) {
      API.loadAllExams().then(newEx => {
        setExams(newEx);
        setLoading(false);
        setDirty(false);  //local data is synched with server data
      });
    }

    // dirty can also be set to true after a timeout, so that if we watch the data from 2 different browser, they will see the update even if they didn't made requests!
  }, [courses.length, dirty]); // NOT COURSES, OTHERWAYS INFINITE LOOP! Since courses are updated only on mount, and that refreshing changes courses.length from 0 to 5, after that change this useEffect will run again, with all the information it needs! 


  const examCodes = exams.map(exam => exam.coursecode);

  const deleteExam = (coursecode) => {
    setExams((exs) => exs.filter(ex => ex.coursecode !== coursecode));
    // API.deleteExam(exam).then((err) => { setDirty(true); });
  };

  const addExam = (exam) => {
    setExams(oldExams => [...oldExams, exam]);  // local update could contain also a field "temporary" that can be used by the ExamRow to give a visual feedback (grey text) to tell the user that the update is only temporary for now! We could also pass the dirty flag to the various component so that we disable the buttons while the previous operation has not completed yet! (so that we help to keep the correct state of the application!)

    API.addNewExam(exam).then((err) => { setDirty(true); });
    // instead of adding loadAllExam logic here and duplicate it we just have a single useEffect!

    // server update FROM THE EVENT HANDLER (the other way would be that the event handler set a flag, which is a dependency of an useEffect hook, that during the commit phase will do the server update(more precise because use hook, but less readable since you need to manage an extra flag)->no consensus about which is the best place to fetch the server. Since after the update we need to be sure that the local state is synched with the server, we need a dirty flag state variable!

    // If I manage error, I should rehydrate data anyways!

    // If the post is slow to return (addNewExamSlow) (slow server/slow network), only when the promise is fulfilled the new get will be done!

    // setDirty(true) outside the then would be wrong because I have to be sure to rehydrate the data only after the server state really changed
  };

  const updateExam = (exam) => {
    setExams(oldExams => {
      return oldExams.map(ex => {
        if (ex.coursecode === exam.coursecode)
          return { coursecode: exam.coursecode, score: exam.score, date: exam.date };
        else
          return ex;
      });
    });
  };
  console.log(exams);
  return (<Router>
    <Container className="App">
      <Row>
        <AppTitle />
      </Row>

      <Switch>
        <Route path="/add" render={() =>
          <ExamForm courses={courses.filter(course => !examCodes.includes(course.coursecode))} addOrUpdateExam={addExam}></ExamForm>
        } />

        <Route path="/update" render={() =>
          <ExamForm courses={courses} addOrUpdateExam={updateExam}></ExamForm>
        } />

        <Route path="/" render={() =>
          <Row>

            {loading ? <h2>Please wait...</h2> :
              <ExamScores exams={exams} courses={courses} deleteExam={deleteExam} />
            }
          </Row>
        } />

      </Switch>
    </Container>
  </Router>);
}

export default App;
