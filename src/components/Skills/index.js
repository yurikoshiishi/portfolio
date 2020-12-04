import {Grid} from '@material-ui/core';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  CssIcon,
  GitHubIcon,
  GitIcon,
  HtmlIcon,
  JavaScriptIcon,
  NodeIcon,
  ReactIcon,
  ReduxIcon,
} from '../Icons';
import Section from '../Section';
import SkillItem from './SkillItem';

const SKILL_ITEMS = [
  {text: 'JavaScript', icon: <JavaScriptIcon />},
  {text: 'React.js', icon: <ReactIcon />},
  {text: 'Redux', icon: <ReduxIcon />},
  {text: 'Node.js', icon: <NodeIcon />},
  {text: 'HTML', icon: <HtmlIcon />},
  {text: 'CSS', icon: <CssIcon />},
  {text: 'Git', icon: <GitIcon />},
  {text: 'GitHub', icon: <GitHubIcon />},
];

const Skills = () => {
  const {t} = useTranslation();
  return (
    <Section title={t('Skills')}>
      <Grid container spacing={1}>
        {SKILL_ITEMS.map((item) => (
          <Grid key={item.text} item xs={4} sm={3}>
            <SkillItem {...item} />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};

export default Skills;
