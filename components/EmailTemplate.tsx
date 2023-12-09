import { Body, Button, Container, Head, Heading, Html, Preview, Row, Section, Tailwind, Text } from "@react-email/components"


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
                            <Button href={props.link} className="bg-indigo-700 text-lg font-bold w-full">Listen Now</Button>
                        </Section>
                        <Section>
                            {
                                props.titleList.map((title, index) => {
                                    return (
                                        <Row key={index}>
                                            {title}
                                        </Row>
                                    )
                                })
                            }
                        </Section>
                    </Container>
                </Body>
            </Html>
        </Tailwind>
    )
}