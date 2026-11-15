import { expect, test } from "@playwright/test";

for (const [width, height] of [
  [320, 568],
  [390, 844],
  [1280, 800],
]) {
  test(
    "support and audio on a " + width + "px display, including offline reload",
    async ({ page, context, baseURL }) => {
      await page.setViewportSize({ width, height });
      const origin = new URL(baseURL!).origin;
      const unexpected: string[] = [];
      context.on("request", (request) => {
        const url = new URL(request.url());
        if (url.origin !== origin || url.pathname.includes("/voice-studio/"))
          unexpected.push(url.href);
      });
      await page.goto("./");
      const start = page.getByRole("button", { name: /Help me through this/ });
      await expect(start).toBeInViewport();
      for (const name of [
        /afraid it might happen/i,
        /it just happened/i,
        /i want to practice/i,
      ]) {
        const box = await page.getByRole("button", { name }).boundingBox();
        expect(box!.y + box!.height).toBeLessThanOrEqual(height - 56);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await start.click();
      const alternative = page.getByRole("button", {
        name: "Try a different exercise",
      });
      await expect(alternative).toBeInViewport();
      const urgent = page.getByRole("button", { name: "Urgent help" });
      await urgent.click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(urgent).toBeFocused();
      await alternative.click();
      await page.getByRole("button", { name: "Paced breathing" }).click();
      await page
        .getByRole("button", { name: /start breathing timer/i })
        .click();
      await urgent.click();
      await page.getByRole("button", { name: "Go back" }).click();
      await expect(
        page.getByRole("button", { name: /pause breathing timer/i }),
      ).toHaveCount(0);
      await page.getByRole("button", { name: "Try grounding instead" }).click();
      await page.getByRole("button", { name: "Next sense" }).click();
      await expect(
        page.getByRole("heading", { name: /4 things you can touch/i }),
      ).toBeFocused();

      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      await context.setOffline(true);
      await page.reload();
      await start.click();
      await expect(
        page.getByRole("heading", { name: "Feel one steady surface." }),
      ).toBeVisible();
      const seconds = await page.evaluate(async () => {
        const ac = new AudioContext();
        try {
          const clip = await fetch("./voices/surface.mp3");
          return (await ac.decodeAudioData(await clip.arrayBuffer())).duration;
        } finally {
          await ac.close();
        }
      });
      expect(seconds).toBeGreaterThan(1);
      expect(unexpected).toEqual([]);
    },
  );
}

test("a saved small step and reflection stay available offline after an interrupted visit", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.getByRole("button", { name: /afraid it might happen/i }).click();
  await page.getByRole("button", { name: /make a small plan/i }).click();
  await page.getByRole("button", { name: "Go to a shop", exact: true }).click();
  await page.getByRole("button", { name: /choose my step/i }).click();
  await page.getByRole("button", { name: /see my plan/i }).click();
  await page.getByRole("button", { name: /keep this plan/i }).click();
  await page.getByRole("button", { name: /i’ll try this step/i }).click();
  await expect(page.getByText(/put your phone away/i)).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await page
    .getByRole("button", { name: /my saved step.*go to a shop/i })
    .click();
  await expect(
    page.getByText("Go inside and look at one thing."),
  ).toBeVisible();
  await page.getByRole("button", { name: /look back on it/i }).click();
  await page
    .getByLabel(/what happened/i)
    .fill("I went in and left after a minute.");
  await page.getByRole("button", { name: /keep this reflection/i }).click();
  await page.getByText("What I noticed before", { exact: true }).click();
  await expect(
    page.getByText("I went in and left after a minute."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Go to home", exact: true }).click();
  await page.getByRole("button", { name: /it just happened/i }).click();
  await expect(
    page.getByRole("heading", { name: "A moment for yourself." }),
  ).toBeVisible();
  const clipSeconds = await page.evaluate(async () => {
    const audio = new AudioContext();
    try {
      return (
        await audio.decodeAudioData(
          await (await fetch("./voices/after.mp3")).arrayBuffer(),
        )
      ).duration;
    } finally {
      await audio.close();
    }
  });
  expect(clipSeconds).toBeGreaterThan(1);
});

test("browser Back and Forward stay inside support and interrupted reflection drafts survive", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.getByRole("button", { name: /i want to practice/i }).click();
  await page.getByRole("button", { name: /understand my pattern/i }).click();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Practice when you feel ready." }),
  ).toBeVisible();
  await page.goForward();
  await expect(
    page.getByRole("heading", { name: "What did you notice?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Go to home", exact: true }).click();

  await page.getByRole("button", { name: /afraid it might happen/i }).click();
  await page.getByRole("button", { name: /make a small plan/i }).click();
  await page.getByRole("button", { name: "Go to a shop", exact: true }).click();
  await page.getByRole("button", { name: /choose my step/i }).click();
  await page.getByRole("button", { name: /see my plan/i }).click();
  await page.getByRole("button", { name: /keep this plan/i }).click();
  await page.getByRole("button", { name: /look back on it/i }).click();
  await page
    .getByLabel(/what happened/i)
    .fill("I went inside and asked for a minute.");
  await page.getByRole("button", { name: /i’d like support now/i }).click();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Go to a shop", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /look back on it/i }).click();
  await expect(page.getByLabel(/what happened/i)).toHaveValue(
    "I went inside and asked for a minute.",
  );
  await page.reload();
  await page
    .getByRole("button", { name: /my saved step.*go to a shop/i })
    .click();
  await page.getByRole("button", { name: /look back on it/i }).click();
  await expect(page.getByLabel(/what happened/i)).toHaveValue(
    "I went inside and asked for a minute.",
  );
});
