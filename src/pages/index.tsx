import React from "react";
import { Element } from "react-scroll";
import Card from "../components/Card";
import Container from "../components/Container";
import EntryContent from "../components/EntryContent";
import Header from "../components/Header";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Experience from "../components/Experience";
import Footer from "../components/Footer";

const IndexPage = () => (
  <Container>
    <Header />
    <Card>
      <Element name="about">
        <EntryContent />
      </Element>
      <Element name="skills">
        <Skills />
      </Element>
      <Element name="experience">
        <Experience />
      </Element>
      <Element name="projects">
        <Projects />
      </Element>
      <Element name="contact">
        <Contact />
      </Element>
      <Footer />
    </Card>
  </Container>
);

export default IndexPage;
