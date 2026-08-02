import React from "react";
/**
 * ---- DATA ----
 * One row per time slot. Each row has a `time` label and an entry
 * for every day. Each entry has:
 *   - text: what's displayed in the cell ("" for a blank/empty cell)
 *   - type: "class" | "lunch" | "empty"  (drives the background color)
 *
 * Phase 2 hook: each row also carries `start` / `end` (24hr "HH:MM")
 * so a future "current class" checker can compare against Date.now().
 */
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
      Monday: { text: "", type: "empty" },
      Tuesday: { text: "", type: "empty" },
      Wednesday: { text: "Community B-222", type: "class" },
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
      Wednesday: { text: "Nand B-220", type: "class" },
      Thursday: { text: "DBMS D-203", type: "class" },
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
      Thursday: { text: "DBMS D-203", type: "class" },
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
      Wednesday: { text: "DSA B-220", type: "class" },
      Thursday: { text: "Lunch", type: "lunch" },
      Friday: { text: "", type: "empty" },
    },
  },
  {
    time: "1:30-2:20",
    start: "13:30",
    end: "14:20",
    days: {
      Monday: { text: "Verbal B-220", type: "class" },
      Tuesday: { text: "", type: "empty" },
      Wednesday: { text: "", type: "empty" },
      Thursday: { text: "DBMS B-220", type: "class" },
      Friday: { text: "", type: "empty" },
    },
  },
  {
    time: "2:20-3:10",
    start: "14:20",
    end: "15:10",
    days: {
      Monday: { text: "DSA D-201", type: "class" },
      Tuesday: { text: "DBMS B-220", type: "class" },
      Wednesday: { text: "Coding B-220", type: "class" },
      Thursday: { text: "", type: "empty" },
      Friday: { text: "WebDev B-220", type: "class" },
    },
  },
  {
    time: "3:10-4:00",
    start: "15:10",
    end: "16:00",
    days: {
      Monday: { text: "DSA D-201", type: "class" },
      Tuesday: { text: "Verbal B-208", type: "class" },
      Wednesday: { text: "Coding B-220", type: "class" },
      Thursday: { text: "DSA B-220", type: "class" },
      Friday: { text: "Nand B-220", type: "class" },
    },
  },
];

// Background color per cell type — matches the screenshot's palette.
const TYPE_STYLES = {
  class: "bg-blue-100",
  lunch: "bg-neutral-300",
  empty: "bg-green-200",
};

function Cell({ entry }) {
  return (
    <td
      className={`border border-black px-2 py-3 text-center align-middle text-sm sm:text-base ${TYPE_STYLES[entry.type]}`}
    >
      {entry.text}
    </td>
  );
}

export default function Timetable() {
  return (
    <div className="w-full overflow-x-auto p-4">
      <table className="min-w-[800px] w-full border-collapse border-2 border-black">
        <thead>
          <tr>
            <th
              colSpan={DAYS.length + 1}
              className="border border-black bg-blue-100 px-2 py-3 text-xl sm:text-2xl font-semibold"
            >
              Time Table - AI/ML [Sec-D]
            </th>
          </tr>
          <tr>
            <th className="border border-black bg-blue-100 px-2 py-3 text-base sm:text-lg font-semibold w-32">
              Time
            </th>
            {DAYS.map((day) => (
              <th
                key={day}
                className="border border-black bg-blue-100 px-2 py-3 text-base sm:text-lg font-semibold"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIMETABLE_DATA.map((row) => (
            <tr key={row.time}>
              <th className="border border-black bg-blue-100 px-2 py-3 text-base sm:text-lg font-semibold whitespace-nowrap">
                {row.time}
              </th>
              {DAYS.map((day) => (
                <Cell key={day} entry={row.days[day]} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}