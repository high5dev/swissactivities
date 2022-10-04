import { Select } from "../Form/Select";
import { useI18n } from "next-localization";
import { useRouter } from "next/router";

const LanguageSelect = ({ options }) => {
  const { locale } = useI18n();
  const router = useRouter();

  if (!options) return null;

  const handleSelect = (e) => {
    const selectedOption = options.find(
      (option) => option.value === e.target.value
    );

    router.push({
      pathname: selectedOption.url,
      query: selectedOption.queryParams,
    });
  };

  return (
    <Select onChange={handleSelect} options={options} selected={locale()} />
  );
};

export default LanguageSelect;
