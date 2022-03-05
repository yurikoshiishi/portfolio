import React from "react";
import { Avatar, makeStyles, Typography, Button } from "@material-ui/core";
import useTranslation from "next-translate/useTranslation";
import { Link } from "react-scroll";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(5),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(6, 2),
      flexDirection: "column",
    },
  },
  avatarContainer: {
    margin: theme.spacing(0, 4),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginBottom: theme.spacing(3),
    },
    "& .MuiAvatar-root": {
      width: "225px",
      height: "225px",
      border: `2px solid ${theme.palette.divider}`,
      [theme.breakpoints.down("sm")]: {
        width: "175px",
        height: "175px",
        margin: "0 auto",
      },
      [theme.breakpoints.down("xs")]: {
        width: "125px",
        height: "125px",
      },
    },
  },
  textContainer: {
    "& h1": {
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.down("sm")]: {
      "& .name": {
        textAlign: "center",
      },
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(3),
    "& .MuiButton-root": {
      [theme.breakpoints.down("sm")]: {
        display: "block",
        textAlign: "center",
      },
      "&:first-child": {
        marginRight: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
          marginRight: "0",
          marginBottom: theme.spacing(2),
        },
      },
    },
  },
}));

const EntryContent = () => {
  const classes = useStyles();
  const { t } = useTranslation("common");

  return (
    <div className={classes.root}>
      <div className={classes.avatarContainer}>
        <Avatar src="/assets/avatar.jpg" alt="avatar" />
      </div>
      <div className={classes.textContainer}>
        <div className="name">
          <Typography variant="body1" color="textSecondary">
            {t("Web Developer")}
          </Typography>
          <Typography variant="h1" color="textPrimary">
            {t("Yuri Koshiishi")}
          </Typography>
        </div>
        <Typography variant="body2" color="textSecondary">
          {t("profile.description")}
        </Typography>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            smooth={true}
            offset={-55}
            duration={400}
            to="skills"
          >
            {t("See more")}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            smooth={true}
            offset={-55}
            duration={400}
            to="contact"
          >
            {t("Contact me")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntryContent;
