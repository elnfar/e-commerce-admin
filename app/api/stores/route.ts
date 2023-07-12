import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req:Request
) {
    try {

        const {userId} = auth()
        if(!userId) {
            return new NextResponse("Unauth",{status:401})
        }

        const body = await req.json();
        const {name} = body;

        if(!name) {
            return new NextResponse("Name is required",{status:400})
        }


        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store);       

    }catch(error) {
        console.log('{Store Post}',error);
        return new NextResponse("Internal Error",{status:500})
        
    }
}