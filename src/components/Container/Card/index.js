import React from 'react';
import {Card as MuiCard, makeStyles, useMediaQuery} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    background: theme.palette.background.paper,
  },
}));

const Card = (props) => {
  const classes = useStyles();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('xs'));

  if (isMobile) {
    return <div className={classes.container}>{props.children}</div>;
  }

  return <MuiCard>{props.children}</MuiCard>;
};

export default Card;
