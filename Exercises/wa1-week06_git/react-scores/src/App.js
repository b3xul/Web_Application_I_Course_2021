import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row } from 'react-bootstrap';
import { ExamTable, Title } from './ExamComponents';
import dayjs from 'dayjs';

import { BrowserRouter as Router } from 'react-router-dom';

const fakeExams = [
  { coursecode: '01TYMOV', score: 28, date: dayjs('2021-03-01'), isHigh: function () { return true; } },
  { coursecode: '01SQJOV', score: 29, date: dayjs('2021-06-03'), isHigh: function () { return true; } },
  { coursecode: '04GSPOV', score: 27, date: dayjs('2021-05-24'), isHigh: function () { return true; } },
  { coursecode: '01TXYOV', score: 24, date: dayjs('2021-06-21'), isHigh: function () { return true; } },
];

const fakeCourses = [
  { coursecode: '01TYMOV', name: 'Information systems security' },
  { coursecode: '02LSEOV', name: 'Computer architectures' },
  { coursecode: '01SQJOV', name: 'Data Science and Database Technology' },
  { coursecode: '01OTWOV', name: 'Computer network technologies and services' },
  { coursecode: '04GSPOV', name: 'Software Engineering' },
  { coursecode: '01TXYOV', name: 'Web Applications I' },
  { coursecode: '01NYHOV', name: 'System and device programming' },
  { coursecode: '01TYDOV', name: 'Cloud Computing' },
  { coursecode: '01SQPOV', name: 'Software Networking' },
];


function App() {
  return (
    <Router>
      <Container className="App">
        <Row>
          <Title />
        </Row>
        <Row>
          <ExamTable courses={fakeCourses} exams={fakeExams} />
        </Row>
      </Container>
    </Router>
  );
}

export default App;
