import { createHmac } from "node:crypto";

export function createSessionToken(secret: string): string {
  const payload = JSON.stringify({ role: "admin", exp: Date.now() + 86400000 });
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + sig;
}

export function verifySessionToken(token: string, secret: string): boolean {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;
  try {
    const payload = Buffer.from(payloadB64, "base64").toString();
    const expectedSig = createHmac("sha256", secret).update(payload).digest("hex");
    if (sig !== expectedSig) return false;
    const data = JSON.parse(payload);
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

export function verifyPin(input: string, pin: string): boolean {
  return input === pin;
}
