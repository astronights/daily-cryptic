import {
    Box, Heading, Container, Text, Button, Stack, CardBody, Card, CardHeader,
    StackDivider, Flex, Spacer, Link, CircularProgress, CircularProgressLabel,
    Input, HStack
} from "@chakra-ui/react";
import { Clue } from "../types";
import { getDailyClue, getNthDay, updateScore } from "../api/ClueAPI";
import { useEffect, useState } from "react";
import { CalendarIcon, LinkIcon, SearchIcon, InfoOutlineIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";

const Game = (props: { color: string }) => {

    const today = new Date();
    const [clue, setClue] = useState<Clue>({
        rowid: 0,
        clue: "",
        answer: "",
        definition: "",
        puzzle_date: today,
        puzzle_name: "",
        source_url: "",
        source: "",
        score: 0,
        date_used: today,

    });
    const [nthDay, setNthDay] = useState<number>();
    const [def, setDef] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0.0);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [rated, setRated] = useState<boolean>(true); //TODO: Change before deployment

    useEffect(() => {
        getDailyClue().then((clue) => {
            setClue(clue);
            console.log(clue);
            let raw_rating = clue.score * 0.1 + 3.0;
            setRating(raw_rating > 5.0 ? 5.0 : (raw_rating < 0.0 ? 0.0 : raw_rating));
        });
        getNthDay().then((nthday) => {
            setNthDay(nthday);
            console.log(nthday);
        });
    }, []);

    const triggerDef = () => {
        setDef(true);
    }

    const reRate = (e: any) => {
        if (!rated) {
            let id = e.target.id;
            const newScore = id === 'plus' ? clue.score + 1 : clue.score - 1;
            const newRating = newScore * 0.1 + 3.0;
            setRating(newRating > 5.0 ? 5.0 : (newRating < 0.0 ? 0.0 : newRating));
            setRated(true);
            updateScore(clue.rowid, newScore);
        }

    }

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
                            <Flex>
                                <Heading size='md'>Cryptle # {nthDay}</Heading>
                                <Spacer />
                                <Stack direction={'row'}>
                                    <CalendarIcon />
                                    <Heading fontSize='md'>{clue.puzzle_date.toDateString()}</Heading>
                                </Stack>
                            </Flex>
                        </CardHeader>

                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                                <Box>
                                    <Stack direction={'row'} spacing='2'>
                                        <SearchIcon />
                                        <Heading textAlign={'left'} size='xs' textTransform='uppercase'>
                                            Clue
                                        </Heading>
                                    </Stack>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        {clue.clue}
                                    </Text>
                                </Box>
                                <Box>
                                    <Stack direction={'row'} spacing='2'>
                                        <LinkIcon />
                                        <Heading textAlign={'left'} size='xs' textTransform='uppercase'>
                                            Source
                                        </Heading>
                                    </Stack>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        <Link isExternal href={clue.source_url}>
                                            {clue.puzzle_name} ({clue.puzzle_date.toDateString()})
                                        </Link>
                                    </Text>
                                </Box>
                                <Box alignItems={'start'}>
                                    <Stack direction={'row'} spacing='2'>
                                        <Button variant={'link'} onClick={triggerDef}>
                                            <InfoOutlineIcon />
                                            <Heading size='xs' textTransform='uppercase'>
                                                &nbsp; Hint (Definition) ?
                                            </Heading>
                                        </Button>
                                    </Stack>
                                    <Text display={def ? 'block' : 'none'} textAlign={'left'} pt='2' fontSize='sm'>
                                        {clue.definition}
                                    </Text>
                                </Box>
                            </Stack>
                        </CardBody>
                    </Card>

                    <Stack
                        as={Box} w={'4x1'}
                        textAlign={"center"}
                        spacing={{ base: 6, md: 6 }}>
                        <Card>
                            <CardHeader>
                                <Heading textAlign={'left'} fontSize='md'>
                                    Guess ! ({5 - guesses.length} Remaining)
                                </Heading>
                            </CardHeader>
                            <CardBody>
                                <Stack direction='row'>
                                    <Input width={'750px'} placeholder='Guess!' />
                                    <Button variant='outline'>Submit</Button>
                                </Stack>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Heading textAlign={'left'} fontSize='md'>
                                    Did You Like It ?
                                </Heading>
                            </CardHeader>
                            <CardBody paddingTop={'1px'}>
                                <HStack direction='row'>
                                    <Spacer />
                                    <Button id='minus' onClick={reRate} leftIcon={<CloseIcon />} variant='outline'>
                                        No..
                                    </Button>
                                    <Spacer />
                                    <HStack direction={'row'}>
                                        <Heading verticalAlign={'center'} size='sm'>Average Rating</Heading>
                                        <CircularProgress value={(rating / 5.0) * 100}
                                            color={rating > 4 ? 'green' : (rating < 2 ? 'red' : 'orange')}>
                                            <CircularProgressLabel textAlign={'center'}>{rating}</CircularProgressLabel>
                                        </CircularProgress>
                                    </HStack>

                                    <Spacer />
                                    <Button id='plus' onClick={reRate} leftIcon={<CheckIcon />} variant='outline'>
                                        Yes!
                                    </Button>
                                    <Spacer />
                                </HStack>
                            </CardBody>
                        </Card>
                    </Stack>



                </Stack>
            </Container >
        </>
    );
}

export default Game;