import React from "react";
import styles from "./Header.module.css";
import { FaArrowLeft, FaArrowRotateLeft } from "react-icons/fa6";
import { RefetchFunction } from "../../store/useHeaderStore";

interface HeaderProps {
  title: string;
  onBack?: boolean;
  onRefresh?: RefetchFunction;
}

export default function Header({ title, onBack, onRefresh }: HeaderProps) {
  const handleBackButtonClick = () => {
    history.back();
  };

  return (
    <header className={styles.fixedHeaderContainer}>
      <div className={styles.headerContent}>
        {onBack ? (
          <button onClick={handleBackButtonClick} className={styles.backButton}>
            <FaArrowLeft size={24} />
          </button>
        ) : (
          <div className={styles.placeholder} />
        )}
        <h1 className={styles.title}>{title}</h1>
        {onRefresh ? (
          <button onClick={() => onRefresh()} className={styles.refreshButton}>
            <FaArrowRotateLeft size={24} />
          </button>
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
    </header>
  );
}
