import React from "react";

import styles from "./Input.module.scss";

type Props = {
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input: React.FC<Props> = ({ value, handleChange }) => {
  return (
    <input
      type="text"
      placeholder="Søk arter"
      onChange={handleChange}
      value={value}
      className={styles.input}
      aria-label="Søk arter"
    />
  );
};