import React from 'react';
import {makeStyles} from '@material-ui/core';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: '4px',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'flex-start',
    '& svg': {
      marginRight: theme.spacing(2),
      display: 'flex',
    },
  },
  error: {
    borderRadius: '6px',
    backgroundColor: 'rgb(253, 236, 234)',
    color: 'rgb(102, 60, 0)',
    '& svg': {
      color: theme.palette.error.main,
    },
  },
  success: {
    borderRadius: '6px',
    backgroundColor: 'rgb(237, 247, 237)',
    color: 'rgb(30, 70, 32)',

    '& svg': {
      color: theme.palette.success.main,
    },
  },
}));

const TYPE_MAP = {
  error: {
    text:
      'An unexpected error occurred while sending a message. Please try again.',
    icon: <WarningOutlinedIcon />,
  },
  success: {
    text: 'Thank you for contacting. I will get back to you within 48 hours.',
    icon: <CheckCircleOutlinedIcon />,
  },
};

const Alert = ({type}) => {
  const classes = useStyles();

  if (!type) {
    return null;
  }

  return (
    <div className={classes[type]}>
      <div className={classes.container}>
        <div>{TYPE_MAP[type].icon}</div>
        {TYPE_MAP[type].text}
      </div>
    </div>
  );
};

export default Alert;
