import React, { useState, useEffect, useLayoutEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TIMETABLE_DATA = [
  {
    time: "9:10-10:00",
    start: "09:10",
    end: "10:00",
    days: {
      Monday: { text: "WebDev B-220", type: "class" },
      Tuesday: { text: "Nand B-220", type: "class" },
      Wednesday: { text: "WebDev B-205", type: "class" },
      Thursday: { text: "Nand B-220", type: "class" },
      Friday: { text: "Coding B-220", type: "class" },
    },
  },
  {
    time: "10:05-10:55",
    start: "10:05",
    end: "10:55",
    days: {
      Monday: { text: "ML  B-220", type: "class" },
      Tuesday: { text: "ML  B-209", type: "class" },
      Wednesday: { text: "Nand B-311", type: "class" },
      Thursday: { text: "Nand B-220", type: "class" },
      Friday: { text: "Coding B-220", type: "class" },
    },
  },
  {
    time: "11:00-11:50",
    start: "11:00",
    end: "11:50",
    days: {
      Monday: { text: "WebDev B-318", type: "class" },
      Tuesday: { text: "", type: "empty" },
      Wednesday: { text: "Community B-220", type: "class" },
      Thursday: { text: "DBMS B-517", type: "class" },
      Friday: { text: "DBMS B-220", type: "class" },
    },
  },
  {
    time: "11:50-12:40",
    start: "11:50",
    end: "12:40",
    days: {
      Monday: { text: "WebDev B-318", type: "class" },
      Tuesday: { text: "DSA B-018", type: "class" },
      Wednesday: { text: "Lunch", type: "lunch" },
      Thursday: { text: "DBMS B-517", type: "class" },
      Friday: { text: "Lunch", type: "lunch" },
    },
  },
  {
    time: "12:40-1:30",
    start: "12:40",
    end: "13:30",
    days: {
      Monday: { text: "Lunch", type: "lunch" },
      Tuesday: { text: "Lunch", type: "lunch" },
      Wednesday: { text: "Verbal B-220", type: "class" },
      Thursday: { text: "Lunch", type: "lunch" },
      Friday: { text: "ML  B-220", type: "class" },
    },
  },
  {
    time: "1:30-2:20",
    start: "13:30",
    end: "14:20",
    days: {
      Monday: { text: "Verbal B-220", type: "class" },
      Tuesday: { text: "", type: "empty" },
      Wednesday: { text: "ML  B-116", type: "class" },
      Thursday: { text: "DBMS B-220", type: "class" },
      Friday: { text: "ML  B-220", type: "class" },
    },
  },
  {
    time: "2:20-3:10",
    start: "14:20",
    end: "15:10",
    days: {
      Monday: { text: "DSA B-504", type: "class" },
      Tuesday: { text: "Coding B-119", type: "class" },
      Wednesday: { text: "DSA B-220", type: "class" },
      Thursday: { text: "", type: "empty" },
      Friday: { text: "WebDev B-220", type: "class" },
    },
  },
  {
    time: "3:10-4:00",
    start: "15:10",
    end: "16:00",
    days: {
      Monday: { text: "DSA B-504", type: "class" },
      Tuesday: { text: "Coding B-119", type: "class" },
      Wednesday: { text: "DBMS B-220", type: "class" },
      Thursday: { text: "DSA B-220", type: "class" },
      Friday: { text: "Nand B-220", type: "class" },
    },
  },
];

// ============================================================================
// THEME COLORS — every color for BOTH modes (page, table, text, borders,
// toggle button) lives in this one object. Search "CHANGE COLOR HERE" to
// find each one. Values are plain CSS colors (hex, rgb(), etc.).
// ============================================================================
const THEMES = {
  // ---------------------------- LIGHT MODE ----------------------------
  light: {
    // CHANGE COLOR HERE: Light mode page background (area around/below the table)
    page: "#ffffff",
    // CHANGE COLOR HERE: Light mode table header cells ("Time Table", day names, time column)
    header: "#dbeafe", // = Tailwind bg-blue-100
    // CHANGE COLOR HERE: Light mode "class" cell background
    class: "#dbeafe", // = Tailwind bg-blue-100
    // CHANGE COLOR HERE: Light mode "lunch" cell background
    lunch: "#d4d4d4", // = Tailwind bg-neutral-300
    // CHANGE COLOR HERE: Light mode "empty" cell background
    empty: "#bbf7d0", // = Tailwind bg-green-200
    // CHANGE COLOR HERE: Light mode text color
    text: "#000000",
    // CHANGE COLOR HERE: Light mode table borders
    border: "#000000",
    // CHANGE COLOR HERE: Light mode toggle button background
    buttonBg: "#dbeafe",
    // CHANGE COLOR HERE: Light mode toggle button text
    buttonText: "#000000",
    // CHANGE COLOR HERE: Light mode toggle button border
    buttonBorder: "#000000",
  },

  // ------------------------- AMOLED DARK MODE -------------------------
  dark: {
    // CHANGE COLOR HERE: Dark mode page background (true black for AMOLED)
    page: "#000000",
    // CHANGE COLOR HERE: Dark mode table header cells ("Time Table", day names, time column)
    header: "#000000",
    // CHANGE COLOR HERE: Dark mode "class" cell background
    class: "#000000",
    // CHANGE COLOR HERE: Dark mode "lunch" cell background (dark brown/orange)
    lunch: "#4a2c0f",
    // CHANGE COLOR HERE: Dark mode "empty" cell background
    empty: "#2E4E53",
    // CHANGE COLOR HERE: Dark mode text color (off-white)
    text: "#f5f5f5",
    // CHANGE COLOR HERE: Dark mode table borders (dark gray)
    border: "#3a3a3a",
    // CHANGE COLOR HERE: Dark mode toggle button background
    buttonBg: "#000000",
    // CHANGE COLOR HERE: Dark mode toggle button text
    buttonText: "#f5f5f5",
    // CHANGE COLOR HERE: Dark mode toggle button border
    buttonBorder: "#3a3a3a",
  },
};

const THEME_STORAGE_KEY = "timetable-theme";

// Reads the saved theme; falls back to light if nothing is saved
// or localStorage is unavailable (private mode, blocked storage, etc.).
function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) {
    // ignore — just use the default
  }
  return "light";
}

