import {
    Flex, Button, Drawer, DrawerBody, DrawerOverlay, DrawerContent, useColorModeValue,
    Stack, useColorMode, IconButton, useMediaQuery, useDisclosure, HStack, Link,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";
const TbIcons = require("react-icons/tb");

interface NavProps {
    color: string;
    updatePage?: any;
}

const NavBar = (props: NavProps) => {
    const colors = {
        "blue": "#3182CE",
        "cyan": "#00B5D8",
        "gray": "#718096",
        "green": "#38A169",
        "orange": "#DD6B20",
        "pink": "#D53F8C",
        "purple": "#805AD5",
        "red": "#E53E3E",
        "teal": "#319795",
        "yellow": "#D69E2E"
    };

    const [scroll, setScroll] = useState(false);
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");
    const scrollToHeader = () => {
        const heroSection = document.querySelector("#header");
        heroSection.scrollIntoView({ behavior: "smooth" });
    };
    const changeScroll = () =>
        document.body.scrollTop > 80 || document.documentElement.scrollTop > 80
            ? setScroll(true)
            : setScroll(false);

    typeof window !== "undefined" && window.addEventListener("scroll", changeScroll);

    const TbLetterComponents = 'CRYPTLE'.split('').map((letter) => TbIcons[`TbLetter${letter}`]);

    return (
        <>
            <Flex
                bg={useColorModeValue("gray.100", "gray.900")}
                px={4}
                h={16}
                boxShadow={scroll ? "base" : "none"}
                zIndex="sticky"
                position="fixed"
                as="header"
                alignItems={"center"}
                justifyContent={"space-between"}
                w="100%"
            >
                <Link onClick={scrollToHeader}>
                    <HStack gap={'0.3rm'}>
                        {TbLetterComponents.map((Component, index) => {
                            if (Component.name === "TbSeparator") {
                                return <Component key={index} color={'transparent'} />;
                            } else {
                                return <Component key={index} color={colors[props.color]} />
                            }
                        }
                        )}
                    </HStack>
                </Link>

                <Flex alignItems={"center"}>
                    <Stack direction={"row"} spacing={3}>
                        {isLargerThanMD ? (
                            ['game', 'about', 'rules'].map((page: string) => (
                                <Button
                                    key={page}
                                    variant="ghost"
                                    onClick={() => props.updatePage(page)}
                                >
                                    {page[0].toUpperCase() + page.slice(1)}
                                </Button>
                            ))
                        ) : (
                            <></>
                        )}
                        <Button onClick={toggleColorMode}>
                            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                        </Button>

                        {isLargerThanMD ? (
                            <></>
                        ) : (
                            <>
                                <Button
                                    as={IconButton}
                                    icon={<HamburgerIcon />}
                                    onClick={onOpen}
                                ></Button>
                                <Drawer placement="top" onClose={onClose} isOpen={isOpen}>
                                    <DrawerOverlay />
                                    <DrawerContent>
                                        <DrawerBody>
                                            {
                                                ['game', 'about', 'rules'].map((page: string) => (
                                                    <Button
                                                        key={page}
                                                        variant="ghost"
                                                        onClick={() => {
                                                            props.updatePage(page)
                                                            onClose(); } //TODO Check if this works
                                                        }
                                                    >
                                                        {page[0].toUpperCase() + page.slice(1)}
                                                    </Button>
                                                ))
                                            }
                                        </DrawerBody>
                                    </DrawerContent>
                                </Drawer>
                            </>
                        )}
                    </Stack>
                </Flex>
            </Flex>
        </>
    );
}

export default NavBar;