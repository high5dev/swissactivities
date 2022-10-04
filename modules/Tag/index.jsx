import React from 'react';
import classnames from 'classnames';
import { BsX } from 'react-icons/bs';
import Icon from '../Icon';

const Tag = (props) => {
  const {
    title,
    onClick,
    customStyle,
    size = "large",
    active = false,
    clickable = true,
    closable = false,
  } = props;

  const onClickTag = (e) => {
    if (clickable)
      onClick(title);
    else
      e.preventDefault();
  }
  const rootClasses = classnames(
    'tag-element',
    size,
    active && 'active',
    !clickable && 'non-clickable',
  );
  const buttonClasses = classnames('Tag', customStyle);

  return (
    <div className={rootClasses}>
      <button className={buttonClasses} onClick={onClickTag}>
        {title}
        {closable && <Icon color="#fff" icon={<BsX />} />}
      </button>
    </div>
  );
};

export default Tag;
