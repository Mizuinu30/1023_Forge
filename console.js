// Import the mysql module
const mysql = require('mysql');

// Create a connection to the MySQL server
const db = mysql.createConnection({
    host: 'localhost',
    user: 'mizuinu',
    password: '',
    database: '1023_Forge'
});

// Connect to the MySQL server
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server.');
});

// Function to create data
function create(tableName, data) {
    let query = `INSERT INTO ${tableName} SET ?`;
    db.query(query, data, (err, result) => {
        if (err) throw err;
        console.log("Data created");
    });
}

// Function to show data
function show(tableName) {
    let query = `SELECT * FROM ${tableName}`;
    db.query(query, (err, rows) => {
        if (err) throw err;
        console.log(rows);
    });
}

// Function to update data
function update(tableName, data, condition) {
    let query = `UPDATE ${tableName} SET ? WHERE ${condition}`;
    db.query(query, data, (err, result) => {
        if (err) throw err;
        console.log("Data updated");
    });
}

// Function to delete data
function deleteData(tableName, condition) {
    let query = `DELETE FROM ${tableName} WHERE ${condition}`;
    db.query(query, (err, result) => {
        if (err) throw err;
        console.log("Data deleted");
    });
}