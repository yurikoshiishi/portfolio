import {
  Box,
  Button,
  CircularProgress,
  TextField,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import Section from "../Section";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { sendContactForm } from "../../apis";
import useTranslation from "next-translate/useTranslation";
import Alert from "./Alert";
import MyContact from "./MyContact";

const validationSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Required"),
  name: yup.string(),
  subject: yup.string(),
  message: yup.string().required("Required"),
});

const FIELD_CONFIG = {
  variant: "filled",
  margin: "dense",
  fullWidth: true,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  form: {
    flexGrow: 1,
    [theme.breakpoints.down("xs")]: {
      marginBottom: theme.spacing(4),
      alignSelf: "stretch",
    },
  },
  button: {
    width: "200px",
    height: "36px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      display: "block",
      margin: "0 auto",
    },
  },
}));

const Contact = () => {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const { t } = useTranslation("common");

  const handleSendContactForm = async (formData, resetForm) => {
    setLoading(true);
    setError(false);
    setSuccess(false);
    try {
      const { data } = await sendContactForm({ ...formData });
      if (data.status === "success") {
        setSuccess(true);
        resetForm();
      }
    } catch (err) {
      console.log(err);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <Section title={t("Contact")}>
      <div className={classes.root}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{ email: "", name: "", subject: "", message: "" }}
          onSubmit={(data, { resetForm }) =>
            handleSendContactForm(data, resetForm)
          }
        >
          {({ values, errors, touched, handleSubmit }) => (
            <Form className={classes.form}>
              <Box>
                <Field
                  name="email"
                  label={t("Email")}
                  as={TextField}
                  required
                  type="email"
                  autoComplete="email"
                  {...FIELD_CONFIG}
                  error={errors.email && touched.email}
                  helperText={
                    errors.email && touched.email
                      ? t("Required. Please enter a valid email.")
                      : ""
                  }
                />
              </Box>
              <Box>
                <Field
                  name="name"
                  type="text"
                  autoComplete="name"
                  label={t("Name")}
                  as={TextField}
                  {...FIELD_CONFIG}
                />
              </Box>
              <Box>
                <Field
                  name="subject"
                  label={t("Subject")}
                  type="text"
                  autoComplete="off"
                  as={TextField}
                  {...FIELD_CONFIG}
                />
              </Box>
              <Box mb={3}>
                <Field
                  name="message"
                  label={t("Body")}
                  type="text"
                  autoComplete="off"
                  as={TextField}
                  {...FIELD_CONFIG}
                  required
                  multiline
                  rows={10}
                  rowsMax={30}
                  error={errors.message && touched.message}
                  helperText={
                    errors.message && touched.message ? t("Required.") : ""
                  }
                />
              </Box>
              <Box mb={2}>
                {isError && <Alert type="error" />}
                {isSuccess && <Alert type="success" />}
              </Box>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                onSubmit={handleSubmit}
                disabled={
                  isLoading ||
                  Object.keys(errors).length !== 0 ||
                  !values.email ||
                  !values.message.trim()
                }
                className={classes.button}
              >
                {isLoading ? <CircularProgress size={20} /> : t("Send Message")}
              </Button>
            </Form>
          )}
        </Formik>
        <MyContact />
      </div>
    </Section>
  );
};

export default Contact;
