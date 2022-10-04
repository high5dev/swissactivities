import { promises as fs } from "fs";
import {
  BlogIndex,
  blogIndexStaticProps,
} from "../../../modules/_pages-new/blog/blogIndex";

export default function Index(props) {
  return <BlogIndex {...props} />;
}

export async function getStaticProps() {
  return await blogIndexStaticProps(fs, "fr_CH");
}
