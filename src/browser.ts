import { chromium } from "playwright";

export const launchBrowser = async (global: any) => {
  global.browser = await chromium.launch({
    headless: true, // Mantener en background
    args: [
      "--no-sandbox", // 🔹 Evita restricciones de sandboxing
      "--disable-setuid-sandbox", // 🔹 Necesario en algunos entornos Linux
      "--disable-gpu", // 🔹 Desactiva la GPU para menos consumo
      "--disable-dev-shm-usage", // 🔹 Usa la memoria RAM en lugar de /dev/shm
      "--disable-software-rasterizer", // 🔹 Mejora el rendimiento en headless
      "--disable-extensions", // 🔹 No carga extensiones innecesarias
      "--disable-background-timer-throttling", // 🔹 Evita que Playwright limite procesos en segundo plano
      "--disable-renderer-backgrounding", // 🔹 Evita pausas en la renderización
      "--disable-backgrounding-occluded-windows", // 🔹 Evita pausas si la ventana no está visible
      "--blink-settings=imagesEnabled=false", // 🔹 No carga imágenes (si no las necesitas)
    ],
  });

  global.page = await global.browser.newPage();

  await page.goto("http://localhost:3000/");

  // Mantener el proceso abierto
  process.stdin.resume();
};
