import {
  SupplierIndex,
  supplierIndexStaticProps,
} from "../../../modules/_pages-new/supplier/supplierIndex";
import { promises as fs } from "fs";

export default function Index(props) {
  return <SupplierIndex {...props} />;
}

export async function getStaticProps() {
  return await supplierIndexStaticProps(fs, "it_CH");
}
