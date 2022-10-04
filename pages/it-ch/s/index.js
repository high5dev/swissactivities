import { promises as fs } from "fs";
import { S, sStaticProps } from "../../../modules/_pages-new/s";

export default function Index(props) {
  return <S {...props} />;
}

export async function getStaticProps() {
  return await sStaticProps(fs, "it_CH");
}
