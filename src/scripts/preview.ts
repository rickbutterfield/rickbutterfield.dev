// Backoffice preview links. Umbraco's AstroPreviewUrlProvider (rick-butterfield repo) signs the document id,
// culture and expiry with PREVIEW_SECRET; the /preview route checks the signature before it fetches drafts.

export interface PreviewRequest {
  id: string;
  culture: string;
}

const hexToBytes = (hex: string): Uint8Array<ArrayBuffer> | null => {
  if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) return null;
  return Uint8Array.from(hex.match(/../g)!, (byte) => parseInt(byte, 16));
};

// Must match the string the URL provider signs
export const signedPayload = (id: string, culture: string, expires: string) => `${id}\n${culture}\n${expires}`;

/** Returns the requested document when the link is signed with `secret` and hasn't expired, otherwise null. */
export async function verifyPreviewLink(url: URL, secret: string, now = Date.now()): Promise<PreviewRequest | null> {
  const id = url.searchParams.get("id") ?? "";
  const culture = url.searchParams.get("culture") ?? "";
  const expires = url.searchParams.get("expires") ?? "";
  const signature = hexToBytes(url.searchParams.get("signature") ?? "");

  if (!id || !signature || !/^\d+$/.test(expires) || Number(expires) * 1000 < now) return null;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  // verify() compares in constant time
  const valid = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(signedPayload(id, culture, expires)));

  return valid ? { id, culture } : null;
}
