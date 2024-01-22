import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
const minimal_args = [
  // To disable unecessary processes of chrome
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];


const app = express();
app.use(cors());
const allowedOrigins = [
  "https://buzzleague.vercel.app",
  "https://buzzleague-git-main-lovelindhoni.vercel.app",
  "http://buzzleague-oxkn78frc-lovelindhoni.vercel.app",
];


app.use(
  cors({
    origin: (origin, callback) => {
      // disallow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, false);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);


app.get("/", async (_, res) => {
  res.setHeader("cache-control", "public max-age=2000");
  const browser = await puppeteer.launch({
    headless: "new",
    args: minimal_args,
    userDataDir : './temp'
  }); // Launching chrome in new headless mode
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto("https://buzzleague.vercel.app", {
    waitUntil: "networkidle0",
  }); // Waits until there are no network requests for 500ms
  const content = await page.$("#topper");
  const screenshot = await content?.screenshot({ encoding: "base64" });
  await browser.close();
  res.send(`data:image/jpeg;base64,${screenshot}`); // The captured screenshot in base64 image format
});


const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
