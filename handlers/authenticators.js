const authQueryRoute = (req, res, next) => {
  var { secretKey } = req.cookies;
  
  // check if the user have the cookie from the server
  if(secretKey == process.env.SECRET_KEY) {
    return next();
  }

  // otherwise forward to the login page
  res.redirect('/login');
};

const authLoginRoute = (req, res, next) => {
  var { secretKey } = req.cookies;
  
  // check if the user is logged out
  if(secretKey != process.env.SECRET_KEY) {
    return next();
  }

  // otherwise forward to the query page
  res.redirect('/query');
};

module.exports = { authLoginRoute, authQueryRoute };