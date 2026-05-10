import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

const errorRate = new Rate("errors");
const productListDuration = new Trend("product_list_duration");
const authDuration = new Trend("auth_duration");

export const options = {
  stages: [
    { duration: "30s", target: 10 },   // Ramp up to 10 users
    { duration: "1m", target: 50 },    // Ramp up to 50 users
    { duration: "2m", target: 100 },   // Ramp up to 100 users
    { duration: "1m", target: 200 },   // Push to 200 users
    { duration: "30s", target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],  // 95% of requests under 2s
    errors: ["rate<0.1"],               // Error rate under 10%
  },
};

const TEST_USER = {
  name: `LoadTest User ${Date.now()}`,
  email: `loadtest_${Date.now()}_${Math.random().toString(36).slice(2)}@test.com`,
  password: "TestPassword123!",
};

export default function () {
  // --- Health Check ---
  group("Health Check", () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, { "health OK": (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
  });

  // --- Browse Products (public, most common action) ---
  group("Browse Products", () => {
    const res = http.get(`${BASE_URL}/api/products`);
    productListDuration.add(res.timings.duration);
    check(res, { "products loaded": (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
  });

  sleep(1);

  // --- Get Flash Deals ---
  group("Flash Deals", () => {
    const res = http.get(`${BASE_URL}/api/products/flash-deals`);
    check(res, { "flash deals OK": (r) => r.status === 200 });
    errorRate.add(res.status !== 200);
  });

  // --- Login (authenticated flow) ---
  let token = null;
  group("Login", () => {
    const res = http.post(
      `${BASE_URL}/api/auth/login`,
      JSON.stringify({ email: "test@test.com", password: "Test1234" }),
      { headers: { "Content-Type": "application/json" } }
    );
    authDuration.add(res.timings.duration);
    if (res.status === 200) {
      try {
        token = res.json("accessToken") || res.json("token");
      } catch (_) {}
    }
    check(res, { "login responded": (r) => r.status === 200 || r.status === 400 || r.status === 429 });
    errorRate.add(res.status >= 500);
  });

  sleep(1);

  // --- Authenticated endpoints (only if login succeeded) ---
  if (token) {
    const authHeaders = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    group("Get Orders", () => {
      const res = http.get(`${BASE_URL}/api/orders`, authHeaders);
      check(res, { "orders OK": (r) => r.status === 200 });
      errorRate.add(res.status >= 500);
    });

    group("Get Wishlist", () => {
      const res = http.get(`${BASE_URL}/api/wishlist`, authHeaders);
      check(res, { "wishlist OK": (r) => r.status === 200 });
      errorRate.add(res.status >= 500);
    });

    group("Get Addresses", () => {
      const res = http.get(`${BASE_URL}/api/addresses`, authHeaders);
      check(res, { "addresses OK": (r) => r.status === 200 });
      errorRate.add(res.status >= 500);
    });
  }

  // --- Check Delivery Zone (public) ---
  group("Check Delivery Zone", () => {
    const res = http.post(
      `${BASE_URL}/api/delivery-zones/check`,
      JSON.stringify({ pincode: "110001" }),
      { headers: { "Content-Type": "application/json" } }
    );
    check(res, { "zone check responded": (r) => r.status < 500 });
    errorRate.add(res.status >= 500);
  });

  sleep(Math.random() * 2);
}
