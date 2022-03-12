const Crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// init db
const Bay = require('../models/calypsobay').Bay;
const User = require('../models/calypsobay').User;

exports.whoAreYou = (req, res) => {
    res.render('index', { title: 'Calypsobay', bayImg: null });
};

exports.whoAreYou_posting = async (req, res, next) => {
  console.log(req.files);
    try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {
          const unique = Crypto.randomBytes(3*24).toString('hex');
          //Use the name of the input field to retrieve the uploaded file
          let theimage = req.files.theimage;
          
          //Use the mv() method to place the file in upload directory (i.e. "uploads")
          theimage.mv('./uploads/' + "calypsobay-" + theimage.name);

          // save details to db
          const pasted = new Bay({
            name: theimage.name,
            created_at: Date.now(),
            created_by: 'Public',
            uniqueID: unique,
            itsPath: '/uploads/' + "calypsobay-" + theimage.name,
            itsSize: theimage.size
          })

          pasted.save();

          //send response
          res.send({
              status: true,
              message: 'File is uploaded',
              data: {
                  name: theimage.name,
                  mimetype: theimage.mimetype,
                  size: theimage.size
              }
          });
      }
  } catch (err) {
      res.status(500).send(err);
  }
};

exports.registerUserForm = async (req, res, next) => {
    res.render('register');
};

exports.registerUser = async (req, res, next) => {    
    try {
    // get details from body
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
    // check if user exist
    const oldUser = await theBay.User.findOne({ email: email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    const user = await theBay.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    // return new user
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
}

exports.loginUserForm = async (req, res, next) => {
    res.render('login');
}

exports.loginUser = async (req, res, next) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await theBay.findOne({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, user_name: user.first_name },
        process.env.TOKEN_KEY,
        {
          algorithm: "HS256",
          expiresIn: "5m",
        }
      );

      // save user token
      user.token = token;

      // user
      res.cookie("token", token, { maxAge: 60000 });
      return res.redirect('/users/welcome');
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
}