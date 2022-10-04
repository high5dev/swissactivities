import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { useEffect, useState } from "react";
import Button from "../Button";
import { useI18n } from "next-localization";

export const Share = () => {
  const { t } = useI18n();
  const [shareUrl, setShareUrl] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  return (
    <div className={`relative`}>
      <Button type="secondary" text={t("activity.share")} className={`peer`} />
      <div
        className={`pointer-events-none absolute left-1/2 bottom-0 flex -translate-x-1/2 -translate-y-full opacity-0 transition duration-100 ease-in peer-hover:pointer-events-auto peer-hover:opacity-100`}
      >
        <FacebookShareButton url={shareUrl}>
          <FacebookIcon size={30} round />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl}>
          <TwitterIcon size={30} round />
        </TwitterShareButton>
        <EmailShareButton url={shareUrl}>
          <EmailIcon size={30} round />
        </EmailShareButton>
        <RedditShareButton url={shareUrl}>
          <RedditIcon size={30} round />
        </RedditShareButton>
        <TelegramShareButton url={shareUrl}>
          <TelegramIcon size={30} round />
        </TelegramShareButton>
      </div>
    </div>
  );
};

export default Share;
