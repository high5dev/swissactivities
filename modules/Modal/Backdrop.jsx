import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import BackdropContent, {
  propTypes as mcPropTypes,
  defaultProps as mcDefaultProps,
} from './BackdropContent';

const Backdrop = (props) => {
  const { open, onClose, children, blockBodyScroll, className, targetView={} } = props;
  const [y, setY] = useState(0);
  const body = useRef(null);
  const modal = useRef(null);

  useEffect(() => {
    if (blockBodyScroll) {
      if (open) {
        const yOffset = targetView.current?.getBoundingClientRect().top + window.scrollY;
        setY(yOffset);
        document.querySelector('body').style.cssText = `overflow-y: hidden; position: fixed; top:-${yOffset}px; width: 100%;`;
      } else {
        document.querySelector('body').removeAttribute('style')
        document.querySelector('body').scrollTo(0, y)
        document.querySelector('html').scrollTo(0, y)
      }
    }

    return () => {
      if (blockBodyScroll) {
        document.querySelector('body').removeAttribute('style')
        if(open) {
          document.querySelector('body').scrollTo(0, y)
          document.querySelector('html').scrollTo(0, y)
        }
      }
    }
  }, [open, blockBodyScroll]);

  useEffect(() => {
    body.current = document.body;
  }, [body]);

  useEffect(() => {
    const modalElement = document.createElement('div');
    modal.current = modalElement;
  }, [modal]);

  useEffect(() => {
    if (!body.current || !modal.current) {
      return;
    }
    body.current.append(modal.current);

    return () => {
      modal.current.remove();
    };
  }, [body, modal]);

  if (!modal.current) {
    return null;
  }
  return createPortal(
    (
      <BackdropContent
        open={open}
        onClose={onClose}
        className={className}
      >
        {children}
      </BackdropContent>
    ),
    modal.current,
  );
};
export const propTypes = {
  ...mcPropTypes,
};
export const defaultProps = {
  ...mcDefaultProps,
};

Backdrop.propTypes = propTypes;
Backdrop.defaultProps = defaultProps;

export default Backdrop;