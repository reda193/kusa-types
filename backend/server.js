require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credientials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const addFields = require('./controllers/AddFields');
const testEmail = require('./config/verificationEmail')
const validateSimklOrigin = require('./middleware/validateSkimklOrigin')
const validateLastFmOrigin = require('./middleware/validateLastFmOrigin');
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);


app.use(credientials);
app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));
app.use('/simkl', validateSimklOrigin);
app.use('/lastfm', validateLastFmOrigin);
app.use('/simkl', require('./routes/simkl'));
app.use('/lastfm', require('./routes/lastfm'));
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/user/', require('./routes/userdata'))
app.use('/userstats', require('./routes/userstats'));
app.use('/leaderboard', require('./routes/leaderboard'));
app.use('/validate', require('./routes/validatecode'));
app.use('/verify', require('./routes/verifycode'));

app.use(verifyJWT);


app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({error: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found')
    }
});

app.use(errorHandler);

const User = require('./model/User');

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    // addFields();
});
