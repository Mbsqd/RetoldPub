import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Card } from "@/components/ui/card";

interface DataTableProps<
	TData extends { id: number; title: string; teachersName: string; day: number; timeStart: string; cabinet: string; link: string },
	TValue
> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	blockId: number;
	fetchConsultations: () => void;
}

const daysOfWeek = {
	1: "Понеділок",
	2: "Вівторок",
	3: "Середа",
	4: "Четвер",
	5: "П'ятниця",
	6: "Субота",
	7: "Неділя",
};

const formatTime = (time: string | undefined) => {
	if (!time) return ""; // Возвращаем пустую строку, если time является undefined

	const [hours, minutes] = time.split(":");
	if (hours && minutes) {
		return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
	}
	return "";
};

export function DataTable<
	TData extends { id: number; title: string; teachersName: string; day: number; timeStart: string; cabinet: string; link: string },
	TValue
>({ columns, data, blockId, fetchConsultations: fetchScheduleData }: DataTableProps<TData, TValue>) {
	const [tableData, setTableData] = useState(data);
	const [editingRowId, setEditingRowId] = useState<number | null>(null);
	const [editedRowData, setEditedRowData] = useState<TData | null>(null);
	const [isBadEdit, setIsBadEdit] = useState(false);

	// Сортируем данные перед установкой в состояние
	useEffect(() => {
		const sortedData = [...data].sort((a, b) => {
			// Сортировка по дню недели (Понедельник сначала, Воскресенье потом)
			if (a.day !== b.day) {
				return a.day - b.day;
			}
			// Сортировка по времени (раньше время выше)
			return a.timeStart.localeCompare(b.timeStart);
		});
		setTableData(sortedData);
	}, [data]);

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(`/api/Blocks/${blockId}/delete-consultation`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ id }),
			});

			if (!response.ok) {
				throw new Error("Failed to delete consultation");
			}
			setTableData(tableData.filter(item => item.id !== id));
		} catch (error) {
			console.error(error);
		}
	};

	const handleEdit = async () => {
		if (!editedRowData) return;

		try {
			const response = await fetch(`/api/Blocks/${blockId}/update-consultation`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					...editedRowData,
					timeStart: formatTime((editedRowData as any).timeStart),
				}),
			});

			if (!response.ok) {
				if (response.status == 400) {
					setIsBadEdit(true);
				}
				throw new Error("Failed to update schedule");
			}

			setIsBadEdit(false);

			setTableData(prevData =>
				prevData.map(item =>
					item.id === editedRowData.id
						? {
								...item,
								...editedRowData,
								timeStart: formatTime((editedRowData as any).timeStart),
								timeEnd: formatTime((editedRowData as any).timeEnd),
						  }
						: item
				)
			);

			setEditingRowId(null); // Exit edit mode
		} catch (error) {
			console.error(error);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof TData) => {
		if (editedRowData) {
			let value = e.target.value;
			if (field === "title" && value.length > 64) value = value.slice(0, 64);
			if (field === "teachersName" && value.length > 64) value = value.slice(0, 64);
			if (field === "cabinet" && value.length > 5) value = value.slice(0, 5);
			if (field === "link" && value.length > 256) value = value.slice(0, 256);

			setEditedRowData({
				...editedRowData,
				[field]: e.target.value,
			});
		}
	};

	const handleSelectChange = (value: string, field: keyof TData) => {
		const parsedValue = field === "typeWeek" ? value === "true" : Number(value);
		if (editedRowData) {
			setEditedRowData({
				...editedRowData,
				[field]: parsedValue,
			});
		}
	};

	return (
		<>
			{isBadEdit && <div className="p-4 mb-4 text-red-600 bg-red-100 border border-red-300 rounded">Будь ласка, заповніть всі необхідні поля</div>}
			<div className="w-screen 2xl:max-w-7xl">
				<div className="px-2.5">
					<Card className="rounded-md border">
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map(headerGroup => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map(header => (
											<TableHead key={header.id}>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map(row => (
										<TableRow key={row.id}>
											{row.getVisibleCells().map(cell => {
												const field = cell.column.id as keyof TData;
												return (
													<TableCell key={cell.id} className="relative">
														{editingRowId === row.original.id ? (
															field === "day" ? (
																<Select value={(editedRowData as any)[field].toString()} onValueChange={value => handleSelectChange(value, field)}>
																	<SelectTrigger>
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		{Object.entries(daysOfWeek).map(([key, value]) => (
																			<SelectItem key={key} value={key}>
																				{value}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															) : field === "timeStart" ? (
																<Input type="time" value={(editedRowData as any)[field]?.slice(0, 5) || ""} onChange={e => handleChange(e, field)} />
															) : (
																<Input
																	value={(editedRowData as any)[field] || ""}
																	onChange={e => handleChange(e, field)}
																	maxLength={
																		field === "title"
																			? 64
																			: field === "teachersName"
																			? 64
																			: field === "cabinet"
																			? 5
																			: field === "link"
																			? 256
																			: undefined
																	}
																/>
															)
														) : (
															flexRender(cell.column.columnDef.cell, cell.getContext())
														)}
													</TableCell>
												);
											})}
											<TableCell key={`actions-${row.id}`} className="flex justify-between">
												{editingRowId === row.original.id ? (
													<div className="flex py-3">
														<button className="text-blue-500 hover:text-blue-700 mr-2 min-w-4" onClick={handleEdit}>
															<Image src="/save-ico.svg" width="0" height="0" style={{ width: "15px", height: "auto" }} alt="Save" />
														</button>

														<button
															className="text-blue-500 hover:text-blue-700 min-w-4"
															onClick={() => {
																setEditingRowId(null);
																setEditedRowData(null);
															}}
														>
															<Image src="/cancel.svg" width="0" height="0" style={{ width: "15px", height: "auto" }} alt="Cancel" />
														</button>
													</div>
												) : (
													<div className="flex py-3">
														<button
															className="text-blue-500 hover:text-blue-700 mr-2 min-w-4"
															onClick={() => {
																setEditingRowId(row.original.id);
																setEditedRowData(row.original);
																setIsBadEdit(false);
															}}
														>
															<Image src="/edit.svg" width="0" height="0" style={{ width: "15px", height: "auto" }} alt="Edit" />
														</button>

														<button className="text-red-500 hover:text-red-700 min-w-4" onClick={() => handleDelete(row.original.id)}>
															<Image src="/delete.svg" width="0" height="0" style={{ width: "15px", height: "auto" }} alt="Delete" />
														</button>
													</div>
												)}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columns.length}>No results.</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</Card>
				</div>
			</div>
		</>
	);
}
