import { useSwipeable } from "react-swipeable";

import { DrawerMenu } from "./DrawerMenu";
import Header from "./Header";
import type { ReactNode } from "react";
import { useUIStore } from "../store/useUIStore";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const openMenu = useUIStore((s) => s.openMenu);
  const closeMenu = useUIStore((s) => s.closeMenu);

  const handlers = useSwipeable({
    onSwipedRight: () => openMenu(),
    onSwipedLeft: () => closeMenu(),
    trackMouse: true,
  });

  return (
    <div {...handlers} className="h-screen flex flex-col overflow-hidden">
      <Header />
      <DrawerMenu />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};
