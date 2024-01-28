// Import necessary modules
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const logger = require('pino')();

// Load environment variables
dotenv.config();

async function connectToDatabase() {
  try {
    // Database connection configuration
    const pool = mysql.createPool({
      connectionLimit: 5,
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || '1023_Forge',
      waitForConnections: true,
      queueLimit: 0
    });
    logger.info('Database connection pool created.');
    return pool;
  } catch (e) {
    logger.error('Error while creating connection pool:', e);
    throw e;
  }
}

async function executeQuery(pool, query, params) {
  try {
    const [rows, fields] = await pool.execute(query, params);
    return rows;
  } catch (e) {
    logger.error(`Error: '${e}' occurred during query execution.`);
    return null;
  }
}

// Usage Example
(async () => {
  const pool = await connectToDatabase();
  const query = 'SELECT * FROM campaign WHERE id = ?';
  const result = await executeQuery(pool, query, [42]);
  if (result) {
    result.forEach(row => {
      console.log(row);
    });
  }
})();
