import { timingSafeEqual } from "crypto";

import { jsonError } from "@/lib/api-response";

const textEncoder = new TextEncoder();

function timingSafeStringEqual(actual, expected) {
  const actualBytes = textEncoder.encode(actual);
  const expectedBytes = textEncoder.encode(expected);

  if (actualBytes.byteLength !== expectedBytes.byteLength) {
    return false;
  }

  return timingSafeEqual(actualBytes, expectedBytes);
}

export function authorizeCronRequest(request, secret = process.env.CRON_SECRET) {
  const configuredSecret = typeof secret === "string" ? secret.trim() : "";

  if (!configuredSecret) {
    return {
      authorized: false,
      response: jsonError("Cron secret is not configured", 500),
    };
  }

  const authHeader = request.headers.get("authorization") || "";
  const expectedHeader = `Bearer ${configuredSecret}`;

  if (!timingSafeStringEqual(authHeader, expectedHeader)) {
    return {
      authorized: false,
      response: jsonError("Unauthorized", 401),
    };
  }

  return {
    authorized: true,
    response: null,
  };
}
