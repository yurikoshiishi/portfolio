import React from "react";
import { BASE_URL } from "../../constants";
import { GAUNTLET_IMAGE_PATHS } from "../Gauntlet";

interface IndexTemplateProps {}

const IndexTemplate: React.FC<IndexTemplateProps> = ({ children }) => {
  return (
    <>
      <head>
        {Object.values(GAUNTLET_IMAGE_PATHS).map((path) => (
          <link key={path} rel="preload" as="image" href={path} />
        ))}
        <link rel="canonical" href={`${BASE_URL}/`} />
      </head>
      {children}
    </>
  );
};

export default IndexTemplate;
