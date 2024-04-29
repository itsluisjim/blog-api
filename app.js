const express = require("express");
const passport = require("passport");
const logger = require('morgan');
const jwtStrategry  = require("./strategies/jwt");
const cors = require('cors');
const YAML = require("yamljs");
const swaggerUI = require('swagger-ui-express');

const apiRoutes = require('./routes/index');
const authRoute = require('./routes/auth');


const app = express();
const swaggerDocument = YAML.load('swagger.yaml');

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const corsOptions = {
    origin: 'http://localhost:4200',
};

app.use(cors());
app.use(logger('dev'));

app.use(passport.initialize());
passport.use(jwtStrategry);

require('./config/connection');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const authProtected = passport.authenticate('jwt', { session: false });

app.use('/api/v1', authProtected, apiRoutes);
app.use('/auth', authRoute);


app.listen(3000);