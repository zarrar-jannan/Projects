import { useSelector } from "react-redux";
import { DatabaseService } from "../Appwrite/config/databaseService/database";
import { conf } from "../conf/conf";
import emailjs from '@emailjs/browser'

const database = new DatabaseService()

export async function sendVerificationCode({userEmail,userId}){
  const code = Math.floor(100000 + Math.random() * 900000)
  const mins = 15 * 60 * 1000
  const expires = Date.now() + mins

  try {
     const res = await database.setVerificationCode({
        userId,
        expires,
        code,
     })

     if(res){
        const sendRes = await emailjs.send(
            conf.emailjsServiceId,
            conf.emailjsTemplateId,
            {
                to_email: userEmail,
                passcode: code,
            },
            conf.emailjsPublicKey,
        )
        if(sendRes){
            return true
        }
     }
  } catch (error) {
    console.log(error,error.code);
    
  }

  console.log(Date.now(), expires);
  
}