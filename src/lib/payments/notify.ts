import { after } from "next/server";
import { sendOrderEmails, sendUnmatchedPaymentAlert } from "./email";
import type { PaymentUpdate } from "./orders";
import type { SadadResult } from "./sadad";

/**
 * Emails go out after the response, so neither the customer's redirect nor
 * SADAD's webhook waits on SMTP. Only the caller holding the email claim
 * (see applyPaymentResult) sends the paid emails, so each goes out once — and
 * a later SADAD event retries whichever never went out. A payment to check
 * alerts staff on its own, even when the paid emails are also due.
 */
export function notifyPaymentUpdate(update: PaymentUpdate | null): void {
  if (!update) return;
  const { order, review } = update;
  if (update.sendPaidEmails) after(() => sendOrderEmails(order, "paid"));
  if (review) after(() => sendOrderEmails(order, "review", review));
}

/**
 * SADAD verified a successful payment we could not record (order unknown or
 * the store failed). Staff must hear about it: the customer has paid.
 */
export function alertUnrecordedPayment(result: SadadResult, source: "callback" | "webhook", reason: string): void {
  if (result.outcome !== "paid") return;
  console.error(
    `[sadad] PAID BUT NOT RECORDED via ${source}: order=${result.orderId} txn=${result.transactionNumber} amount=${result.amountQar} (${reason})`,
  );
  after(() => sendUnmatchedPaymentAlert(result, source, reason));
}
