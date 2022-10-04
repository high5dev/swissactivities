import { promises as fs } from "fs";
import { About, aboutStaticProps } from "../../../modules/_pages-new/about-us";

export default function Index(props) {
  return <About {...props} />;
}

export async function getStaticProps() {
  return await aboutStaticProps(fs, "en_CH");
}
