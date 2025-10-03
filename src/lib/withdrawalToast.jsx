// src/lib/withdrawalToast.jsx
import { toast } from "react-toastify";

const kes = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[randInt(0, arr.length - 1)];
}

function randomMaskedMsisdn() {
  const last3 = String(randInt(0, 999)).padStart(3, "0");
  const prefixX = randChoice(["XX", "YY", "ZZ"]);
  return `2547${prefixX}****${last3}`;
}

function randomAmount() {
  const base = randInt(10, 100) * 50;
  return randChoice([2500, 2500, 1000, 3000, base, base]);
}

function randomRef() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const six = [
    digits[randInt(0, 9)], digits[randInt(0, 9)],
    digits[randInt(0, 9)], digits[randInt(0, 9)],
    letters[randInt(0, 25)], letters[randInt(0, 25)]
  ].join("");
  return `TX${six}`;
}

function randomBalance() {
  return randInt(0, 100);
}

let toastInterval;

export function startWithdrawalToasts() {
  if (toastInterval) {
    clearInterval(toastInterval);
  }
  pushRandomWithdrawalToast();
  toastInterval = setInterval(pushRandomWithdrawalToast, 45000); // 45 seconds
}

export function stopWithdrawalToasts() {
  if (toastInterval) {
    clearInterval(toastInterval);
    toastInterval = null;
  }
}

export function pushRandomWithdrawalToast() {
  const msisdn = randomMaskedMsisdn();
  const amount = randomAmount();
  const balance = randomBalance();
  const ref = randomRef();

  toast(
    <div className="rounded-xl border border-amber-200 shadow-lg bg-white !text-slate-800">
      <div className="text-green-900 font-bold">Withdrawal</div>
      <div className="mt-1 text-slate-700">
        <span className="font-mono tracking-tight">{msisdn}</span> has withdrawn{" "}
        <span className="font-semibold">{kes.format(amount)}</span>.{" "}
        New balance: <span className="font-semibold">{kes.format(balance)}</span>.{" "}
        Ref. <span className="font-mono">{ref}</span>
      </div>
    </div>,
    {
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      hideProgressBar: true,
    }
  );
}
