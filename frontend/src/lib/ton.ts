import { TonConnect } from "@tonconnect/sdk";

export const tonConnect = new TonConnect({
  manifestUrl:
    "https://beer-app.vercel.app/frontend/public/tonconnect-manifest.json",
});
