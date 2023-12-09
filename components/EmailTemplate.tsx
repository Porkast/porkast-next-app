import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Row, Section, Tailwind, Text } from "@react-email/components"


type EmailTemplateProps = {
    keyword: string
    nickname: string
    updateCount: number
    titleList: string[]
    link: string
}

export function UserSubscriptionUpdateNotification(props: EmailTemplateProps) {

    return (
        <Tailwind>
            <Html>
                <Head />
                <Preview>#{props.keyword} has new podcasts update</Preview>
                <Body className="w-full flex justify-center">
                    <Container className="w-full max-w-2xl">
                        <Heading className="text-lg font-bold">#{props.keyword} has {props.updateCount} new podcast update</Heading>
                        <Section>
                            <Text>
                                Hi {props.nickname},
                            </Text>
                            <Text>
                                Your subscription #{props.keyword} has new podcast update.
                            </Text>
                        </Section>
                        <Section>
                            {
                                props.titleList.map((title, index) => {
                                    return (
                                        <Row className="mt-4" key={index}>
                                            <Text>
                                                {title}
                                            </Text>
                                            <Hr />
                                        </Row>
                                    )
                                })
                            }
                            <Button href={props.link} className="bg-indigo-700 text-lg font-bold w-full text-center text-white border rounded-full mt-9">Listen Now</Button>
                        </Section>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    )
}