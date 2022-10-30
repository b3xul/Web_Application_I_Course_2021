import './App.css';

/* React imports */
import { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

/* Bootstrap imports */
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

/* custom components */
import { Toggler, LogoName, UserIcon, SearchBar } from './NavbarElements';
import { LeftSidebar } from './LeftSidebar';
import { MainContent } from "./MainContent";
import { Task } from "./Task";

/* Static information */
const TASKS = [
  //Task(id, description, isUrgent = false, isPrivate = true, deadline)
  new Task(1, "Read a good book!", false),
  new Task(2, "laundry", true, false), //text+public icon
  new Task(3, "Follow lab", false, true, '2021-04-26T14:30'),    //text+date
  new Task(4, "Follow PdS lecture", true, false, '2021-05-10'),   //text+public icon+date
  new Task(5, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", false, false, '2021-03-15T13:20'),    //long text+public icon+date
  new Task(6, "domani", false, true, '2021-04-28'),    //text+date
  new Task(7, "Complete Lab 3", false, true, "14:30:00"),
  new Task(8, "Buy some groceries", false, false, "14:00")
];

/* filters */
const FILTERS = ['All', 'Important', 'Today', 'Next 7 Days', 'Private'];

function App() {

  /* Static tasks + tasks added during use */
  const [taskList, setTaskList] = useState(TASKS);

  /* Function to set the new state variable adding a new task to the list */
  const addTask = (task) => {
    setTaskList((oldTaskList) => [...oldTaskList, task]);
  };

  /* Function to set the new state variable deleting a task from the list */
  const deleteTask = (id) => {
    setTaskList(oldTaskList => oldTaskList.filter(task => task.id !== id));
  };

  /* Function to set the new state variable updating a task of the list */
  const updateTask = (updatedTask) => {
    setTaskList(oldTaskList => oldTaskList.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  /* Visibility of the Searchbar and Sidebar, managed by the Toggler */
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);

  /* Which filter is currently active: managed by the url */

  return (
    <Router>
      <Container fluid>
        {/* Navigation */}
        <Row>
          <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
            <Toggler visible={visible} toggleVisibility={toggleVisibility} />
            <LogoName />
            <UserIcon />
            <SearchBar />
          </Navbar>
        </Row>

        {/* Content of the page */}
        <Row className="min-vh-100">
          <Route path={["/filter/:activeFilter", "/"]} render={({ match }) => {
            return (
              <>
                <LeftSidebar visible={visible} FILTERS={FILTERS} activeFilter={match.params.activeFilter ? match.params.activeFilter : FILTERS[0]} />

                {/* Main content */}
                <Col xs={12} sm={8} id="main_section" className={visible ? "closer_main" : ""}>

                  <Container fluid className='d-flex flex-column h-100'>
                    {/* Filter name header */}
                    <Row id="list_header">
                      <h1 id="filter_name_h1"> <b>Filter: </b>{match.params.activeFilter ? match.params.activeFilter : FILTERS[0]}</h1>
                    </Row>
                    {/* Task Table + Add Button */}
                    <MainContent taskList={taskList} activeFilter={match.params.activeFilter ? match.params.activeFilter : FILTERS[0]} addTask={addTask} deleteTask={deleteTask} updateTask={updateTask} />
                  </Container>
                </Col>
              </>
            );
          }}
          />

        </Row>
      </Container >
    </Router >
  );
}

export default App;
