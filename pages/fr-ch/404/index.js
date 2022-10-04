import {
  FourOhFour,
  fourOhFourStaticProps,
} from "../../../modules/_pages-new/404";
import { promises as fs } from "fs";

export default function Index(props) {
  return <FourOhFour {...props} />;
}

export async function getStaticProps() {
  return await fourOhFourStaticProps(fs, "en_CH");
}
