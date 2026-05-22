import { useEffect, useState } from 'react'
import Header from '../component/Header'
import Footer from '../component/Footer'

type Lang = 'en' | 'zh'

const content: Record<Lang, {
    title: string
    lastUpdated: string
    sections: { heading: string; paragraphs: string[] }[]
    contactEmail: string
}> = {
    en: {
        title: 'Privacy Policy',
        lastUpdated: 'Last updated: May 2026',
        contactEmail: 'support@porkast.com',
        sections: [
            {
                heading: 'Information We Collect',
                paragraphs: [
                    'Email address: Used for authentication via one-time verification codes sent to your email.',
                    'Optional nickname: You may provide a display name.',
                    'Subscription keywords: Topics or keywords you choose to follow for podcast discovery.',
                    'Listen Later list: Episodes you save for later listening.',
                    'Playlists: Names and episodes you organize into playlists.',
                    'Verification codes: Temporary codes used for login; stored for 10 minutes then deleted.',
                ]
            },
            {
                heading: 'Information We Do NOT Collect',
                paragraphs: [
                    'Precise location data',
                    'Device identifiers (IDFA, IDFV)',
                    'Contacts, photos, or other personal files',
                    'Health, financial, or biometric data',
                ]
            },
            {
                heading: 'How We Use Your Information',
                paragraphs: [
                    'Authentication: Verify your identity using email-based one-time codes.',
                    'Podcast Discovery: Find new podcast episodes matching your subscribed keywords.',
                    'Personalization: Display your playlists, listen later queue, and subscriptions.',
                    'Notifications: Send email updates about new episodes matching your subscriptions.',
                ]
            },
            {
                heading: 'Third-Party Services',
                paragraphs: [
                    'Resend: Email delivery service for sending verification codes and notifications. Their privacy policy: https://resend.com/legal/privacy-policy',
                    'Apple iTunes API: Used for podcast search and metadata retrieval.',
                    'Spotify API: Used for podcast search and metadata retrieval.',
                    'Telegram Bot API: Optional integration for podcast discovery via Telegram.',
                    'These services receive only the data necessary to perform their functions (e.g., your email address is shared with Resend solely for delivering verification codes).',
                ]
            },
            {
                heading: 'Data Storage and Security',
                paragraphs: [
                    'Your data is stored on secure PostgreSQL database servers.',
                    'Authentication uses JWT tokens, stored securely in your device\'s Keychain (iOS) or local storage.',
                    'Session tokens expire after 30 days of inactivity.',
                    'We implement reasonable security measures to protect your personal information.',
                ]
            },
            {
                heading: 'Your Rights',
                paragraphs: [
                    'Access your data at any time through the app.',
                    'Delete your data by removing subscriptions, playlists, or listen later items.',
                    'Request account deletion by contacting us at support@porkast.com.',
                ]
            },
            {
                heading: 'Children\'s Privacy',
                paragraphs: [
                    'Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us.',
                ]
            },
            {
                heading: 'Changes to This Policy',
                paragraphs: [
                    'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the service after changes constitutes acceptance.',
                ]
            },
            {
                heading: 'Contact Us',
                paragraphs: [
                    'If you have questions about this Privacy Policy, contact us at:',
                    'support@porkast.com',
                ]
            },
        ]
    },
    zh: {
        title: '隐私政策',
        lastUpdated: '最后更新：2026年5月',
        contactEmail: 'support@porkast.com',
        sections: [
            {
                heading: '我们收集的信息',
                paragraphs: [
                    '电子邮件地址：用于通过发送到您邮箱的一次性验证码进行身份认证。',
                    '可选的昵称：您可以设置显示名称。',
                    '订阅关键词：您选择关注的话题或关键词，用于发现播客。',
                    '稍后收听列表：您保存以便稍后收听的节目。',
                    '播放列表：您创建的播放列表名称及其中包含的节目。',
                    '验证码：用于登录的一次性临时代码，存储10分钟后自动删除。',
                ]
            },
            {
                heading: '我们不会收集的信息',
                paragraphs: [
                    '精确位置数据',
                    '设备标识符（IDFA、IDFV）',
                    '通讯录、照片或其他个人文件',
                    '健康、财务或生物识别数据',
                ]
            },
            {
                heading: '我们如何使用您的信息',
                paragraphs: [
                    '身份认证：使用基于邮箱的一次性验证码验证您的身份。',
                    '播客发现：根据您的订阅关键词为您找到匹配的新播客节目。',
                    '个性化：展示您的播放列表、稍后收听队列和订阅内容。',
                    '通知：在匹配您订阅的新节目出现时发送邮件更新。',
                ]
            },
            {
                heading: '第三方服务',
                paragraphs: [
                    'Resend：用于发送验证码和通知的邮件投递服务。其隐私政策：https://resend.com/legal/privacy-policy',
                    'Apple iTunes API：用于播客搜索和元数据检索。',
                    'Spotify API：用于播客搜索和元数据检索。',
                    'Telegram Bot API：可选的机器人集成，用于在 Telegram 中搜索和订阅播客。',
                    '这些服务仅接收执行其功能所必需的数据（例如，您的电子邮件地址仅共享给 Resend 用于投递验证码）。',
                ]
            },
            {
                heading: '数据存储与安全',
                paragraphs: [
                    '您的数据存储在安全的 PostgreSQL 数据库服务器上。',
                    '身份认证使用 JWT 令牌，安全地存储在您设备的 Keychain（iOS）或本地存储中。',
                    '会话令牌在30天不活动后过期。',
                    '我们采用合理的安全措施保护您的个人信息。',
                ]
            },
            {
                heading: '您的权利',
                paragraphs: [
                    '访问您的数据：随时通过应用查看您的订阅、播放列表等。',
                    '删除您的数据：取消订阅、删除播放列表或移除稍后收听项目。',
                    '请求删除账户：通过 support@porkast.com 联系我们。',
                ]
            },
            {
                heading: '儿童隐私',
                paragraphs: [
                    '我们的服务不面向13岁以下儿童。我们不会有意收集儿童的个人信息。如果您认为我们无意中收集了此类信息，请与我们联系。',
                ]
            },
            {
                heading: '本政策的变更',
                paragraphs: [
                    '我们可能会不时更新本隐私政策。变更将在本页面发布，并更新"最后更新"日期。变更后继续使用服务即表示您接受修改后的政策。',
                ]
            },
            {
                heading: '联系我们',
                paragraphs: [
                    '如对本隐私政策有任何疑问，请通过以下方式联系我们：',
                    'support@porkast.com',
                ]
            },
        ]
    },
}

