import { iconNames } from "@/data";
import { InferGetStaticPropsType } from "next";
import IndexTemplate from "../components/templates/IndexTemplate";

export default function Page(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return <IndexTemplate {...props} />;
}

export const getStaticProps = () => {
  return {
    props: {
      iconNames: shuffle(iconNames),
    },
  };
};

function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
