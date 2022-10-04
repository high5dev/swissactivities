import { promises as fs } from "fs";
import {
  Blog,
  blogStaticPaths,
  blogStaticProps,
} from "../../../modules/_pages-new/blog/blog";

export default function Index(props) {
  return <Blog {...props} />;
}

export async function getStaticProps({ params }) {
  const locale = "fr_CH";

  return await blogStaticProps({ params, fs, locale });
}

export async function getStaticPaths() {
  return await blogStaticPaths();
}
