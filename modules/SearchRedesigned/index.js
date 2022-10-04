import { useState, useEffect, useCallback } from 'react';
import { InstantSearch, connectHits, Index, Configure } from 'react-instantsearch-core';
import { useI18n } from "next-localization";
import classNames from 'classnames'
import {BsQuestionCircle, BsX} from "react-icons/bs";
import searchClient, { indices } from "../PlatformSearch/searchClient";
import { CategoriesService, ConditionalWrapper, getArray } from "../../utils";
import SearchBox from './SearchBox';
import MobileOptions from './MobileOptions';
import CategoryFilter, { VirtualCategoryFilter, Categories } from "../CategoryFilter";
import Filter from "../FilterRedesigned";
import HitActivities from "../PlatformSearch/HitActivitiesRedesigned";
import { GimmickMap } from "../MapView";
import ListingActivity from "../ListingOffers/ListingActivity";
import Listings from "../ListingsRedesigned";
import AlgoliaMap from "../AlgoliaMap";
import Modal from "../Modal";
import styles from './styles.module.scss'
import { useRouter } from 'next/router';
import { attributes as indicesAttributes } from '../../services/algoliaServices';
import SearchDetails from './SearchDetails';
import useIsMobile from '../../hooks/useIsMobile.hook';
import Link from "next/link";
import {getPageUrl} from "../../services/contentServices";

const categoriesClient = searchClient.initIndex(indices.categories);
const categoryTypes = ['location', 'type', 'location_type', 'category'];

