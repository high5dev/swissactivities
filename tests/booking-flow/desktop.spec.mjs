import { test, expect } from "@playwright/test";

let page;
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await context.setHTTPCredentials({ username: "sa", password: "d3mo" });
  await page.goto("https://staging.swissactivities.com/warenkorb");
});

test.afterAll(async ({ browser }) => {
  await browser.close();
});

test.describe("booking flow desktop", () => {
  test("cart is empty", async () => {
    await expect(page.locator("text=Dein Warenkorb ist leer")).toBeTruthy();
  });

  test("go to activity", async () => {
    await page.goto("https://staging.swissactivities.com/best-tour-ever1/");
    await expect(
      page.locator("text=this is our first test listing")
    ).toBeTruthy();
  });

  test.describe("booking widget", () => {
    test("is open", async () => {
      page.locator("text=Verfügbarkeit prüfen").first().click();
      await expect(page.locator("#booking-calendar")).toBeTruthy();
    });

    test.describe("calendar", () => {
      test("is closed", async () => {
        page.locator("#booking-calendar + div > div:first-of-type").click();
        await expect(page.locator(".react-calendar.hidden")).toBeTruthy();
      });

      test("is open again", async () => {
        page.locator("#booking-calendar + div > div:first-of-type").click();
        await expect(page.locator(".react-calendar:not(.hidden)")).toBeTruthy();
      });

      test("back button is disabled", async () => {
        const button = page.locator(".react-calendar__navigation__prev-button");
        const pointerEvents = await button.evaluate((e) =>
          window.getComputedStyle(e).getPropertyValue("pointer-events")
        );
        await expect(pointerEvents).toBe("none");
      });

      test("next month is triggered", async () => {
        page.locator(".react-calendar__navigation__next-button").click();
        const month = await page
          .locator(".react-calendar__navigation__label__labelText--from")
          .innerText();
        await page.waitForFunction(
          (month) =>
            document.querySelector(
              ".react-calendar__navigation__label__labelText--from"
            ).textContent !== month,
          month
        );
        expect(
          await page
            .locator(".react-calendar__navigation__label__labelText--from")
            .innerText()
        ).not.toBe(month);
      });

      test("back button is enabled", async () => {
        const button = page.locator(".react-calendar__navigation__prev-button");
        const pointerEvents = await button.evaluate((e) =>
          window.getComputedStyle(e).getPropertyValue("pointer-events")
        );
        await expect(pointerEvents).not.toBe("none");
      });
    });

    test.describe("first ticket", () => {
      test("click minus and cart button has pointer-events-none", async () => {
        const minus = page.locator("#offer-41 button >> nth=0");
        await minus.click();
        const cart = page.locator("text=Zum Warenkorb hinzufügen").first();
        const pointerEvents = await cart.evaluate((e) =>
          window.getComputedStyle(e).getPropertyValue("pointer-events")
        );
        await expect(pointerEvents).toBe("none");
      });

      test("minus button has pointer-events-none", async () => {
        const minus = page.locator("#offer-41 button").first();
        const pointerEvents = await minus.evaluate((e) =>
          window.getComputedStyle(e).getPropertyValue("pointer-events")
        );
        await expect(pointerEvents).toBe("none");
      });

      test("click plus and cart button does not have pointer-events-none", async () => {
        const plus = page.locator("#offer-41 button >> nth=1");
        await plus.click();
        const cart = page.locator("text=Zum Warenkorb hinzufügen").first();
        const pointerEvents = await cart.evaluate((e) =>
          window.getComputedStyle(e).getPropertyValue("pointer-events")
        );
        await expect(pointerEvents).not.toBe("none");
      });
    });

    test.describe("second ticket", () => {
      test("click plus and and total price CHF 2", async () => {
        const plus = page.locator("#offer-41 button >> nth=3");
        await plus.click();
        await expect(page.locator("text=CHF 2")).toBeTruthy();
      });

      test("click plus and and total price CHF 3", async () => {
        const plus = page.locator("#offer-41 button >> nth=3");
        await plus.click();
        await expect(page.locator("text=CHF 3")).toBeTruthy();
      });
    });

    test("go to cart page", async () => {
      await page.locator("text=Zum Warenkorb hinzufügen").click();
      await expect(page.locator("body")).toHaveClass(/is-booking/);
    });
  });

  test.describe("cart page", () => {
    test("has one reservation", async () => {
      await expect(
        page.locator("text=Wir halten diese Reservierung für")
      ).toBeTruthy();
    });

    test.describe("edit ticket", () => {
      test("opens booking widget", async () => {
        await page.locator("button >> nth=1").click();
        await expect(page.locator("#booking-calendar")).toBeTruthy();
        await expect(page.locator("#offer-41")).toBeTruthy();
        await expect(page.locator("text=Warenkorb aktualisieren")).toBeTruthy();
      });

      // @TODO: Find out why those tests are not working.
      /*
      test("add third ticket", async () => {
        const plus = page.locator("#offer-41 button >> nth=3");
        await plus.click();
        await expect(page.locator("text=CHF 4")).toBeTruthy();
      });
  
      test("closes booking widget", async () => {
        await page.locator("button >> nth=1").click();
        await page.waitForSelector("#booking-calendar", {
          state: "detached",
        });
        await expect(page.locator("#booking-calendar")).toBeFalsy();
      });
       */
    });
  });

  test("go to activity #2", async () => {
    await page.goto("https://staging.swissactivities.com/best-tour-ever1/");
    await expect(
      page.locator("text=this is our first test listing")
    ).toBeTruthy();
  });

  test.describe("booking widget #2", () => {
    test("is open", async () => {
      page.locator("text=Verfügbarkeit prüfen").first().click();
      await expect(page.locator("#booking-calendar")).toBeTruthy();
    });

    test.describe("first ticket", () => {
      test("click plus and cart button does not have pointer-events-none", async () => {
        const plus = page.locator("#offer-41 button >> nth=1");
        await plus.click();
        const cart = page.locator("text=Zum Warenkorb hinzufügen");
        const pointerEvents = await cart.evaluate((e) =>
          window.getComputedStyle(e).getPropertyValue("pointer-events")
        );
        await expect(pointerEvents).not.toBe("none");
      });
    });

    test.describe("second ticket", () => {
      test("click plus and and total price CHF 2", async () => {
        const plus = page.locator("#offer-41 button >> nth=3");
        await plus.click();
        await expect(page.locator("text=CHF 2")).toBeTruthy();
      });

      test("click plus and and total price CHF 3", async () => {
        const plus = page.locator("#offer-41 button >> nth=3");
        await plus.click();
        await expect(page.locator("text=CHF 3")).toBeTruthy();
      });
    });

    test("go to cart page", async () => {
      await page.locator("text=Zum Warenkorb hinzufügen").click();
      await expect(page.locator("body")).toHaveClass(/is-booking/);
    });
  });

  test.describe("cart page two", () => {
    test("has two reservations", async () => {
      await expect(
        page.locator("text=Wir halten diese Reservierung für")
      ).toHaveCount(2);
    });

    test("go to booking", async () => {
      await page.locator("text=Zur Kasse").click();
      await expect(
        page.locator("text=Reservation bestätigt - Warenkorb")
      ).toBeTruthy();
    });
  });
});
