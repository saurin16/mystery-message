import { getServerSession   } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {

    await dbConnect()

    const session = await getServerSession(authOptions) 
    const user : User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        )
    }
    const userId = user._id

    const {acceptmessage} = await request.json()
    try{
 
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptmessage},
            {new: true}

        )
        if(!updateUser){
            return Response.json(
                {
                    success: false,
                    message: "failed to update"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "updated",
                data: updateUser
            },
            {
                status: 200
            }
            )

    }

    catch(error){
       
        console.log(error)
        
        return Response.json(
            {
                success: false,
                message: "failed to update"
            },
            {
                status: 500
            }
        )

    }
    
     

}

export async function GET (request:Request){

    await dbConnect()

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User
    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        )
    }

    const userId = session.user._id

    try{

        const user = await UserModel.findById(userId)   

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    
                    status: 404
                }
            )
        }

        return Response.json(

            {
                success: true,
                message: "User found",
                data: user
            },
            {
                status: 200
            }
        )

    }

    catch(error){
        console.log(error)
        return Response.json(
            {
                success: false,
                message: "User not found"
            },
            {
                status: 500
            }

        )
    }
    }

