import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {

    const userId = params.userId
    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }

    if (!userId) {
        resp.code = 1
        resp.message = 'User ID is required'
        return NextResponse.json({ resp })
    }

    let queryData = await prisma.user_info.findUnique({
        where: {
            id: userId
        }
    })

    if (queryData) {
        queryData.password = ''
        resp.code = 0
        resp.message = 'OK'
        resp.data = queryData
        return NextResponse.json(resp)
    }

    resp.code = 1
    resp.message = 'User not found'
    return NextResponse.json(resp)
}