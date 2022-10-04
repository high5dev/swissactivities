import { promises as fs } from "fs";
import {
  Booking,
  bookingStaticProps,
} from "../../../modules/_pages-new/booking/bookingIndex";

export default function Index(props) {
  return <Booking {...props} />;
}

export async function getStaticProps() {
  return await bookingStaticProps(fs, "it_CH");
}
