import { useUIStore } from "../store/useUIStore";

export default function Header() {
  const toggleMenu = useUIStore((s) => s.toggleMenu);

  return (
    <header className="h-14 flex items-center px-4 shadow">
      <button onClick={toggleMenu} className="text-2xl" aria-label="Open menu">
        ☰
      </button>

      <h1 className="ml-4 font-semibold">Drink Shop</h1>
    </header>
  );
}
