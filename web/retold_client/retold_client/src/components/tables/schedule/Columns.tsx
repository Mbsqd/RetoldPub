"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Lessons = {
  id: number;
  blockId: number;
  typeWeek: number;
  day: number;
  timeStart: string;
  timeEnd: string;
  title: string;
  lessonType: string;
  cabinet: string;
  linkFirst: string;
  linkSecond: string;
};

const TypeWeekMap: { [key: number]: string } = {
  0: "Загальне",
  1: "Чисельник",
  2: "Знаменник",
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

export const columns: ColumnDef<Lessons>[] = [
  {
    accessorKey: "typeWeek",
    header: "Тип тижня",
    cell: ({ row }) => TypeWeekMap[row.original.typeWeek] || row.original.typeWeek,
  },
  {
    accessorKey: "day",
    header: "День",
    cell: ({ row }) => dayOfWeekMap[row.original.day] || row.original.day,
  },
  {
    accessorKey: "timeStart",
    header: "*Початок",
    cell: ({ row }) => displayTime(row.original.timeStart),
  },
  {
    accessorKey: "timeEnd",
    header: "*Завершення",
    cell: ({ row }) => displayTime(row.original.timeEnd),
  },
  {
    accessorKey: "title",
    header: "*Назва",
  },
  {
    accessorKey: "lessonType",
    header: "*Тип",
  },
  {
    accessorKey: "cabinet",
    header: "Кабінет",
    cell: ({ row }) => (row.original.cabinet ? row.original.cabinet : "—"),
  },
  {
    accessorKey: "linkFirst",
    header: "Посилання №1",
    cell: ({ row }) =>
      row.original.linkFirst ? (
        <a href={row.original.linkFirst} target="_blank" rel="noopener noreferrer">
          Посилання
        </a>
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "linkSecond",
    header: "Посилання №2",
    cell: ({ row }) =>
      row.original.linkSecond ? (
        <a href={row.original.linkSecond} target="_blank" rel="noopener noreferrer">
          Посилання
        </a>
      ) : (
        "—"
      ),
  },
];
