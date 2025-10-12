import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 10, // virtual users
  duration: "10s", // test duration
};

export default function () {
  const url = "http://202.38.182.170:1339/api/auth/local"; // Strapi local auth endpoint
  const payload = JSON.stringify({
    identifier: "mani@hph.com", // change to real user
    password: "Welcome@123", // change to real password
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "JWT token received": (r) => r.json("jwt") !== undefined,
  });

  sleep(1); // wait before next request
}
