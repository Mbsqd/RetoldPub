"use client";

import { Consultations, columns } from "@/components/tables/consultation/Columns";
import { DataTable } from "@/components/tables/consultation/DataTable";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { CreateConsultationForm } from '@/components/tables/consultation/CreateConsultationForm'

interface ConsultationTableProps {
	blockId: number;
}

export default function ConsultationTable({ blockId }: ConsultationTableProps) {
	const [data, setData] = useState<Consultations[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);
	const [isNotFound, setIsNotFound] = useState(false);

	const fetchConsultationData = async () => {
		try {
			const response = await fetch(`/api/Blocks/${blockId}/get-consultations`, {
				method: "GET",
				credentials: "include",
			});

			const responseData = await response.text();

			if (!response.ok) {
				if (responseData == "Blocks not found") {
					setIsNotFound(true);
				} else if (responseData == "Consultations not found") {
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
		fetchConsultationData();
	}, [blockId]);

	if (loading) return <div className="mx-auto py-10">Завантаження...</div>;
	if (isNotFound) notFound();

	return (
		<div className="max-w-7xl px-2,5 mx-auto py-10 space-y-10">
			<CreateConsultationForm blockId={blockId} fetchConsultations={fetchConsultationData} />
			{error ? (
				<h3 className="flex justify-center mx-auto text-xl ml-4">Консультації не знайдено</h3>
			) : (
				<DataTable columns={columns} data={data} blockId={blockId} fetchConsultations={fetchConsultationData} />
			)}
		</div>
	);
}
