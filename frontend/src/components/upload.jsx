
import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Container, Row, Col, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import { onPublishScore } from '../lib/api';
import { useNavigate } from 'react-router-dom'


const UploadFile = ({ setData, pieceTitle, setPiece }) => {

    const navigate = useNavigate();
    const [ file, setFile ] = useState([])
    const [ measures, setMeasures ] = useState({ startMeasure: 1, endMeasure: 30 }) 
    const [ isSubmitting, setSubmitting ] = useState(false)
    const [ formErrors, setErrors ] = useState({ startMeasure: null, endMeasure: null, fileType: null })
    const [ errMsg, setErrMsg ] = useState("")
    const [ isButtonDisabled, setButtonDisabled ] = useState(false)

    useEffect(() => {
        if (isSubmitting || errMsg.length > 0 || !file.size || !pieceTitle) setButtonDisabled(true)
        else setButtonDisabled(false)
        
    }, [isSubmitting, errMsg, file.size, pieceTitle])



    const handleFile = (e) => {
        const userFile = e.target.files[0]

        if (userFile && !isFileTypeValid(userFile)) {
            setErrMsg("Does not support this file type!")
            e.target.value = null
            setFile([])
        } else {
            setFile(e.target.files[0])
            setErrMsg("")
        }
        
    }

    const handleSubmission = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await onPublishScore(file, measures)
        setData(JSON.parse(res.data))
        setSubmitting(false)
        return navigate('/graph')
    }

    const handleAlertClose = () => {
        setErrMsg("")
    }

    useEffect(()=> {
        if (measures.endMeasure - measures.startMeasure > 30) {
            setErrMsg("Currently limited for maximum of 30 measures analysis")
        } else if (measures.startMeasure >= measures.endMeasure) {
            setErrMsg("End measure must be greater than starting measure")
        } else if (measures.startMeasure <= 0 || measures.endMeasure <= 0) {
            setErrMsg("Please use valid measure numbers")
        }
    }, [measures, errMsg])


    const isFileTypeValid = (file) => {
        const allowedFileTypes = ["application/vnd.recordare.musicxml", "application/vnd.recordare.musicxml+xml", "mxl","musicxml"]
        return allowedFileTypes.includes(file.type || file.name.split('.')[1])
    }
    return (
        <Container >
        <Form onSubmit={handleSubmission} className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <h2>Create a Musical Roadmap</h2>
        <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>Upload Score</Form.Label>
            <Form.Control onChange={handleFile} type="file" size="lg" />
        </Form.Group>
        <Row>
            <Form.Group controlId="pieceTitle" className="mb-3">
                <Form.Label>Enter the Work Title</Form.Label>
                <Form.Control
                    type="text"
                    value={pieceTitle}
                    onChange={e => setPiece(e.target.value)}
                />
            </Form.Group>
        </Row>
        <Row> 
            <Col>       
                <Form.Group controlId="startMeasureIn" className="mb-3">
                <Form.Label>Enter Starting Measure</Form.Label>
                <Form.Control
                    type="number"
                    placeholder="1"
                    accept='.mxl, .musicxml'
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
        {errMsg &&<Alert variant="danger" onClose={handleAlertClose} dismissible>
            {errMsg}
        </Alert>}
        <Button type="submit" disabled={isButtonDisabled} variant="primary" size="lg">
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