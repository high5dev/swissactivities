import filter from 'lodash/filter';
import cloneDeep from 'lodash/cloneDeep';
import concat from 'lodash/concat';
import moment from 'moment';

export const findType = (types, id) => {
  let selected = null;
  types.forEach(type => {
    if (type.id == id) {
      selected = type;
    }
    type.children.forEach(child => {
      if (child.id == id) {
        selected = child;
      }
    });
  });
  return selected;
}

export const findParentStructure = (main, slug) => {
  const d3 = filter(main, {children: [{children: [{slug}]}]});
  if (d3.length < 1) {
    const d2 = filter(main, {children: [{slug}]});
    if (d2.length < 1) {
      const d1 = filter(main, {slug});
      if (d1.length < 1) {
        return main;
      }
      return d1;
    }
    return d2;
  }
  return d3;
}

export const getFilteredLocations = (locations, selected) => {
  let target = [];
  locations.map(el => {
    if (el.slug === selected) {
      target = addChildLocations(el.children, [el.slug]);
      return;
    }
    el.children.map(child1 => {
      if (child1.slug === selected) {
        target = addChildLocations(child1.children, [child1.slug]);
        return;
      }
      child1.children.map(child2 => {
        if (child2.slug === selected) {
          target = addChildLocations(child2.children, [child2.slug]);
          return;
        }
      })
    })
  });
  return target;
}

const addChildLocations = (children, target) => {
  let array = cloneDeep(target);
  children && children.map(child1 => {
    array.push(child1.slug);
    child1.children && child1.children.map(child2 => {
      array.push(child2.slug);
    })
  })
  return array;
}

export const getSelectedLocations = (locations, selected) => {
  if (!selected) {
    return locations;
  } else {
    let target = [];
    locations.map(el => {
      if (el.slug === selected) {
        target = [el];
        return;
      }
      el.children.map(child1 => {
        if (child1.slug === selected) {
          target = [child1];
          return;
        }
        child1.children.map(child2 => {
          if (child2.slug === selected) {
            target = [child2];
            return;
          }
        })
      })
    });
    return target;
  }
}

export const getChildActivitiesCount = (parent) => {
  let activities = cloneDeep(parent.activities);
  if (parent.children && parent.children.length > 0) {
    parent.children.map(el => {
      activities = concat(activities, el.activities);
      if (el.children && el.children.length > 0) {
        el.children.map(child1 => {
          activities = concat(activities, child1.activities);
        });
      }
    });
  }
  return activities.length;
}

export const getNextAvailable = (dates, mappedId) => {
  const nextAvailable = Object.keys(dates).find(el => dates[el].includes(parseInt(mappedId)));
  return nextAvailable;
}

export const getAvailableDates = (dates, startDate, endDate) => {
  let array = [];
  Object.keys(dates).forEach((el) => {
    if (startDate < moment(el) && moment(el) < endDate) {
      array = concat(array, dates[el]);
    }
  })
  return array;
}

export const getImageName = (src) => {
  const array = src.split("/").reverse();
  return array[0];
}
