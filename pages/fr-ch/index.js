import updateAlgolia from "../../services/algoliaServices";
import { promises as fs } from "fs";
import {
  Homepage,
  homepageStaticProps,
} from "../../modules/_pages-new/homepage";

export default function Index(props) {
  return <Homepage {...props} />;
}

export async function getStaticProps() {
  await updateAlgolia(fs);
  return homepageStaticProps(fs, "fr_CH");
}
