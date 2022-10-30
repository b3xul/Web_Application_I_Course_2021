import { Col, Table } from 'react-bootstrap';
import dayjs from 'dayjs';


function ExamScores(props) {
  return <Col>
    <ExamTable exams={props.exams} courses={props.courses} />
  </Col>;
}

function ExamTable(props) {

  return (<>
    <Table striped bordered>
      <thead>
        <tr>
          <th>Exam</th>
          <th>Score</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>{
        props.exams.map((ex) => <ExamRow key={ex.coursecode}
          exam={ex}
          examName={props.courses.filter(c => c.coursecode === ex.coursecode)[0].name}
        />)
      }
      </tbody>
    </Table>
  </>

  );
}

function ExamRow(props) {
  return <tr><ExamRowData exam={props.exam} examName={props.examName} /></tr>
}

function ExamRowData(props) {
  return <>
    <td>{props.examName}</td>
    <td>{props.exam.score}</td>
    <td>{dayjs(props.exam.date).format('DD MMM YYYY')}</td>
  </>;
}

export {ExamScores};