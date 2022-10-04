import { InternalLinks } from "../InternalLinks";
import Meta from "../../MetaComponent";
import Header from "../Header";
import { Footer } from "../Footer";
import { useEffect } from "react";

export default function Layout(props) {
  const {
    meta,
    pageNum,
    children,
    pageUrls,
    pageUrlsQuery = null,
    pageType,
    headerShadow,
    isMobile = false,
    isBooking = false,
    disableLinksBlock = false,
    menu,
  } = props;

  useEffect(() => {
    if (isBooking || pageType === 'confirm') {
      document.body.classList.add("is-booking");
    } else {
      document.body.classList.remove(`is-booking`);
    }
  }, []);

  return (
    <>
      <Meta pageUrls={pageUrls} pageNum={pageNum} {...meta} />
      <div className="app-container">
        {(!isBooking || (!isMobile && !isBooking)) && (
          <Header
            shadow={headerShadow}
            meta={meta}
            pageType={pageType}
            pageUrls={pageUrls}
            menu={menu}
          />
        )}
        {isBooking && <Header type="booking" />}
        {children}
        {!disableLinksBlock && <InternalLinks />}
        <Footer
          isBooking={isBooking}
          pageUrls={pageUrls}
          pageUrlsQuery={pageUrlsQuery}
          isActivity={
            pageType === "activity" ||
            pageType === "type" ||
            pageType === "listing" ||
            pageType === "location"
          }
          data={props}
        />
      </div>
    </>
  );
}
