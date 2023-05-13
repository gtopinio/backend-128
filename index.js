const express = require("express");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer();
const url = require("url");

const PORT = process.env.PORT || 3001;
const app = express();
const appLink = "https://mockup-backend-128.herokuapp.com/"

require('./models/user');

// Parse the database URL from the config var
const dbUrl = url.parse(process.env.CLEARDB_DATABASE_URL);
// Check if database URL exists
if (!dbUrl) {
  throw new Error('Database URL not found');
}

// Create a connection pool to the database
const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.auth.split(':')[0],
  password: dbUrl.auth.split(':')[1],
  database: dbUrl.pathname.substring(1),
  connectionLimit: 10,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log("Error connecting to database:", err);
  } else {
    console.log("Connected to database!");
    connection.release();
  }
});

// The two lines below is to ensure that the server has parser to read the body of incoming requests
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// for parsing multipart/form-data
app.use(upload.fields([{ name: 'accommodationName', maxCount: 1 }, { name: 'data', maxCount: 1 }, { name: 'username', maxCount: 1 }, { name: 'data', maxCount: 1 }]));

// allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Pass the database connection pool to your routes module
require("./routes")(app, pool);

// start server
app.listen(PORT, (err) => {
    if(err){ console.log(err);}
    else{console.log("Server listening at port " + PORT);}
});
