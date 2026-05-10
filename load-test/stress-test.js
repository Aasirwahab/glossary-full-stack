import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

const errorRate = new Rate("errors");
const productListDuration = new Trend("product_list_duration");

export const options = {
  stages: [
    { duration: "30s", target: 100 },   // Warm up
    { duration: "1m", target: 300 },    // Push to 300
    { duration: "1m", target: 500 },    // Push to 500
    { duration: "1m", target: 750 },    // Push to 750
    { duration: "1m", target: 1000 },   // Push to 1000
    { duration: "1m", target: 1000 },   // Hold 1000
    { duration: "30s", target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<5000"],  // Relaxed: 95% under 5s
    errors: ["rate<0.3"],               // Allow up to 30% errors to find breaking point
  },
};

export default function () {
  // Health check
  group("Health Check", () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, { "health OK": (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
  });

  // Products (heaviest DB query)
  group("Browse Products", () => {
    const res = http.get(`${BASE_URL}/api/products`);
    productListDuration.add(res.timings.duration);
    check(res, {
      "products OK": (r) => r.status === 200,
      "under 3s": (r) => r.timings.duration < 3000,
    });
    errorRate.add(res.status !== 200);
  });

  sleep(0.5);

  // Flash deals
  group("Flash Deals", () => {
    const res = http.get(`${BASE_URL}/api/products/flash-deals`);
    check(res, { "flash deals OK": (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
  });

  // Delivery zone check
  group("Zone Check", () => {
    const res = http.post(
      `${BASE_URL}/api/delivery-zones/check`,
      JSON.stringify({ pincode: "110001" }),
      { headers: { "Content-Type": "application/json" } }
    );
    check(res, { "zone OK": (r) => r.status < 500 });
    errorRate.add(res.status >= 500);
  });

  sleep(Math.random() * 1.5);
}
