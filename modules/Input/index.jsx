import React, { forwardRef } from 'react';
import types from 'prop-types';
import cx from 'classnames';

import styles from './styles.module.scss';

const Input = forwardRef(({ className, ...rest }, ref) => {
  const classes = cx(styles.inputContainer, className);

  return (
    <input
      {...rest}
      className={classes}
      ref={ref}
    />
  );
});
export const propTypes = {
  className: types.string,
  type: types.string,
};
export const defaultProps = {
  className: null,
  type: 'text',
};

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;
Input.displayName = "Input";

export default Input;
