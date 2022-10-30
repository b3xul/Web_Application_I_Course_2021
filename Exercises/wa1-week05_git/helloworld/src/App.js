import logo from './logo.svg';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyButton from './MyButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function App() {
  return (
    <Container>
      <Row>
        <Col>
          <MyButton lang='en' size={2}/>
          <MyButton lang='it' />
          <MyButton></MyButton>
        </Col>
        <Col>
         {['en', 'it'].map((lg => <MyButton key={lg} lang={lg}/>))}
        </Col>
      </Row>

    </Container>
  );
}

export default App;
