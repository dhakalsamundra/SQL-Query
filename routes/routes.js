const queryProcessor = require('./../handlers/query-processor');
const authenticators = require('./../handlers/authenticators');

module.exports = function(app, root, connection) {
  // authenticate the user. if the user is already logged in, forward directly to the query page,
  // else open the login page
  app.get('/login', authenticators.authLoginRoute, (req, res) => {
    res.sendFile('./public/login.html', { root });
  });

  app.post('/login', (req, res) => {
    var { password } = req.body;
    // check if input password matches with db password
    if(process.env.DB_PASSWORD == password) {
      // if yes, forward to query page
      // set the cookie
      res.cookie('secretKey', process.env.SECRET_KEY, { maxAge: 86400000 });
      res.send({ redirectTo: '/query' });
    } else {
      // otherwise send error data
      res.send('Incorrect password');
    }
  });

  app.get('/logout', (req, res) => {
    // clear the cookie
    res.clearCookie('secretKey');
    res.send({ redirectTo: '/login' });
  }); 

  app.get('/query', authenticators.authQueryRoute, (req, res) => {
    res.sendFile('./pages/query.html', { root });
  });

  app.post('/query', (req, res) => {
    var { query } = req.body;

    queryProcessor(query, connection, (err, fields, data) => {
      if(err) {
        // if there was a error in sql query, send the type `error` along with the error message
        res.send({
          type: 'error',
          responseText: err
        });
      } else if(!fields) {
        // if the query is of single output, such as, insert, create, update ...
        // send the type `single-output` along with the output
        res.send({
          type: 'single-output',
          responseText: data
        });
      } else {
        // if the result is a table, send the table rows along with the fields
        res.send({ data: { fields, data } });
      }
    });
  });
};
