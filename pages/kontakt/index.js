import { promises as fs } from "fs";
import { Contact, contactStaticProps } from "../../modules/_pages-new/contact";

export default function Index(props) {
  return <Contact {...props} />;
}

export async function getStaticProps() {
  return await contactStaticProps(fs);
}
