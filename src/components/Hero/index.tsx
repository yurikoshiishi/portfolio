import React, { VFC } from "react";
import {
  Image,
  Container,
  VStack,
  Center,
  Box,
  Heading,
  Text,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import Typist from "react-typist";
import { SocialLink } from "../../data";

interface HeroProps {
  links: SocialLink[];
}

const emojiId = `emoji-hand-${new Date().getTime()}`;

const Hero: VFC<HeroProps> = ({ links }) => {
  const { t } = useTranslation("common");

  const onTypingDone = () => {
    const emojiEl = document.getElementById(emojiId);

    if (!emojiEl) {
      return;
    }

    emojiEl.classList.add("wave");
  };

  return (
    <Container maxWidth="container.md">
      <Box py={{ base: 10, sm: 14 }}>
        <Center>
          <VStack spacing={8}>
            <Image
              fit="cover"
              boxSize="150px"
              borderRadius="full"
              src="/assets/avatar.jpg"
              alt="Yuri Koshiishi"
            />
            <Heading
              letterSpacing="-0.05em"
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
              lineHeight="110%"
              textAlign="center"
            >
              <style>
                {`
                  .wave {
                    animation-name: wave-animation;
                    animation-duration: 2.5s;
                    animation-iteration-count: 1;
                    transform-origin: 70% 70%;
                    display: inline-block;
                  }

                  @keyframes wave-animation {
                    0% {
                      transform: rotate(0deg);
                    }
                    10% {
                      transform: rotate(14deg);
                    }
                    20% {
                      transform: rotate(-8deg);
                    }
                    30% {
                      transform: rotate(14deg);
                    }
                    40% {
                      transform: rotate(-4deg);
                    }
                    50% {
                      transform: rotate(10deg);
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
                avgTypingDelay={70}
                cursor={{
                  blink: true,
                }}
                onTypingDone={onTypingDone}
              >
                {t("hero.greeting")}
                <Text
                  px={1.5}
                  as="span"
                  className="emoji-wave-hand"
                  id={emojiId}
                >
                  👋
                </Text>
              </Typist>
            </Heading>
            <Text
              fontSize={{ base: "md", sm: "lg", md: "xl" }}
              textAlign="center"
              color="gray.500"
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

export default Hero;
