import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";


type RequestData = {
    userId: string
    nickname: string
    password: string
    passwordVerify: string
    email: string
    phone: string
    avatar: string
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    let resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }
    const requestData: RequestData = {
        userId: body.userId,
        nickname: body.nickname,
        password: body.password,
        passwordVerify: body.passwordVerify,
        email: body.email,
        phone: body.phone,
        avatar: body.avatar
    }

    if (!requestData.userId) {
        resp.code = 1
        resp.message = 'User ID is required'
        return NextResponse.json(resp)
    }

    const queryData = await prisma.user_info.findUnique({
        where: {
            id: requestData.userId
        }
    })


    if (queryData) {
        await prisma.user_info.update({
            where: {
                id: requestData.userId
            },
            data: {
                nickname: requestData.nickname,
                password: requestData.password,
                email: requestData.email,
                phone: requestData.phone,
                avatar: requestData.avatar,
                update_date: new Date()
            }
        })
    } else {
        await prisma.user_info.create({
            data: {
                id: requestData.userId,
                nickname: requestData.nickname,
                password: requestData.password,
                email: requestData.email,
                phone: requestData.phone,
                avatar: requestData.avatar,
                reg_date: new Date(),
                update_date: new Date(),
            }
        })
    }

    resp.code = 0
    resp.message = 'Success'
    return NextResponse.json(resp)
}