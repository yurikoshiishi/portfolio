import React from 'react';
import {makeStyles, Chip, Divider, Button, Box} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CallMade from '@material-ui/icons/CallMade';
import {useTranslation} from 'react-i18next';
import {GitHubIcon} from '../Icons';
import VideoModal from './VideoModal';

const useStyles = makeStyles((theme) => ({
  card: {
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

export const ProjectItem = ({
  name,
  imageSrc,
  description,
  technologies,
  youtubeVideoId,
  projectUrl,
  githubUrl,
}) => {
  const classes = useStyles();
  const {t} = useTranslation();

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
        <Typography variant="h3" color="textPrimary" className={classes.title}>
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </div>
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

        {githubUrl && (
          <Button
            color="default"
            variant="outlined"
            startIcon={<GitHubIcon />}
            fullWidth
            component="a"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('view source')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectItem;
