"use client";

import { Lessons, columns } from "@/components/tables/schedule/Columns";
import { DataTable } from "@/components/tables/schedule/DataTable";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { CreateScheduleForm } from "@/components/tables/schedule/CreateScheduleForm";

interface ScheduleTableProps {
	blockId: number;
}

export default function ScheduleTable({ blockId }: ScheduleTableProps) {
	const [data, setData] = useState<Lessons[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);
	const [isNotFound, setIsNotFound] = useState(false);

	const fetchScheduleData = async () => {
		try {
			const response = await fetch(`/api/Blocks/${blockId}/get-schedules`, {
				method: "GET",
				credentials: "include",
			});

			const responseData = await response.text();

			if (!response.ok) {
				if (responseData == "Blocks not found") {
					setIsNotFound(true);
				} else if (responseData == "Schedules not found") {
					setError(true);
				}
				throw new Error(responseData);
			}

			const result = JSON.parse(responseData);
			setData(result);
			setError(false);
		} catch (error) {
			console.error(error);
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchScheduleData();
	}, [blockId]);

	if (loading) return <div className="mx-auto py-10">Завантаження...</div>;
	if (isNotFound) notFound();

	return (
		<div className="max-w-7xl px-2,5 mx-auto py-10 space-y-10">
			<CreateScheduleForm blockId={blockId} fetchSchedule={fetchScheduleData} />
			{error ? (
				<h3 className="flex justify-center mx-auto text-xl ml-4">Розклад не знайдено</h3>
			) : (
				<DataTable columns={columns} data={data} blockId={blockId} fetchScheduleData={fetchScheduleData} />
			)}
		</div>
	);
}
