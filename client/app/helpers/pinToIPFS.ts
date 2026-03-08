// Pinata calls are proxied through /api/ipfs to keep the JWT server-side only.
// The PINATA_JWT env var (without NEXT_PUBLIC_ prefix) is used in app/api/ipfs/route.ts.

export const pinJSONFile = async (body: any) => {
  try {
    const response = await fetch("/api/ipfs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const unpinJSONFile = async (CID: string) => {
  try {
    await fetch("/api/ipfs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cid: CID }),
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
