import { promises as fs } from "fs";
import {
  TravelGuide,
  travelGuideStaticProps,
} from "../../../modules/_pages-new/travel-guide";

export default function Index(props) {
  return <TravelGuide {...props} />;
}

export async function getStaticProps() {
  return await travelGuideStaticProps(fs, "fr_CH");
}
