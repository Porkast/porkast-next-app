import prisma from './prisma'

export type ServerUserInfo = {
    id: string;
    username?: string;
    nickname?: string;
    token?: string;
    password?: string;
    email: string;
    phone?: string;
    regDate?: Date;
    updateDate?: Date;
    avatar?: string;
}

export const getTempNickname = (serverUserInfo: ServerUserInfo): string => {
    let nickname: string = ""
    if (!serverUserInfo.nickname) {
        if (serverUserInfo.email) {
            nickname = serverUserInfo.email.split('@')[0]
        } else if (serverUserInfo.phone) {
            nickname = serverUserInfo.phone
        }
    } else {
        nickname = serverUserInfo.nickname
    }

    return nickname
}

export const getNickname = (email: string, nickname: string): string => {
    if (!nickname) {
        nickname = email.split('@')[0]
    }
    return nickname
}

export const syncToServer = async (userInfo: ServerUserInfo) => {


    const resp = await fetch(`${process.env.API_BASE_URL}api/user/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userInfo.token || ''
        },
        body: JSON.stringify(
            {
                userId: userInfo.id,
                email: userInfo.email,
                phone: userInfo.phone,
                nickname: userInfo.nickname,
                password: userInfo.password,
                avatar: userInfo.avatar
            }
        )
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    });

    return resp
}

export const getUserInfoFromServer = async (userId: string): Promise<{ code: number, message: string, data: ServerUserInfo }> => {
    const resp = await fetch(`${process.env.API_BASE_URL}api/user/info/${userId}`)
    const respJson = await resp.json()

    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}
export async function getUserInfoByIdServer(userId: string): Promise<{ code: number, message: string, data: ServerUserInfo | null }> {
    try {
        const user = await prisma.user_info.findUnique({ where: { id: userId } })
        if (!user) return { code: 1, message: 'User not found', data: null }
        return {
            code: 0,
            message: 'OK',
            data: {
                id: user.id,
                username: user.username || '',
                nickname: user.nickname || '',
                email: user.email || '',
                phone: user.phone || '',
                regDate: user.reg_date || new Date(),
                updateDate: user.update_date || new Date(),
                avatar: user.avatar || '',
            }
        }
    } catch (err) {
        console.error('getUserInfoByIdServer error:', err)
        return { code: 1, message: String(err), data: null }
    }
}