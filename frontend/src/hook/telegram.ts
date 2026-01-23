import { useEffect, useState } from "react";

export const useTelegram = () => {
  const [tg, setTg] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [initData, setInitData] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;

    if (!telegram) {
      console.error("Telegram WebApp SDK not found");
      return;
    }

    telegram.ready();
    telegram.expand();

    setTg(telegram);
    setUser(telegram.initDataUnsafe?.user ?? null);
    setInitData(telegram.initData);
    setIsReady(true);

    console.log("Telegram WebApp initialized", {
      user: telegram.initDataUnsafe?.user,
      initData: telegram.initData,
      platform: telegram.platform,
    });
  }, []);

  const onClose = () => {
    tg?.close();
  };

  const onToggleButton = () => {
    if (!tg?.MainButton) return;

    if (tg.MainButton.isVisible) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  };

  return {
    tg,
    user,
    initData,
    isReady,
    onClose,
    onToggleButton,
  };
};
