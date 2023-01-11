import { MongooseModel } from '@tsed/mongoose';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { UserModel } from 'src/models/UserModel';
import * as jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret';

const LocalStrategy = passportLocal.Strategy;
let userModel:MongooseModel<UserModel>;
export function configurePassport() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', // Use the email field as the username field
        passwordField: 'password',
      },
      (email, password, done) => {
        // Find the user with the given email address
        userModel.findOne({ email })
          .then((user) => {
            // If the user does not exist, call 'done' with a 'false' flag
            if (!user) {
              return done(null, false);
            }

            // Verify the password
            if (!verifyPassword(password, user.password)) {
              return done(null, false);
            }
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
            // If the email and password are correct, call 'done' with the user object
            done(null, user);
          })
          .catch((error) => {
            done(error, false);
          });
      }
    )
  );
}

function verifyPassword(password: string, hashedPassword: string) {
  return password==hashedPassword;
}
