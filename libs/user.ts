
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
export const syncToServer = async (userInfo: ServerUserInfo) => {

    if (!userInfo.nickname) {
        if (userInfo.email) {
            userInfo.nickname = userInfo.email.split('@')[0]
        } else if (userInfo.phone) {
            userInfo.nickname = userInfo.phone
        }
    }

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