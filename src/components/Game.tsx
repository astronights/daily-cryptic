import {
    Box, Heading, Container, Text, Button, Stack, CardBody, Card, CardHeader,
    StackDivider, Flex, Spacer, Link, CircularProgress, CircularProgressLabel,
    Input, HStack, Badge, Divider
} from "@chakra-ui/react";
import { Clue } from "../types";
import { getDailyClue, getNthDay, updateScore } from "../api/ClueAPI";
import { useEffect, useState } from "react";
import { CalendarIcon, LinkIcon, SearchIcon, InfoOutlineIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import { compareAnswers } from "../utils";

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
    const [guesses, setGuesses] = useState<string[][]>([]);
    const [scores, setScores] = useState<number[][][]>([]);
    const [rated, setRated] = useState<boolean>(false);
    const [curGuess, setCurGuess] = useState<string>('');

    const countRegex = new RegExp('\\([0-9\\W]+\\)$', 'g')

    useEffect(() => {
        getDailyClue().then((clue) => {
            setClue({
                ...clue,
                answer: clue.answer.toUpperCase().split(/[^A-Z]/).filter(word => word.length > 0).join(' ')
            });
            let raw_rating = clue.score * 0.1 + 3.0;
            setRating(raw_rating > 5.0 ? 5.0 : (raw_rating < 0.0 ? 0.0 : raw_rating));
        });
        getNthDay().then((nthday) => {
            setNthDay(nthday);
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

    const handleChange = (e: any) => {
        setCurGuess(e.target.value.replace(/[^A-Za-z ]/g, '').toUpperCase());
    }

    const updateGuess = () => {
        const guess = (document.getElementById('guess') as HTMLInputElement).value;
        if (guesses.length < 5) {
            const scoredGuesses = compareAnswers(clue.answer, guess.toUpperCase());
            const guessWords = scoredGuesses[0];
            const guessScores = scoredGuesses[1];
            setGuesses([...guesses, guessWords]);
            setScores([...scores, guessScores]);
        }
    }

    const mapColor = (score: number) => {
        switch (score) {
            case 0:
                return 'yellow';
            case 1:
                return 'purple';
            case 2:
                return 'green';
            case -1:
                return 'none';
        }
    }

    const checkColor = (score: number[]) => {
        if (score.every((val) => val === 2)) {
            return 'green';
        } else if (score.every((val) => val > 0)) {
            return 'purple';
        } else if (score.every((val) => val >= 0)) {
            return 'yellow';
        } else {
            return 'blue';
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
                                    <HStack>
                                    <Text textAlign={'left'} pt='2' fontSize='sm'>
                                        {clue.clue.replace(countRegex, '')}
                                    </Text>
                                    <Text textAlign={'left'} as='i' pt='2' fontSize='sm'>
                                        *{clue.clue.search(countRegex) !== -1 ? clue.clue.slice(clue.clue.search(countRegex)-1) : ''}
                                    </Text>
                                    </HStack>
                                    
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
                                <Stack>
                                    <HStack direction='row'>
                                        <Stack direction='row' >
                                            {clue.answer.split(' ').map((word, index) => {
                                                return <Badge fontSize={'inherit'} key={index} colorScheme='blue'>{word.length}</Badge>
                                            })}
                                        </Stack>
                                        <Input width={'750px'} id='guess' placeholder='Guess!' value={curGuess} onChange={handleChange} isDisabled={guesses.length == 5} />
                                        <Button variant='outline' onClick={updateGuess} isDisabled={guesses.length == 5}>Submit</Button>
                                    </HStack>
                                    <Divider />
                                    <Stack>
                                        {guesses.map((guess, index) => {
                                            return (
                                                <HStack key={index} direction='row'>
                                                    <Stack direction={'row'}>
                                                        {clue.answer.split(' ').map((word, wix) => {
                                                            return <Badge fontSize={'inherit'} key={wix} colorScheme={checkColor(scores[index][wix])}>{word.length}</Badge>
                                                        })}
                                                    </Stack>
                                                    <Stack direction={'row'} paddingLeft={'16px'} spacing={'0px'}>
                                                        {guess.map((word, wix) => {
                                                            return word.split('').map((letter, lix) => {
                                                                return lix === word.length - 1 ?
                                                                <><Badge fontSize={'inherit'} key={lix} padding={'0.5px'} colorScheme={mapColor(scores[index][wix][lix])}>{letter}</Badge><>&nbsp;</></> :
                                                                <Badge fontSize={'inherit'} key={lix} padding={'0.5px'} colorScheme={mapColor(scores[index][wix][lix])}>{letter}</Badge>
                                                            });
                                                            
                                                        })}
                                                    </Stack>
                                                </HStack>
                                            )
                                        })
                                        }
                                    </Stack>

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