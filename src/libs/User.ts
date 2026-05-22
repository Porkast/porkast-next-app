import { API_URL } from "./Constants";
import type { UserInfo } from "../types/user_info";

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
    const resp = await fetch(`${API_URL}/user/sync`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': userInfo.token || ''
        },
        body: JSON.stringify({
            userId: userInfo.id,
            email: userInfo.email,
            phone: userInfo.phone,
            nickname: userInfo.nickname,
            password: userInfo.password,
            avatar: userInfo.avatar
        })
    }).then(resp => resp.json()).catch(err => {
        console.log(err);
    });
    return resp
}

export const getUserInfoFromServer = async (userId: string): Promise<{ code: number, message: string, data: ServerUserInfo }> => {
    const resp = await fetch(`${API_URL}/user/info/${userId}`)
    const respJson = await resp.json()
    return {
        code: respJson.code,
        message: respJson.message,
        data: respJson.data
    }
}

// ─── Session management (localStorage) ───

export const isUserLoggedIn = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    const cacheUserData = localStorage.getItem('user_session')
    if (cacheUserData) {
        const userInfo = JSON.parse(cacheUserData) as UserInfo
        return !!userInfo.userId
    }
    return false
}

export const userSignout = async (): Promise<void> => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user_session')
        window.location.href = '/signin'
    }
}

export const getUserSessionInfo = async (): Promise<UserInfo> => {
    if (typeof window !== 'undefined') {
        const cacheUserData = localStorage.getItem('user_session')
        if (cacheUserData) {
            return JSON.parse(cacheUserData) as UserInfo
        }
    }
    return { userId: '', email: '', token: '' }
}

export const setUserSessionInfo = (userInfo: UserInfo): void => {
    localStorage.setItem('user_session', JSON.stringify(userInfo))
}
