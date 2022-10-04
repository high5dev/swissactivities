import {Legal, legalStaticProps} from "../../../../modules/_pages-new/legal";
import {promises as fs} from "fs";

export default function Index(props) {
    return <Legal type="tos_aff" locale="fr_CH" {...props} />;
};

export async function getStaticProps() {
    return await legalStaticProps(fs, "affiliate", "fr_CH");
}
