import List from "../components/List/List";
import css from "./home.module.css";

export default function Home() {
  return (
    <>
      <h1 className={css.header}>Beer Shop</h1>
      <List />
    </>
  );
}
