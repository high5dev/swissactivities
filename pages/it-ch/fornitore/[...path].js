import {
  Supplier,
  supplierStaticPaths,
  supplierStaticProps,
} from "../../../modules/_pages-new/supplier/supplier";
import { promises as fs } from "fs";

export default function Index(props) {
  return <Supplier {...props} />;
}

export async function getStaticProps({ params }) {
  return supplierStaticProps({ params, fs });
}

export async function getStaticPaths() {
  return supplierStaticPaths(fs, "it_CH");
}
