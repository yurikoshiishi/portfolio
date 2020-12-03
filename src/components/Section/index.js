import React from 'react';
import Title from './Title';
import {Box} from '@material-ui/core';

const Section = (props) => {
  const {title, children} = props;

  return (
    <Box component="section" mb={7}>
      <Title title={title} />
      <Box p={1}> {children}</Box>
    </Box>
  );
};

export default Section;
