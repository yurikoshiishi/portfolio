import { Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-block",
    position: "relative",
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(3),
    "&:after": {
      display: "block",
      position: "absolute",
      content: '""',
      width: "30px",
      backgroundColor: theme.palette.primary.main,
      height: "4px",
      bottom: "0",
      borderRadius: "5px",
    },
    "&:before": {
      display: "block",
      position: "absolute",
      content: '""',
      width: "100%",
      backgroundColor: theme.palette.grey[50],
      height: "4px",
      bottom: "0",
      borderRadius: "5px",
    },
  },
}));

const Title = ({ title }) => {
  const classes = useStyles();
  return (
    <Typography variant="h2" className={classes.root}>
      {title}
    </Typography>
  );
};

export default Title;