export default function PrivacyPage() {
    const [lang, setLang] = useState<Lang>('en')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('lang') === 'zh') setLang('zh')
    }, [])

    const t = content[lang]

    return (
        <>
            <Header hideSearchBtn={true}>
                <div className="w-full flex justify-center min-h-screen">
                    <div className="w-full max-w-3xl pt-24 px-6 pb-12">
                        <div className="bg-base-200 p-8 rounded-xl shadow-lg">
                            <div className="flex justify-end mb-6">
                                <div className="join">
                                    <button
                                        className={`join-item btn btn-sm ${lang === 'en' ? 'btn-active' : ''}`}
                                        onClick={() => setLang('en')}
                                    >
                                        EN
                                    </button>
                                    <button
                                        className={`join-item btn btn-sm ${lang === 'zh' ? 'btn-active' : ''}`}
                                        onClick={() => setLang('zh')}
                                    >
                                        中文
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold mb-2">{t.title}</h1>
                            <p className="text-sm text-base-content/60 mb-8">{t.lastUpdated}</p>

                            {t.sections.map((section, i) => (
                                <div key={i} className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2">{section.heading}</h2>
                                    {section.paragraphs.map((p, j) => (
                                        <p key={j} className="text-base text-base-content/80 mb-1">{p}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Header>
            <Footer />
        </>
    )
}
