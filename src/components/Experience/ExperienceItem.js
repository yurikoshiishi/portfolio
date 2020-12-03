import React from 'react';
import {makeStyles} from '@material-ui/core';
import {Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2, 2, 3, 5),
    position: 'relative',
    '&.first': {
      paddingTop: '0',
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      display: 'block',
      height: '100%',
      backgroundColor: '#f5f6f9',
      width: '1px',
      left: '15px',
      bottom: '5px',
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      display: 'block',
      height: '1px',
      backgroundColor: '#f5f6f9',
      width: 'calc(100% - 15px)',
      left: '15px',
      bottom: '3px',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(0, 0, 2, -5),
    '& .chip': {
      borderRadius: '30px',
      border: `2px solid ${theme.palette.primary.light}`,
      padding: '3px 10px',
      marginRight: theme.spacing(1),
      position: 'relative',
      background: theme.palette.background.paper,
    },
  },
}));

const ExperienceItem = ({time, company, jobTitle, jobDescription, isFirst}) => {
  const classes = useStyles();
  return (
    <div className={`${classes.root} ${isFirst ? 'first' : ''}`}>
      <div className={classes.header}>
        <div className="chip">
          <Typography variant="body2" color="textPrimary">
            {time}
          </Typography>
        </div>
        <Typography variant="body2" color="textSecondary">
          {company}
        </Typography>
      </div>
      <Typography variant="h4" color="textPrimary">
        {jobTitle}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {jobDescription}
      </Typography>
    </div>
  );
};

export default ExperienceItem;
