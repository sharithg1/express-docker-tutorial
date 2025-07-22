import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 100 }, // ramp up to 100 VUs
    { duration: "30s", target: 100 }, // stay at 100 VUs
    { duration: "10s", target: 0 }, // ramp down
  ],
};

export default function () {
  http.get("http://ec2-18-222-148-168.us-east-2.compute.amazonaws.com:3001/");
  sleep(0.1); // small delay to simulate real usage
}
