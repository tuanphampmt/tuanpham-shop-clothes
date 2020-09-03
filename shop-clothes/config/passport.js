const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
module.exports = function (passport) {
    const authenticateUserReg = (req, email, password, done) => {
        process.nextTick(async () => {
            try {
                const user = await User.findOne({email: email});
                const hashedPassword = await bcrypt.hash(password, 10);
                if (user) {
                    return done(null, false, req.flash('SignUpMessage', 'Email đã tồn tại'))
                }
                const newUser = new User({
                    username: req.body.username
                });
                newUser.email = email;
                newUser.password = hashedPassword;
                await newUser.save();
                done(null, newUser);
            } catch (err) {
                done(err, false);
            }
        })
    };
    const authenticateUserLog = async (req, email, password, done) => {
        process.nextTick(async () => {
            try {
                const user = await User.findOne({email: email});
                const match = bcrypt.compare(password, user.password);
                if (!user) {
                    return done(null, false, req.flash('LoginMessage', 'Không tìm thấy user!!!'))
                }
                if (!match) {
                    return done(null, false, req.flash('LoginMessage', 'Mậu khẩu sai!!!'))
                }
                done(null, user);
            } catch (err) {
                done(err, false)
            }
        })
    };

    passport.use('local-Register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    }, authenticateUserReg));

    passport.use('local-Login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    }, authenticateUserLog));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
            const user = await User.findById(id);
            done(null, user)
        }
    );
};
