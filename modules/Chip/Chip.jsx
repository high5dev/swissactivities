import React, { useCallback, useRef } from 'react';
import types from 'prop-types';
import cx from 'classnames';
import styles from './styles.module.scss';
import { BsX } from 'react-icons/bs';

const Chip = (props) => {
  const {
    value,
    onClose,
    onClick,
    classes,
    className,
    removable,
  } = props;

  const closeIconRef = useRef(null);
  const rootClasses = cx(styles.root, className);

  const handleClose = useCallback((e) => {
    e.preventDefault();

    if (typeof onClose === 'function') {
      onClose(e);
    }
  }, [onClose]);

  const handleClick = useCallback((e) => {
    if (closeIconRef.current.contains(e.target)) {
      return;
    }
    if (typeof onClick === 'function') {
      onClick(e);
    }
  }, [onClick, closeIconRef]);

  return (
    <span onClick={handleClick} className={rootClasses}>
      <span
        title={value}
        className={classes?.label}
      >
        {value}
      </span>
      {removable && (
        <span
          ref={closeIconRef}
          onClick={handleClose}
          className={styles.closeIcon}
        >
          <BsX />
        </span>
      )}
    </span>
  );
};
Chip.propTypes = {
  value: types.node.isRequired,
  removable: types.bool,
  onClick: types.func,
  onClose: types.func,
};
Chip.defaultProps = {
  removable: false,
  onClick: null,
  onClose: null,
};

export default Chip;
