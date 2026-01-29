const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host:process.env.Db_HOST ||"localhost",
    user:process.env.DB_USER || "root",
    password:process.env.DB_password || "",
    database:process.env.DB_NAME || "pastebin_lite",
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0,
});

async function checkDConnection(){
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
}

module.exports={
    pool,checkDConnection,
}