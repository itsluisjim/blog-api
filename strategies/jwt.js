const JwtStrategry = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
require('dotenv').config();


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
};


module.exports = new JwtStrategry(opts, async (JwtPayload, done) => {
    const userId = JwtPayload.newUser._id;

    const user = await User.findById(userId).exec();

    if (!user) {
      return done(null, false);
    } else {
        return done(null, user)
    }
})
