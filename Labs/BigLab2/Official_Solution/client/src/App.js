import { React, useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import API from './API';

import { Container, Row, Col, Button, Toast } from 'react-bootstrap/';


import Navigation from './components/Navigation';
import Filters from './components/Filters';
import ContentList from './components/ContentList';
import ModalForm from './components/ModalForm';
import { LoginForm } from './components/Login';

import { Route, useRouteMatch, useHistory, Switch, Redirect } from 'react-router-dom';


import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);

const App = () => {

  // Need to place <Router> above the components that use router hooks
  return (
    <Router>
      <Main></Main>
    </Router>
  );

};

const Main = () => {

  // This state is an object containing the list of tasks, and the last used ID (necessary to create a new task that has a unique ID)
  const [taskList, setTaskList] = useState([]);
  const [dirty, setDirty] = useState(true);

  const MODAL = { CLOSED: -2, ADD: -1 };
  const [selectedTask, setSelectedTask] = useState(MODAL.CLOSED);

  const [message, setMessage] = useState('');

  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [user, setUser] = useState(null);

  // active filter is read from the current url
  const match = useRouteMatch('/list/:filter');
  const activeFilter = (match && match.params && match.params.filter) ? match.params.filter : 'all';

  const history = useHistory();
  // if another filter is selected, redirect to a new view/url
  const handleSelectFilter = (filter) => {
    history.push("/list/" + filter);
  };

  // check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        console.log(err.error); // mostly unauthenticated user
      }
    };
    checkAuth();
  }, []);


  // set dirty to true only if acfiveFilter changes, if the active filter is not changed dirty = false avoids triggering a new fetch
  useEffect(() => {
    setDirty(true);
  }, [activeFilter]);


  const deleteTask = (task) => {
    API.deleteTask(task)
      .then(() => setDirty(true))
      .catch(e => handleErrors(e));
  };


  const findTask = (id) => {
    return taskList.find(t => t.id === id);
  };


  useEffect(() => {
    if (loggedIn && dirty) {
      API.getTasks(activeFilter)
        .then(tasks => {
          setTaskList(tasks);
          setDirty(false);
        })
        .catch(e => handleErrors(e));
    }
  }, [activeFilter, dirty, loggedIn]);

  // show error message in toast
  const handleErrors = (err) => {
    setMessage({ msg: err.error, type: 'danger' });
    console.log(err);
  };


  // add or update a task into the list
  const handleSaveOrUpdate = (task) => {

    // if the task has an id it is an update
    if (task.id) {
      API.updateTask(task)
        .then(() => setDirty(true))
        .catch(e => handleErrors(e));

      // otherwise it is a new task to add
    } else {
      API.addTask(task)
        .then(() => setDirty(true))
        .catch(e => handleErrors(e));
    }
    setSelectedTask(MODAL.CLOSED);
  };

  const handleEdit = (task) => {
    setSelectedTask(task.id);
  };

  const handleClose = () => {
    setSelectedTask(MODAL.CLOSED);
  };

  const handleCheck = (task, flag) => {
    API.updateTask({ ...task, completed: flag })
      .then(() => setDirty(true))
      .catch(e => handleErrors(e));
  };

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    }
    catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      // handleErrors(err)
      throw err;
    }
  };

  const handleLogOut = async () => {
    await API.logOut();
    // clean up everything
    setLoggedIn(false);
    setUser(null);
    setTaskList([]);
    setDirty(true);
  };


  return (

    <Container fluid>
      <Row>
        <Navigation onLogOut={handleLogOut} loggedIn={loggedIn} user={user} />
      </Row>

      <Toast show={message !== ''} onClose={() => setMessage('')} delay={3000} autohide>
        <Toast.Body>{message?.msg}</Toast.Body>
      </Toast>

      <Switch>
        <Route path="/login">
          <Row className="vh-100 below-nav">
            {loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}
          </Row>
        </Route>
        <Route path={["/list/:filter"]}>
          {loggedIn ?
            <Row className="vh-100 below-nav">
              <TaskMgr taskList={taskList} filter={activeFilter} onDelete={deleteTask} onEdit={handleEdit} onCheck={handleCheck} onSelect={handleSelectFilter}></TaskMgr>
              <Button variant="success" size="lg" className="fixed-right-bottom" onClick={() => setSelectedTask(MODAL.ADD)}>+</Button>
              {(selectedTask !== MODAL.CLOSED) && <ModalForm task={findTask(selectedTask)} onSave={handleSaveOrUpdate} onClose={handleClose}></ModalForm>}
            </Row> : <Redirect to="/login" />
          }
        </Route>
        <Route>
          <Redirect to="/list/all" />
        </Route>
      </Switch>
    </Container>

  );

};


const TaskMgr = (props) => {

  const { taskList, filter, onDelete, onEdit, onCheck, onSelect } = props;


  // ** FILTER DEFINITIONS AND HELPER FUNCTIONS **
  const filters = {
    'all': { label: 'All', id: 'all', filterFn: () => true },
    'important': { label: 'Important', id: 'important', filterFn: t => t.important },
    'today': { label: 'Today', id: 'today', filterFn: t => t.deadline && t.deadline.isToday() },
    'nextweek': { label: 'Next 7 Days', id: 'nextweek', filterFn: t => isNextWeek(t.deadline) },
    'private': { label: 'Private', id: 'private', filterFn: t => t.private },
  };

  // if filter is not know apply "all"
  const activeFilter = (filter && filter in filters) ? filter : 'all';

  const isNextWeek = (d) => {
    const tomorrow = dayjs().add(1, 'day');
    const nextWeek = dayjs().add(7, 'day');
    const ret = d && (!d.isBefore(tomorrow, 'day') && !d.isAfter(nextWeek, 'day'));
    return ret;
  };


  return (
    <>
      <Col bg="light" className="d-block col-4" id="left-sidebar">
        <Filters items={filters} defaultActiveKey={activeFilter} onSelect={onSelect} />
      </Col>
      <Col className="col-8">
        <h1 className="pb-3">Filter: <small className="text-muted">{activeFilter}</small></h1>
        <ContentList
          tasks={taskList}
          onDelete={onDelete} onEdit={onEdit} onCheck={onCheck}
        />
      </Col>
    </>
  );

};

export default App;
