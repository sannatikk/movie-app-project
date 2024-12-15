import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

const openDb = () => {

    const environment = process.env.NODE_ENV // get current environment
    console.log("Current environment: ", environment)

    const dbName = environment === 'development' ? process.env.DB_NAME : process.env.TEST_DB_NAME // select database based on environment
    console.log("Connecting to database: ", dbName)

    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: dbName,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })
    return pool
}

const pool = openDb()

export { pool }