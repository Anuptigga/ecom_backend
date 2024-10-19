import jwt from "jsonwebtoken";

const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.token;
    if(authHeader){
        const token=authHeader.split(" ")[1];
                jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err){
                console.error("Token verification failed:", err);
                res.status(403).json("token is not valid!");
                }
            req.user=user;
            next();
        });
    }else{
        return res.status(401).json("You are not authenticated!");
    };
};

const verifyTokenAuthorization=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("you are not authorized to do that!");
        }
    });
};
const verifyTokenAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("you are not authorized to do that!");
        }
    });
};

export {verifyToken , verifyTokenAuthorization, verifyTokenAdmin};
