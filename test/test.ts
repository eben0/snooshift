import { SnooShift } from "../src";

(async () => {
  const snoo = new SnooShift();
  const subs = await snoo.searchSubmissions({ size: 10 });
  console.log(subs[0]);
})();
