import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { Message } from "@/model/User";


export async function POST(request: Request) {

    await dbConnect()
    const{username, content} = await request.json()
    try{

        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json(

                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 400
                }
            )
        }

        if(!user.isAcceptingMessage){
            return Response.json(

                {

                    success: false,
                    message: "User not accepting messages"
                },
                {
                    status: 400
                }
            )


        }
        const newMessage = {content, createAt: new Date()}
       user.message.push (newMessage as Message )

      await user.save()

      return Response.json(

        {

            success: true,
            message: "Message sent"
        },
        {
            status: 200
        }
    )
    }
    catch(error){
        console.log("An error occurred: ", error)
        return Response.json(

            {

                success: false,
                message: "Error sending message"
            },
            {
                status: 500
            }
        )
        

    }
}