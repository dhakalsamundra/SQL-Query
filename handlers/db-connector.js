const mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.USE_DB
});

module.exports = (done) => {
  connection.connect(err => {
    if(err) {
      return done(err);
    }

    return done(err, connection);
  });
};