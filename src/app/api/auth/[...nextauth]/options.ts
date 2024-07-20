import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import  dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from 'bcryptjs'



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
                id: "credentials",
                name: "Credentials",
                credentials: {
                    email: {
                        label: "Email",
                        type: "text",
                        placeholder: "Enter your username",
                    },
                    password: {
                        label: "Password",
                        type: "password",
                        placeholder: "Enter your password",
                    },
                },
                async authorize(credentials: any): Promise<any> {
                    await dbConnect()
                    try{

                        const user = await UserModel.findOne({
                            $or:[
                                {
                                    email: credentials.identifier
                                },
                                {
                                    username: credentials.identifier
                                }
                            ]

                        })

                        if(!user){
                            throw new Error("Invalid credentials")
                        }

                        if(!user.isVerified){
                            throw new Error("Please verify your email")
                        }
                        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)

                        if(isPasswordCorrect){
                            return user
                        }
                        if(!isPasswordCorrect){
                            throw new Error("Invalid credentials")
                        }
                    }
                    catch(err:any){
                        throw new Error(err)
                    }
                } 
        })
    ],
     callbacks:{
         async jwt({token, user}){
             if(user){
                token.id = user._id?.toString()
                 token.isVerified = user.isVerified;
                 token.isAcceptingMessage = user.isAcceptingMessage
                 token.username = user.username
                    
             }
             return token
         },
         async session({session, token}){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
               // session.user.email = token.email
            }
             return session
         }
     },

     pages:{
         signIn:"/sign-in"
     },
     session:{
         strategy:"jwt"
     },
     secret: process.env.NEXTAUTH_SECRET

}

           
export default authOptions