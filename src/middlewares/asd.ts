import jwt from 'jsonwebtoken';
import { Request ,Response} from 'express';
import { DecodedRequest } from 'src/interfaces/DecodedRequest';

// Replace "JWT_SECRET" with your actual JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret';

export function jwtMiddleware(req: DecodedRequest, res: Response, next: Function) {
  // Get the token from the request header
  const token = req.headers['authorization'];

  // If there is no token, return a 401 error
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  // Otherwise, verify the token
  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    // If there is an error verifying the token, return a 401 error
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    // If the token is valid, attach the decoded token to the request object and call the next middleware function
    req.decoded = decoded;
    next();
  });
}
