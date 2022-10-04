import SectionHeadBreadCrumbs from "./SectionHeadBreadCrumbs";
import Header from "../../Header";

const ActivityHeader = ({ activity, isMobile, breadcrumbs, tag }) => {
  return (
    <section className={`mt-header container-tw pt-4 mb-6`}>
      <SectionHeadBreadCrumbs isMobile={isMobile} breadcrumbs={breadcrumbs} />
      <div className={`hidden lg:block`}>
        <Header activity={activity} tag={tag} />
      </div>
    </section>
  );
};

export default ActivityHeader;
export { Header as MainHeader, Header };
