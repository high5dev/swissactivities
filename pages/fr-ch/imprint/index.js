import { Legal, legalStaticProps } from "../../../modules/_pages-new/legal";
import { promises as fs } from "fs";

export default function Index(props) {
  return <Legal type="imprint" locale="fr_CH" {...props} />;
}

export async function getStaticProps() {
  return await legalStaticProps(fs, "imprint", "fr_CH");
}
