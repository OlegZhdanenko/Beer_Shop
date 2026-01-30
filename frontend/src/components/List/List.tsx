import { useEffect, useState } from "react";
import { BeerAnimation } from "../BeerAnimation/BeerAnimation";
import Button from "../BTN/Button";
import css from "./List.module.css";
import { api } from "../../lib/axios";
import { useTelegram } from "../../hook/telegram";
// import type { ProductInterface } from "../../types/product.dto";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { Toaster } from "react-hot-toast";

export default function List() {
  const { user, initData, isReady } = useTelegram();

  // const [product, setProduct] = useState<ProductInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  useEffect(() => {
    if (!isReady || !initData) return;

    (async () => {
      try {
        await api.post("/api/auth/telegram", { initData });

        // const res = await api.post("/api/product/create", {
        //   name: "Stella Artous",
        //   priceTon: 1,
        // });

        // setProduct(res.data);
        setIsLoading(false);
      } catch (e: any) {
        setError(e.message || "Init error");
        setIsLoading(false);
      }
    })();
  }, [isReady, initData]);

  useEffect(() => {
    if (!wallet || !user) return;

    api.post(
      "/api/user/bind-wallet",
      {
        address: wallet.account.address,
        network: wallet.account.chain === "-3" ? "testnet" : "mainnet",
      },
      {
        headers: { "x-telegram-id": user.id },
      },
    );
  }, [wallet, user]);

  if (error) {
    return (
      <div className={css.container}>
        <BeerAnimation />
        <div style={{ color: "red" }}>{error}</div>
      </div>
    );
  }

  if (!isReady || isLoading) {
    return (
      <div className={css.container}>
        <BeerAnimation />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className={css.container}>
      <BeerAnimation />

      {user && (
        <div>
          <Toaster />
          <h2>Welcome, {user.first_name || user.username}!</h2>
          <p>Telegram ID: {user.id}</p>

          {!wallet ? (
            <button onClick={() => tonConnectUI.openModal()}>
              Connect Wallet
            </button>
          ) : (
            <>
              <p>✅ Wallet connected</p>
              {/* <Button id={user.id}  /> */}
            </>
          )}
        </div>
      )}
    </div>
  );
}