// "HH:MM" -> minutes since midnight, for easy numeric comparison.
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Figures out which (day, row) is "now", based on the real system clock.
 * Returns { day, time } of the active row, or null if nothing is active
 * (weekend, or outside 9:10–4:00).
 */
function getActiveSlot(now) {
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  if (!DAYS.includes(dayName)) return null; // weekend

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const activeRow = TIMETABLE_DATA.find(
    (row) => nowMinutes >= toMinutes(row.start) && nowMinutes < toMinutes(row.end)
  );
  if (!activeRow) return null; // outside 9:10–4:00, or in an unlisted gap

  return { day: dayName, time: activeRow.time };
}

function Cell({ entry, isActive, palette }) {
  return (
    <td
      // The active-cell red border below is intentionally NOT theme-based,
      // so it looks the same in light and dark mode.
      className={`border px-2 py-3 text-center align-middle text-sm sm:text-base transition-colors ${
        isActive ? "border-4 border-red-600 relative z-10" : ""
      }`}
      style={{
        // Cell background comes from THEMES[...].class / .lunch / .empty above
        backgroundColor: palette[entry.type],
        color: palette.text,
        // Only set the border color on non-active cells, so the red border wins
        ...(isActive ? {} : { borderColor: palette.border }),
      }}
    >
      {entry.text}
    </td>
  );
}

export default function Timetable() {
  const [now, setNow] = useState(new Date());
  const [theme, setTheme] = useState(getInitialTheme);

  // Re-check the clock every 30s — plenty granular for a class schedule,
  // no need to re-render every second.
  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Paint the page background on <html>, <body> and #root (so no white edges
  // show anywhere) and save the theme to localStorage so it persists on reload.
  useLayoutEffect(() => {
    // CHANGE COLOR HERE: page background comes from THEMES[...].page above
    const bg = THEMES[theme].page;

    [document.documentElement, document.body, document.getElementById("root")].forEach(
      (el) => {
        if (el) {
          el.style.backgroundColor = bg;
          el.style.colorScheme = theme; // also darkens scrollbars
        }
      }
    );

    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // ignore — theme just won't persist
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const palette = THEMES[theme];
  const activeSlot = getActiveSlot(now);

  // Shared inline style for all header cells (Time Table / Time / day names / time column)
  const headerStyle = {
    backgroundColor: palette.header, // CHANGE COLOR HERE: header bg (edit in THEMES above)
    color: palette.text,
    borderColor: palette.border,
  };

  return (
    <div
      // min-h-screen makes the wrapper fill the full window height, so no
      // white strip appears below the table.
      className="w-full min-h-screen overflow-x-auto p-4"
      // CHANGE COLOR HERE: page background (edit THEMES[...].page above)
      style={{ backgroundColor: palette.page }}
    >
      {/* Theme toggle */}

      <table
        className="min-w-[800px] w-full border-collapse border-2"
        // CHANGE COLOR HERE: outer table border (edit THEMES[...].border above)
        style={{ borderColor: palette.border }}
      >
        <thead>
          <tr>
            <th
              colSpan={DAYS.length + 1}
              className="border px-2 py-3 text-xl sm:text-2xl font-semibold"
              style={headerStyle}
            >
              Time Table
            </th>
          </tr>
          <tr>
            <th
              className="border px-2 py-3 text-base sm:text-lg font-semibold w-32"
              style={headerStyle}
            >
              Time
            </th>
            {DAYS.map((day) => (
              <th
                key={day}
                className="border px-2 py-3 text-base sm:text-lg font-semibold"
                style={headerStyle}
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIMETABLE_DATA.map((row) => (
            <tr key={row.time}>
              <th
                className="border px-2 py-3 text-base sm:text-lg font-semibold whitespace-nowrap"
                style={headerStyle}
              >
                {row.time}
              </th>
              {DAYS.map((day) => (
                <Cell
                  key={day}
                  entry={row.days[day]}
                  palette={palette}
                  isActive={
                    activeSlot !== null &&
                    activeSlot.day === day &&
                    activeSlot.time === row.time
                  }
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="rounded-md border px-3 py-1.5 text-sm font-medium cursor-pointer"
          style={{
            // CHANGE COLOR HERE: toggle button colors (edit in THEMES above)
            backgroundColor: palette.buttonBg,
            color: palette.buttonText,
            borderColor: palette.buttonBorder,
          }}
        >
          {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
        </button>
      </div>
      <Analytics />
    </div>
  );
}