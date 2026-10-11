"use client";

import React, { useState, useEffect } from "react";

export function CopyrightYear(): React.JSX.Element {
  const [year, setYear] = useState("2024");

  useEffect(() => {
    setYear(String(new Date().getFullYear()));
  }, []);

  return <>{year}</>;
}
