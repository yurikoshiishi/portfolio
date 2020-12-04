import React from 'react';
import {Divider, makeStyles} from '@material-ui/core';
import Copyright from './Copyright';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(-5),
    marginRight: theme.spacing(-5),
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(-2),
      marginRight: theme.spacing(-2),
    },
  },
  container: {
    textAlign: 'center',
    padding: theme.spacing(1, 0, 0.5),
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Divider />
      <div className={classes.container}>
        <Copyright />
      </div>
    </div>
  );
};

export default Footer;
