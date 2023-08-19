import React from 'react';
import { Button, Container, Dropdown, Form, Row } from "react-bootstrap"


const SelectMenu = ({ fields, setCompare, handleCompare, graphTypes }) => {


    return (
        <>
            <Container>
            <Row>
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="checkfields">
                    Compare X axis
                </Dropdown.Toggle>
                <Dropdown.Menu>
                {
                    fields.map(field => (
                        field.type==='x' && 
                        <Form.Check
                            key={field.name}
                            name={field.name}
                            label={field.name}
                            value={field.name}
                            type="checkbox"
                            onChange={e => setCompare(prevState => { return {...prevState, x: e.target.value}})}
                        />

                    ))
                }
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="checkfields">
                    Compare Y axis
                </Dropdown.Toggle>
                <Dropdown.Menu>
                {
                    fields.map(field => (
                        field.type==='y' && 
                        <Form.Check
                            key={field.name}
                            name={field.name}
                            label={field.name}
                            type="checkbox"
                            value={field.name}
                            onChange={e => setCompare(prevState => { return {...prevState, y: e.target.value}})}
                        />

                    ))
                }
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
                <Dropdown.Toggle>
                    Graph Type
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        graphTypes.map((type, idx) => (
                            <Form.Check 
                                key={type.type}
                                name={type.type}
                                value={type.type}
                                label={type.type.toUpperCase()}
                                onChange={() => setCompare(prevState => { return {...prevState, graphType: graphTypes[idx]}})}
                            />
                        ))
                    }
                </Dropdown.Menu>
            </Dropdown>
            <Form.Check type="checkbox" label="Apply on all instruments?" onChange={(e)=>{setCompare(prevState => { return { ...prevState, applyOnAllInstruments: e.target.checked }})} }/>
            <Button color="success" onClick={handleCompare}>Compare</Button>
            </Row>
            </Container>
        </>
    )
}

export default SelectMenu