import cx from "classnames";
import React, { useRef, useState, useCallback } from "react";
import { getArray } from "../../utils";
import Chip from "../Chip";
import styles from './styles.module.scss';

export const Input = (props) => {
  const {
    value,
    popover,
    filters,
    className,
    onKeyDown,
    icon = null,
    inputHandler,
    inputFieldRef,
    inputClassName,
    onFilterChange,
    placeholder = '',
    inputContainerRef,
  } = props;

  const rootRef = useRef(null);
  const [focused, setFocused] = useState(null);

  const rootClasses = cx(styles.inputRow, className);
  const inputClasses = cx(
    styles.container,
    styles.fullWidth,
    styles.inputContainer,
    inputClassName,
  );
  const inputPopoverClasses = cx(
    styles.inputPopover,
    focused && styles.inputPopoverVisible,
  );

  const handleRootBlur = useCallback((e) => {
    setFocused(false);
  }, [setFocused]);

  const handleRootFocus = useCallback(() => {
    setFocused(focused !== null);
  }, [setFocused, focused]);

  const handleChange = useCallback((...args) => {
    setFocused(true);

    if (typeof inputHandler === 'function') {
      inputHandler(...args);
    }
  }, [inputHandler, setFocused]);

  const handlePopoverClick = useCallback(() => {
    setFocused(false);
  }, [setFocused]);

  const handleFilterRemove = useCallback((filter) => {
    onFilterChange(filters.filter((f) => f !== filter));
  }, [filters, onFilterChange]);

  const handleRootRef = useCallback((r) => {
    rootRef.current = r;

    if (typeof inputContainerRef === 'function') {
      inputContainerRef(r);
    }
    if (typeof inputContainerRef === 'object' && inputContainerRef.hasOwnProperty('current')) {
      inputContainerRef.current = {
        ref: r,
        blur: () => setFocused(false),
      };
    }
  }, [rootRef, inputContainerRef, setFocused]);

  return (
    <div
      tabIndex="0"
      ref={handleRootRef}
      className={rootClasses}
      onBlur={handleRootBlur}
      onFocus={handleRootFocus}
    >
      {icon}
      <div className={styles.input}>
        {getArray(filters).map((filter) => (
          <Chip
            removable
            value={filter.title}
            key={filter.objectID || filter.title}
            onClose={() => handleFilterRemove(filter)}
            className={styles.filterTag}
            classes={{
              label: styles.filterTagLabel,
            }}
          />
        ))}
        {!getArray(filters)[0]?.title && (
          <input
            value={value}
            ref={inputFieldRef}
            onKeyDown={onKeyDown}
            onChange={handleChange}
            className={inputClasses}
            placeholder={placeholder}
          />
        )}

      </div>

      <div onClick={handlePopoverClick} className={inputPopoverClasses}>
        {popover}
      </div>
    </div>
  );
};
