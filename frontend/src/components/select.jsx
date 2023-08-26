import React, { useEffect, useState } from 'react';
import { Button, Container, Dropdown, Form, Row, Col } from "react-bootstrap"


const SelectMenu = ({ fields, setCompare, handleComparison, setNextGraphKey, comparedData, isHeatmapApplicable, handleCompare, graphTypes }) => {


    //  FIX Graph Menu select that each select upon compare is marked as check

    //  Omit checkbox if graphtype upon compare is heatmap 

    //  layout of buttons on screen
    console.log(isHeatmapApplicable)

    useEffect(()=> {    
        if (comparedData.type === 'heatmap') setNextGraphKey(prev =>( {...prev, next: 'heatmap'}))
        else {
            if (comparedData.applyOnAllInstruments) setNextGraphKey(prev => ( {...prev, next: 'instrumentData' }))
            else setNextGraphKey(prev => ( {...prev, next: 'orchestralData' }))
        }
        console.log(comparedData)
    }, [comparedData])

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
    

    const onChangeOfAxis = (e,type) => {
        handleComparison(e,type)
        handleDropdownToggle(e.target.id)
    }

    return (
        <>
            <Container>
            <Row>
                <Col xs={2}>
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
                                    onChange={e => onChangeOfAxis(e,field.type)}
                                />

                            ))
                        }
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col xs={2}>
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
                                    onChange={e => onChangeOfAxis(e,field.type)}
                                />

                            ))
                        }
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col xs={2}>
                    <Dropdown show={dropdownStates.graphOptions} onToggle={() => handleDropdownToggle('graphOptions')}>
                        <Dropdown.Toggle>
                            Graph Type
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                graphTypes.map((graph) => (
                                        // graph.type === 'heatmap' ?
                                        //     isHeatmapApplicable ? 
                                        //         <Form.Check 
                                        //             key={graph.type}
                                        //             name={graph.type}
                                        //             value={graph.type}
                                        //             checked={graph.type===comparedData.graphType.type}
                                        //             label={graph.type.toUpperCase()}
                                        //             options="grpahOptions"
                                        //             onChange={e => onChangeOfAxis(e,'graphType')}
                                        //         />
                                        //         :
                                        //         <></>
                                        // :
                                            <Form.Check 
                                                key={graph.type}
                                                name={graph.type}
                                                value={graph.type}
                                                checked={graph.type===comparedData.graphType.type}
                                                label={graph.type.toUpperCase()}
                                                options="grpahOptions"
                                                onChange={e => onChangeOfAxis(e,'graphType')}
                                            />
                                    
                                ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                {!comparedData.graphType.type === 'heatmap' && 
                    <Col xs={4}>
                        <Form.Check type="checkbox" label="Apply on all instruments?" onChange={(e)=>{setCompare(prevState => { return { ...prevState, applyOnAllInstruments: e.target.checked }})} }/>
                    </Col>
                }
                <Col xs={2}>
                     <Button color="success" onClick={handleCompare}>Compare</Button>
                </Col>
            </Row>
            </Container>
        </>
    )
}

export default SelectMenu