import React, { useState } from "react";
import cx from "classnames";
import { BsX } from "react-icons/bs";
import types from "prop-types";

import Backdrop, {
  propTypes as bPropTypes,
  defaultProps as bDefaultProps,
} from "./Backdrop";

import styles from "./styles.module.scss";

const Modal = (props) => {
  const { children, classes, onClose, withTransition, title, ...rest } = props;
  const [closing, setClosing] = useState(false);
  const modalClasses = cx(styles.modal, classes.modal);
  const modalContainerClasses = cx(
    styles.modalContainer,
    classes.modalContainer,
    {
      [styles.closing]: withTransition && closing,
      [styles.opening]: withTransition && !closing,
    }
  );

  const handleClose = (e) => {
    if (withTransition) {
      return setClosing(true);
    }
    onClose(e);
  };

  const handleAnimationEnd = (e) => {
    if (closing) {
      setClosing(false);
      onClose(e);
    }
  };

  return (
    <Backdrop {...rest} onClose={handleClose} className={classes.root}>
      <div className={modalClasses}>
        <div
          className={modalContainerClasses}
          onAnimationEnd={handleAnimationEnd}
        >
          {title && (
            <div className={styles.modalTopbar}>
              <BsX onClick={handleClose} />
              {title}
            </div>
          )}
          {children}
        </div>
      </div>
    </Backdrop>
  );
};
export const propTypes = {
  ...bPropTypes,
  classes: types.shape({
    modal: types.string,
    modalContainer: types.string,
    root: types.string,
  }),
};
export const defaultProps = {
  ...bDefaultProps,
  classes: {},
};

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
