import { useEffect, useState } from "react";
import classes from "./Header.module.css";

const Header = () => {
  const [year, setYear] = useState();

  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());
  }, []);
  return (
    <header className={classes["header"]}>
      <div className={classes["header-title"]}>
        <h2>Active users 1</h2>
        <h1>&lt;PRIVATE CHAT&gt;</h1>
      </div>
      <div className={classes["header-info"]}>
        <h4>SECHAT for WEB BROWSER version 0.3.2</h4>
        <h5>Copyright &#40;C&#41; 1997-{year}</h5>
      </div>
    </header>
  );
};

export default Header;
