import styles from "../styles/Header.module.css";
import animations from "../styles/Animations.module.css";
import ModeSettings from "./ModeSettings";

type Props = {
  modeSettings: { mode: string; time: number; words: number };
  handleClick: (value: { mode: string; time: number; words: number }) => void;
};

const Header = ({ modeSettings, handleClick }: Props) => {
  return (
    <header className={`${animations.slideDown}`}>
      <div className={styles.settings}>
        <img src="/yetilogo-108.svg" alt="YetiLogo" />
        <h1 className={styles.logo} title="yetitype">
          YetiType
        </h1>
      </div>
      <div className={styles.settings}>
        <ModeSettings modeSettings={modeSettings} handleClick={handleClick} />
      </div>
    </header>
  );
};

export default Header;
