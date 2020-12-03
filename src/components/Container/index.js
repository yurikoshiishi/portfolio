import React from 'react';
import {Container as MuiContainer, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(10, 2, 5),
    [theme.breakpoints.down('xs')]: {
      padding: '0',
    },
  },
}));

const Container = (props) => {
  const classes = useStyles();
  return (
    <MuiContainer maxWidth="md" className={classes.root}>
      {props.children}
    </MuiContainer>
  );
};

export default Container;
