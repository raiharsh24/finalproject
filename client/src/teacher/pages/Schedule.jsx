import React, {
  useEffect,
  useState,
} from "react";

import Modal from "../components/Modal";
import Button from "../components/Button";

import { toast } from "../components/Toast";

import {
  Plus,
  Trash2,
} from "lucide-react";

/* ================= INITIAL ================= */

const initialClasses = [
  {
    id: 1,
    subject: "Math Class",
    day: "Mon",
    start: "09:00",
    end: "10:00",
    color: "bg-blue-500",
  },

  {
    id: 2,
    subject: "Physics Lab",
    day: "Tue",
    start: "11:00",
    end: "12:00",
    color: "bg-green-500",
  },

  {
    id: 3,
    subject: "Biology",
    day: "Wed",
    start: "09:00",
    end: "10:00",
    color: "bg-purple-500",
  },

  {
    id: 4,
    subject: "CS Workshop",
    day: "Thu",
    start: "14:00",
    end: "15:00",
    color: "bg-orange-500",
  },

  {
    id: 5,
    subject: "History Review",
    day: "Fri",
    start: "10:00",
    end: "11:00",
    color: "bg-red-500",
  },
];

const days = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

const hours = Array.from(
  { length: 10 },
  (_, i) => 8 + i
);

export default function Schedule() {
  const [classes,
    setClasses] =
    useState([]);

  const [modalOpen,
    setModalOpen] =
    useState(false);

  const [form,
    setForm] =
    useState({
      subject: "",
      day: "Mon",
      start: "09:00",
      end: "10:00",
      color: "bg-blue-500",
    });

  /* ================= LOAD ================= */

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "teacher_schedule"
      );

    if (saved) {
      setClasses(
        JSON.parse(saved)
      );
    } else {
      setClasses(
        initialClasses
      );
    }
  }, []);

  /* ================= SAVE ================= */

  useEffect(() => {
    if (
      classes.length > 0
    ) {
      localStorage.setItem(
        "teacher_schedule",
        JSON.stringify(
          classes
        )
      );
    }
  }, [classes]);

  /* ================= MODAL ================= */

  const openModal =
    () => {
      setForm({
        subject: "",
        day: "Mon",
        start: "09:00",
        end: "10:00",
        color:
          "bg-blue-500",
      });

      setModalOpen(true);
    };

  /* ================= SAVE CLASS ================= */

  const handleSave =
    () => {
      if (
        !form.subject
      ) {
        toast(
          "Subject required"
        );
        return;
      }

      const newClass = {
        ...form,
        id: Date.now(),
      };

      setClasses((prev) => [
        ...prev,
        newClass,
      ]);

      setModalOpen(false);

      toast(
        "Class scheduled"
      );
    };

  /* ================= DELETE ================= */

  const handleDelete =
    (id) => {
      const confirmed =
        window.confirm(
          "Delete this class?"
        );

      if (!confirmed)
        return;

      setClasses((prev) =>
        prev.filter(
          (c) =>
            c.id !== id
        )
      );

      toast(
        "Class removed"
      );
    };

  /* ================= CELL ================= */

  const getCellClasses =
    (day, hour) => {
      const startStr = `${hour
        .toString()
        .padStart(
          2,
          "0"
        )}:00`;

      const cls =
        classes.find(
          (c) =>
            c.day === day &&
            c.start ===
              startStr
        );

      if (cls) {
        const span =
          parseInt(
            cls.end
          ) -
          parseInt(
            cls.start
          );

        return (
          <div
            className={`${cls.color} text-white rounded-md absolute inset-0 p-1 text-xs shadow flex flex-col justify-between`}
            style={{
              height: `${span * 100}%`,
              zIndex: 10,
            }}
          >

            <div>

              <p className="font-semibold truncate">
                {cls.subject}
              </p>

              <p className="text-[10px] opacity-90">
                {cls.start} -{" "}
                {cls.end}
              </p>

            </div>

            <button
              onClick={() =>
                handleDelete(
                  cls.id
                )
              }
              className="self-end hover:opacity-80"
            >

              <Trash2 className="w-3 h-3" />

            </button>

          </div>
        );
      }

      return null;
    };

  /* ================= UPCOMING ================= */

  const upcoming =
    [...classes].slice(
      0,
      4
    );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-semibold">
            Schedule
          </h1>

          <p className="text-gray-500 mt-1">
            Manage upcoming
            classes and
            sessions
          </p>

        </div>

        <Button
          variant="primary"
          onClick={
            openModal
          }
        >

          <Plus className="w-4 h-4 mr-1" />

          Add Class

        </Button>

      </div>

      {/* UPCOMING */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {upcoming.map(
          (item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow border p-4"
            >

              <div
                className={`w-3 h-3 rounded-full ${item.color} mb-3`}
              />

              <h3 className="font-semibold text-gray-800">
                {item.subject}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {item.day} •{" "}
                {item.start}
              </p>

            </div>
          )
        )}

      </div>

      {/* TABLE */}

      <div className="overflow-auto bg-white rounded-xl shadow border">

        <table className="border-collapse w-full min-w-max">

          <thead>

            <tr>

              <th className="border border-gray-200 w-16 bg-gray-50" />

              {days.map(
                (d) => (
                  <th
                    key={d}
                    className="border border-gray-200 text-center py-3 bg-gray-50 font-medium"
                  >
                    {d}
                  </th>
                )
              )}

            </tr>

          </thead>

          <tbody>

            {hours.map(
              (h) => (
                <tr
                  key={h}
                  className="relative"
                  style={{
                    height:
                      "70px",
                  }}
                >

                  <td className="border border-gray-200 text-center text-sm font-medium text-gray-600">

                    {h}:00

                  </td>

                  {days.map(
                    (d) => (
                      <td
                        key={d}
                        className="border border-gray-200 relative"
                      >

                        {getCellClasses(
                          d,
                          h
                        )}

                      </td>
                    )
                  )}

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      <Modal
        isOpen={
          modalOpen
        }
        onClose={() =>
          setModalOpen(
            false
          )
        }
      >

        <h2 className="text-2xl font-semibold mb-5">
          Add Class
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            placeholder="Subject"
            value={
              form.subject
            }
            onChange={(e) =>
              setForm({
                ...form,
                subject:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-3"
          />

          <select
            value={
              form.day
            }
            onChange={(e) =>
              setForm({
                ...form,
                day:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-3"
          >

            {days.map(
              (d) => (
                <option
                  key={d}
                >
                  {d}
                </option>
              )
            )}

          </select>

          <input
            type="time"
            value={
              form.start
            }
            onChange={(e) =>
              setForm({
                ...form,
                start:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-3"
          />

          <input
            type="time"
            value={
              form.end
            }
            onChange={(e) =>
              setForm({
                ...form,
                end:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-3"
          />

          <select
            value={
              form.color
            }
            onChange={(e) =>
              setForm({
                ...form,
                color:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-3 md:col-span-2"
          >

            <option value="bg-blue-500">
              Blue
            </option>

            <option value="bg-green-500">
              Green
            </option>

            <option value="bg-purple-500">
              Purple
            </option>

            <option value="bg-orange-500">
              Orange
            </option>

            <option value="bg-red-500">
              Red
            </option>

          </select>

        </div>

        <div className="flex justify-end mt-6 gap-3">

          <Button
            variant="secondary"
            onClick={() =>
              setModalOpen(
                false
              )
            }
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={
              handleSave
            }
          >
            Save
          </Button>

        </div>

      </Modal>

    </div>
  );
}