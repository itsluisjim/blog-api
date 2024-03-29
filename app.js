const express = require("express");
const passport = require("passport");
const jwtStrategry  = require("./strategies/jwt");
const cors = require('cors');

const apiRoutes = require('./routes/index');
const authRoute = require('./routes/auth');


const app = express();

const corsOptions = {
    origin: 'http://localhost:4200',
};

app.use(cors());

app.use(passport.initialize());
passport.use(jwtStrategry);

require('./config/connection');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authProtected = passport.authenticate('jwt', { session: false });

app.use('/api/v1', authProtected, apiRoutes);
app.use('/auth', authRoute);


app.listen(3000);