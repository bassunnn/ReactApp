import React, { useState, useEffect } from "react";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>/?";

function shuffleString(s) {
  const arr = s.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join("");
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const st = localStorage.getItem("pwgen_history");
    if (st) setHistory(JSON.parse(st));
  }, []);

  useEffect(() => {
    localStorage.setItem("pwgen_history", JSON.stringify(history.slice(0, 20)));
  }, [history]);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(t);
    }
  }, [copied]);

  function randomChar(str) {
    return str[Math.floor(Math.random() * str.length)];
  }

  function generate() {
    let pool = "";
    if (useLower) pool += LOWER;
    if (useUpper) pool += UPPER;
    if (useDigits) pool += DIGITS;
    if (useSymbols) pool += SYMBOLS;

    if (!pool) {
      setPassword("Выберите хотя бы один тип символов");
      return;
    }

    const mandatory = [];
    if (useLower) mandatory.push(randomChar(LOWER));
    if (useUpper) mandatory.push(randomChar(UPPER));
    if (useDigits) mandatory.push(randomChar(DIGITS));
    if (useSymbols) mandatory.push(randomChar(SYMBOLS));

    let result = "";
    for (let i = 0; i < length - mandatory.length; i++) {
      result += randomChar(pool);
    }

    result += mandatory.join("");
    result = shuffleString(result);

    setPassword(result);
    setHistory((prev) => [
      { value: result, time: new Date().toISOString() },
      ...prev,
    ]);
  }

  function copyToClipboard() {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => setCopied(true));
  }

  function clearHistory() {
    setHistory([]);
  }

  function strengthScore(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  }

  const strength = strengthScore(password);
  const labels = [
    "Очень слабый",
    "Слабый",
    "Средний",
    "Хороший",
    "Сильный",
    "Очень сильный",
  ];
  const strengthLabel = labels[Math.min(5, strength)];

  return (
    <div className="card">
      <div className="controls">
        <label>
          Длина: <strong>{length}</strong>
        </label>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />

        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={useLower}
              onChange={(e) => setUseLower(e.target.checked)}
            />{" "}
            Строчные
          </label>
          <label>
            <input
              type="checkbox"
              checked={useUpper}
              onChange={(e) => setUseUpper(e.target.checked)}
            />{" "}
            Прописные
          </label>
          <label>
            <input
              type="checkbox"
              checked={useDigits}
              onChange={(e) => setUseDigits(e.target.checked)}
            />{" "}
            Цифры
          </label>
          <label>
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
            />{" "}
            Символы
          </label>
        </div>

        <div className="actions">
          <button onClick={generate} className="btn primary">
            Сгенерировать
          </button>
          <button onClick={copyToClipboard} className="btn">
            Копировать
          </button>
        </div>
      </div>

      <div className="result">
        <input readOnly value={password} placeholder="Здесь появится пароль" />
        <div className="strength">
          Надёжность: <strong>{strengthLabel}</strong>
        </div>
      </div>

      <div className="history">
        <div className="history-header">
          <h3>История ({history.length})</h3>
          <button onClick={clearHistory} className="btn">
            Очистить
          </button>
        </div>

        <ul>
          {history.length === 0 && <li className="empty">История пуста</li>}

          {history.map((h, i) => (
            <li key={i}>
              <code>{h.value}</code>
              <small>{new Date(h.time).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </div>

      {copied && <div className="toast">Скопировано!</div>}
    </div>
  );
}