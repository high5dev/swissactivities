export const mappedTicket = (o) => {
  return `${o?.label.audience}_${o?.label.discount}_${o?.occupancyType}_${o?.occupancy}`;
};
