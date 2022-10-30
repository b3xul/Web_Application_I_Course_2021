import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row, Alert } from 'react-bootstrap';
import { ExamScores } from './ExamComponents.js';
import AppTitle from './AppTitle.js';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import API from './API';
import { LoginForm, LogoutButton } from './LoginComponents';

function App() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        await API.getUserInfo();
        setLoggedIn(true);
      } catch(err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  useEffect(()=> {
    const getCourses = async () => {
      if(loggedIn) {
        const courses = await API.getAllCourses();
        setCourses(courses);
      }
    };
    getCourses()
      .catch(err => {
        setMessage({msg: "Impossible to load your exams! Please, try again later...", type: 'danger'});
        console.error(err);
      });
  }, [loggedIn]);

  useEffect(()=> {
    const getExams = async () => {
      const exams = await API.getAllExams();
      setExams(exams);
    };
    if(courses.length) {
      getExams().catch(err => {
        setMessage({msg: 'Impossible to load your exams! Please, try again later...', type: 'danger'});
        console.error(err);
      });
    }
  }, [courses.length]);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user}!`, type: 'success'});
    } catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setCourses([]);
    setExams([]);
  }

  return (<Router>
    <Container className="App">
      <Row>
        <AppTitle/>
        {loggedIn ? <LogoutButton logout={doLogOut} /> : <Redirect to="/login" />}
      </Row>
      {message && <Row>
         <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
      </Row> }

      <Switch>
        <Route path="/login" render={() => 
          <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
        }/>

        <Route path="/" render={() =>
        <>
          {loggedIn ?
            <Row>
              <ExamScores exams={exams} courses={courses} />
            </Row>
          : <Redirect to="/login" /> }
        </>
        } />
        
      </Switch>
    </Container>
  </Router>);
}

export default App;
