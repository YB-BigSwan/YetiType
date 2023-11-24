import { MouseEventHandler, useState } from "react";
import styles from "../styles/Result.module.css";
import animations from "../styles/Animations.module.css";
import Button from "./Button";

type Props = {
  wpm: number;
  accuracy: number;
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  handleNewSet: MouseEventHandler;
  handleRetrySet: MouseEventHandler;
};

const Result = ({
  wpm,
  accuracy,
  correct,
  incorrect,
  extra,
  missed,
  handleNewSet,
  handleRetrySet,
}: Props) => {
  const [name, setName] = useState("");
  return (
    <div className="wordwrapper">
      <div className={styles.result}>
        <div className={styles.stats}>
          <div className={`${styles.mainStats} ${animations.slideRight}`}>
            <h2 title="wpm">WPM: {wpm > 0 ? wpm : "invalid"}</h2>
            <h2>Accuracy: {accuracy}%</h2>
          </div>
          <div className={`${styles.charStats} ${animations.slideLeft}`}>
            <p>Characters:</p>
            <div>{correct} correct</div>
            <div>{incorrect} incorrect</div>
            <div>{extra} extra</div>
            <div>{missed} missed</div>
          </div>
        </div>
        <div className={`${styles.buttons} ${animations.slideUp}`}>
          <Button text="New Set" variant="set" handleClick={handleNewSet} />
          <Button text="Retry Set" variant="set" handleClick={handleRetrySet} />
        </div>
      </div>
    </div>
  );
};

export default Result;
