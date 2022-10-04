import { promises as fs } from "fs";
import { Basket, basketStaticProps } from "../../../modules/_pages-new/basket";

export default function Index(props) {
  return <Basket {...props} />;
}

export async function getStaticProps() {
  return await basketStaticProps(fs, "fr_CH");
}
