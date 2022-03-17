// configure stuff
const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

// auth stuff
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.cookie("currentUser", 'Public', { maxAge: 600000 });
    // console.log(req.cookies);
  }

  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
    res.clearCookie('currentUser');
    res.cookie("currentUser", decoded.user_name, { maxAge: 600000 });
    // console.log(req.cookies);
  } catch (err) {
    // console.log(err);
    res.clearCookie('token');
    res.clearCookie('currentUser');
  }
  return next();
}

function dontLoginAndRegister(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/');
  }
  return next();
}

module.exports = { verifyToken, dontLoginAndRegister };