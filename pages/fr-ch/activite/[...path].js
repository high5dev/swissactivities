import { promises as fs } from "fs";
import {
  Activity,
  activityStaticPaths,
  activityStaticProps,
} from "../../../modules/_pages-new/activity/activity";

export default function Index(props) {
  return <Activity {...props} />;
}

export async function getStaticProps({ params }) {
  return activityStaticProps({ params, fs });
}

export async function getStaticPaths() {
  return activityStaticPaths(fs, "fr_CH");
}
