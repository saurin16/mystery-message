import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'

import { usernameValidation } from "@/schemas/signupSchema";

export async function POST ( request: Request){

    await dbConnect()

    try{
  const {username, code} = await request.json()
  
  const decodedUsername =decodeURIComponent(username)
  const user = await UserModel.findOne({username:decodedUsername})

  if(!user){
    return Response.json(
        {
            success: false,
            message: " Username not found"
        },
        {
            status: 400
        }
    )
  }
  const isCodeValid = user.verifyCode === code 
  const isCodeNotexpired = new Date(user.verifyCodeExpiry)> new Date()

  if(!isCodeValid && !isCodeNotexpired){
    user.isVerified = true
    await user.save()

    return Response.json(
        {
            success: true,
            message: "User Verified"
        },
        {
            status: 200
        }
    )
  }
  else if(!isCodeNotexpired){
    return Response.json(
        {
            success: false,
            message: "Code Expired"
        },
        {
            status: 400
        }
    )
  }
  else{
    return Response.json(
        {
            success: false,
            message: "Invalid Code"
        },
        {
            status: 400
        }
    )
  }
}
catch (error) {
console.error("Error verifying user", error)
return Response.json(
    {
        success: false,
        message: "Error Verifying User "
    },
    {
        status: 500
    }
    
)
}

}