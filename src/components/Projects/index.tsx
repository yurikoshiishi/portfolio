import React, {useMemo} from 'react';
import Section from '../Section';
import ProjectItem, {ProjectItemProps} from './ProjectItem';
import {Grid} from '@material-ui/core';
import useTranslation from 'next-translate/useTranslation';

const Projects = () => {
  const {t, lang} = useTranslation('common');

  const PROJECT_ITEMS: ProjectItemProps[] = useMemo(
    () => [
      {
        name: 'Barbellbase',
        imageSrc: '/assets/barbellbase.png',
        descriptions: Array.from({length: 4}).map((_, i) =>
          t(`projects.0.descriptions.${i}`)
        ),
        technologies: [
          'Javascript',
          'React',
          'Redux',
          'Node.js',
          'HTML',
          'CSS',
          'Firebase',
          'Stripe',
          'SendGrid',
        ],
        youtubeVideoId: 'K4XIKTlgvnA',
        projectUrl: 'https://dashboard.barbellbase.app',
        githubUrl: '',
      },
      {
        name: 'Next.js + Express',
        imageSrc: '/assets/preview.png',
        descriptions: Array.from({length: 3}).map((_, i) =>
          t(`projects.1.descriptions.${i}`)
        ),
        technologies: [
          'TypeScript',
          'React',
          'Next.js',
          'Express',
          'PostgreSQL',
          'HTML',
          'CSS',
          'Firebase',
          'Docker',
          'nginx',
          'VPS',
        ],
        youtubeVideoId: '037HeJRu_-Y',
        projectUrl: 'https://review-protein.com',
        githubUrl:
          'https://github.com/yurikoshiishi/nextjs-express-postgresql-example-app',
      },
    ],
    [t, lang]
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
