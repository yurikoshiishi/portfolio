import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import Section from '../Section';
import ExperienceItem from './ExperienceItem';

const Experience = () => {
  const {t} = useTranslation();

  const EXPERIENCE_ITEMS = useMemo(
    () => [
      {
        time: t('2018/4 - 2020/10'),
        company: t('Dome Corp. Tokyo, Japan.'),
        jobTitle: t('E-commerce Specialist'),
        jobDescriptions: [
          t(
            'Worked on official e-commerce sites for Under Armour (Global Sports Apparel) and DNS (Japanese Sports Supplement).'
          ),
          t(
            'Localized Under Armour e-commerce site for Japan in collaboration with North America and APAC Teams, including translations as well as interpreting, issue handling and testing functionalities.'
          ),
          t(
            'Implemented various A/B tests through Adobe Target as well as creating landing pages and in-site contents with HTML, CSS, and JavaScript.'
          ),
          t(
            'Recovered CVR for Under Armour e-commerce site by 60% in cooperation with Adobe team, using in-depth analysis to improve UX, after it dropped down due to e-commerce platform renewal. '
          ),
        ],
      },
    ],
    [t]
  );

  return (
    <Section title={t('Experience')}>
      <div>
        {EXPERIENCE_ITEMS.map((exp, i) => (
          <ExperienceItem key={exp.time} {...exp} isFirst={i === 0} />
        ))}
      </div>
    </Section>
  );
};

export default Experience;
