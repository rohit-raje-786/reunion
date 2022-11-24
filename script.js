import http from "k6/http";
import { sleep } from "k6";

const baseURL = "http://localhost:8080/register";

export let options = {
  vus: 5,
  duration: "1s",
  thresholds: {
    http_req_duration: ["p(95)<1500"],
  },
};

export default function () {
  const payload = JSON.stringify({
    sender_id: "917035107903",
    channel: "whatsapp",
    payload: {
      user_email: `${Math.random()}@gmail.com`,
      branch_name: "mumbai",
    },
  });
  http.post(baseURL, payload, {
    headers: { "Content-Type": "application/json" },
  });
  sleep(1);
}
