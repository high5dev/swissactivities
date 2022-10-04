import { promises as fs } from "fs";
import {
  Blog,
  blogStaticPaths,
  blogStaticProps,
} from "../../modules/_pages-new/blog/blog";

export default function Index(props) {
  return <Blog {...props} />;
}

export async function getStaticProps({ params }) {
  return await blogStaticProps({ params, fs });
}

export async function getStaticPaths() {
  return await blogStaticPaths();
}
