import React from 'react';
import {makeStyles, Typography} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
    '& svg': {
      maxWidth: '45px',
      marginBottom: theme.spacing(1),
    },
  },
}));

const SkillItem = ({icon, text}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {icon}
      <Typography variant="body2" color="textSecondary">
        {text}
      </Typography>
    </div>
  );
};

export default SkillItem;
