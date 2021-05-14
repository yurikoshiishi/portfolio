import React, {useMemo} from 'react';
import Section from '../Section';
import ProjectItem from './ProjectItem';
import {Grid} from '@material-ui/core';
import {useTranslation} from 'next-i18next';

const Projects = () => {
  const {t} = useTranslation();

  const PROJECT_ITEMS = useMemo(
    () => [
      {
        name: 'Barbellbase',
        imageSrc: '/assets/barbellbase.png',
        descriptions: [
          t('Online coaching platform built for personal trainers in Japan. '),
          t(
            'Built SPA frontend in React, with Firebase backend for authentication, NoSQL database, and serverless functions.'
          ),
          t(
            'Integrated 3rd party solutions such as Stripe for billing, and SendGrid for sending emails.'
          ),
          t(
            'Core functionalities include workout logging, schedule sharing, real-time messaging, etc.'
          ),
        ],
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
      {
        name: 'PReview',
        imageSrc: '/assets/preview.png',
        descriptions: [
          t('Product review sharing platform designed for protein powders.'),
          t(
            'Built SSR frontend as well as API endpoints in Next.js, with PostgreSQL database.'
          ),
          t('Deployed the server and database in VPS.'),
          t(
            'Core functionalities include posting/liking/sorting/filtering reviews, product search, etc.'
          ),
        ],
        technologies: [
          'TypeScript',
          'React',
          'Next.js',
          'Node.js',
          'PostgreSQL',
          'HTML',
          'CSS',
          'Firebase',
          'VPS',
        ],
        youtubeVideoId: '037HeJRu_-Y',
        projectUrl: 'https://review-protein.com',
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
