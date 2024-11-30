import React from 'react';
import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/exercise1">Normal Range</a>
          </li>
          <li>
            <a href="/exercise2">Fixed Values Range</a>
          </li>
        </ul>
      </nav>

      {/* Centered SVG */}
      <div className={styles.logo}>
        {/* Usamos la ruta del archivo SVG dentro de public */}
        <img
          src="/assets/svg/mango-logo.svg"
          alt="Mango Logo"
          width="96"
          height="16"
        />
      </div>

      {/* Name on the right */}
      <div className={styles.name}>Fran Aragón</div>
    </header>
  );
};

export default Header;
