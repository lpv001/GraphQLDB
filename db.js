import mysql from 'mysql'

function DB() {
    let connection = mysql.createConnection({
        host: "127.0.0.1",
        port: "3307",
        user: "root",
        password: "",
        database: "graphql_db"
    })
    
    connection.connect(function (err) {
        if (err) {
            return console.error('error: ' + err.message)
        }
    
        console.log('Connected to the MySQL server.')
    })

    return connection
}

export default DB