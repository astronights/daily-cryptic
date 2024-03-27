import { Container, Stack, Box } from "@chakra-ui/react"

const Rules = (props: { color: string }) => {
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
                    Rules
                </Stack>
            </Container>
        </>
    )
}

export default Rules;