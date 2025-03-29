export default defineBackground(() => {
  // Aggiungi un listener per il caricamento delle pagine
  browser.webRequest.onCompleted.addListener(
    async (details) => {
      // Se la risposta non contiene header, esci
      if (!details.responseHeaders) return;

      // Ricerca l'header "content-length"
      const header = details.responseHeaders.find(
        (header) => header.name.toLowerCase() === "content-length"
      );

      if (!header || !header.value) return;

      const contentLength = parseInt(header.value, 10);
      if (isNaN(contentLength)) return;

      // Converti il valore da byte a megabyte
      const mbUsed = contentLength / (1024 * 1024);

      // Aggiorna il contatore locale
      const total = await storage.getItem<number>("local:total-megabytes");
      const newTotal = (total ?? 0) + mbUsed;

      await storage.setItem("local:total-megabytes", newTotal);
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
  );

  // Crea un alarm per inviare i dati ogni 20 minuti
  browser.alarms.create("send-data", {
    periodInMinutes: 20,
    when: Date.now(),
  });

  // Aggiungi un listener per l'alarm
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== "send-data") return;

    // Ottieni il totale dei megabyte
    const total = await storage.getItem<number>("local:total-megabytes");
    if (!total) return;

    // Invia i dati al server
    const apiKey = await storage.getItem<string>("local:api-key");
    if (!apiKey) return;

    const date = new Date();

    const res = await fetch(`${process.env.WXT_API_URL}/05_estensione.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        usage: total,
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      }),
    });

    if (!res.ok) {
      console.error("Failed to send data", res.statusText);
      return;
    }

    const data = await res.json();
    if (data.error) {
      console.error("Error from server:", data.error);
      return;
    }

    // Resetta il contatore locale
    console.log("Data sent successfully:", data);
    await storage.setItem("local:total-megabytes", 0);
    console.log("Total megabytes reset to 0");
  });
});
