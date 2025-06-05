"use client";

import React from "react";
import useErrorMessageStore from "../_store/useErrorMessageStore";
import styles from "./ErrorMessage.module.css";

export default function ErrorMessage() {
  const { errorMessage } = useErrorMessageStore();

  return <div className={styles.errorMessage}>{errorMessage}</div>;
}
