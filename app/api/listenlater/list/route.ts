import { formatDateTime } from "@/libs/common"
import { queryUserListenLaterList, queryUserListenLaterTotalCount } from "@/libs/db/listen_later"
import { UserListenLaterDto } from "@/types/listen_later"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {

    const resp: JsonResponse = {
        code: 0,
        message: '',
        data: null
    }
    const searchParam = request.nextUrl.searchParams
    const userId = searchParam.get('userId')
    const limit = searchParam.get('limit')
    const offset = searchParam.get('offset')

    if (!userId) {
        resp.code = 1
        resp.message = 'User ID is required'
        return NextResponse.json(resp)
    }

    let queryListData: UserListenLaterDto[]
    try {
        queryListData = await queryUserListenLaterList(userId, Number(limit), Number(offset))
    } catch (error) {
        resp.code = 1
        resp.message = 'Something went wrong'
        console.log('query user listen later list error', error)
        return NextResponse.json(resp)
    }

    const totalCount = await queryUserListenLaterTotalCount(userId)

    for (const listenLaterDto of queryListData) {
        listenLaterDto.count = totalCount
        listenLaterDto.pub_date = formatDateTime(listenLaterDto.pub_date)
        listenLaterDto.input_date = formatDateTime(listenLaterDto.input_date)
        listenLaterDto.reg_date = formatDateTime(listenLaterDto.reg_date)
    }

    if (!queryListData) {
        resp.code = 1
        resp.message = 'No data found'
        return NextResponse.json(resp)
    } else {
        resp.code = 0
        resp.message = 'OK'
        resp.data = queryListData
    }

    return NextResponse.json(resp)
}