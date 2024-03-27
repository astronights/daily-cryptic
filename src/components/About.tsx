import { Container, Stack, Box } from "@chakra-ui/react"

const About = (props: { color: string }) => {
    return (
        <>
            <Container maxW={"4xl"} id="header">
                <Stack
                    as={Box}
                    textAlign={"center"}
                    spacing={{ base: 6, md: 6 }}
                    pb={{ base: 20, md: 16 }}
                    pt={{ base: 24, md: 24 }}
                >
                    About
                </Stack>
            </Container>
        </>
    )
}

export default About;