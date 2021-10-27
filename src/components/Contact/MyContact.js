import React from 'react';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import {makeStyles, Button, Typography, Box} from '@material-ui/core';
import {GitHubIcon, LinkedInIcon} from '../Icons';
import useTranslation from 'next-translate/useTranslation';

const CONTACTS = [
  {
    text: 'yuri.koshiishi@gmail.com',
    href: 'mailto:yuri.koshiishi@gmail.com',
    icon: <EmailOutlinedIcon />,
  },
  {
    text: 'yurikoshiishi',
    href: 'https://www.linkedin.com/in/yurikoshiishi/',
    icon: <LinkedInIcon />,
  },
  {
    text: 'yurikoshiishi',
    href: 'https://github.com/yurikoshiishi',
    icon: <GitHubIcon />,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: theme.spacing(3),
    padding: theme.spacing(1, 0),
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      padding: '0',
      margin: '0',
    },
  },
  container: {
    flexGrow: '1',
    maxHeight: 'calc(100% - 74px)',
    padding: theme.spacing(1),
    border: '2px solid',
    borderColor: '#E7EDF3',
    borderRadius: 16,
    transition: '0.4s',
    overflow: 'hidden',
    '&:hover': {
      borderColor: '#5B9FED',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 2),
    },
  },
  contactItem: {
    marginBottom: theme.spacing(1),
    '& svg': {
      width: '20px',
      height: '20px',
      fill: theme.palette.text.secondary,
    },
  },
  button: {
    textTransform: 'none',
  },
  contact: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const ContactItem = ({icon, text, href}) => {
  const classes = useStyles();
  return (
    <div className={classes.contactItem}>
      <Button
        color="default"
        variant="text"
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        startIcon={icon}
        className={classes.button}
      >
        {text}
      </Button>
    </div>
  );
};

const MyContact = () => {
  const classes = useStyles();
  const {t} = useTranslation('common');
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Box my={1}>
          <Typography variant="body1" color="textSecondary" align="center">
            {t('Contact Info')}
          </Typography>
        </Box>
        {CONTACTS.map((contact) => (
          <ContactItem key={contact.href} {...contact} />
        ))}
      </div>
    </div>
  );
};

export default MyContact;
