import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { authenticate } from '../../services/auth'

const LoginPage = () => {

    const navigate = useNavigate()

    const [ userEmail, setUserEmail ] = useState("")
    const [ userPasswd, setUserPasswd ] = useState("")
    const [ confirmPass, setConfirm ] = useState("")
    const [ loginErr, setLoginErr ] = useState("")
    const [ newPass, setNewPass ] = useState(false)

    const validateSubmission = () => {
        // TODO
    }

    const handleSubmission = async (e) => {
        e.preventDefault()
        console.log('submtiting')
        try {
            const cognitoResponse = await authenticate(userEmail, userPasswd)
            console.log(cognitoResponse)
            if (cognitoResponse.status >= 200 && cognitoResponse.status < 400) {
                // navigate('/main')
            }
        } catch(err) {
            console.log(err)
            setLoginErr(err)
        }

    }
    return (
        <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={e => setUserEmail(e.target.value)}/>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={e => setUserPasswd(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={e => setUserPasswd(e.target.value)}/>
        </Form.Group>        <Button onClick={handleSubmission} variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    )
}

export default LoginPage