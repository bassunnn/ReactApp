import React from "react";
import PasswordGenerator from "./components/PasswordGenerator";

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Генератор паролей</h1>
        <p className="subtitle">
          Надёжные случайные пароли с гибкими настройками
        </p>
      </header>

      <main className="app-main">
        <PasswordGenerator />
      </main>

      <footer className="app-footer">
        <small>Контрольная работа — Генератор паролей</small>
      </footer>
    </div>
  );
}