import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signupSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation


}
)


export async function GET(request: Request) {
  await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
       const result =  UsernameQuerySchema.safeParse(queryParam)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json(
                {
                    success: false,
                    message: "Invalid Username",
                    errors: usernameErrors
                },
                {
                    status: 400
                }
            )
        }
         const {username} = result.data
         
        const existingUserVerified = await UserModel.findOne({
           username, isVerified:true
        })

        if (existingUserVerified) {
            return Response.json(
                {
                    success: false,
                    message: "Username Already Exists"
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true
            },
            {
                status: 200
            }
        )


    } 
    catch (error) {
        return Response.json(
            { success: false, message: "Error Checking Username" },
            {
                status: 500
            }
        )
    }
}
   