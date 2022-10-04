import React from 'react';
import cx from 'classnames';
import types from 'prop-types';

import Input, {
  propTypes as InputPropTypes,
  defaultProps as InputDefaultProps,
} from './index';

import styles from './customInput.module.scss';

const CustomInput = (props) => {
  const {
    className,
    inputRef,
    fullWidth,
    ...rest
  } = props;

  const inputClasses = cx(className);

  const containerStyles = cx(
    styles.container,
    fullWidth && styles.fullWidth,
  );

  return (
    <div className={containerStyles}>
      <Input
        {...rest}
        className={inputClasses}
        ref={inputRef}
      />
    </div>
  );
};
export const propTypes = {
  ...InputPropTypes,
  className: types.string,
  inputRef: types.shape({
    current: (props, name, component) => {
      const El = typeof Element === 'undefined' ? undefined : Element;

      if (!El) {
        return;
      }
      const value = props[name];

      if (value instanceof El || value === null) {
        return;
      }
      return new Error(`Component [${component}]: value is not an Element instance (wrong type).`);
    },
  }),
  fullWidth: types.bool,
};
export const defaultProps = {
  ...InputDefaultProps,
  className: null,
  inputRef: null,
  fullWidth: false,
};

CustomInput.propTypes = propTypes;
CustomInput.defaultProps = defaultProps;

export default CustomInput;
