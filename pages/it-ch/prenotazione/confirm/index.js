import { promises as fs } from "fs";
import {
  BookingConfirm,
  bookingConfirmStaticProps,
} from "../../../../modules/_pages-new/booking/bookingConfirm";

export default function Index(props) {
  return <BookingConfirm {...props} />;
}

export async function getStaticProps() {
  return await bookingConfirmStaticProps(fs, "it_CH");
}
