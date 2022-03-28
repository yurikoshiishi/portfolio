import React, { useState, VFC } from "react";
import {
  Container,
  VStack,
  Center,
  Box,
  Heading,
  Text,
  HStack,
  IconButton,
  useColorMode,
  useBreakpointValue,
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import Typist from "react-typist";
import { SocialLink } from "../../data";
import { snap, undo } from "../../services/snap";
import Gauntlet from "../Gauntlet";

interface HeroProps {
  links: SocialLink[];
}

const Hero: VFC<HeroProps> = ({ links }) => {
  const { colorMode } = useColorMode();
  const { t, lang } = useTranslation("common");
  const [isTypingDone, setIsTypingDone] = useState<boolean>(false);
  const [shouldWave, setShouldWave] = useState<boolean>(false);
  const headingHeight = useBreakpointValue({ base: 40, sm: 60, md: 80 });

  const onTypingDone = () => {
    setIsTypingDone(true);

    setTimeout(() => {
      setShouldWave(true);
    }, 50);
  };

  const responsiveHeadingFontSize = getHeadingFontSizeForLang(lang);
  const avgTypingDelay = lang === "ja" ? 110 : 70;

  return (
    <Container maxWidth="container.md">
      <Box py={{ base: 10, sm: 14, md: 20, lg: 24 }}>
        <Center>
          <VStack spacing={8}>
            <Box
              className="snap-target"
              borderRadius="full"
              boxSize={150}
              backgroundImage="/assets/avatar.jpg"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              backgroundSize="cover"
            ></Box>
            <Heading
              minH={`${headingHeight}px`}
              letterSpacing="-0.05em"
              fontWeight={600}
              fontSize={responsiveHeadingFontSize}
              lineHeight="110%"
              textAlign="center"
              display="flex"
              alignItems="flex-end"
            >
              <style>
                {`
                  .wave {
                    animation-name: wave-animation;
                    animation-duration: 2.5s;
                    animation-iteration-count: 1;
                    transform-origin: 60% 200%;
                    display: inline-block;
                  }

                  @keyframes wave-animation {
                    0% {
                      transform: rotate(0deg);
                    }
                    10% {
                      transform: rotate(-7.5deg);
                    }
                    20% {
                      transform: rotate(7.5deg);
                    }
                    30% {
                      transform: rotate(-5deg);
                    }
                    40% {
                      transform: rotate(5deg);
                    }
                    50% {
                      transform: rotate(-5deg);
                    }
                    60% {
                      transform: rotate(0deg);
                    }
                    100% {
                      transform: rotate(0deg);
                    }
                  }
                `}
              </style>
              <Typist
                startDelay={200}
                avgTypingDelay={avgTypingDelay}
                cursor={{
                  show: false,
                }}
                onTypingDone={onTypingDone}
              >
                {t("hero.greeting")}
              </Typist>
              {isTypingDone && (
                <Gauntlet
                  size={headingHeight}
                  className={shouldWave ? "wave" : undefined}
                  onAnimationStart={(e, { type, animationDuration }) => {
                    type === "snap"
                      ? //NOTE: snap takes some time to execute, thus calling it between animation start and end
                        setTimeout(
                          () => snap(".snap-target"),
                          animationDuration * 0.5
                        )
                      : undefined;
                  }}
                  onAnimationEnd={(e, { type }) =>
                    type === "time" ? undo() : undefined
                  }
                />
              )}
            </Heading>
            <Text
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              textAlign="center"
              color={colorMode === "dark" ? "gray.300" : "gray.800"}
            >
              {t("hero.description")}
            </Text>
            <HStack spacing={6}>
              {links.map((link) => (
                <IconButton
                  key={link.href}
                  href={link.href}
                  as="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  aria-label={`link ${link.name}`}
                >
                  {link.icon}
                </IconButton>
              ))}
            </HStack>
          </VStack>
        </Center>
      </Box>
    </Container>
  );
};

function getHeadingFontSizeForLang(lang: string) {
  switch (lang) {
    case "ja":
      return { base: "xl", sm: "4xl", md: "5xl" };

    default:
      return { base: "2xl", sm: "4xl", md: "6xl" };
  }
}

export default Hero;
