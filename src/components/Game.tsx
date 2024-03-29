import {
    Box, Heading, Container, Text, Button, Stack, CardBody, Card, CardHeader,
    StackDivider, Flex, Spacer, Link, CircularProgress, CircularProgressLabel,
    Input, HStack, Badge, Divider, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, SkeletonText
} from "@chakra-ui/react";
import {
    CalendarIcon, LinkIcon, SearchIcon, InfoOutlineIcon, TriangleUpIcon,
    TriangleDownIcon, ExternalLinkIcon, CopyIcon, ArrowForwardIcon, QuestionOutlineIcon
} from "@chakra-ui/icons";
import { BarChart } from '@saas-ui/charts'
import { Clue } from "../types";
import { getDailyClue, getNthDay, updateScore } from "../api/ClueAPI";
import { useEffect, useState } from "react";

import { checkColor, mapColor, getShareScores, compareAnswers } from "../utils";
import copy from 'copy-to-clipboard';


const Game = (props: { color: string, updatePage?: any;}) => {
    const [today, setToday] = useState(new Date());
    const [nthDay, setNthDay] = useState<number>();
    const [def, setDef] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0.0);
    const [guesses, setGuesses] = useState<string[][]>([]);
    const [scores, setScores] = useState<number[][][]>([]);
    const [rated, setRated] = useState<boolean>(false);
    const [curGuess, setCurGuess] = useState<string>('');
    const [gameEnd, setGameEnd] = useState<boolean>(false);
    const [win, setWin] = useState<boolean>(false);
    const [stats, setStats] = useState<boolean>(false);
    const [oldStats, setOldStats] = useState<number[]>([0, 0, 0, 0, 0, 0]);

    const [clue, setClue] = useState<Clue>({
        rowid: 0,
        clue: "",
        answer: "",
        definition: "",
        puzzle_date: null,
        puzzle_name: "",
        source_url: "",
        source: "",
        score: 0,
        date_used: today,
    });

    const countRegex = new RegExp('\\([0-9\\W]+\\)$', 'g')

    useEffect(() => {
        today.setHours(Math.abs(today.getTimezoneOffset() / 60), Math.abs(today.getTimezoneOffset() % 60), 0, 0);
        getDailyClue(today).then((clue) => {
            setClue({
                ...clue,
                answer: clue.answer.toUpperCase().split(/[^A-Z]/).filter(word => word.length > 0).join(' ')
            });
            setRating(Math.min(Math.max(clue.score * 0.1 + 3.0, 0.0), 5.0));
            const data = JSON.parse(localStorage.getItem("cryptle_cur"));
            if (data && data.clue.rowid === clue.rowid && data.guesses.length > 0) {
                setGuesses(data.guesses);
                setScores(data.scores);
                checkWin(clue.answer, data.guesses[data.guesses.length - 1]);
                if (data.guesses.length === 5) {
                    setGameEnd(true);
                    setStats(true);
                }
            }
            setOldStats(JSON.parse(localStorage.getItem("cryptle_stats")) || [0, 0, 0, 0, 0, 0]);
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

    const checkWin = (answer: string, latestGuess: string[]) => {
        const flatAnswer = answer.replace(/[^A-Z]/g, '');
        const flatGuess = latestGuess.join('').toUpperCase().replace(/[^A-Z]/g, '');
        if (flatAnswer === flatGuess) {
            setWin(true);
            setGameEnd(true);
            setStats(true);
        }
        if (guesses.length === 5) {
            setGameEnd(true);
            setStats(true);
        }
    }

    const updateGuess = () => {
        const isLastGuess = guesses.length === 4;
        const guess = (document.getElementById('guess') as HTMLInputElement).value;
        if (guess.trim().length === 0) {
            return;
        }
        const scoredGuesses = compareAnswers(clue.answer, guess.toUpperCase());
        const guessWords = scoredGuesses[0];
        const guessScores = scoredGuesses[1];
        setGuesses([...guesses, guessWords]);
        setScores([...scores, guessScores]);
        localStorage.setItem("cryptle_cur",
            JSON.stringify({ guesses: [...guesses, guessWords], scores: [...scores, guessScores], clue }));
        checkWin(clue.answer, guessWords);
        if (guessScores.flat().every((val) => val === 2)) {
            setOldStats(oldStats.map((val, ix) => ix === guesses.length ? val + 1 : val));
            localStorage.setItem("cryptle_stats", JSON.stringify(oldStats.map((val, ix) => ix === guesses.length ? val + 1 : val)));
        }
        if (isLastGuess) {
            setGameEnd(true);
            setStats(true);
            setOldStats([...oldStats.slice(0, 5), oldStats[5] + 1]);
            localStorage.setItem("cryptle_stats", JSON.stringify([...oldStats.slice(0, 5), oldStats[5] + 1]));
        }
        setCurGuess('');
    }

    const shareStats = () => {
        const scoresToCopy = getShareScores(nthDay, def, scores);
        if (navigator.share) {
            navigator.share({
                title: 'Cryptle',
                text: scoresToCopy.replace('https://daily-cryptic-iief.vercel.app/', ''),
                url: 'https://daily-cryptic-iief.vercel.app/'
            })
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            console.log('Web Share API not supported.');
        }

    }

    const copyStats = () => {
        const scoresToCopy = getShareScores(nthDay, def, scores);
        copy(scoresToCopy);
    }

    // Small hack to get rid of temporary unfixed bug in SAAS UI
    const error = console.error;
    console.error = (...args: any) => {
        if (/defaultProps/.test(args[0])) return;
        error(...args);
    };

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
                                <SkeletonText isLoaded={clue.answer != ''}>
                                    <Heading size='md'>Cryptle # {nthDay}</Heading>
                                </SkeletonText>
                                <Spacer />
                                <Stack direction={'row'}>
                                    <CalendarIcon />
                                    <Heading fontSize='md'>{today.toDateString()}</Heading>
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
                                    <SkeletonText isLoaded={clue.answer != ''} noOfLines={1} mt={2}>
                                        <HStack>
                                            <Text textAlign={'left'} pt='2' fontSize='sm'>
                                                {clue.clue.replace(countRegex, '')}
                                            </Text>
                                            <Text textAlign={'left'} as='i' pt='2' fontSize='sm'>
                                                {clue.clue.search(countRegex) !== -1 ? '*' + clue.clue.slice(clue.clue.search(countRegex) - 1) : ''}
                                            </Text>
                                        </HStack>
                                    </SkeletonText>

                                </Box>
                                <Box>
                                    <Stack direction={'row'} spacing='2'>
                                        <LinkIcon />
                                        <Heading textAlign={'left'} size='xs' textTransform='uppercase'>
                                            Source
                                        </Heading>
                                    </Stack>
                                    <SkeletonText isLoaded={clue.answer != ''} noOfLines={1} mt={2}>
                                        <Text textAlign={'left'} pt='2' fontSize='sm'>
                                            <Link isExternal href={clue.source_url}>
                                                {clue.puzzle_name} {clue.puzzle_date ? '(' + clue.puzzle_date.toDateString() + ')' : ''}
                                            </Link>
                                        </Text>
                                    </SkeletonText>
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
                                        {clue.definition && clue.definition.length > 0 ? clue.definition : 'No hint available.'}
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
                                <Flex>
                                <Heading textAlign={'left'} fontSize='md'>
                                    Guess ! ({5 - guesses.length} Remaining)
                                </Heading>
                                <Spacer />
                                <Button leftIcon={<QuestionOutlineIcon/>} size={'sm'} onClick={_ => props.updatePage('rules')} iconSpacing={0} variant='outline' />
                                </Flex>
                            </CardHeader>
                            <CardBody>
                                <Stack>
                                    <HStack direction='row'>
                                        <Stack direction='row' >
                                            {clue.answer.split(' ').map((word, index) => {
                                                return <Badge fontSize={'inherit'} key={index} colorScheme='blue'>{word.length}</Badge>
                                            })}
                                        </Stack>
                                        <Input width={'750px'} id='guess' placeholder='Guess!' value={curGuess} onKeyUp={(e) => e.key === 'Enter' ? updateGuess() : {}} onChange={handleChange} isDisabled={gameEnd} />
                                        <Button variant='outline' onClick={updateGuess} isDisabled={gameEnd}>{(typeof window !== "undefined") && (window.visualViewport.width > 768) ? 'Submit' : <ArrowForwardIcon />}</Button>
                                    </HStack>
                                    <Divider />
                                    <Stack>
                                        {guesses.toReversed().map((guess, revix) => {
                                            const index = guesses.length - revix - 1;
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
                                    Did You Like Today&apos;s Puzzle ?
                                </Heading>
                            </CardHeader>
                            <CardBody paddingTop={'1px'}>
                                <HStack direction='row'>
                                    <Spacer />
                                    <Button id='minus' onClick={reRate} leftIcon={<TriangleDownIcon />} variant='outline'>
                                        No
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
                                    <Button id='plus' onClick={reRate} leftIcon={<TriangleUpIcon />} variant='outline'>
                                        Yes
                                    </Button>
                                    <Spacer />
                                </HStack>
                            </CardBody>
                        </Card>
                    </Stack>

                    <>

                        <Modal isOpen={stats} onClose={() => { setStats(false) }}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>{win ? 'Congratulations!' : 'Better Luck Tomorrow..'}</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Text>
                                        {win ? 'You have solved today\'s puzzle in ' + guesses.length + (guesses.length > 1 ? ' guesses! ' : ' guess! ') : 'You ran out of guesses. :( '}
                                        The correct answer was {clue.answer}!
                                    </Text>
                                    <BarChart
                                        data={
                                            oldStats
                                                .map((val, ix) => {
                                                    return {
                                                        date: ix < 5 ? (ix + 1) : 'X',
                                                        Solved: val,
                                                    }
                                                })}
                                        categories={['Solved']}
                                        colors={['green', 'blue', 'red']}
                                        variant="solid"
                                        height="300px"
                                    />
                                </ModalBody>

                                <ModalFooter>
                                    <Button leftIcon={<ExternalLinkIcon />} colorScheme='blue' mr={1} onClick={shareStats}>
                                        Share
                                    </Button>
                                    <Button leftIcon={<CopyIcon />} colorScheme='blue' mr={1} onClick={copyStats}>
                                        Copy Results
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </>


                </Stack>
            </Container >
        </>
    );
}

export default Game;