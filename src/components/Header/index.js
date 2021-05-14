import React, {useState, useMemo} from 'react';
import {
  Box,
  Toolbar,
  makeStyles,
  Button,
  Hidden,
  Drawer,
  IconButton,
  AppBar,
  Container,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import {Link} from 'react-scroll';
import ChangeLanguage from '../ChangeLanguage';
import MenuIcon from '@material-ui/icons/Menu';
import ElevationScroll from './ElevationScroll';
import {useTranslation} from 'next-i18next';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.down('xs')]: {
      padding: '0',
    },
  },
  appBar: {
    padding: theme.spacing(0, 2),
    transition: 'all 0.2s ease',
    '&.MuiPaper-elevation0': {
      background: 'transparent',
      '& .MuiButton-root': {
        color: 'rgba(255,255,255,0.85)',
      },
      [theme.breakpoints.down('xs')]: {
        background: theme.palette.background.paper,
        '& .MuiButton-root': {
          color: theme.palette.text.primary,
        },
      },
    },

    '&.MuiPaper-elevation2': {
      borderBottom: 'none',
      background: theme.palette.background.paper,
    },
    [theme.breakpoints.down('xs')]: {
      borderBottom: 'none',
      background: theme.palette.background.paper,
    },
  },
  desktopLinkContainer: {
    '& a': {
      marginRight: theme.spacing(1),
      '&:last-child': {
        marginRight: '0',
      },
      [theme.breakpoints.down('sm')]: {
        marginRight: theme.spacing(0.5),
        '& .MuiButton-root': {
          fontSize: '12px',
          textTransform: 'none',
        },
      },
    },
  },
  mobileLinkContainer: {
    '& ul': {
      width: '100%',
      '& a.active .MuiListItemText-root .MuiTypography-root': {
        color: theme.palette.primary.main,
      },
    },
  },
  link: {
    transition: '0.2s',
    '&.active': {
      '& .MuiButton-root': {
        color: theme.palette.primary.main,
      },
    },
  },
  drawerPaper: {
    width: '75%',
  },
}));

const Header = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();

  const LINKS = useMemo(
    () => [
      {to: 'about', text: t('About')},
      {to: 'skills', text: t('Skills')},
      {to: 'projects', text: t('Projects')},
      {to: 'experience', text: t('Experience')},
      {to: 'contact', text: t('Contact')},
    ],
    [t]
  );

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const container =
    typeof window !== 'undefined' ? () => window.document.body : undefined;

  return (
    <ElevationScroll>
      <AppBar className={classes.appBar}>
        <Container maxWidth="md">
          <Toolbar className={classes.toolbar}>
            <ChangeLanguage />
            <Hidden xsDown>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                className={classes.desktopLinkContainer}
              >
                {LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    spy={true}
                    smooth={true}
                    offset={-55}
                    duration={400}
                    activeClass="active"
                    className={classes.link}
                  >
                    <Button variant="text">{link.text}</Button>
                  </Link>
                ))}
              </Box>
            </Hidden>

            <Hidden smUp>
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon color="action" />
              </IconButton>
              <Drawer
                container={container}
                variant="temporary"
                anchor={'right'}
                open={open}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="column"
                  className={classes.mobileLinkContainer}
                >
                  <List>
                    {LINKS.map((link) => (
                      <ListItem
                        component={Link}
                        key={link.to}
                        to={link.to}
                        spy={true}
                        smooth={true}
                        offset={-60}
                        duration={400}
                        activeClass="active"
                        button
                        onClick={handleCloseDrawer}
                      >
                        <ListItemText primary={link.text} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </Hidden>
          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
};

export default Header;
