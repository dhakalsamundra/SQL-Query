require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const connectDB = require('./handlers/db-connector');
const routes = require('./routes/routes');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());

var server;

// connect to db
connectDB((err, connection) => {
  if(err) {
    return console.log('error in database connection');
  }

  this.connection = connection;
  console.log('database connected. connection id: ', connection.threadId);

  // send all route requests to routes
  routes(app, __dirname, connection);

  // if no route found, show 404 page
  app.use((req, res) => {
    res.sendFile(__dirname + '/public/404.html');
  });

  // start the server
  server = app.listen(process.env.PORT, () => {
    console.log(`server is running and up at http://localhost:${server.address().port}`);
  });
});

// function to handle server shutdown
const shutdown = () => {
  // close the db connection
  this.connection.end(err => {
    if(err) {
      return console.log('error in database connection close');
    }
    console.log('database disconnected');
    
    // shutdown the server
    server.close();
    console.log('server shutted down');
  });
};

// if `Ctrl + c` is pressed for stop node process, shutdown server
process.on('SIGINT', shutdown);
