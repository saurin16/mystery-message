import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?:number
}

const connection: ConnectionObject = {}


async function  dbConnect(): Promise<void>{
     {
        if (connection.isConnected) {
            console.log('using existing connection');
            return;
        }

        try{
            await mongoose.connect(process.env.MONGODB_URI|| '', {})
            const db =await mongoose.connect(process.env.MONGODB_URI || '', {})
            connection.isConnected = db.connections[0].readyState

            console.log("DB Connected Successfully");


        }
         catch (error){
         console.log("Database COnnection Failed", error);

         process.exit(1)

         }   

             }        }


export default dbConnect;