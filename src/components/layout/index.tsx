"use client";
import React from "react";

import Appbar from "./appbar";
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Appbar />
      <div className="relative top-16 float-right w-full overflow-hidden">
        {children}
      </div>
    </>
  );
};

export default Layout;
