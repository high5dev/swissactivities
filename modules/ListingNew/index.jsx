import Layout from "../_components/Layout";
import { useI18n } from "next-localization";

const ListingNew = ({ listing }) => {
  const { t, locale } = useI18n();

  const meta = {
    title: listing.info.title,
    desc: listing.info.meta_description,
    locale: locale(),
    image: listing.teaser_image?.url,
  };

  return (
    <Layout meta={meta}>
      <div className={`mt-[var(--h-header)]`}>Hello world</div>
    </Layout>
  );
};

export default ListingNew;
