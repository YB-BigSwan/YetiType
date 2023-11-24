import dynamic from "next/dynamic";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Result from "../components/Result";
import Timer from "../components/Timer";
import WordSet from "../components/WordSet";
import useLocalStorage from "../hooks/useLocalStorage";
import useTimer from "../hooks/useTimer";
import styles from "../styles/Home.module.css";
import themes from "../styles/Themes.module.css";
import wordList from "../wordlist.json";

const Snowfall = dynamic(() => import("react-snowfall"), { ssr: false });

const Home: NextPage = () => {
  const [modeSettings, setModeSettings] = useLocalStorage("modeSettings", {
    mode: "time",
    time: 15,
    words: 10,
  });
  const baseUrl = process.env.BE_SERVER_BASE_URL;
  const [theme, setTheme] = useLocalStorage("theme", "slate");
  const [typedWordList, setTypedWordList] = useState<string[]>([""]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [mistypeCount, setMistypeCount] = useState(0);
  const [testStatus, setTestStatus] = useState(0); //-1: Test end, 0: Test waiting, 1: Test running
  const [wordSet, setWordSet] = useState<string[]>([]);
  const [records, setRecords] = useState<
    {
      name: string;
      wpm: number;
    }[]
  >([]);
  const [result, setResult] = useState({
    wpm: 0,
    accuracy: 0,
    correct: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
  });
  const [time, setTimer] = useTimer(() => setTestStatus(-1));
  const wordRef = useCallback((node: HTMLDivElement) => {
    if (node === null) return;
    node.scrollIntoView({
      block: "center",
    });
  }, []);
  const main = useRef<HTMLInputElement>(null);

  const handleKeyPress = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (testStatus == 0) {
      if (modeSettings.mode === "time") setTimer(modeSettings.time);
      else setTimer(-1);
      setTestStatus(1);
    }
    const typed = event.target.value;

    if (
      typed.slice(-1) != " " &&
      typed.slice(-1) !=
        wordList[activeWordIndex].charAt(typedWordList.at(-1)?.length || 0)
    )
      setMistypeCount(mistypeCount + 1);

    setTypedWordList(typed.split(" "));
  };
  const reset = () => {
    setTypedWordList([""]);
    setActiveWordIndex(0);
    setMistypeCount(0);
    setTestStatus(0);
    setTimer(0);
    main.current ? (main.current.value = "") : null;
    main.current?.focus();
  };
  const newSet = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/wordlist`);
      if (!response.ok) {
        throw new Error("Failed to fetch wordlist");
      }

      const data = await response.json();
      // Extract only the "word" property from each object in the array
      const wordsArray = data.map((item: { word: string }) => item.word);

      setWordSet(
        wordsArray
          .sort(() => Math.random() - 0.5)
          .slice(
            0,
            modeSettings.mode === "words" ? modeSettings.words : undefined
          )
      );
      reset();
    } catch (error) {
      console.error(error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    if (typedWordList.length > wordSet.length) setTestStatus(-1);
    else setActiveWordIndex(typedWordList.length - 1);
  }, [typedWordList, wordSet]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await newSet();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [modeSettings]);

  useEffect(() => {
    if (testStatus !== -1) return;
    let correct = 0;
    let incorrect = 0;
    let extra = 0;
    let missed = 0;
    let space = 0;
    typedWordList.forEach((typedWord, i) => {
      typedWord.split("").forEach((typedChar, j) => {
        if (wordSet[i].charAt(j) === typedChar) correct++;
        else if (wordSet[i].charAt(j) === "") extra++;
        else incorrect++;
      });
      if (
        typedWord.length < wordSet[i]?.length &&
        typedWordList.length != i + 1
      )
        missed += wordSet[i].length - typedWord.length;
    });
    space = typedWordList.length - 1;
    const accuracy =
      Math.floor((correct / (correct + mistypeCount)) * 100) || 0;
    const wpm =
      accuracy >= 40 ? Math.floor((correct + space) / 5 / (time / 60)) : 0;
    setResult({
      wpm,
      accuracy,
      correct,
      incorrect,
      extra,
      missed,
    });
    setTimer(0);
  }, [testStatus]);
  useEffect(() => {
    document.body.className = `${themes.mainBody} ${themes[theme]}`;
  });

  return (
    <div>
      <Head>
        <title>YetiType</title>
        <meta
          name="description"
          content="A fork of TypeToast. Modified and used as the fronted of my backend programing final project"
        />
        <link
          rel="yetilogo-108"
          type="image/svg+xml"
          sizes="108x108"
          href="/yetilogo-108.svg"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          sizes="50x50"
          href="/yetilogo-50.svg"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="google-site-verification"
          content="XCTjZzY_AZ8tEPP-AqJQ_RBQhjGmmGqf0W-nAeZ3r0Y"
        />
      </Head>
      <div className={styles.container}>
        <Header modeSettings={modeSettings} handleClick={setModeSettings} />
        <Snowfall snowflakeCount={200} />
        <div
          className={styles.test}
          onFocus={() => main.current?.focus()}
          tabIndex={1}
        >
          {testStatus == -1 && (
            <Result
              wpm={result.wpm}
              accuracy={result.accuracy}
              correct={result.correct}
              incorrect={result.incorrect}
              extra={result.extra}
              missed={result.missed}
              handleNewSet={newSet}
              handleRetrySet={reset}
            />
          )}

          {testStatus != -1 && (
            <div title="typing test">
              <input
                className={styles.input}
                ref={main}
                onChange={handleKeyPress}
                autoFocus
                autoCapitalize="off"
              ></input>
              <Timer timeLeft={Math.floor(time)} />
              <WordSet
                wordList={wordSet.slice(0, activeWordIndex + 50)}
                typedWordList={typedWordList}
                activeWordIndex={activeWordIndex}
                wordRef={wordRef}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;
