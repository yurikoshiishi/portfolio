import React, { VFC } from "react";
import {
  Image,
  Container,
  VStack,
  Center,
  Box,
  Heading,
  Text,
  VisuallyHidden,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import Typist from "react-typist";
import { SocialLink } from "../../data";

interface HeroProps {
  links: SocialLink[];
}

const Hero: VFC<HeroProps> = ({ links }) => {
  const { t } = useTranslation("common");

  return (
    <Container maxWidth="container.md">
      <Box py={14}>
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
              fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
              lineHeight="110%"
              textAlign="center"
            >
              <Typist
                startDelay={200}
                avgTypingDelay={70}
                cursor={{
                  blink: true,
                }}
              >
                {t("hero.greeting")}
              </Typist>
              <VisuallyHidden>{t("hero.greeting")}</VisuallyHidden>
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
