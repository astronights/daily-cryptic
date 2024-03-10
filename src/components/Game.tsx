import { Box, Heading, Container, Text, Button, Stack, Icon, useColorModeValue } from "@chakra-ui/react";
import { Clue } from "../types";
import { getDailyClue } from "../api/ClueAPI";
import { useEffect, useState } from "react";

const Game = (props: {color: string}) => {

    const [clue, setClue] = useState<Clue>();

    useEffect(() => {
        getDailyClue().then((clue) => setClue(clue));
        console.log(clue);
    }, [clue]);

    const profile = {
        headerName: "John Doe",
        headerRole: "Software Engineer",
        headerDesc: "I'm a software engineer based in San Francisco, CA specializing in building (and occasionally designing) exceptional, high-quality websites and applications.",
        linkedin: "https://www.linkedin.com/in/johndoe/",
    };
    const linkedin = () => {
        window.open(
            `${profile.linkedin}`,
            "_blank",
            "noreferrer,noopener"
        );
    };
    return (
        <>
            <Heading>
                <link
                    href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
                    rel="stylesheet"
                />
            </Heading>

            <Container maxW={"4xl"} id="header">
                <Stack
                    as={Box}
                    textAlign={"center"}
                    spacing={{ base: 8, md: 14 }}
                    pb={{ base: 20, md: 16 }}
                    pt={{ base: 36, md: 32 }}
                >
                    <Heading
                        fontWeight={400}
                        fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
                        lineHeight={"110%"}
                    >
                        {profile.headerName} <br />
                        <Text as={"span"} color={`${props.color}.400`}>
                            {profile.headerRole}
                        </Text>
                    </Heading>
                    <Text
                        color={"gray.500"}
                        fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                    >
                        {profile.headerDesc}
                    </Text>
                    <Stack
                        direction={"column"}
                        spacing={3}
                        align={"center"}
                        alignSelf={"center"}
                        position={"relative"}
                    >
                        <Button
                            colorScheme={props.color}
                            bg={`${props.color}.400`}
                            rounded={"full"}
                            px={6}
                            _hover={{
                                bg: `${props.color}.500`,
                            }}
                            onClick={linkedin}
                        >
                            Let's connect!
                        </Button>
                        <Button
                            variant={"link"}
                            colorScheme={"blue"}
                            size={"sm"}
                        >
                            Contact Me
                        </Button>
                        <Box>
                            <Icon
                                color={useColorModeValue("gray.800", "gray.300")}
                                w={71}
                                position={"absolute"}
                                right={-71}
                                top={"10px"}
                            />
                            <Text
                                fontSize={"lg"}
                                fontFamily={"Caveat"}
                                position={"absolute"}
                                right={"-85px"}
                                top={"-15px"}
                                transform={"rotate(10deg)"}
                            >
                                Click me!
                            </Text>
                        </Box>
                    </Stack>
                </Stack>
            </Container>
        </>
    );
}

export default Game;