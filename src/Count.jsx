import { useEffect } from "react";
import { useState } from "react";
import "./styles.css";

export default function App() {
  const [time, settime] = useState({
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [flag, setflag] = useState(false);
  const [isrunner, setisrunner] = useState(false);
  const [timeid, settimeid] = useState(null);
  const [err, seterr] = useState({ hours: "", minutes: "", seconds: "" });

  const handleinputchange = (e) => {
    const { name, value } = e.target;
    settime(() => ({
      ...time,
      [name]: value,
    }));
  };

  const validation = (time) => {
    const { hours, minutes, seconds } = time;
    const error = {
      hours: "",
      minutes: "",
      seconds: "",
    };
    let valid = true;
    if (hours === "" || minutes === "" || seconds === "") {
      alert("Please fill the field");
      valid = false;
    }
    if (parseInt(hours) > 24) {
      error.hours = "hours must be < 24";
      valid = false;
    }
    if (parseInt(minutes) > 59) {
      error.minutes = "minutes must be < 60";
      valid = false;
    }
    if (parseInt(seconds) > 59) {
      error.seconds = "second must be < 60";
      valid = false;
    }
    seterr(error);
    return valid;
  };

  const handlestart = () => {
    const valid = validation(time);

    if (!valid) {
      return;
    }
    setflag(true);
    setisrunner(true);
  };
  const runtime = () => {
    settime(({ hours, minutes, seconds }) => {
      let h = parseInt(hours);
      let m = parseInt(minutes);
      let s = parseInt(seconds);
      s--;
      if (s < 0) {
        s = 59;
        m--;
      }
      if (m < 0) {
        m = 59;
        h--;
      }

      if (h === 0 && m === 0 && s === 0) {
        setisrunner(false);
        clearInterval(timeid);
        alert("Sale time finished");
        return {
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return { hours: h, minutes: m, seconds: s };
    });
  };

  const handletoggle = () => {
    setisrunner(!isrunner);
  };

  const handlereset = () => {
    setflag(false);
    setisrunner(false);

    settime({
      hours: "",
      minutes: "",
      seconds: "",
    });
  };

  useEffect(() => {
    let timerid;
    if (isrunner) {
      timerid = setInterval(() => {
        runtime();
      }, 1000);
      settimeid(timerid);
    } else {
      clearInterval(timeid);
    }
    return () => {
      clearInterval(timeid);
    };
  }, [isrunner]);

  return (
    <div className="App">
      {!flag ? (
        <div>
          <h1>Countdown Timer</h1>
          <input
            type="number"
            placeholder="HH"
            value={time.hours}
            name="hours"
            onChange={handleinputchange}
          />
          {err.hours ? <p>{err.hours}</p> : ""}
          <input
            type="number"
            placeholder="MM"
            value={time.minutes}
            name="minutes"
            onChange={handleinputchange}
          />
          {err.minutes ? <p>{err.minutes}</p> : ""}

          <input
            type="number"
            placeholder="SS"
            value={time.seconds}
            name="seconds"
            onChange={handleinputchange}
          />
          {err.seconds ? <p>{err.seconds}</p> : ""}

          <div className="controls">
            <button onClick={handlestart}>Start</button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Countdown Timer</h1>
          <div className="timer-display">
            <span>{time.hours < 10 ? `0${time.hours}` : time.hours}:</span>
            <span>
              {time.minutes < 10 ? `0${time.minutes}` : time.minutes}:
            </span>
            <span>{time.seconds < 10 ? `0${time.seconds}` : time.seconds}</span>
          </div>
          <div className="controls">
            <button onClick={handletoggle}>
              {isrunner ? "Pause" : "Resume"}
            </button>
            <button onClick={handlereset}>Reset</button>
          </div>
        </div>
      )}
    </div>
  );
}
