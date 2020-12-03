import React from 'react';
import Section from '../Section';
import ExperienceItem from './ExperienceItem';

const EXPERIENCE_ITEMS = [
  {
    time: '2020/11 - Current',
    company: 'Freelance',
    jobTitle: 'Web Developer',
    jobDescription: 'ewjfwe wefew ojnewr wefgjer ergp rjwe  p',
  },
  {
    time: '2018/4 - 2020/10',
    company: 'Dome Corp.',
    jobTitle: 'E-commerce Specialist',
    jobDescription: 'ewjfwe wefew ojnewr wefgjer ergp rjwe  p',
  },
];

const Experience = () => {
  return (
    <Section title="Experience">
      <div>
        {EXPERIENCE_ITEMS.map((exp, i) => (
          <ExperienceItem key={exp.time} {...exp} isFirst={i === 0} />
        ))}
      </div>
    </Section>
  );
};

export default Experience;
