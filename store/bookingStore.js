import create from "zustand";
import { DateService } from "../utils";

export const useBookingStore = create((set) => ({
  activity: {},
  setActivity: (activity) => set({ activity }),

  data: {},
  setData: (data) => set({ data }),

  date: new Date(),
  dateFormat: DateService.formatDate(new Date()),
  setDate: (date) => {
    set({ date: date, dateFormat: DateService.formatDate(date) });
  },

  dates: [],
  setDates: (dates) => set({ dates }),

  formattedDates: [],
  setFormattedDates: (formattedDates) => set({ formattedDates }),

  level: 1,
  setLevel: (level) => set({ level }),

  offers: {},
  setOffers: (offers) => set({ offers }),

  selectedOffer: {},
  setSelectedOffer: (selectedOffer) => set({ selectedOffer }),

  tickets: 0,
  setTickets: (tickets) => set({ tickets }),

  reservation: {},
  setReservation: (reservation) => set({ reservation }),

  reservationIdNew: "",
  setReservationIdNew: (reservationIdNew) => set({ reservationIdNew }),

  openReservation: "",
  setOpenReservation: (openReservation) => set({ openReservation }),

  openReservationId: "",
  setOpenReservationId: (openReservationId) => set({ openReservationId }),

  openReservationLoaded: false,
  setOpenReservationLoaded: (openReservationLoaded) =>
    set({ openReservationLoaded }),

  scroll: "",
  setScroll: (scroll) => set({ scroll }),

  is422: false,
  setIs422: (is422) => set({ is422 }),

  isBasket: false,
  setIsBasket: (isBasket) => set({ isBasket }),

  isCalendarLoading: false,
  setIsCalendarLoading: (isCalendarLoading) => set({ isCalendarLoading }),

  isCalendarOpen: true,
  setIsCalendarOpen: (isCalendarOpen) => set({ isCalendarOpen }),

  isCancellable: false,
  setIsCancellable: (isCancellable) => set({ isCancellable }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  isLoaded: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),

  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),

  isSelected: false,
  setIsSelected: (isSelected) => set({ isSelected }),

  isSkeleton: true,
  setIsSkeleton: (isSkeleton) => set({ isSkeleton }),

  isRequest: false,
  setIsRequest: (isRequest) => set({ isRequest }),

  reset: (date = new Date()) => {
    set({
      data: {},
      date,
      dates: [],
      formattedDates: [],
      is422: false,
      isBasket: false,
      isCancellable: false,
      isCalendarLoading: false,
      isCalendarOpen: true,
      isLoading: false,
      isOpen: false,
      isRequest: false,
      isSelected: false,
      isSkeleton: true,
      level: 1,
      offers: {},
      openedGroups: {},
      selectedOffer: {},
      tickets: 0,
    });
  },
}));
