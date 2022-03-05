import React, { useMemo } from "react";
import useTranslation from "next-translate/useTranslation";
import Section from "../Section";
import ExperienceItem from "./ExperienceItem";

const EXPERIENCE_ITEM_LENGTH = 3;
const JOB_DESCRIPTIONS_LENGTHS = [4, 3, 3];

const Experience = () => {
  const { t, lang } = useTranslation("common");

  const EXPERIENCE_ITEMS = useMemo(
    () => generateExperienceTranslations(t),
    [t]
  );

  return (
    <Section title={t("Experience")}>
      <div>
        {EXPERIENCE_ITEMS.map((exp, i) => (
          <ExperienceItem key={exp.time} {...exp} isFirst={i === 0} />
        ))}
      </div>
    </Section>
  );
};

function generateExperienceTranslations(t) {
  const translations = [];

  for (let i = 0; i < EXPERIENCE_ITEM_LENGTH; i++) {
    const jobDescriptions = Array.from({
      length: JOB_DESCRIPTIONS_LENGTHS[i],
    }).map((_, j) => t(`experiences.${i}.jobDescriptions.${j}`));

    translations.push({
      time: t(`experiences.${i}.time`),
      company: t(`experiences.${i}.company`),
      jobTitle: t(`experiences.${i}.jobTitle`),
      jobDescriptions,
    });
  }

  return translations.reverse();
}

export default Experience;
