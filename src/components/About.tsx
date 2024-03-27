import {
    Container, Stack, Box, Avatar, AvatarBadge, Text,
    Card, CardHeader, Heading, HStack, CardBody, StackDivider, Link, Tooltip
} from "@chakra-ui/react"

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
                    <Card>
                        <CardHeader>

                            <HStack>
                                <Tooltip label='/u/astronights' closeDelay={100}>
                                    <Avatar>
                                        <AvatarBadge boxSize='1.25em' bg='green.500' />
                                    </Avatar>
                                </Tooltip>
                                <Heading size='md'>Cryptic Crossword Enthusiast</Heading>
                            </HStack>

                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Heading textAlign={'left'} size='xs' textTransform='uppercase'>
                                        Summary
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        A Data Scientist with a passion for machine learning, quizzing and solving puzzles.
                                        Most of my expertise lies in the data science stack working with Python, Hadoop, Spark, SQL and Machine Learning models.
                                        If you&apos;d like to talk more, feel free to drop me an  &nbsp;
                                        <Link href='mailto:shubhankar.a31@gmail.com' color={props.color} isExternal>email</Link>
                                        &nbsp; here or connect with me on &nbsp; 
                                        <Link href='https://www.linkedin.com/in/shubhankar-agarwal/' color={props.color} isExternal>LinkedIn</Link> &nbsp;.
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs' textTransform='uppercase'>
                                        Technology Journey
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        I ventured into the foray of web development during university where I learnt how easy it was to build servers with Node, Express and Mongo.
                                        Wanting to complete the tech stack, I recently delved into learning React. 
                                        This project bringing my desire to build a single app integrating a server and client taught me NextJS and Vercel.
                                        However, I hope you will be kind with my project as I am still learning the ropes and would love to get feedback!
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs' textTransform='uppercase'>
                                        Inspiration
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        My interests in Cryptic Crosswords stemmed from my resolution to solve the &nbsp;
                                        <Link href='https://lovattspuzzles.com/online-puzzles-competitions/daily-cryptic-crossword/' color={props.color} isExternal>Lovatts</Link>
                                        &nbsp; cryptic crossword daily. Grateful to this website, this eased my transition from a casual puzzle solver to a seasoned cryptic crossword enthusiast.
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs' textTransform='uppercase'>
                                        Data
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        The data for the Cryptic clues and solutions are sourced from this publicly available &nbsp;
                                        <Link href='https://cryptics.georgeho.org/' color={props.color} isExternal>Cryptic Dataset</Link>
                                        , to which I extend my gratitude for aggregating some of the best Cryptic crossword clues over the past decades.
                                    </Text>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                </Stack>
            </Container>
        </>
    )
}

export default About;