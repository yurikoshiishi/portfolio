import React from 'react';
import {makeStyles, Chip, Divider, Button, Box} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CallMade from '@material-ui/icons/CallMade';
import useTranslation from 'next-translate/useTranslation';
import {GitHubIcon} from '../Icons';
import VideoModal from './VideoModal';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: theme.spacing(2),
    border: '2px solid',
    borderColor: '#E7EDF3',
    borderRadius: 16,
    transition: '0.4s',
    overflow: 'hidden',
    '&:hover': {
      borderColor: '#5B9FED',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  },
  imageContainer: {
    marginBottom: theme.spacing(2),
    borderRadius: '10px',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    '& img': {
      display: 'block',
      width: '100%',
    },
  },
  textContainer: {
    marginBottom: theme.spacing(2),
    '& h3': {
      marginBottom: theme.spacing(1),
    },
  },
  descriptions: {
    paddingLeft: theme.spacing(1),
    '& li': {
      listStyle: 'disc inside',
      lineHeight: 1.2,
      marginBottom: theme.spacing(1),
    },
    '& span': {
      lineHeight: 1.2,
    },
  },
  chipContainer: {
    margin: theme.spacing(2, 0),
    '& .MuiChip-root': {
      marginRight: theme.spacing(0.5),
      marginBottom: theme.spacing(1),
    },
  },
  buttonContainer: {
    '& svg': {
      width: '20px',
      height: '20px',
    },
  },
}));

export interface ProjectItemProps {
  name: string;
  imageSrc: string;
  descriptions: string[];
  technologies: string[];
  youtubeVideoId: string;
  projectUrl: string;
  githubUrl?: string;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({
  name,
  imageSrc,
  descriptions,
  technologies,
  youtubeVideoId,
  projectUrl,
  githubUrl,
}) => {
  const classes = useStyles();
  const {t} = useTranslation('common');

  return (
    <div className={classes.card}>
      <div className={classes.imageContainer}>
        <a
          href={projectUrl ? projectUrl : githubUrl ? githubUrl : '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={imageSrc} alt={name} />
        </a>
      </div>
      <div className={classes.textContainer}>
        <Typography variant="h3" color="textPrimary">
          {name}
        </Typography>
        <ul className={classes.descriptions}>
          {descriptions.map((d, i) => (
            <li key={i}>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
              >
                {d}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
      <Box mt="auto">
        <Divider />
        <div className={classes.chipContainer}>
          {technologies.map((tech) => (
            <Chip variant="default" color="secondary" label={tech} key={tech} />
          ))}
        </div>
        <div className={classes.buttonContainer}>
          <Box mb={1} display="flex" alignItems="center" width="100%">
            <Box mr={1} flex="1">
              {youtubeVideoId && <VideoModal videoId={youtubeVideoId} />}
            </Box>
            <Box flex="1">
              {projectUrl && (
                <Button
                  fullWidth
                  color="primary"
                  variant="outlined"
                  startIcon={<CallMade />}
                  component="a"
                  href={projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('see live')}
                </Button>
              )}
            </Box>
          </Box>
          <Button
            color="default"
            variant="outlined"
            startIcon={<GitHubIcon />}
            fullWidth
            component="a"
            href={githubUrl}
            disabled={!githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('view source')}
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default ProjectItem;
