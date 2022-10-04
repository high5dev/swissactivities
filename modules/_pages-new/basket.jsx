import { useI18n } from "next-localization";
import Layout from "../_components/Layout";
import { useEffect, useState } from "react";
import {
  getBooking,
  getCart,
  getReservations,
  updateCart,
} from "../../services/bookingServices";
import { useRouter } from "next/router";
import { BreadcrumbsBasket } from "../_components/Breadcrumbs/Basket";
import {
  getPageUrl,
  getParams,
  queryActivityById,
} from "../../services/contentServices";
import { Card } from "../_components/Card";
import { Text } from "../_components/Text";
import Button from "../_components/Button";
import { Summary } from "../_components/Booking/Summary";
import { CardLoader } from "../_components/Card/CardLoader";
import { Activity } from "../_components/Booking/Activity";
import Link from "next/link";
import { useBookingStore } from "../../store/bookingStore";
import classNames from "classnames";
import { Skeleton } from "../_components/Skeleton";
import { BottomBar } from "../_components/BottomBar";

export const Basket = ({ menu, widget, size = "md" }) => {
  const { t, locale } = useI18n();
  const isSm = size === "sm";
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [activities, setActivities] = useState({});
  const [cart, setCart] = useState(null);
  const [reservations, setReservations] = useState([]);
  const openReservation = useBookingStore((state) => state.openReservation);
  const reservationIdNew = useBookingStore((state) => state.reservationIdNew);
  const setIsLoadingBooking = useBookingStore((state) => state.setIsLoading);
  const setOpenReservation = useBookingStore(
    (state) => state.setOpenReservation
  );
  const setReservationIdNew = useBookingStore(
    (state) => state.setReservationIdNew
  );

  const meta = {
    title: t("pages.basket.title"),
    desc: t("pages.basket.description"),
    locale: locale(),
  };

  useEffect(() => {
    if (
      router.query.cartId ||
      localStorage.getItem("cartId") ||
      router.query.bookingId
    ) {
      fetchData();
    } else {
      setIsLoading(false);
    }
    setIsLoadingBooking(false);
  }, [router.query.cartId, router.query.bookingId]);

  useEffect(() => {
    const update = async () => {
      updateCart(cart.cartId, {
        reservationIds: [
          ...reservations.filter((x) => x !== openReservation.reservationId),
          reservationIdNew,
        ],
      }).then(() => {
        fetchData().then(() => {
          setOpenReservation("");
          setReservationIdNew("");
          setIsLoadingBooking(false);
        });
      });
    };

    if (openReservation !== "" && cart?.cartId) {
      update();
    }
  }, [reservationIdNew, cart]);

  async function fetchData() {
    const cartIdQuery = router.query.cartId;
    const cartIdLocal = localStorage.getItem("cartId");
    const cartId = cartIdQuery || cartIdLocal;
    const bookingId = router.query.bookingId;

    if (
      ((cartIdLocal && cartIdQuery !== cartIdLocal) || !cartIdLocal) &&
      cartIdQuery !== undefined
    ) {
      localStorage.setItem("cartId", cartIdQuery);
    }

    let a = {};

    if (cartId && !bookingId) {
      const c = await getCart(cartId);
      const reservations = c?.reservations;
      let reservationIds = [];
      setCart(c);

      // console.log("cart", c);

      if (c && reservations?.length >= 1) {
        for (const item of reservations) {
          reservationIds.push(item.reservationId);
          const activity = await queryActivityById(item.capiActivityId);
          const reservation = await getReservations(item.reservationId);
          a = {
            ...a,
            [item.reservationId]: {
              activity: {
                ...activity.data.activity,
                summary: {
                  activityId: item.activityId,
                },
              },
              reservation: {
                ...reservation,
                offerId: item.offerId,
                cancellableUntil: item.cancellableUntil,
              },
            },
          };

          if (Object.values(a).length === reservations.length) {
            setActivities(a);
            setIsLoading(false);
          }
        }
      }

      if (reservations?.length === 0 || !c || c.isAxiosError) {
        setIsLoading(false);
      }

      if (!c && localStorage.getItem("cartId")) {
        localStorage.removeItem("cartId");
      }

      setReservations(reservationIds);
    } else if (bookingId) {
      const b = await getBooking(bookingId);
      const bookings = b.items;

      for (const item of bookings) {
        const activity = await queryActivityById(
          item.relatedIds.activity_id_capi
        );
        const reservation = await getReservations(
          item.reservations[0].reservationId
        );

        a = {
          ...a,
          [item.bookingItemId]: {
            activity: {
              ...activity.data.activity,
              summary: {
                activityId: item.relatedIds.activity_id,
              },
            },
            reservation: {
              ...reservation,
              offerId: item.relatedIds.offer_id,
            },
          },
        };

        // console.log(a);

        if (Object.values(a).length === bookings.length) {
          setIsLoading(false);
          setActivities(a);
        }
      }
    }
  }

  async function newCart(data) {
    setCart(data);
    setReservations([]);
    localStorage.setItem("cartId", data.cartId);
    await router.push(
      `${getPageUrl("basket", locale())}/?cartId=${data.cartId}`,
      undefined,
      { shallow: true }
    );
  }

  const Activities = () => {
    return isLoading ? (
      <Skeleton />
    ) : (
      <div
        className={classNames({
          "space-y-4 lg:space-y-6": !isSm,
          "space-y-5": isSm,
        })}
      >
        {Object.values(activities).map((item, index) => {
          return (
            <div key={item.activity?.id + index}>
              {isSm && index !== 0 && (
                <div className={`mb-4 h-px w-full bg-gray-200`} />
              )}
              <Activity
                size={size}
                widget={widget}
                cart={cart}
                reservations={reservations}
                item={item}
                removeCb={() => {
                  setIsLoading(true);
                  fetchData();
                }}
                newCartCb={(cart) => {
                  newCart(cart);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const BookingButton = () => {
    return cart?.cartId ? (
      <Link
        href={`${getPageUrl("booking", locale())}/?cartId=${cart.cartId}`}
        passHref
      >
        <Button
          onClick={() => setIsLoadingButton(true)}
          type="primary"
          loading={isLoadingButton}
          className={`w-full`}
          text={t("pages.basket.next")}
        />
      </Link>
    ) : null;
  };

  return widget ? (
    <Activities />
  ) : (
    <Layout isBooking={true} disableLinksBlock meta={meta} menu={menu}>
      <section className={`bg-gray-50 pb-16 lg:pb-24`}>
        <BreadcrumbsBasket />
        <div className={`container-tw`}>
          <div className={`grid gap-8 lg:grid-cols-[2fr,1fr] lg:gap-12`}>
            <div>
              <Text as="h2" size="md" className={`mb`}>
                {t("activity.widget.basket")}
              </Text>
              <div>
                {!isLoading && reservations.length === 0 ? (
                  <Card
                    className={`flex flex-col items-center justify-center space-y-4 lg:py-8`}
                  >
                    <Text as="h2" size="lg">
                      {t("pages.basket.empty")}
                    </Text>
                    <Link href={getPageUrl("s", locale())} passHref>
                      <Button type="primary" as="a">
                        {t("pages.basket.explore")}
                      </Button>
                    </Link>
                  </Card>
                ) : isLoading ? (
                  <CardLoader />
                ) : (
                  reservations.length >= 1 && (
                    <div className={`space-y-4 lg:space-y-6`}>
                      <Activities />
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={`hidden lg:block`}>
              {reservations.length >= 1 && (
                <>
                  <Text as="h2" size="md" className={`mb`}>
                    {t("breadcrumbsBasket.stepTwoDescription")}
                  </Text>
                  {isLoading ? (
                    <CardLoader />
                  ) : (
                    <Card>
                      <Summary
                        className={`mb-6`}
                        type="total"
                        total={cart.total.formatted}
                        checkout={false}
                      />
                      <BookingButton />
                    </Card>
                  )}
                </>
              )}
            </div>
            {reservations.length >= 1 && (
              <BottomBar className={`lg:hidden`}>
                <BookingButton />
              </BottomBar>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const basketStaticProps = async (fs, locale = "de_CH") => {
  const params = await getParams(fs, locale);

  return {
    props: {
      ...params,
    },
  };
};
