import { Text } from "../Text";
import { useBookingStore } from "../../../store/bookingStore";
import { TicketName } from "./TicketName";
import { useEffect, useState } from "react";

export const Tickets = () => {
  const data = useBookingStore((state) => state.data);
  const selectedOffer = useBookingStore((state) => state.selectedOffer);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setTickets(getTickets());
  }, [data.tickets]);

  const getTickets = () => {
    const tickets = [];

    Object.entries(data.tickets).forEach(([k, v]) => {
      tickets.push(
        selectedOffer?.ticketCategories.find(
          (e) => e?.ticketCategoryId === Number(k)
        )
      );
    });

    tickets.sort((a, b) =>
      a.label.formatted.localeCompare(b.label.formatted, undefined, {
        numeric: true,
      })
    );

    return tickets;
  };

  return data?.tickets ? (
    <div className={`space-y-1.5`}>
      {tickets.map((item) => {
        const ticketCat = selectedOffer?.ticketCategories.find(
          (e) => e.ticketCategoryId === item?.ticketCategoryId
        );

        return (
          data?.tickets[item?.ticketCategoryId] >= 1 && (
            <div
              key={`summary-${item?.ticketCategoryId}`}
              className={`grid grid-cols-[auto,1fr,auto] items-center gap-2`}
            >
              <div
                className={`relative flex h-5 w-5 items-center justify-center rounded-full bg-blue/40 text-[10px] font-semibold text-white`}
              >
                <span className={`flex leading-none`}>
                  {ticketCat?.maxOccupancy === null && ticketCat?.occupancy >= 2
                    ? data.tickets?.[item?.ticketCategoryId] *
                      ticketCat?.occupancy
                    : data.tickets?.[item?.ticketCategoryId]}
                </span>
              </div>
              <Text className={`text-xs text-black lg:text-sm`}>
                <TicketName item={item} />
              </Text>
              <Text className={`text-xs font-medium text-black lg:text-sm`}>
                {item?.price.currency +
                  " " +
                  data.tickets?.[item?.ticketCategoryId] *
                    Number(item?.price.amount)}
              </Text>
            </div>
          )
        );
      })}
    </div>
  ) : null;
};
