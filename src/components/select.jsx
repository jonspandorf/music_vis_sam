import React, { useState } from 'react';
import { Button, Container, Dropdown, Form, Row, Col } from "react-bootstrap"


const SelectMenu = ({ fields, setCompare, comparedData, handleCompare, graphTypes }) => {

    const [ dropdownStates, setDropdownStates ] = useState({
        xOptions: false,
        yOptions: false, 
        graphOptions: false
    })


    const handleDropdownToggle = (dropdownId) => {
        setDropdownStates({
          ...dropdownStates,
          [dropdownId]: !dropdownStates[dropdownId],
        });
      };
    
    const handleComparison = (e,field) => {
        setCompare(prevState => { return {...prevState, [field]: e.target.value}})
        handleDropdownToggle(e.target.id)
    }

    return (
        <>
            <Container>
            <Row>
                <Col>
                    <Dropdown show={dropdownStates.xOptions} onToggle={() => handleDropdownToggle('xOptions')}>
                        <Dropdown.Toggle variant="primary" id="checkfields">
                            {comparedData.x}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        {
                            fields.map(field => (
                                field.type==='x' && 
                                <Form.Check
                                    id="xOptions"
                                    key={field.name}
                                    name={field.name}
                                    checked={field.name===comparedData.x}
                                    label={field.name}
                                    value={field.name}
                                    type="checkbox"
                                    onChange={e => handleComparison(e,field.type)}
                                />

                            ))
                        }
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col>
                    <Dropdown show={dropdownStates.yOptions} onToggle={() => handleDropdownToggle('yOptions')}>
                        <Dropdown.Toggle variant="secondary"  id="checkfields">
                            {comparedData.y}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        {
                            fields.map(field => (
                                field.type==='y' && 
                                <Form.Check
                                    key={field.name}
                                    name={field.name}
                                    label={field.name}
                                    checked={field.name===comparedData.y}
                                    type="checkbox"
                                    options="yOptions"
                                    value={field.name}
                                    onChange={e => handleComparison(e,field.type)}
                                />

                            ))
                        }
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col>
                    <Dropdown show={dropdownStates.graphOptions} onToggle={() => handleDropdownToggle('graphOptions')}>
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
                                        checked={type.type===comparedData.graphTypes}
                                        label={type.type.toUpperCase()}
                                        options="grpahOptions"
                                        onChange={e => handleComparison(e,type.type)}
                                    />
                                ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col>
                    <Form.Check type="checkbox" label="Apply on all instruments?" onChange={(e)=>{setCompare(prevState => { return { ...prevState, applyOnAllInstruments: e.target.checked }})} }/>
                </Col>
                <Col>
                <Button color="success" onClick={handleCompare}>Compare</Button>

                </Col>
            </Row>
            </Container>
        </>
    )
}

export default SelectMenu