const { MongoClient } = require('mongodb');
const express = require('express');
const session = require('express-session');
const request = require('request');
const bcrypt = require('bcrypt');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const readline = require('readline');

app.use(express.static('public'))
app.use(express.json());
app.use(session({
  secret: 'session-code',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static('public'));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://azatmahan:1n8ov1pi3lWrQn6n@cluster0.6v91xh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  age: String,
  country: String,
  gender: String,
  hashPasswd: String,
  role: String
});


const User = mongoose.model('users', userSchema);


function sendEmail(recipient, subject, message) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'azatmahan@gmail.com',
      pass: 'wlkv ybhp aqkt owde',
    },
  });

  const mailOptions = {
    from: 'azatmahan@gmail.com',
    to: recipient,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


app.get('/', (req, res) => {
  if (req.session.user) {
     res.sendFile(__dirname + '/public/index.html')
  } else {
     res.redirect('/login');
  }
});
app.get('/login', (req,res) => {
  res.sendFile(__dirname + '/public/login.html')
})
app.get('/admin', (req, res) => {
  if (req.session.user) {
     if(req.session.user.role == "admin"){
        res.sendFile(__dirname + '/public/admin.html')
     } else {
        res.redirect('/login')
     }
  } else {
     res.redirect('/login')
  }
})
//login

app.post('/login', async (req, res) => {
  const { email, hashPasswd } = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid =bcrypt.compare(hashPasswd, user.hashPasswd);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Store user information in the session
    req.session.user = { userId: user._id, username: user.username, role: user.role };

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error during login', details: error.message });
  }
});

app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.json({ message: 'Authenticated user profile', user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

app.get('/username', async (req, res) => {
  try {
      if (req.session.user) {
         const userId = req.session.user._id;
         
         const result = await User.findOne({userId});
         

            res.json(result);
         } else {
            res.status(404).json({ error: 'User not found'});
         }
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error'});
  }
})
//create the user
app.post('/users', async (req, res) => {
  try {
    const { username, firstName, lastName, email, age, country, gender, password, role} = req.body;

    if (!username || !firstName || !lastName || !email || !age || !country || !gender || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const hashPasswd = await bcrypt.hash(password, 10)
    const user = new User({ username, firstName, lastName, email, age, country, gender, hashPasswd, role});
    await user.save();
    sendEmail(user.email, "Registration", "Successful");

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//retrieve(get) all the todo
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

//retrieve(get) single user
app.get('/users/:id', async (req, res) => {
  const user = await Todo.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
});

//update user
app.put('/users/:id', async (req, res) => {
  const { username, firstName, lastName, email, age, country, gender } = req.body;

  if (!username && !firstName && !lastName && !email && !age && !country && !gender) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { username, firstName, lastName, email, age, country, gender }, { new: true });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
});

//delete the todo
app.delete('/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json();
});



app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
     if (err) {
        console.error(err);
     } else {
        res.redirect('/login');
     }
  });
});


















app.get('/:crypto', (req, res) => {
  const crypto = req.params.crypto
  // URL BRINGS BACK ALL INFO OF THE TOKEN 
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${crypto}`;
  // URL2 BRINGS BACK THE CURRENT QUOTE AND PRICE DATA

  request.get({
    url: url,
    json: true,
    headers: {
      'X-CMC_PRO_API_KEY': "2b915716-484f-4635-8c8e-ab3c8389c05f"
    }
  }, (error, response, data) => {

    if (error) {
      return res.send({
        error: error
      });
    }

    res.json(data);

  });

});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));