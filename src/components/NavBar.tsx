import {
    Flex, Button, Drawer, DrawerBody, DrawerOverlay, DrawerContent, useColorModeValue,
    Stack, useColorMode, IconButton, useMediaQuery, useDisclosure, HStack, Link,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";
const TbIcons = require("react-icons/tb");

const NavBar = (props: { color: string }) => {
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
    const scrollToAbout = () => {
        const aboutSection = document.querySelector("#about");
        aboutSection.scrollIntoView({ behavior: "smooth" });
    };
    const scrollToContact = () => {
        const contactSection = document.querySelector("#contact");
        contactSection.scrollIntoView({ behavior: "smooth" });
    };
    const changeScroll = () =>
        document.body.scrollTop > 80 || document.documentElement.scrollTop > 80
            ? setScroll(true)
            : setScroll(false);

    window.addEventListener("scroll", changeScroll);

    const TbLetterComponents = (window.visualViewport.width > 768) ?
        'CRYPTLE'.split('').map((letter) => TbIcons[`TbLetter${letter}`]) : [];

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
                            <>
                                <Button variant="ghost" onClick={scrollToAbout}>
                                    About
                                </Button>
                                <Button variant="ghost" onClick={scrollToContact}>
                                    Contact
                                </Button>
                            </>
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
                                            <Button variant="ghost" onClick={scrollToAbout}>
                                                About
                                            </Button>
                                            <Button variant="ghost" onClick={scrollToContact}>
                                                Contact
                                            </Button>
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