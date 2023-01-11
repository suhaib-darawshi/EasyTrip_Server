import {Property} from "@tsed/schema";
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  
});

// Add methods to the user schema
userSchema.methods.comparePassword = function (password: string) {
  // Compare the given password to the hashed password stored in the database
  return bcrypt.compare(password, this.password);
};

const Model  = mongoose.model('User', userSchema);

export class User extends Model {}

