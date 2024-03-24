import { Box, Heading, Container, Text, Button, Stack, CardBody, Card, CardHeader, StackDivider, Flex, Spacer, Link } from "@chakra-ui/react";
import { Clue } from "../types";
import { getDailyClue, getNthDay } from "../api/ClueAPI";
import { useEffect, useState } from "react";
import { CalendarIcon, LinkIcon, SearchIcon, InfoOutlineIcon } from "@chakra-ui/icons";

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

    useEffect(() => {
        getDailyClue().then((clue) => {
            setClue(clue);
            console.log(clue);
        });
        getNthDay().then((nthday) => {
            setNthDay(nthday);
            console.log(nthday);
        });
    }, []);

    const triggerDef = () => {
        setDef(true);
    }

    return (
        <>

            <Container maxW={"4xl"} id="header">
                <Stack
                    as={Box}
                    textAlign={"center"}
                    spacing={{ base: 8, md: 14 }}
                    pb={{ base: 20, md: 16 }}
                    pt={{ base: 36, md: 32 }}
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



                </Stack>
            </Container>
        </>
    );
}

export default Game;