import jwt from 'jsonwebtoken';
import { Request ,Response} from 'express';
import { DecodedRequest } from 'src/interfaces/DecodedRequest';


const AdminSecret = process.env.AdminSecret || 'AdminSecret';
const userSecret = process.env.userSecret || 'userSecret';
const companySecret = process.env.companySecret || 'companySecret';
export function companyAuth(req: DecodedRequest, res: Response, next: Function){
  const token = req.headers['authorization'];


  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }


  jwt.verify(token, companySecret, (err: any, decoded: any) => {
    
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    
    next();
  });
}
export function userAuth(req: DecodedRequest, res: Response, next: Function){
  const token = req.headers['authorization'];

  
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

 
  jwt.verify(token, userSecret, (err: any, decoded: any) => {
  
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    
    req.decoded = decoded;
    next();
  });
}
export function AdminAuth(req: DecodedRequest, res: Response, next: Function) {
  
  const token = req.headers['authorization'];

  
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  
  jwt.verify(token, AdminSecret, (err: any, decoded: any) => {
    
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    
    req.decoded = decoded;
    next();
  });
}
