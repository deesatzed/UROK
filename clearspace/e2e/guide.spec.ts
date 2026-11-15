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
      const start = page.getByRole("button", { name: "Start calming support" });
      await expect(start).toBeInViewport();
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
