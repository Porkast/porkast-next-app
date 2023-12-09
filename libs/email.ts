import { Resend } from "resend";
import { UserSubscriptionUpdateNotification } from "../components/EmailTemplate";

export type NotificationParams = {
    to: string
    subject: string
    keyword: string
    nickname: string
    updateCount: number
    titleList: string[]
    link: string
}

export const sendSubscriptionUpdateEmail = async (params: NotificationParams) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
        from: 'Porkast <noreply@porkast.com>',
        to: [params.to],
        subject: params.subject,
        react: UserSubscriptionUpdateNotification({
            keyword: params.keyword,
            nickname: params.nickname,
            updateCount: params.updateCount,
            titleList: params.titleList,
            link: params.link
        })
    });
}