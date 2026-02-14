const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("../config/config");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// ======================
// JWT STRATEGY
// ======================
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        return user ? done(null, user) : done(null, false);
      } catch (err) {
        done(err, false);
      }
    },
  ),
);

// ======================
// GOOGLE OAUTH STRATEGY
// ======================
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: config.googleClientId,
      clientSecret: config.googleClientSecret,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase().trim();

        // Check if user already exists with googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);

        // If not, check if email already exists (local account)
        user = await User.findOne({ email });

        if (user) {
          // Attach googleId to existing account
          user.googleId = profile.id;
          user.provider = "google";
          await user.save();
          return done(null, user);
        }

        // Create new Google user
        user = await User.create({
          email,
          googleId: profile.id,
          provider: "google",
        });

        return done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);


module.exports = passport;
