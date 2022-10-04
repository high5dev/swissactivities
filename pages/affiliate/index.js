import { promises as fs } from "fs";
import {
  Affiliate,
  affiliateStaticProps,
} from "../../modules/_pages-new/affiliate";

export default function Index(props) {
  return <Affiliate {...props} />;
}

export async function getStaticProps() {
  return await affiliateStaticProps(fs);
}
