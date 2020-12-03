import React from 'react';
import {Divider, makeStyles} from '@material-ui/core';
import Copyright from './Copyright';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: '-100%',
    marginRight: '-100%',
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
