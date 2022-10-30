/* React imports */
import { useState, useEffect } from 'react';

/* Bootstrap imports */
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

/* Bootstrap icons imports */
import { BsPeopleFill, BsPencil, BsTrash, BsPlusCircleFill } from "react-icons/bs";

/* custom components */
import { Task } from "./Task";
import { filterBy } from "./FilterFunctions";

import API from "./API";

function MainContent(props) {
    const [show, setShow] = useState(false);
    const [taskToUpdate, setTaskToUpdate] = useState(undefined);

    const setTaskList = props.setTaskList;
    useEffect(() => {
        if (props.activeFilter) {
            API.loadFilteredTasks(props.activeFilter).then(newTaskList => {
                setTaskList(newTaskList);
            });
        }
    }, [props.activeFilter, setTaskList]);

    return (
        <>
            {/* List of tasks */}
            <Row>
                <TaskTable taskList={props.taskList} activeFilter={props.activeFilter} setShow={setShow} setTaskToUpdate={setTaskToUpdate} deleteTask={props.deleteTask} updatedId={props.updatedId} setUpdatedId={props.setUpdatedId} setCompletedTask={props.setCompletedTask} setDirty={props.setDirty} />
            </Row>

            {/* Add button */}
            <Row className="mt-auto mb-3 justify-content-end" >
                {props.updatedId === -1 ? <BsPlusCircleFill id="new_task_icon" size={48} onClick={() => setShow(true)} />
                    : <BsPlusCircleFill id="new_task_icon_disabled" size={48} />}
            </Row>

            {/* Modal to add or update a task */}
            <Modal show={show} onHide={() => { setShow(false); setTaskToUpdate(undefined); }}>
                <TaskForm taskList={props.taskList} show={show} setShow={setShow} taskToUpdate={taskToUpdate} setTaskToUpdate={setTaskToUpdate} addTask={props.addTask} updateTask={props.updateTask} />
            </Modal>
        </>
    );
}

function TaskTable(props) {
    const filteredTasks = filterBy(props.activeFilter, props.taskList);

    return (
        <Table>
            <tbody>
                {filteredTasks.map(task => <TaskRow key={task.id} task={task} setShow={props.setShow} setTaskToUpdate={props.setTaskToUpdate} deleteTask={props.deleteTask} updatedId={props.updatedId} setUpdatedId={props.setUpdatedId} setCompletedTask={props.setCompletedTask} setDirty={props.setDirty} />)}
            </tbody>
        </Table>
    );
}

function TaskRow(props) {
    return (
        <tr bgcolor={(props.task.id === props.updatedId) ? "#D3D3D3" : ""}>
            <TaskDescription task={props.task} updatedId={props.updatedId} setUpdatedId={props.setUpdatedId} setCompletedTask={props.setCompletedTask} setDirty={props.setDirty} />
            <TaskShared task={props.task} />
            <TaskDeadline task={props.task} />
            <TaskControls task={props.task} setShow={props.setShow} setTaskToUpdate={props.setTaskToUpdate} deleteTask={props.deleteTask} updatedId={props.updatedId} />
        </tr>
    );
}

function TaskDescription(props) {
    return (
        <td>
            <Form>
                <Form.Check
                    type="checkbox"
                    id={"check-t" + props.task.id}
                    className={(props.task.isImportant()) ? "important" : ""}
                    label={props.task.description}
                    checked={props.task.completed}
                    disabled={(props.task.id === props.updatedId)}
                    onChange={() => {
                        let updatedObject = { ...props.task, completed: !props.task.completed };
                        props.setCompletedTask(updatedObject);
                    }}
                />
            </Form>
        </td>
    );
}

function TaskShared(props) {
    if (props.task.isPrivate())
        return <td className='text-center'></td>;
    return (
        <td className='text-center'>
            <BsPeopleFill className="Share_icon" />
        </td>
    );
}

function TaskDeadline(props) {
    if (!props.task.deadline)
        return <td className='text-center small'></td>;
    return (
        <td className='text-center small'>
            {props.task.formatDeadline()}
        </td>
    );
}

