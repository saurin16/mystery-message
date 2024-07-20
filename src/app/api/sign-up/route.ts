import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return NextResponse.json(
                { success: false, message: "Username already exists" },
                { status: 400 }
            );
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({
            email,
            isVerified: true,
        });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return NextResponse.json(
                    { success: false, message: "Email already exists" },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                existingUserVerifiedByEmail.isVerified = false;
                existingUserVerifiedByEmail.isAcceptingMessage = true;
                await existingUserVerifiedByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date(Date.now() + 3600000);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(username, email, verifyCode);

        if (!emailResponse.success) {
            return NextResponse.json(
                { success: false, message: emailResponse.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Verification email sent successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error registering the User", error);
        return NextResponse.json(
            { success: false, message: "Error registering the User" },
            { status: 500 }
        );
    }
}