const Search = (props) => {
  const {
    type,
    algolia,
    location,
    focusHandler,
  } = props;

  const { t, locale } = useI18n();
  const localeFilter = `locale:${locale()}`;

  const isMobile = useIsMobile();
  const [currentRefinement, setCurrentRefinement] = useState(CategoriesService.initialState);
  const [currentDate, setCurrentDate] = useState('');
  const [filtersActive, setFiltersActive] = useState(false);
  const [openedCategory, setOpenedCategory] = useState('');
  const [mapOpened, setMapOpened] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState(null);
  const [categorySearch, setCategorySearch] = useState(null);
  const [count, setCount] = useState(20);
  const activityCategories = (categoryFilters || [])
    .filter((f) => f.category_id && categoryTypes.includes(f.type))
    .map((f) => f.category_id);

  const router = useRouter();
  let contentFilters = localeFilter;
  let catFilters = localeFilter;

  const loadCategoryInAlgolia = useCallback(async (c) => {
    const response = await categoriesClient.search('', {
      filters: `category_id:${c.category_id} AND ${localeFilter}`,
      attributesToRetrieve: indicesAttributes[indices.categories],
    });

    if (response?.hits?.[0]) {
      setCategoryFilters([response.hits[0]]);
    }
  }, [setCategoryFilters, localeFilter]);

  useEffect(() => {
    if (categoryFilters?.[0]) {
      const firstCategory = categoryFilters[0];

      if (categoryTypes.includes(firstCategory.type) && !firstCategory.objectID) {
        loadCategoryInAlgolia(firstCategory);
      }
    }
  }, [categoryFilters, loadCategoryInAlgolia]);

  // If current page is a location, type, location-type page, and there is no category info in the
  // query setup current location, type, or location-type as a selected category.
  useEffect(() => {
    if (!router.query.categories && !categoryFilters && (type || location)) {
      // this whole thing here is a mess ... I'm just trying to fix it after Vlad left
      // some of the data used here is used later to put in the URL query (e.g. category_id)
      // but other data is passed on to SearchDetails.jsx and eventually used in SubTitle.jsx

      const typeData = type ? {
        category_id: type.id,
        type: 'type',
        url: type.urls[locale()],
        title: type.title,
        description: type.description,
        teaser_image: type.teaser_image.url,
        parent: null,
        related: [],
      } : null;

      const locationData = location ? {
        category_id: location.id,
        type: 'location',
        title: location.title,
        url: location.urls[locale()],
        description: location.description,
        teaser_image: location.teaser_image.url,
        parent: null,
        related: [],
      } : null;

      if (!location) {
        setCategoryFilters([typeData]);
      } else if (!type) {
        setCategoryFilters([locationData]);
      } else {
        setCategoryFilters([{
          type: 'location_type',
          nested: {
            type: typeData,
            location: locationData,
          },
          description: [
            typeData.description,
            locationData.description,
          ],
          category_id: `${location.id}_${type.id}`,
          title: `${location.title} | ${type.title}`,
          parent: null,
          related: [],
        }]);
      }
    }
  }, [router, type, location, setCategoryFilters, categoryFilters]);

  // Change router if search text was changed
  useEffect(() => {
    const searchText = getArray(categoryFilters).filter(({ type }) => type === 'searchText');

    if (searchText.length === 0) {
      if (router.query.searchText) {
        const newParams = { ...router.query };
        delete newParams.searchText;
        router.replace({
          pathname: router.pathname,
          query: newParams,
        }, undefined, { shallow: true });
      }
      return;
    }

    const textQuery = `${searchText[0].title}`;

    if (router.query.searchText !== textQuery) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          searchText: textQuery,
        },
      }, undefined, { shallow: true });
    }
  }, [categoryFilters, router]);

  // Change router if categories were changed
  useEffect(() => {
    const categories = getArray(categoryFilters).filter((f) => f.category_id && categoryTypes.includes(f.type));

    if (categories.length === 0) {
      if (router.query.categories) {
        const newParams = { ...router.query };
        delete newParams.categories;
        router.replace({
          pathname: router.pathname,
          query: newParams,
        }, undefined, { shallow: true });
      }
      return;
    }

    const cats = categories.map((c) => {
      return `${c.category_id}:${c.title}`;
    });
    const catsQuery = cats.join(',');

    if (router.query.categories !== catsQuery) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          categories: catsQuery,
        },
      }, undefined, { shallow: true });
    }
  }, [categoryFilters, router]);

  // Setup initial categories on the page loading (from query params)
  useEffect(() => {
    if (categoryFilters === null && router.query.categories) {
      const cats = router.query.categories.split(',').map((c) => {
        const [category_id, title] = c.split(':');

        return {
          title,
          category_id,
          type: 'category',
        };
      });
      setCategoryFilters(cats);
    }
    if (categoryFilters === null && router.query.searchText) {
      setCategoryFilters([{
        type: 'searchText',
        title: router.query.searchText,
      }]);
    }
    setCount(20)
  }, [setCategoryFilters, categoryFilters, router]);

  if (activityCategories.length) {
    const contentQueries = activityCategories.map((c) => `categories:${c}`);
    const catQueries = activityCategories.map((c) => `NOT category_id:${c}`);
    contentFilters += ` AND (${contentQueries.join(' OR ')})`;
    catFilters += ` AND (${catQueries.join(' AND ')})`;
  }
  const clearRefinements = useCallback(() => {
    setCurrentDate('');
    setOpenedCategory('');
    setCurrentRefinement(CategoriesService.initialState);
  }, [setCurrentRefinement, setCurrentDate, setOpenedCategory]);

  const handleFilters = useCallback(() => {
    setFiltersActive(!filtersActive);
  }, [setFiltersActive, filtersActive]);

  const handleButtonSliderClick = useCallback(() => {
    setMapOpened(!mapOpened);
  }, [setMapOpened, mapOpened]);

  const wrapper = useCallback((children) => (
    <Modal
      open={filtersActive}
      onClose={handleFilters}
      classes={{
        modal: styles.modal,
        modalContainer: styles.modalContainer,
      }}
    >
      {children}
    </Modal>
  ), [filtersActive, handleFilters]);

  const handleCategoryFilterClick = useCallback((item) => {
    setCategoryFilters([{
      ...item,
      type: item.type || 'category',
    }]);
    setCount( 20)
  }, [setCategoryFilters]);

  const handleContainerClick = useCallback((e) => {
    if (e.currentTarget === e.target) {
      e.preventDefault();
      focusHandler(e);
    }
  }, [focusHandler]);

  const handleLink = useCallback((url) => {
    const newParams = { ...router.query };
    delete newParams.search;
    if(isMobile){
      router.push({
        pathname: url,
        query: newParams,
      });
    }else{
      window.open(`${url}`, "_blank");
    }
  }, [router]);

  const removeFilter = (filter) => {
    setCurrentRefinement(prevState => ({
      ...prevState,
      labels: prevState.labels.filter(label => label !== filter)
    }));
  };

  const handleLoadMore = () => {
    setCount(count + 20)
  };

  const mapClasses = classNames(
    styles.filtersColumn,
    mapOpened && styles.withMaxHeight,
  );
  return (
    <InstantSearch indexName={indices.activities} searchClient={searchClient}>
      <Configure filters={localeFilter} />
      <div className={classNames(styles.search, 'fade-in')} onClick={handleContainerClick}>
        <div className={styles.search__container}>
          {(!isMobile && !mapOpened || isMobile) && (
            <div className={styles.topBar}>
              {isMobile && (
                  <>
                  <div className={styles.logo}>
                    <Link href={getPageUrl("homepage", locale())} passHref>
                      <a>
                        {/*TODO*/}
                        {/*eslint-disable-next-line*/}
                        <img src="/assets/Logo_SA.png" alt="logo"/>
                      </a>
                    </Link>
                  </div>
                <BsQuestionCircle onClick={() => $crisp.push(['do', 'chat:open'])} color={"#000"} size={30} style={{marginLeft: 'auto', marginRight: 10}} />
                  </>
              )}
              <button onClick={focusHandler} className={styles.closeIcon}>
                <BsX size={40}/>
              </button>
            </div>
          )}

          {!mapOpened && (
            <SearchDetails category={categoryFilters?.[0]} />
          )}
          <div className={styles.row}>
            <div className={mapClasses}>
              {!mapOpened && (
                <div className={styles.search_box}>
                  <SearchBox
                    isMobile={isMobile}
                    currentDate={currentDate}
                    categoryFilters={categoryFilters}
                    onFilterChange={setCategoryFilters}
                    onCategorySearch={setCategorySearch}
                    dateRefinementHandler={setCurrentDate}
                    popover={
                      <Index indexName={indices.categories}>
                        <Configure
                          filters={catFilters}
                          query={categorySearch || ''}
                          hitsPerPage={isMobile ? 15 : 15}
                        />
                        <div className={styles.categories}>
                          <Filter
                            limit={20}
                            searchValue={categorySearch}
                            onClick={handleCategoryFilterClick}
                            currentRefinement={currentRefinement}
                          />
                        </div>
                      </Index>
                    }
                  />
                </div>
              )}
              {!mapOpened && (
                <div className={styles.desktopMapButton} onClick={handleButtonSliderClick}>
                  <GimmickMap t={t} isMobile={isMobile} className={styles.GimmickMap}/>
                </div>
              )}
              {!mapOpened && (
                <MobileOptions
                  removeFilter={removeFilter}
                  currentRefinement={currentRefinement}
                  handleFilters={handleFilters}
                  handleButtonSliderClick={handleButtonSliderClick}
                />
              )}
              <div className={styles.filters}>
                <VirtualCategoryFilter
                  attribute="priceRange"
                  defaultRefinement={currentRefinement.priceRange}
                />
                <VirtualCategoryFilter
                  attribute="labels"
                  defaultRefinement={currentRefinement.labels}
                />
                <ConditionalWrapper condition={isMobile} wrapper={wrapper}>
                  <div className={styles.nav}>
                    <div onClick={handleFilters}>{t('filter.apply')}</div>
                    <h2>{t('filter.filters')}</h2>
                    <span onClick={clearRefinements}>{t('filter.clear')}</span>
                  </div>
                  <Categories
                    algolia={algolia}
                    isMobile={isMobile}
                    openedCategory={openedCategory}
                    currentRefinement={currentRefinement}
                    handleOpenCategory={setOpenedCategory}
                    refinementHandler={setCurrentRefinement}
                  />
                  <CategoryFilter
                    isMobile={isMobile}
                    attribute="priceRange"
                    header={t('filter.price')}
                    showMore showMoreLimit={50}
                    openedCategory={openedCategory}
                    handleOpenCategory={setOpenedCategory}
                    refinementHandler={setCurrentRefinement}
                    defaultRefinement={currentRefinement.priceRange}
                  />
                </ConditionalWrapper>
              </div>
              {mapOpened && (
                <div className={styles.mapActivities}>
                  <MapActivities/>
                </div>
              )}
            </div>

            {/* MAP VIEW */}
            {mapOpened && (
              <div className={styles.mapContainer}>
                <AlgoliaMap t={t} isMobile={isMobile} locale={locale()} />
                <button onClick={handleButtonSliderClick} className={classNames(styles.closeIcon,styles.closeMapIcon)}>
                  <BsX color="#3B3B3B" />
                </button>
                <button className={styles.mobileFilterButton} onClick={handleFilters}>
                  <span>{t("search.filter")}</span>
                </button>
              </div>
            )}

            {/* REGULAR VIEW */}
            {!mapOpened && (
              <>
                <div className={styles.divider__vertical}/>
                <div className={styles.results}>

                  <div className={styles.resultHits}>
                    <Index indexName={indices.activities}>
                      <Configure
                        filters={contentFilters}
                        hitsPerPage={count}
                      />
                      <div className={styles.activities}>
                        <Activities
                          t={t}
                          onClick={handleLink}
                          focusHandler={focusHandler}
                          handleLoadMore={handleLoadMore}
                          selectedCategory={(categoryFilters || [])[0]}
                          isMobile={isMobile}
                        />
                      </div>
                    </Index>
                    <div className={styles.divider__vertical}/>
                    <Index indexName={indices.listings}>
                      <Configure
                        filters={contentFilters}
                        hitsPerPage={isMobile ? 8 : 8}
                      />
                      <div className={styles.listings}>
                        <Listings {...{focusHandler}} />
                      </div>
                    </Index>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </InstantSearch>
  )
}

const MapActivities = connectHits((props) => {
  const { hits } = props;

  return (
    hits.map((hit, index) => (
      <ListingActivity
        key={hit.objectID}
        className={styles.activityContainer}
        activity={{
          ...hit,
          info: {
            title: hit.title,
            teaser: hit.teaser
          },
          price: {
            ...hit.price?.startingPrice
          }
        }}
      />
    ))
  )
})

const Activities = connectHits((props) => {
  const {
    t,
    hits,
    onClick,
    focusHandler,
    selectedCategory,
    handleLoadMore,
    isMobile
  } = props;

  if (!hits.length) {
    return <h3 className={styles.title}>{t('filter.noResults')}</h3>;
  }
  return (
    <>
      {
        selectedCategory
          ? <h3 className={styles.title}> {selectedCategory.title}: {t("search.offers", {number: selectedCategory.numActivities})} </h3>
          : <h3 className={styles.title}>{t('activity.title')} {hits.length}</h3>
      }

      {hits.map((hit) => (
        <HitActivities
          hit={hit}
          onClick={onClick}
          key={hit.objectID}
          focusHandler={focusHandler}
        />
      ))}

      {((selectedCategory && selectedCategory.numActivities > hits.length) || !selectedCategory ) && (
        <button className={styles.viewMoreBtn} onClick={handleLoadMore}>{t("search.viewMore")}</button>
      )}

    </>
  );
})

export { Input } from './Input'
export default Search;
