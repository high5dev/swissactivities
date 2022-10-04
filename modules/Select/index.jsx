import React from 'react';
import Select, { components } from 'react-select';
import styles from './styles.module.scss';

const Option = props => {
  const { data: { label, icon } } = props;
  return (
    icon ? <components.Option {...props}>
      <div className={styles.customOption}>
        {/*TODO*/}
        {/*eslint-disable-next-line*/}
        {icon && <img src={icon} alt="flag" />}
        <span>{label}</span>
      </div>
    </components.Option> :
    <components.Option {...props} />
  );
};

const SingleValue = props => {
  const { data: { label }, options } = props;
  const option = options.find(el => el.label === label);
  return (
    option && option.icon ? <components.SingleValue {...props}>
      <div className={styles.customOption}>
        {/*TODO*/}
        {/*eslint-disable-next-line*/}
        {option.icon && <img src={option.icon} alt="flag" />}
        <span>{label}</span>
      </div>
    </components.SingleValue> :
    <components.SingleValue {...props} />
  );
};

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#ff385c' : 'white',
    color: state.isSelected ? 'white' : '#3B3B3B',
    padding: '9px 11px',
    borderBottom: '1px solid #ECECEC',
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  })
}

const CustomSelect = ({ options, value, placeholder, onChange, className, selectClassName, name="color", required, instanceId, isSearchable=true, components }) => {
  return (
    <div className={className}>
      <Select
        value={value}
        name={name}
        classNamePrefix="react-select"
        className={`${styles.reactSelect} ${selectClassName ? selectClassName : ''}`}
        components={{
          IndicatorSeparator: () => null,
          Option,
          SingleValue,
          ...components,
        }}
        placeholder={placeholder}
        onChange={onChange}
        styles={customStyles}
        options={options}
        required={required}
        instanceId={instanceId}
        isSearchable={isSearchable}
      />
    </div>
  );
};

export default CustomSelect;
