import React, {useMemo} from 'react';
import Section from '../Section';
import ProjectItem from './ProjectItem';
import {Grid} from '@material-ui/core';
import barbellbaseImage from '../../data/assets/barbellbase.png';
import {useTranslation} from 'react-i18next';

const Projects = () => {
  const {t} = useTranslation();

  const PROJECT_ITEMS = useMemo(
    () => [
      {
        name: 'Barbellbase',
        imageSrc: barbellbaseImage,
        description: t(
          'Online coaching platform built for personal trainers in Japan. Core functionalities include workout logging, schedule sharing, real-time messaging, etc.'
        ),
        technologies: [
          'Javascript',
          'React',
          'Redux',
          'Node.js',
          'HTML',
          'CSS',
          'Firebase',
        ],
        youtubeVideoId: 'K4XIKTlgvnA',
        projectUrl: 'https://dashboard.barbellbase.app',
        githubUrl: '',
      },
    ],
    [t]
  );

  return (
    <Section title={t('Projects')}>
      <Grid container spacing={1}>
        {PROJECT_ITEMS.map((project) => (
          <Grid item xs={12} sm={6} key={project.name}>
            <ProjectItem {...project} />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
};

export default Projects;
