/* React imports */
import { NavLink } from 'react-router-dom';

/* Bootstrap imports */
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Collapse from 'react-bootstrap/Collapse';

function LeftSidebar(props) {
    return (
        <Collapse in={props.visible} className="toToggle">
            <Col xs={12} sm={4} className="d-sm-block" id="aside_section">
                <ListGroup>
                    {props.FILTERS.map(filter => (
                        <NavLink to={`/filter/${filter}`} key={filter}>
                            <ListGroup.Item key={filter} active={filter === props.activeFilter}>{filter}</ListGroup.Item>
                        </NavLink>
                    ))}
                </ListGroup>
            </Col>
        </Collapse>
    );
}

export { LeftSidebar };