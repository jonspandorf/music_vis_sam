
import React, { useState } from 'react';
import { Form, Button, Spinner, Typography } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import { onPublishScore } from '../lib/api';



const UploadFile = ({ setData }) => {

    const [ file, setFile ] = useState([])
    const [ isSubmitting, setSubmitting ] = useState(false)

    const handleFile = (e) => {
        setFile(e.target.files[0])
    }

    const handleSubmission = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await onPublishScore(file)
        setData(JSON.parse(res.data))
        setSubmitting(false)
    }

    return (
        <div >
        <Form onSubmit={handleSubmission} className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <h2>Create a Musical Roadmap</h2>
        <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>Upload Score</Form.Label>
            <Form.Control onChange={handleFile} type="file" size="lg" />
        </Form.Group>
        <Button type="submit" disabled={isSubmitting} variant="primary" size="lg">
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
        </div>
    )
}

export default UploadFile