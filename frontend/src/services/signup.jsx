import { CognitoUserAttribute } from "amazon-cognito-identity-js"
import userpool from "../lib/userpool"

export const signupNewUser = (data) => {
    const attributes = []

    const name = {
        Name: 'name',
        Value: 'bandor'
    }

    const email = {
        Name: 'email', 
        Value: data.email
    }

    const username = {
        Name:'preferred_username',
        Value: data.username
    }

    const emailAtt = new CognitoUserAttribute(email)
    attributes.push(emailAtt)
    attributes.push(name)
    attributes.push(username)
    userpool.signUp(data.username, data.password,attributes,null,(err,result) => {
        if (err) {
            console.error(err)
        } 
        const user = result.user
        console.log(`user ${user} is signed in`)
    })

}