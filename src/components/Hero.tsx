import IconButton from "@/components/ui/IconButton";
import { useLanguage } from "@/contexts/language";
import { joinClassNames } from "@/lib/style-helper";
import { snap, undo } from "blip-js";
import { useState, VFC } from "react";
import Typist from "react-typist";
import { SocialLink } from "../data";
import Gauntlet from "./Gauntlet";

interface HeroProps {
  links: SocialLink[];
}

const Hero: VFC<HeroProps> = ({ links }) => {
  const { t, lang, isLangSet } = useLanguage();
  const [isTypingDone, setIsTypingDone] = useState<boolean>(false);
  const [shouldWave, setShouldWave] = useState<boolean>(false);

  const onTypingDone = () => {
    setIsTypingDone(true);

    setTimeout(() => {
      setShouldWave(true);
    }, 50);
  };

  const avgTypingDelay = lang === "ja" ? 110 : 70;

  return (
    <div className="max-w-3xl px-4">
      <div className=" py-10 sm:py-14 md:py-20 lg:py-24">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <div
              className="snap-target rounded-full w-[150px] h-[150px] bg-no-repeat bg-cover bg-center"
              style={{ backgroundImage: "url(/assets/avatar.jpg)" }}
            ></div>
            {isLangSet ? (
              <h2
                className={joinClassNames(
                  "tracking-tight font-semibold text-center flex items-end dark:text-gray-50 min-h-[40px] sm:min-h-[60px] md:min-h-[80px]",
                  getHeadingFontSizeForLang(lang)
                )}
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
                {isTypingDone ? (
                  t("hero.greeting")
                ) : (
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
                )}
                {isTypingDone && (
                  <Gauntlet
                    className={joinClassNames(
                      " w-10 h-10 sm:w-[60px] sm:h-[60]px md:w-20 md:h-20",
                      shouldWave ? "wave" : undefined
                    )}
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
              </h2>
            ) : (
              <div className="h-[40px] sm:h-[60px] md:h-[80px]" />
            )}

            <p
              className={joinClassNames(
                "text-base sm:text-lg md:text-xl text-center text-gray-600 dark:text-gray-400",
                isLangSet ? "visible" : "invisible"
              )}
            >
              {t("hero.description")}
            </p>
            <div className="flex items-center justify-center gap-6">
              {links.map((link) => (
                <IconButton
                  key={link.href}
                  href={link.href}
                  as="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`link ${link.name}`}
                >
                  {link.icon}
                </IconButton>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getHeadingFontSizeForLang(lang: string) {
  switch (lang) {
    case "ja":
      return "text-xl sm:text-4xl md:text-5xl";

    default:
      return "text-2xl sm:text-4xl md:text-6xl";
  }
}

export default Hero;
