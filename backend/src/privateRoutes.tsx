import express from 'express'
import { prisma } from './prisma.js'

const router = express.Router()

router.get('/user-details',async(req,res)=>{
    const userEmail = req.userData?.email

    if(!userEmail){
       return res.status(403).json({error:'Invalid token'})
    }
try {
    const user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { password, ...rest } = user;

    res.status(200).json({
      payload: rest,
      message: "User verified.",
    });
  } catch (err) {
    return res.status(403).json({ error: "User not found." });
  }
})

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("hasAuth");

  res.status(200).json({ message: "Successfully Logged out" });
});

export default router