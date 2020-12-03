import React from 'react';
import {Card as MuiCard, makeStyles, useMediaQuery} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    borderRadius: '35px',
    background: theme.palette.background.paper,
    boxShadow: '0px 1px 30px 1px rgba(60,64,67,0.15)',
    padding: theme.spacing(3, 5, 1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2, 2),
      boxShadow: 'none',
      borderRadius: '0',
    },
  },
}));

const Card = (props) => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('xs'));

  if (isMobile) {
    return <div className={classes.container}>{props.children}</div>;
  }

  return <MuiCard className={classes.container}>{props.children}</MuiCard>;
};

export default Card;
