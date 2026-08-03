import type { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || '123456789'

export type decodedTokenPayload={
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    imagePath: string;
    isVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      userData?: decodedTokenPayload;
    }
  }
}



const authenticationToken = ( 
    req: Request,
    res: Response,
    next: NextFunction
) =>{

    const token = req.cookies.token

    if(!token){
        return res.status(404).json({error:'Token not found'})
    }

    try{
         const decode = jwt.verify(token, jwtSecret) as decodedTokenPayload
         req.userData = {...decode}
         next()
    }catch(err){
        return res.status(403).json({error:'Token expired.'})
    }
   


}

export default authenticationToken