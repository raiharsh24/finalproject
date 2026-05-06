import React from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Toast from "./Toast";

export default function Layout({
  children,
}) {
  return (
    <div
      className="
        flex
        h-screen
        overflow-hidden
        bg-gradient-to-br
        from-slate-50
        via-[#f8fafc]
        to-slate-100
      "
    >

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN AREA */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* NAVBAR */}

        <Navbar />

        {/* CONTENT */}

        <main
          className="
            flex-1
            overflow-y-auto
            px-8
            py-7
          "
        >

          <div
            className="
              max-w-[1700px]
              mx-auto
              space-y-6
            "
          >

            {children}

          </div>

        </main>

        {/* TOAST */}

        <Toast />

      </div>

    </div>
  );
}