function TaskControls(props) {
    return (
        <td className='text-right' id='td_icons'>
            {(props.task.id === props.updatedId) ? <BsPencil className="Pencil_icon_disabled" /> : <BsPencil className="Pencil_icon" onClick={() => { props.setShow(true); props.setTaskToUpdate(props.task); }} />}
            {(props.task.id === props.updatedId) ? <BsTrash className="Trash_icon_disabled ml-1" /> :
                <BsTrash className="Trash_icon ml-1" onClick={() => props.deleteTask(props.task.id)} />}
        </td>
    );
}

function TaskForm(props) {

    const [id, setId] = useState(props.taskToUpdate ? props.taskToUpdate.id : ((props.taskList.length > 0) ? props.taskList[props.taskList.length - 1].id + 1 : 0));
    const [description, setDescription] = useState(props.taskToUpdate ? props.taskToUpdate.description : '');
    const [deadlineDate, setDeadlineDate] = useState(props.taskToUpdate ? ((props.taskToUpdate.deadline) ? props.taskToUpdate.deadline.format('YYYY-MM-DD') : '') : '');
    const [deadlineTime, setDeadlineTime] = useState(props.taskToUpdate ? ((props.taskToUpdate.containsTime) ? props.taskToUpdate.deadline.format('HH:mm') : '') : '');
    const [shared, setShared] = useState(props.taskToUpdate ? !props.taskToUpdate.private : false);
    const [important, setImportant] = useState(props.taskToUpdate ? props.taskToUpdate.important : false);

    const handleSubmit = (event) => {
        let valid = true;
        if (!description)
            valid = false;

        if (valid === true) {
            event.preventDefault();
            event.stopPropagation();

            let deadline = undefined;
            if (deadlineDate === '' && deadlineTime === '') { //undefined
                deadline = undefined;
            }
            else if (deadlineDate !== '' && deadlineTime !== '') { //YYYY-MM-DDTHH:mm
                deadline = deadlineDate + 'T' + deadlineTime;
            }
            else if (deadlineDate === '' && deadlineTime !== '') { //HH:mm
                deadline = deadlineTime;
            }
            else { //YYYY-MM-DD
                deadline = deadlineDate;
            }

            if (props.taskToUpdate)
                props.updateTask(new Task(id, description, important, !shared, deadline));
            else
                props.addTask(new Task(id, description, important, !shared, deadline));

            setId(((props.taskList.length > 0) ? props.taskList[props.taskList.length - 1].id + 1 : 0));
            setDescription('');
            setDeadlineDate('');
            setDeadlineTime('');
            setShared(false);
            setImportant(false);

            props.setShow(false);
            props.setTaskToUpdate(undefined);
        };

    };

    return (
        <Form validated={true} onSubmit={handleSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>{props.taskToUpdate ? "Updated task" : "New task"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        readOnly
                        defaultValue={id}
                        type='number'
                        name="FormID" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        required
                        isInvalid={!description}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        type='text'
                        placeholder='Enter description'
                        name="FormDescription" />
                    <Form.Control.Feedback type="invalid">
                        Description cannot be empty!
                    </Form.Control.Feedback>
                    <Form.Control.Feedback>
                        Nice!
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Deadline Date</Form.Label>
                    <Form.Control
                        value={deadlineDate}
                        onChange={(event) => setDeadlineDate(event.target.value)}
                        type='date'
                        name="FormDeadline" />
                    <Form.Control.Feedback>
                        Date can be left empty!
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Deadline Time</Form.Label>
                    <Form.Control
                        value={deadlineTime}
                        onChange={(event) => setDeadlineTime(event.target.value)}
                        type='time'
                        name="FormDeadline" />
                    <Form.Control.Feedback>
                        Time can be left empty!
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mt-4 mb-4'>
                    <Form.Check checked={!important} onChange={(event) => setImportant(false)} inline type='radio' label='Normal' name="FormNormal" />
                    <Form.Check checked={important} onChange={(event) => setImportant(true)} inline type='radio' label='Important' name="FormImportant" />
                </Form.Group>
                <Form.Group>
                    <Form.Check checked={!shared} onChange={(event) => setShared(false)} inline type='radio' label='Private' name='FormPrivate' />
                    <Form.Check checked={shared} onChange={(event) => setShared(true)} inline type='radio' label='Shared' name='FormShared' />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button type="submit">
                    {props.taskToUpdate ? "Update task" : "Add task"}
                </Button>
            </Modal.Footer>
        </Form>
    );
}

export { MainContent };