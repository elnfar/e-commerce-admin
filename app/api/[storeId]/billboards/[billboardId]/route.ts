import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string, billboardId:string}}
) {
    try {

        const {userId} = auth()
        if(!userId) {
            return new NextResponse("Unauth",{status:401})
        }

        const body = await req.json();
        const {label,imageUrl} = body;

        if(!label) {
            return new NextResponse("Name is required",{status:400})
        }

        if(!imageUrl) {
            return new NextResponse("Name is required",{status:400})
        }


        if(!params.billboardId) {
            return new NextResponse("Store id is required",{status:400})
        }


        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id:params.storeId,
                userId
            }
        })
        if(!storeByUserId) {
            return new NextResponse("Unauthorized",{status:403})
        }

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id:params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard)

    }catch(error) {
        console.log('{Store Patch}',error);
        return new NextResponse("Internal Error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string, billboardId:string}}
) {
    try {

        const {userId} = auth()
        if(!userId) {
            return new NextResponse("Unauth",{status:401})
        }

        if(!params.billboardId) {
            return new NextResponse("Billboard id is required",{status:400})
        }


        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id:params.storeId,
                userId
            }
        })
        if(!storeByUserId) {
            return new NextResponse("Unauthorized",{status:403})
        }

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id:params.billboardId,
            }
        })

        return NextResponse.json(billboard)

    }catch(error) {
        console.log('{Billboard Delete}',error);
        return new NextResponse("Internal Error",{status:500})
    }
}



export async function GET(
    req:Request,
    {params}:{params:{billboardId:string}}
) {
    try {

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id:params.billboardId,
            }
        })

        return NextResponse.json(billboard)

    }catch(error) {
        console.log('{Billboard GET}',error);
        return new NextResponse("Internal Error",{status:500})
    }
}