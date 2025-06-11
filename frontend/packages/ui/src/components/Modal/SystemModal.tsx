"use client";

import React from "react";
import styles from "./SystemModal.module.css";
import { useSystemModalStore } from "../../store/useSystemModalStore";
import clsx from "clsx";

export default function SystemModal() {
  const { config, close } = useSystemModalStore();
  if (!config.isOpen) return null;

  const handleConfirm = () => {
    config.onConfirm?.();
    close();
  };

  const handleCancel = () => {
    config.onCancel?.();
    close();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {config.title && <h2 className={styles.title}>{config.title}</h2>}
        {config.message && <p className={styles.message}>{config.message}</p>}
        <div className={styles.buttonGroup}>
          {config.showCancel && (
            <button
              className={clsx(styles.button, styles.cancel)}
              onClick={handleCancel}
            >
              {config.cancelText}
            </button>
          )}
          <button
            className={clsx(styles.button, styles.confirm)}
            onClick={handleConfirm}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
