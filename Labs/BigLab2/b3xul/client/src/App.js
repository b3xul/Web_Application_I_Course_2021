import './App.css';

/* React imports */
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/* Bootstrap imports */
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Toast from 'react-bootstrap/Toast';
import Nav from 'react-bootstrap/Nav';

/* custom components */
import { Toggler, LogoName, SearchBar } from './NavbarElements';
import { LeftSidebar } from './LeftSidebar';
import { MainContent } from "./MainContent";
import { loggedInContext } from './loggedInContext';
import { LoginForm, LogoutButton } from './LoginForm';
import API from "./API";

/* Static information */
const TASKS = [];

/* filters */
const FILTERS = ['All', 'Important', 'Today', 'Next 7 Days', 'Private'];

function App() {

  /* Static tasks + tasks added during use */
  const [taskList, setTaskList] = useState(TASKS);
  const [dirty, setDirty] = useState(false);
  const [updatedId, setUpdatedId] = useState(-1); // used to show tasks differently when update is only local
  const [message, setMessage] = useState('');

  /* Function to set the new state variable adding a new task to the list */
  const addTask = (task) => {
    setUpdatedId(task.id);
    setTaskList((oldTaskList) => [...oldTaskList, task]); // local update
    API.addNewTask(task).then(() => { setUpdatedId(-1); setDirty(true); }).catch(err => handleErrors(err));  // in case of error rehydrate
  };

  /* Function to set the new state variable deleting a task from the list */
  const deleteTask = (id) => {
    setTaskList(oldTaskList => oldTaskList.filter(task => task.id !== id));
    API.deleteTask(id).then(() => { setDirty(true); }).catch(err => handleErrors(err));
  };

  /* Function to set the new state variable updating a task of the list */
  const updateTask = (updatedTask) => {
    setUpdatedId(updatedTask.id);
    setTaskList(oldTaskList => oldTaskList.map(task => task.id === updatedTask.id ? updatedTask : task));
    API.updateTask(updatedTask).then((err) => { setUpdatedId(-1); setDirty(true); }).catch(err => handleErrors(err));
  };

  /* Function to set the new state variable updating a task of the list */
  const setCompletedTask = (updatedTask) => {
    setUpdatedId(updatedTask.id);
    setTaskList(oldTaskList => oldTaskList.map(task => task.id === updatedTask.id ? updatedTask : task));
    API.setCompletedTask(updatedTask.id, updatedTask.completed).then((err) => { setUpdatedId(-1); setDirty(true); }).catch(err => handleErrors(err));
  };

  // Rehydrate tasks at mount time, and when tasks are dirty(after add,update,delete).
  useEffect(() => {
    if (dirty) {
      API.loadAllTasks().then(newTaskList => {
        setTaskList(newTaskList);
        setDirty(false);  //local data is synched with server data
      }).catch(err => handleErrors(err));
    }
  }, [dirty]); // NOT COURSES, OTHERWAYS INFINITE LOOP! Since courses are updated only on mount, and that refreshing changes courses.length from 0 to 5, after that change this useEffect will run again, with all the information it needs! 

  // show error message in toast
  const handleErrors = (err) => {
    setMessage({ msg: err.error, type: 'danger' });
    console.log(err);
  };

  /* Visibility of the Searchbar and Sidebar, managed by the Toggler */
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);

  const [loggedIn, setLoggedIn] = useState(false);
  /* Which filter is currently active: managed by the url */
  const loggedInObj = { loggedIn, setLoggedIn };


  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // TODO: store them somewhere and use them, if needed
        await API.getUserInfo();
        setLoggedIn(true);
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    // clean up everything
    setTaskList([]);
  };

  return (
    <Router>
      <Container fluid>
        <loggedInContext.Provider value={loggedInObj}>
          {/* Navigation */}
          <Row>
            <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
              <Toggler visible={visible} toggleVisibility={toggleVisibility} />
              <LogoName />
              {loggedIn ?
                <Nav className="order-sm-4 ml-sm-auto">
                  <LogoutButton logout={doLogOut} />
                </Nav>
                : <></>}
              <SearchBar />
            </Navbar>
          </Row>

          <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
            <Toast.Body>{message?.msg}</Toast.Body>
          </Toast>

          {loggedIn ?

            <Switch>
              <Route exact path={["/filter/:activeFilter", "/"]} render={({ match }) => {
                return (
                  <>
                    {/* Navigation
                    <Row>
                      <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
                        <Toggler visible={visible} toggleVisibility={toggleVisibility} />
                        <LogoName />
                        <SearchBar />
                      </Navbar>
                    </Row> */}
                    {/* Content of the page */}
                    <Row className="min-vh-100">
                      {(match.path === "/" || (match.params.activeFilter && FILTERS.includes(match.params.activeFilter))) ?
                        (<>
                          <LeftSidebar visible={visible} FILTERS={FILTERS} activeFilter={match.params.activeFilter ? match.params.activeFilter : FILTERS[0]} />

                          {/* Main content */}
                          <Col xs={12} sm={8} id="main_section" className={visible ? "closer_main" : ""}>

                            <Container fluid className='d-flex flex-column h-100'>
                              {/* Filter name header */}
                              <Row id="list_header">
                                <h1 id="filter_name_h1"> <b>Filter: </b>{match.params.activeFilter ? match.params.activeFilter : FILTERS[0]}</h1>
                              </Row>
                              {/* Task Table + Add Button */}

                              {dirty ? <Row>Loading...🐻</Row> : <MainContent taskList={taskList} activeFilter={match.params.activeFilter ? match.params.activeFilter : FILTERS[0]} setTaskList={setTaskList} addTask={addTask} deleteTask={deleteTask} updateTask={updateTask} updatedId={updatedId} setUpdatedId={setUpdatedId} setCompletedTask={setCompletedTask} setDirty={setDirty} />}

                            </Container>
                          </Col>
                        </>)
                        :
                        (<p id="error_section">
                          Page not found!
                        </p>)
                      }
                    </Row>
                  </>
                );
              }}
              />
              <Route>
                <p id="error_section">
                  Page not found!
                </p>
              </Route>
            </Switch>
            :
            <LoginForm login={doLogIn} />
          }
        </loggedInContext.Provider>
      </Container >
    </Router >
  );
}

export default App;
