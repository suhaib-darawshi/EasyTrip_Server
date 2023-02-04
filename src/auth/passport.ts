import { MongooseModel } from '@tsed/mongoose';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import { UserModel } from 'src/models/UserModel';
import * as jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'general-key';

const LocalStrategy = passportLocal.Strategy;
let userModel:MongooseModel<UserModel>;
export function configurePassport() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', 
        passwordField: 'password',
      },
      (email, password, done) => {
        
        userModel.findOne({ email })
          .then((user) => {
            
            if (!user) {
              return done(null, false);
            }

            
            if (!verifyPassword(password, user.password)) {
              return done(null, false);
            }
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
            
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
