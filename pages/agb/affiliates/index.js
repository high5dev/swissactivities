import { Legal, legalStaticProps } from "../../../modules/_pages-new/legal";
import { promises as fs } from "fs";

export default function Index(props) {
  return <Legal type="tos_aff" {...props} />;
}

export async function getStaticProps() {
  return await legalStaticProps(fs, "affiliate");
}
