import React from 'react';
import {Typography} from '@material-ui/core';

const Copyright = () => {
  return (
    <Typography variant="caption" color="textSecondary" align="center">
      {'© '}Yuri Koshiishi {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
};

export default Copyright;
