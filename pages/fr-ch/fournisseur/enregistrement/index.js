import { promises as fs } from "fs";
import {
  SupplierRegistration,
  supplierRegistrationStaticProps,
} from "../../../../modules/_pages-new/supplier/supplierRegistration";

export default function Index(props) {
  return <SupplierRegistration {...props} />;
}

export async function getStaticProps() {
  return await supplierRegistrationStaticProps(fs, "fr_CH");
}
