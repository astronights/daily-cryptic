import {
    Container, Stack, Box, Text, Highlight,
    Card, CardHeader, Heading, HStack, CardBody, StackDivider, Code, Badge
} from "@chakra-ui/react"

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
                    <Card>
                        <CardHeader>
                            <Heading size='md'>Rules of the Game</Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Heading textAlign={'left'} size='xs' textTransform='uppercase'>
                                        The Game
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        The game is simple. You are presented with a cryptic crossword clue and you have to guess the answer.
                                        The answer can be a single word or a phrase. The clue will be presented in a standard cryptic crossword format.
                                        You have 5 attempts to guess the right answer, after each of which your answer is validated.
                                        The game will end after 5 attempts or if you guess the right answer.
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs'>
                                        Clue
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        The clue is presented as a standard cryptic crossword clue.
                                        Like most cryptic crosswords, the clue is a mix of a definition and a wordplay.
                                        The definition is usually at the beginning or end of the clue and the wordplay is in the middle.
                                        The wordplay can be an anagram, a charade, a container or any other cryptic crossword clue type.
                                        Each clue has a number of letters indicating the length of the answer.
                                    </Text>
                                    <Text padding={4} textAlign={'left'}>EXAMPLE: Put a stop to public relations incident* (7) = PREVENT </Text>

                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        <Highlight query={['NOTE:', 'Guess']} styles={{ px: '2', py: '0.5', rounded: 'full', bg: 'teal.100' }}>
                                            NOTE: The clues are sourced from a publicly available dataset and are not created by me.
                                            This might lead to some incosistencies in the quality of the clues.
                                            The number of letters in the Clue text might not match the number of letters in the answer, refer to the Guess section to have the accurate letter count.
                                        </Highlight>
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs'>
                                        Source
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        The source indicates the puzzle (along with its date and link) from which the clue is taken.
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs'>
                                        Hint (Definition)
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        A hint is available as the definition of the clue. This is usually the first or last part of the clue.
                                        Viewing the hint will add an asterisk (*) to your score.
                                    </Text>
                                    <Text padding={4} textAlign={'left'}>EXAMPLE: Put a stop = PREVENT </Text>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        <Highlight query={['NOTE:']} styles={{ px: '2', py: '0.5', rounded: 'full', bg: 'teal.100' }}>
                                            NOTE: Some clues might not have hints provided.
                                            Clicking on the hint will not affect the score sharing.</Highlight>
                                    </Text>
                                </Box>

                            </Stack>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Heading size='md'>
                                How to Guess
                            </Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Heading textAlign={'left'} size='xs'>
                                        Guess
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        You have five attempts to guess the right answer. After each guess, the answer is validated.
                                        The answer is case-insensitive, space-insensitive and does not require any special characters.
                                        Your answer will automatically be split into words based on the word counts in the actual answer.
                                    </Text>
                                    <Stack direction='row' pt={4}>
                                        <Badge fontSize={'inherit'} key={'count'} colorScheme='blue'>{3}</Badge>
                                        <Badge fontSize={'inherit'} key={'count'} colorScheme='blue'>{5}</Badge>
                                        <Text>This indicates the answer is two words (3, 5) = THE WORLD</Text>
                                    </Stack>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        Any variations including <Code>theworld</Code> (Space Insensitive),<Code>tHe wOrLd</Code> (Case Insensitive), <Code>THEWO RLD</Code> (Letter Count Insensitive) will be considered correct.
                                        If you have more letters than the answer, all extra letters are grouped into the last word when validating.
                                    </Text>

                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs'>
                                        Validation
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        At each guess, your answer is validated. This validation is represented with the following colour scheme.
                                    </Text>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Heading size='md'>
                                More Features
                            </Heading>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Heading textAlign={'left'} size='xs' textTransform='uppercase'>
                                        Miscellaneous Features
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        In line with scaling this further, I have added a few more features to the game.
                                        This includes: \n Rating system for the clues, to gauge which clues are better constructed,
                                        daily aggregated statistics to track performance, and a share feature to share your results
                                        with friends/family across channels.
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs'>
                                        Clue Rating
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        A rating is maintained for each clue to understand the quality of the clue.
                                        Please rate the clue (Yes/No) based on its interpretability.
                                        The ratings are balanced with each user and the average rating is used to update the clue quality.
                                        Clue sources are then filtered in/out based on their average ratings.
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs'>
                                        Daily Statistics
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        A small chart displays the daily statistics of the user.
                                        This shows the number of guesses taken per puzzle and relies on storing minimal browser cookies.
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading textAlign={'left'} size='xs'>
                                        Share
                                    </Heading>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        You can share results on Social Media after completing the puzzle.
                                        The share will include the puzzle date, the score and your pattern of solving (Represented by emojis).
                                    </Text>
                                    <Text pt={4} textAlign={'left'} whiteSpace={'pre-line'}>
                                        {'Cryptle #1 4/5* \n🔵🟢🔵\n🟡🔵🟠\n🟠🟢🟡\n🟢🟢🟢\nhttps://daily-cryptic-iief.vercel.app/'}
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

export default Rules;