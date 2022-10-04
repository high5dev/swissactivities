import React, { useCallback, useEffect, useRef, useState } from 'react';
import types from 'prop-types';
import cx from 'classnames';

import styles from './styles.module.scss';

const ModalContent = (props) => {
  const { children, open, onClose, className } = props;

  const rootRef = useRef(null);

  const rootClasses = cx(
    styles.container,
    open && styles.open,
    className
  );
  const handleRootClick = useCallback((e) => {
    if (!rootRef.current) {
      return;
    }
    if (e.target === rootRef.current) {
      onClose();
    }
  }, [rootRef, onClose]);

  return (
    <div className={rootClasses} ref={rootRef} onClick={handleRootClick}>
      {open ? children : null}
    </div>
  );
};
export const propTypes = {
  open: types.bool.isRequired,
  onClose: types.func.isRequired,
  className: types.string,
};

export const defaultProps = {
  className: ""
};


ModalContent.propTypes = propTypes;
ModalContent.defaultProps = defaultProps;

export default ModalContent;
