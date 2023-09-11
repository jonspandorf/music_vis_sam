
import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Container, Row, Col, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import { onPublishScore } from '../lib/api';
import { useNavigate } from 'react-router-dom'


const UploadFile = ({ setData }) => {

    const navigate = useNavigate();
    const [ file, setFile ] = useState([])
    const [ measures, setMeasures ] = useState({ startMeasure: 1, endMeasure: 30 }) 
    const [ isSubmitting, setSubmitting ] = useState(false)
    const [ errMsg, setErrMsg ] = useState("")

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }

    const handleSubmission = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await onPublishScore(file, measures)
        setData(JSON.parse(res.data))
        setSubmitting(false)
        return navigate('/graph')
    }

    useEffect(()=> {
        if (measures.endMeasure - measures.startMeasure > 30) {
            setErrMsg("Currently limited for maximum of 30 measures analysis")
        }
    }, [measures, errMsg])

    return (
        <Container >
        <Form onSubmit={handleSubmission} className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <h2>Create a Musical Roadmap</h2>
        <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>Upload Score</Form.Label>
            <Form.Control onChange={handleFile} type="file" size="lg" />
        </Form.Group>
        <Row> 
            <Col>       
                <Form.Group controlId="startMeasureIn" className="mb-3">
                <Form.Label>Enter Starting Measure</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="1"
                    value={measures.startMeasure}
                    onChange={e => setMeasures(prev => ({ ...prev, startMeasure: e.target.value }))}
                />
                </Form.Group>
            </Col>
            <Col>       
                <Form.Group controlId="endMeasureIn" className="mb-3">
                <Form.Label>Enter End Measure</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="30"
                    value={measures.endMeasure}
                    onChange={e => setMeasures(prev => ({ ...prev, endMeasure: e.target.value }))}
                />
                </Form.Group>
            </Col>
        </Row>
        {errMsg &&<Alert variant="danger" onClose={() => setErrMsg("")} dismissible>
            {errMsg}
        </Alert>}
        <Button type="submit" disabled={isSubmitting | errMsg===true} variant="primary" size="lg">
            {
                isSubmitting ? 
                <>
                    Uploading
                    <Spinner animation="border" variant="light" />
                </>
                :
                <>
                { "upload".toUpperCase() }                
                </>

            }
        </Button>
        </Form>
        </Container>
    )
}

export default UploadFile