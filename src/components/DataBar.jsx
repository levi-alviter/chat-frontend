import { useEffect, useState } from "react";
import classes from "./DataBar.module.css";

const MILISECONDS_PER_DAY = 86400000;

let timeout;
let x = 1;
const DataBar = () => {
  const [hour, setHour] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [dayWeek, setDayWeek] = useState("");
  const [dayMonth, setDayMonth] = useState("");

  const digitFormatter = (string) =>
    string.length === 2 ? string : `0${string}`;

  const parseDayOfWeek = (numberOfDay) => {
    const days = {
      0: "Sun",
      1: "Mon",
      2: "Tue",
      3: "Wed",
      4: "Thu",
      5: "Fri",
      6: "Sat",
    };

    return days[numberOfDay] || "Wrong!";
  };

  const parseMonthName = (numberOfMonth) => {
    const months = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dec",
    };

    return months[numberOfMonth] || "Wrong!";
  };

  useEffect(() => {
    const clock = setInterval(() => {
      const time = new Date();

      setHour(digitFormatter(time.getHours().toString()));
      setMinutes(digitFormatter(time.getMinutes().toString()));
      setSeconds(digitFormatter(time.getSeconds().toString()));
    }, 1000);
    return () => {
      clearInterval(clock);
    };
  }, []);

  const timeLeftToMidnight = () => {
    const now = new Date();
    now.setHours(now.getHours() + 18);
    now.setDate(now.getDate() - 1);

    const midnight = new Date();
    midnight.setDate(midnight.getDate());
    midnight.setHours(0, 0, 0, 0);

    return midnight.getTime() - now.getTime();
  };

  const updateDate = () => {
    const now = new Date();
    now.setDate(now.getDate());

    setYear(now.getFullYear().toString().slice(2));
    setMonth(parseMonthName(now.getUTCMonth().toString()));
    setDayWeek(parseDayOfWeek(now.getUTCDay().toString()));
    setDayMonth(digitFormatter(now.getUTCDate().toString()));
  };

  const callUpdate = (timeleft = null) => {
    let time = timeleft;
    timeout = setTimeout(() => {
      updateDate();
      if (time) {
        time = null;
      }
      clearTimeout(timeout);
      callUpdate();
    }, time || MILISECONDS_PER_DAY);
  };

  useEffect(() => {
    let timeLeft = timeLeftToMidnight();
    updateDate();
    callUpdate(timeLeft);

    return () => {};
  }, []);

  return (
    <footer className={classes["footer"]}>
      <ul className={classes["list"]}>
        <li className={classes["time"]}>
          {hour}:{minutes}:{seconds} -
        </li>
        <li className={classes["date"]}>
          <ul className={classes["list-embebbed"]}>
            <li className={classes["day-of-month"]}>{dayMonth}</li>
            <li className={classes["day-of-week"]}>{dayWeek}</li>
            <li className={classes["month"]}>{month}</li>
            <li className={classes["year"]}>{year}</li>
          </ul>
        </li>
      </ul>
    </footer>
  );
};

export default DataBar;
