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
    try {
      if(!req.files) {
          res.send({
              status: false,
              message: 'No file uploaded'
          });
      } else {        
        const fileX = Crypto.randomBytes(2*2).toString('hex');
        const unique = Crypto.randomBytes(3*24).toString('hex');
        let theimage = req.files.theimage;
        const fileName = 'bay-' + fileX + '.' + theimage.mimetype.split('/')[1];                     
        theimage.mv('./uploads/' + fileName);
        const thePath = '../' + fileName;

        // save details to db
        const pasted = new Bay({
          created_at: Date.now(),
          created_by: 'Public',
          uniqueID: unique,
          itsPath: thePath,
          itsSize: theimage.size
        })

          pasted.save();

          //send response
          res.render('show', { title: 'Calypsobay', paste: pasted });
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
    const { userName, password } = req.body;
    if (!(userName && password)) {
      res.status(400).send("All input is required");
    }
    // check if user exist
    const oldUser = await User.findOne({ user_name: userName });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    const user = await User.create({
      user_name: userName, // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    // Create token
    const token = jwt.sign(
      { user_id: user._id, user_name: user.user_name },
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
    const { userName, password } = req.body;

    // Validate user input
    if (!(userName && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ user_name: userName });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, user_name: user.user_name },
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

exports.getBay = async (req, res, next) => {
  try {
    Bay.findOne({ uniqueID: req.params.uniqueID })
    .exec(function (err, paste) {
        res.render('display', { title: 'Calypsobay', paste: paste });
    });
    } catch (err) {
        console.log(err);
        res.render('404');
    }
}