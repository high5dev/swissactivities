import PhoneInput from "react-phone-input-2";
import Base from "./Base";
import "react-phone-input-2/lib/style.css";

export const Phone = ({
  name,
  title,
  row,
  rowFull,
  required,
  onInput,
  value,
}) => {
  const onChange = (e) => {
    onInput(e);
  };

  return (
    <Base
      title={title}
      row={row}
      rowFull={rowFull}
      isValid={value?.length >= 5}
    >
      <PhoneInput
        value={value}
        preferredCountries={["ch", "uk", "us", "fr", "it", "de", "at"]}
        isValid={value?.length >= 5}
        onChange={onChange}
        specialLabel={""}
        country={"ch"}
        inputProps={{
          placeholder: "+41 23 456 78 99",
          name: name,
          required: required,
        }}
      />
    </Base>
  );
};
