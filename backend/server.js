// AI-assisted: see docs/AI_LOG.md #20
import "dotenv/config";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { readFileSync } from "node:fs";

const serviceAccount = JSON.parse(
  readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_PATH, "utf8"),
);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const MP = "https://api.mercadopago.com";
const mpHeaders = {
  Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

const app = express();
app.use(cors());
app.use(express.json());

// 1. The app asks for a payment link. The amount comes from Firestore.
app.post("/create-preference", async (req, res) => {
  try {
    const { tripId } = req.body;
    const snap = await db.collection("trips").doc(tripId).get();
    if (!snap.exists) return res.status(404).json({ error: "Trip not found" });
    const trip = snap.data();
    if (trip.status !== "completed")
      return res.status(400).json({ error: "Trip is not completed" });

    const r = await fetch(`${MP}/checkout/preferences`, {
      method: "POST",
      headers: mpHeaders,
      body: JSON.stringify({
        items: [
          {
            title: `Viaje ${tripId}`,
            quantity: 1,
            unit_price: trip.fare + (trip.tip || 0),
            currency_id: "COP",
          },
        ],
        external_reference: tripId,
        notification_url: `${process.env.PUBLIC_URL}/webhook`,
        back_urls: {
          success: `${process.env.PUBLIC_URL}/return`,
          failure: `${process.env.PUBLIC_URL}/return`,
          pending: `${process.env.PUBLIC_URL}/return`,
        },
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data.message });
    res.json({ url: data.init_point });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Mercado Pago notifies the result. We re-check the payment ourselves.
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
  try {
    const type = req.body?.type ?? req.query.type ?? req.query.topic;
    const paymentId =
      req.body?.data?.id ?? req.query["data.id"] ?? req.query.id;
    if (type !== "payment" || !paymentId) return;

    const r = await fetch(`${MP}/v1/payments/${paymentId}`, {
      headers: mpHeaders,
    });
    const payment = await r.json();
    if (payment.status !== "approved") return;

    await db
      .collection("trips")
      .doc(payment.external_reference)
      .update({
        status: "paid",
        paymentMethod: "mercadopago",
        paymentStatus: "approved",
        paymentId: String(paymentId),
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (e) {
    console.log("webhook error", e);
  }
});

app.get("/return", (req, res) =>
  res.send("Pago procesado. Puedes volver a la aplicación."),
);

app.listen(process.env.PORT || 3000, () => console.log("Backend listo"));
