import http from "k6/http";
import { check } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5000";

export const options = {
  vus: 5,
  duration: "30s",
};

export default function () {
  const res = http.get(`${BASE_URL}/api/products`);
  check(res, {
    "status 200": (r) => r.status === 200,
    "response < 500ms": (r) => r.timings.duration < 500,
  });
}
