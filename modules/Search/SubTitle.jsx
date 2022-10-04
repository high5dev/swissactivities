/* eslint-disable */
//TODO 
import React from 'react';
import types from 'prop-types';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { useI18n } from "next-localization";
import reactStringReplace from "react-string-replace";
import Link from "next/link";
import styles from './styles.module.scss';

const SubTitle = (props) => {
  const {
    type,
    location,
    description,
    activitiesAmount,
  } = props;

  const { t } = useI18n();

  if (!location && !type) {
    const content = `${description} ${t('pages.activities.intro')}`;
    return (<span>{content}</span>);
  }
  if (location && !type) {
    const content = t(`search.location.activitiesNote.${location.parent ? 'child' : 'parent'}`, {
      location: location.title,
      num_activities: activitiesAmount,
    });
    return (
      <>
        <p>{content}</p>
        <ReactMarkdown
          plugins={[gfm]}
          className={styles.subTitleMain}
          children={location.description}
        />
      </>
    );
  }
  if (!location && type) {
    const content = t(`search.type.activitiesNote`, {
      type: type.title,
      num_activities: activitiesAmount,
    });
    return (
      <>
        <p>{content}</p>
        <ReactMarkdown plugins={[gfm]} children={type.description} />
      </>
    );
  }

  if (location && type) {
    // This is a bit messy, sorry.
    //
    // We build up two arrays here:
    // [textParts] - here we dynamically add translated strings depending on whether the location
    // or type is top-level or not, etc.
    // [replacements] - here we store text replacements to transform create links for them. this
    // is a bit more complicated because we replace text with JSX.
    //
    // After we've assembled the text parts we apply the replacements for each text.

    let textParts = [];
    const replacements = [];
    const parentType = type.parent;

    // this data is used to replace translation placeholders
    // the ..._link values we first use our own placeholder to later replace with the JSX links
    const translationParams = {
      location: location.title,
      location_link: `%location_link%`,
      type: type.title,
      type_link: `%type_link%`,
      num_activities: activitiesAmount,
    };
    replacements.push([
      `%location_link%`,
      (i) => <Link key={i} href={location.url}>{location.title}</Link>
    ]);
    replacements.push([`%type_link%`, (i) => <Link key={i} href={type.url}>{type.title}</Link>]);

    if (parentType) {
      translationParams.parent_type = parentType.title;
      translationParams.parent_type_link = `%parent_type_link%`;
      replacements.push([
        `%parent_type_link%`,
        (i) => <Link key={i} href={parentType.url}>{parentType.title}</Link>,
      ]);
    }
    for (const [i, relatedType] of type.related.entries()) {
      translationParams[`type${i + 1}_link`] = `%type${i + 1}_link%`;
      replacements.push([
        `%type${i + 1}_link%`,
        (i) => <Link key={i} href={relatedType.url}>{relatedType.title}</Link>,
      ]);
    }
    textParts.push(t(
      `search.locationWithType.typeNote.${location.parent ? 'child' : 'parent'}`,
      translationParams,
    ));
    textParts.push(' ');

    if (parentType) {
      textParts.push(t(`search.type.parentNote`, translationParams));
      textParts.push(' ');
    }
    textParts.push(t(
      `search.locationWithType.activitiesNote.${location.parent ? 'child' : 'parent'}`,
      translationParams,
    ));
    textParts.push(' ');
    textParts.push(t(
      `search.locationWithType.relatedTypesNote.${location.parent ? 'child' : 'parent'}`,
      translationParams,
    ));

    for (const [search, replacer] of replacements) {
      textParts = reactStringReplace(textParts, search, (match, i) => {
        // ${match}-${i} allow to avoid identical keys (because we have 2 cycles here,
        // but the [i] belongs only to one, and could be repeated)
        return replacer(`${match}-${i}`);
      });
    }

    return <p>{textParts}</p>
  }
  return null;
};
SubTitle.propTypes = {
  description: types.string,
  activitiesAmount: types.number,
  type: types.shape({
    title: types.string.isRequired,
    url: types.string.isRequired,
    description: types.string.isRequired,
    related: types.arrayOf(
      types.shape({
        title: types.string.isRequired,
        url: types.string.isRequired,
      }),
    ),
    parent: types.shape({
      title: types.string.isRequired,
      url: types.string.isRequired,
    }),
  }),
  location: types.shape({
    title: types.string.isRequired,
    url: types.string.isRequired,
    description: types.string.isRequired,
    parent: types.any,
  }),
};
SubTitle.defaultProps = {
  type: null,
  location: null,
  description: '',
  activitiesAmount: 0,
};

export default SubTitle;
