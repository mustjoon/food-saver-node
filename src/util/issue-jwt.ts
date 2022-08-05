import jsonwebtoken from "jsonwebtoken";

import {JWT_SECRET} from "./secrets";

export function issueJWT(user) {
  
    const _id = user._id;
    const expiresIn = "1d";
    
    const payload = {
      sub: _id,
      iat: Date.now()
    };


    
    const signedToken = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: expiresIn });
  
    
    return {
      token: "Bearer " + signedToken,
      expires: expiresIn
    };
  }

