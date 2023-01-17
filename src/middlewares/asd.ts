import jwt from 'jsonwebtoken';
import { Request ,Response} from 'express';
import { DecodedRequest } from 'src/interfaces/DecodedRequest';

// Replace "JWT_SECRET" with your actual JWT secret
const AdminSecret = process.env.AdminSecret || 'AdminSecret';
const userSecret = process.env.userSecret || 'userSecret';
const companySecret = process.env.companySecret || 'companySecret';
export function companyAuth(req: DecodedRequest, res: Response, next: Function){
  const token = req.headers['authorization'];

  // If there is no token, return a 401 error
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  // Otherwise, verify the token
  jwt.verify(token, companySecret, (err: any, decoded: any) => {
    // If there is an error verifying the token, return a 401 error
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    // If the token is valid, attach the decoded token to the request object and call the next middleware function
    req.decoded = decoded;
    next();
  });
}
export function userAuth(req: DecodedRequest, res: Response, next: Function){
  const token = req.headers['authorization'];

  // If there is no token, return a 401 error
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  // Otherwise, verify the token
  jwt.verify(token, userSecret, (err: any, decoded: any) => {
    // If there is an error verifying the token, return a 401 error
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    // If the token is valid, attach the decoded token to the request object and call the next middleware function
    req.decoded = decoded;
    next();
  });
}
export function AdminAuth(req: DecodedRequest, res: Response, next: Function) {
  // Get the token from the request header
  const token = req.headers['authorization'];

  // If there is no token, return a 401 error
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  // Otherwise, verify the token
  jwt.verify(token, AdminSecret, (err: any, decoded: any) => {
    // If there is an error verifying the token, return a 401 error
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    // If the token is valid, attach the decoded token to the request object and call the next middleware function
    req.decoded = decoded;
    next();
  });
}
