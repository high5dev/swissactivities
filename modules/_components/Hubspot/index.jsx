import { useEffect, useState } from "react";
import { waitForElement } from "../../../utils/waitForElement";
import { Skeleton } from "../Skeleton";

const Hubspot = ({
  form = {
    region: "na1",
    portalId: "7531548",
    formId: "077b03e4-d431-4a83-9404-b1ca12e54849",
  },
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js.hsforms.net/forms/v2.js";
    document.body.appendChild(script);

    script.addEventListener("load", () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          target: "#hubspotForm",
          ...form,
        });
      }
    });

    return () => {
      document?.querySelector("#hubspotForm > iframe")?.remove();
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await waitForElement("#hubspotForm > iframe");
    setIsLoaded(true);

    const iframe = document.querySelector("#hubspotForm > iframe");
    const doc = iframe.contentDocument;
    const style = document.createElement("style");
    style.innerHTML = `
      [type="submit"] {
        background: #FF385C !important; 
        border: none !important; 
        border-radius: 0.5rem !important;
        padding: 0.625rem 0.875rem !important;
        min-height: 52px !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        text-transform: default !important;
        transition: all 100ms cubic-bezier(0.4, 0, 1, 1) !important;
      }
      [type="submit"]:hover {
        background: #eb002a !important;
      }
      .hs-error-msgs {
        display: none !important;
      }
      .hs-form-booleancheckbox-display {
        display: flex !important;
        align-items: center !important;
      }
      .hs-form-booleancheckbox-display a {
        color: #eb002a !important;
        text-decoration: none !important;
      }
      `;
    doc.body.appendChild(style);
  }, []);

  return (
    <div
      className={`flex flex-col rounded-xl border border-solid border-gray-200 p-4 shadow lg:p-8 lg:min-h-[480px] xl:p-12`}
    >
      {!isLoaded && <Skeleton amount={3} />}
      <div id="hubspotForm" className={`m-auto w-full`} />
    </div>
  );
};

export default Hubspot;
