import { useBookingStore } from "../../../store/bookingStore";
import classNames from "classnames";
import { FaMinus, FaPlus } from "react-icons/fa";
import { TicketName } from "./TicketName";
import { mappedTicket } from "./utils/mappedTicket";
import { useEffect } from "react";
import { dataLayerSend } from "../../../utils/dataLayerSend";
import { useI18n } from "next-localization";

export const Ticket = ({ item, className, activity }) => {
  const { locale } = useI18n();
  const tickets = useBookingStore((state) => state.tickets);
  const setTickets = useBookingStore((state) => state.setTickets);
  const data = useBookingStore((state) => state.data);
  const setLevel = useBookingStore((state) => state.setLevel);
  const setData = useBookingStore((state) => state.setData);

  const ticket = data.tickets?.[item?.ticketCategoryId];
  const amount = (plus = true) =>
    item?.occupancy <= 1 ||
    (item.maxOccupancy &&
      (plus ? ticket >= item?.occupancy : ticket > item?.occupancy)) ||
    item.maxOccupancy === null
      ? 1
      : item.occupancy;
  const ticketLabelId = mappedTicket(item);
  const isMaxOccupancy = item.maxOccupancy
    ? ticket >= item.maxOccupancy
    : ticket === 99;
  const total = parseFloat(item.price.amount);

  useEffect(() => {
    if (tickets >= 1) {
      setLevel(4);
    } else {
      setLevel(3);
    }
  }, [tickets]);

  const B = ({ className, onClick, plus }) => {
    return (
      <button
        onClick={onClick}
        className={classNames(
          `flex h-7 w-7 cursor-pointer items-center justify-center border-none bg-gray-100 transition duration-100 ease-in`,
          className,
          {
            "text-gray-700 hover:bg-gray-200 hover:text-black":
              ticket >= 1 || (plus && !isMaxOccupancy),
            "pointer-events-none text-gray-300":
              ((ticket === 0 || !ticket) && !plus) || (plus && isMaxOccupancy),
          }
        )}
      >
        <span className={`flex text-sm`}>
          {plus ? <FaPlus /> : <FaMinus />}
        </span>
      </button>
    );
  };

  return (
    <div
      key={`ticket-${item?.ticketCategoryId}`}
      className={classNames(
        className,
        "flex flex-col rounded-lg !border !border-solid !border-gray-200 !bg-white !py-3 !px-2.5"
      )}
    >
      <span className={`col-span-3 text-[13px] font-medium text-gray-500`}>
        <TicketName item={item} />
      </span>
      <div className={`flex items-center justify-between`}>
        <span
          className={`relative -top-1 inline-block text-base font-semibold text-black`}
        >
          {item.price.formatted}
        </span>
        <div className={`ml-4 mt-2 grid grid-cols-[auto,30px,auto]`}>
          <B
            className={`rounded-l`}
            onClick={() => {
              if (tickets >= 1) {
                setTickets(tickets - amount(false));
              }
              setData({
                ...data,
                total: data.total - total * amount(false),
                ticketsLabel: {
                  ...data.ticketsLabel,
                  [ticketLabelId]:
                    data.ticketsLabel?.[ticketLabelId] >= 1
                      ? data.ticketsLabel?.[ticketLabelId] - amount(false)
                      : 0,
                },
                tickets: {
                  ...data.tickets,
                  [item?.ticketCategoryId]:
                    ticket >= 1 ? ticket - amount(false) : 0,
                },
              });
            }}
          />
          <div
            className={classNames(
              `flex items-center justify-center bg-blue text-xs font-semibold text-white`,
              {
                "!bg-blue/30": ticket === 0 || !ticket,
              }
            )}
          >
            {ticket ?? 0}
          </div>
          <B
            plus
            className={`rounded-r`}
            onClick={() => {
              if (ticket <= 99 || !ticket) {
                setTickets(tickets + amount());
                setData({
                  ...data,
                  total: (data.total || 0) + total * amount(),
                  ticketsLabel: {
                    ...data.ticketsLabel,
                    [ticketLabelId]:
                      data.ticketsLabel?.[ticketLabelId] >= 1
                        ? data.ticketsLabel?.[ticketLabelId] + amount()
                        : amount(),
                  },
                  tickets: {
                    ...data.tickets,
                    [item?.ticketCategoryId]:
                      ticket >= 1 ? ticket + amount() : amount(),
                  },
                });
                const nextData = window?.__NEXT_DATA__?.props?.pageProps;
                dataLayerSend({
                  event: "ticket_selection",
                  cart_id: localStorage?.getItem?.("cartId"),
                  item_name: nextData?.activity?.info?.title.trim(),
                  id: nextData?.activity?.id,
                  location_id: locale().replace("_CH", "-ch"),
                  value: nextData?.startingPrice?.startingPrice?.amount,
                  currency: nextData?.startingPrice?.startingPrice?.currency,
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
