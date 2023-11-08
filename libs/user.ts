
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

export const syncToServer = async (userInfo: ServerUserInfo) => {


    const resp = await fetch(`${process.env.API_BASE_URL}v1/api/user/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
    const resp = await fetch(`${process.env.API_BASE_URL}v1/api/user/info/${userId}`)
    const respJson = await resp.json()

    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}