import { Request, Response } from "express";
import { getBrowser } from "../../lib/browser";
import { EnquiryData } from "./types";

const DEFAULT_DATA: EnquiryData = {
  name: "Rahul Sharma",
  phone: "9876543210",
  email: "rahul@example.com",
  course: "Computer Science",
  source: "WEBSITE",
  query: "I would like to know about fees and admission dates.",
};

export default async function FirstRPAHandler(req: Request, res: Response) {
  const data: EnquiryData = { ...DEFAULT_DATA, ...(req.body ?? {}) };
  const browser = await getBrowser();
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  try {
    // 1. NAVIGATE to the site
    await page.goto("https://edumerge-assignment-gamma.vercel.app/", {
      waitUntil: "domcontentloaded",
    });

    // 2. CLICK the "Contact / Admission Enquiry" button     //    getByText works whether it's a <button> or an <a> link
    await page.getByText("Contact / Admission Enquiry").first().click();

    // 3. WAIT until the form is actually on screen
    const nameInput = page.getByLabel("Name");
    await nameInput.waitFor({ state: "visible", timeout: 10_000 });

    // 4. FILL the form
    await nameInput.fill(data.name);
    await page.getByLabel("Phone").fill(data.phone);
    await page.getByLabel("Email").fill(data.email);
    await page.getByLabel("Course Interest").fill(data.course);
    // Source is a custom (Radix) dropdown, not a native <select>: open it, then pick the option
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: data.source, exact: true }).click();
    await page.locator("textarea").fill(data.query);

    // 5. SUBMIT, and catch the server's response to that submit
    const responsePromise = page.waitForResponse((r) => r.request().method() === "POST", {
      timeout: 15_000,
    });

    await page.getByRole("button", { name: "Submit Enquiry" }).click();
    const response = await responsePromise;

    // 6. GO BACK to the home page once the submit succeeded
    //    (client-side routing, so wait for the URL instead of a page load)
    if (response.ok()) {
      await page.goBack();
      await page.waitForURL("https://edumerge-assignment-gamma.vercel.app/");
    }

    // 7. READ what happened
    res.json({
      submitted: response.ok(),
      apiStatus: response.status(),
      apiUrl: response.url(),
      finalPageUrl: page.url(),
      sentData: data,
    });
  } catch (err) {
    // Save a screenshot so you can see where it got stuck
    await page.screenshot({ path: "error.png", fullPage: true }).catch(() => {});
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message, screenshot: "error.png" });
  } finally {
    await context.close();
  }
}
