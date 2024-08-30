"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Consultations = {
  id: number;
  title: string;
  teachersName: string;
  day: number;
  timeStart: string;
  cabinet: string;
  link: string;
};

const dayOfWeekMap: { [key: number]: string } = {
  1: "Понеділок",
  2: "Вівторок",
  3: "Середа",
  4: "Четвер",
  5: "П'ятниця",
  6: "Субота",
  7: "Неділя",
};

const displayTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  if (hours && minutes) {
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  }
  return "";
};

export const columns: ColumnDef<Consultations>[] = [
  {
    accessorKey: "title",
    header: "*Назва",
  },
  {
    accessorKey: "teachersName",
    header: "Викладач",
    cell: ({ row }) => (row.original.teachersName ? row.original.teachersName : "—"),
  },
  {
    accessorKey: "day",
    header: "*День",
    cell: ({ row }) => dayOfWeekMap[row.original.day] || row.original.day,
  },
  {
    accessorKey: "timeStart",
    header: "*Початок",
    cell: ({ row }) => displayTime(row.original.timeStart),
  },
  {
    accessorKey: "cabinet",
    header: "Кабінет",
    cell: ({ row }) => (row.original.cabinet ? row.original.cabinet : "—"),
  },
  {
    accessorKey: "link",
    header: "Посилання",
    cell: ({ row }) =>
      row.original.link ? (
        <a href={row.original.link} target="_blank" rel="noopener noreferrer">
          Посилання
        </a>
      ) : (
        "—"
      ),
  },
];
