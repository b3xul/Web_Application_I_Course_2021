import './App.css';

/* React imports */
import { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";

/* Bootstrap imports */
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from "react-router-dom";

/* custom components */
import { Toggler, LogoName, SearchBar } from './NavbarElements';
import { LeftSidebar } from './LeftSidebar';
import { MainContent } from "./MainContent";
import { LogInForm } from "./LoginForm";
import { API } from "./API";


const TASKS = [];

/* filters */
const FILTERS = ['All', 'Important', 'Today', 'Next 7 Days', 'Private'];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

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
    setMessage('');
  };

  /* Static tasks + tasks added during use */
  const [taskList, setTaskList] = useState(TASKS);

  /* Visibility of the Searchbar and Sidebar, managed by the Toggler */
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(!visible);

  /* Which filter is currently active: managed by the url */

  return (
    <Router>
      <Container fluid>
        <Switch>
          <Route path="/login" exact render={() =>
            <>
              {loggedIn ? <Redirect to="/" /> : <LogInForm logIn={doLogIn} />}
              {message && <Container fluid="sm"><Row>
                <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
              </Row>
              </Container>}
            </>
          } />
          <Route path={["/filter/:activeFilter", "/"]} exact render={({ match }) => {
            return (
              <>
                {(match.path === "/" || (match.params.activeFilter && FILTERS.includes(match.params.activeFilter))) ?
                  (<>
                    {/* Navigation */}
                    <Row>
                      <Navbar bg="primary" variant="dark" expand="sm" fixed="top">
                        <Toggler visible={visible} toggleVisibility={toggleVisibility} />
                        <LogoName />
                        <SearchBar />
                        {!loggedIn ? <Link to="/login" ><FiLogIn /></Link> : <FiLogOut onClick={doLogOut} />}
                      </Navbar>
                    </Row>
                    {/* Content of the page */}
                    <Row className="min-vh-100">

                      <LeftSidebar visible={visible} FILTERS={FILTERS} activeFilter={match.params.activeFilter ? match.params.activeFilter : FILTERS[0]} />

                      {/* Main content */}
                      <Col xs={12} sm={8} id="main_section" className={visible ? "closer_main" : ""}>

                        <Container fluid className='d-flex flex-column h-100'>
                          {message && <Row>
                            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                          </Row>}
                          {/* Filter name header */}
                          <Row id="list_header">
                            <h1 id="filter_name_h1"> <b>Filter: </b>{match.params.activeFilter ? match.params.activeFilter : FILTERS[0]}</h1>
                          </Row>
                          {/* Task Table + Add Button */}
                          <MainContent loggedIn={loggedIn} setLoggedIn={setLoggedIn} taskList={taskList} setTaskList={setTaskList} activeFilter={match.params.activeFilter ? match.params.activeFilter : FILTERS[0]} />
                        </Container>
                      </Col>
                    </Row>
                  </>)
                  :
                  (<Row>
                    Filter not found! 😿
                  </Row>)
                }
              </>
            );
          }}
          />
          <Route>
            <Row>
              Page not found! 😿
            </Row>
          </Route>
        </Switch>
      </Container >
    </Router >
  );
}

export default App;
