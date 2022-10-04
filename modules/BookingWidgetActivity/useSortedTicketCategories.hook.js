import { useMemo } from 'react';

// admission: "Admission"
// adults: "Adults"
// bike_rental: "Bike rental"
// boat_rental: "Boat rental"
// car_rental: "Car rental"
// children: "Children"
// ebike_rental: "E-bike rental"
// families: "Families"
// groups: "Groups"
// rental: "Rental"
// school_groups: "School groups"
// seniors: "Seniors"
// ski_rental: "Ski rental"
// sled_rental: "Sled rental"
// snowboard_rental: "Snowboard rental"
// students: "Students"
// ticket: "Ticket"
// toddlers: "Toddlers"
// youth: "Youths"

// NOTE: SAFE-269
const priority = [
  'adults',
  'children',
  'families',
  'groups',
  'school_groups',
].reverse();

const toNum = (n) => Number.parseInt(n, 10);

const useSortedTicketCategories = (ticketCategories) => useMemo(() => (
  (Array.isArray(ticketCategories) ? ticketCategories : []).sort((a, b) => {
    const aDiscount = +!a.discountType;
    const bDiscount = +!b.discountType;
    const idPower = toNum(a.ticketCategoryId) > toNum(b.ticketCategoryId) ? 1 : -1;

    if (priority.includes(a.audience) || priority.includes(b.audience)) {
      // The index in the reversed priority array shows the power of priority for each item.
      // If an item has an audience out of the array values, its index will be -1 (means another
      // item has a higher priority anyway).
      // By multipling by 2 we allow one more point to be added if the item has no an additional
      // property [discount].
      const aPriority = (priority.indexOf(a.audience) * 2) + aDiscount;
      const bPriority = (priority.indexOf(b.audience) * 2) + bDiscount;

      if (aPriority === bPriority) {
        return idPower;
      }
      return aPriority < bPriority ? 1 : -1;
    }
    const result = a.audience.localeCompare(b.audience);

    if (result === 0) {
      // Only one item has discount property (more priority)
      if (aDiscount + bDiscount === 1) {
        return aDiscount < bDiscount ? 1 : -1;
      }
      return idPower;
    }
    return result;
  })
), [ticketCategories]);

export default useSortedTicketCategories;
