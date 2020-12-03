import React from 'react';
import Section from '../Section';
import ProjectItem from './ProjectItem';
import {Grid} from '@material-ui/core';
import barbellbaseImage from '../../data/assets/barbellbase.png';

const PROJECT_ITEMS = [
  {
    name: 'Barbellbase',
    imageSrc: barbellbaseImage,
    description:
      'Online coaching platform built for personal trainers in Japan. Core functionalities include workout logging, schedule sharing, real-time messaging, etc.',
    technologies: [
      'Javascript',
      'React.js',
      'Redux',
      'Node.js',
      'HTML',
      'CSS',
      'Firebase',
    ],
    projectUrl: 'https://dashboard.barbellbase.app',
    githubUrl: '',
  },
];

const Projects = () => {
  return (
    <Section title="Projects">
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
