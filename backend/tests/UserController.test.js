import { expect } from 'chai'
import { initializeTestDB, insertTestUser, getUserByUsername } from '../helpers/test.js'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const base_url = process.env.BACKEND_URL + '/user'
console.log("Base URL for user tests: ", base_url)

// note: custom error messages in UserController.js must match the test error messages exactly
// note: tests that SHOULD return an error must be in a try-catch block because axios will automatically throw an error and terminate the test if the status code is not 2xx

describe('POST register account', () => {

    before(async() => {
        await initializeTestDB()
    })

    const name = 'testuser'
    const pword = 'Testuser123'

    it ('should create an account with valid email and password', async() => {
        const response = await axios.post(base_url + '/register', {
            username: name,
            password: pword
        })
        const data = await response.data
        expect(response.status).to.equal(201)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it ('should not create an account with spaces in username', async() => {
        try {
            const response = await axios.post(base_url + '/register', {
                username: 'name with spaces',
                password: pword
            })
            const data = response.data
            expect(response.status).to.equal(400)
            expect(data).to.be.an('object')
            expect(data).to.have.property('error', 'Username cannot contain spaces')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

    it ('should not create an account with an empty username', async() => {
        try {
            const response = await axios.post(base_url + '/register', {
                username: '',
                password: pword
            })
            const data = response.data
            expect(response.status).to.equal(400)
            expect(data).to.be.an('object')
            expect(data).to.have.property('error', 'Invalid username')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

    it ('should not create an account with username as password', async() => {
        try {
            const response = await axios.post(base_url + '/register', {
                username: pword,
                password: pword
            })
            const data = response.data
            expect(response.status).to.equal(400)
            expect(data).to.be.an('object')
            expect(data).to.have.property('error', 'Username and password must be different')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

    it ('should not create an account with an existing username', async() => {
        try {
            const response = await axios.post(base_url + '/register', {
                username: name,
                password: pword
            })
            const data = response.data
            expect(response.status).to.equal(400)
            expect(data).to.be.an('object')
            expect(data).to.have.property('error', 'Username already exists')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

    it ('should not create an account with < 8 character password', async() => {
        try {
            const response = await axios.post(base_url + '/register', {
                username: name,
                password: 'Short1'
            })
            const data = response.data
            expect(response.status).to.equal(400)
            expect(data).to.be.an('object')
            expect(data).to.have.property('error', 'Password length must be at least 8 characters')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

    it ('should not create an account without capital letters in password', async() => {
        try {
            const response = await axios.post(base_url + '/register', {
                username: name,
                password: 'nocaps123'
            })
    
            const data = response.data
            expect(response.status).to.equal(400)
            expect(data).to.be.an('object')
            expect(data).to.have.property('error', 'Password must include at least one uppercase letter and one number')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

    it ('should not create an account without numbers in password', async() => {
        try {
            const response = await axios.post(base_url + '/register', {
                username: name,
                password: 'Withoutnumbers'
            })
            const data = response.data
            expect(response.status).to.equal(400)
            expect(data).to.be.an('object')
            expect(data).to.have.property('error', 'Password must include at least one uppercase letter and one number')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

})

let token  // declare token at a higher scope for use in multiple tests

describe('DELETE delete account', () => {
    const name = 'DeleteTest'
    const pword = 'DeleteTest123'
    let userId

    before(async () => {
        await initializeTestDB()
        await insertTestUser(name, pword)
        const user = await getUserByUsername(name)
        userId = user.id

        // get the token from the login process
        const response = await axios.post(base_url + '/login', {
            username: name,
            password: pword
        })
        token = response.headers['authorization']
    })

    it('should not delete an account with an invalid password', async () => {
        try {
            const response = await axios.delete(base_url + '/delete', {
                headers: {
                    'Authorization': token
                },
                data: {
                    id: userId,
                    username: name,
                    password: 'InvalidPassword'
                }
            })
            expect(response.status).to.equal(401)
            expect(response.data).to.be.an('object')
            expect(response.data).to.have.property('error', 'Incorrect password')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

    it('should delete an account with correct password', async () => {
        const response = await axios.delete(base_url + '/delete', {
            headers: {
                'Authorization': token  // Include the token here
            },
            data: {
                id: userId,
                username: name,
                password: pword
            }
        })
        expect(response.status).to.equal(200)
        expect(response.data).to.be.an('object')
        expect(response.data.rows).to.be.an('array')
        expect(response.data.rows[0]).to.have.property('id', userId)
    })
    
})

describe('POST login', () => {

    const name = 'LoginTest'
    const pword = 'LoginTest123'

    before(async () => {
        await initializeTestDB()
        await insertTestUser(name, pword)
    })

    it ('should not login with nonexistent username', async () => {
        try {
            const response = await axios.post(base_url + '/login', {
                username: 'Nonexistent',
                password: pword
            })
            expect(response.status).to.equal(401)
            expect(response.data).to.be.an('object')
            expect(response.data).to.have.property('error', 'Invalid username or password')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

    it ('should not login with incorrect password', async () => {
        try {
            const response = await axios.post(base_url + '/login', {
                username: name,
                password: 'Incorrect'
            })
            expect(response.status).to.equal(401)
            expect(response.data).to.be.an('object')
            expect(response.data).to.have.property('error', 'Invalid username or password')
        } catch (error) {
            // console.error('Error:', error.response ? error.response.data : error.message)
        }
    })

    it ('should login with correct username and password', async () => {
        const response = await axios.post(base_url + '/login', {
            username: name,
            password: pword
        })
        const data = response.data
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(response.headers).to.have.property('authorization') // Check for the token in the Authorization header
        const token = response.headers['authorization']  // You can extract the token here if needed
        expect(token).to.be.a('string')
    })

})

// NOTE: to run backend tests:
// - backend must be running in test mode (`npm run testStart` in backend directory in terminal)
// - then run `npm run test` in the backend directory in another terminal
// - all backend tests will run and output to the test terminal