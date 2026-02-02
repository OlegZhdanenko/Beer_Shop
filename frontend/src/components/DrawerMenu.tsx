import clsx from "clsx";

import { NavLink } from "react-router-dom";
import { useUIStore } from "../store/useUIStore";

export const DrawerMenu = () => {
  const { isMenuOpen, closeMenu } = useUIStore();

  return (
    <>
      <div
        onClick={closeMenu}
        className={clsx(
          "fixed inset-0 bg-black/40 transition-opacity z-40",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-semibold">Меню</span>
          <button onClick={closeMenu}>❌</button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          <NavLink to="/catalog" onClick={closeMenu}>
            📦 Каталог
          </NavLink>
          <NavLink to="/cart" onClick={closeMenu}>
            🛒 Корзина
          </NavLink>
          <NavLink to="/orders" onClick={closeMenu}>
            🧾 Історія
          </NavLink>
        </nav>
      </aside>
    </>
  );
};
