import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const daysOfWeek = {
	1: "Понеділок",
	2: "Вівторок",
	3: "Середа",
	4: "Четвер",
	5: "П'ятниця",
	6: "Субота",
	7: "Неділя",
};

const TypeWeekMap: { [key: number]: string } = {
	0: "Загальне",
	1: "Чисельник",
	2: "Знаменник",
  };

const formatTime = (time: string) => {
	const [hours, minutes] = time.split(":");
	if (hours && minutes) {
		return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
	}
	return "";
};

interface CreateScheduleProps {
	blockId: number;
	fetchSchedule: () => void;
}

export function CreateScheduleForm({ blockId, fetchSchedule }: CreateScheduleProps) {
	const [typeWeek, setTypeWeek] = React.useState<string>("0");
	const [day, setDay] = React.useState<string>("1");
	const [timeStart, setTimeStart] = React.useState<string>("");
	const [timeEnd, setTimeEnd] = React.useState<string>("");
	const [title, setTitle] = React.useState<string>("");
	const [lessonType, setLessonType] = React.useState<string>("");
	const [cabinet, setCabinet] = React.useState<string>("");
	const [linkFirst, setLinkFirst] = React.useState<string>("");
	const [linkSecond, setLinkSecond] = React.useState<string>("");

	const [errorValidation, setErrorValidation] = React.useState(false);
	const [successCreated, setSuccessCreated] = React.useState(false);

	const clearForm = () => {
		setTypeWeek("0");
		setDay("1");
		setTimeStart("");
		setTimeEnd("");
		setTitle("");
		setLessonType("");
		setCabinet("");
		setLinkFirst("");
		setLinkSecond("");
	};

	const handleClear = (e: React.FormEvent) => {
		clearForm();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!timeStart || !timeEnd || !title || !lessonType) {
			setErrorValidation(true);
			return;
		}

		const scheduleData = {
			typeWeek: parseInt(typeWeek, 10),
			day: parseInt(day, 10),
			timeStart,
			timeEnd,
			title,
			lessonType,
			cabinet,
			linkFirst,
			linkSecond,
		};
		console.log(scheduleData);

		try {
			const response = await fetch(`/api/Blocks/${blockId}/add-schedule`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					...scheduleData,
					timeStart: formatTime((scheduleData as any).timeStart),
					timeEnd: formatTime((scheduleData as any).timeEnd),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create schedule");
			}
			fetchSchedule();
			setErrorValidation(false);
			setSuccessCreated(true);
			clearForm();
		} catch (error) {
			console.error(error);
			setSuccessCreated(false);
		}
	};

	return (
		<div className='w-screen 2xl:max-w-7xl px-2.5'>
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Створити розклад</CardTitle>
				<CardDescription>Додайте нове заняття.</CardDescription>
			</CardHeader>
			<CardContent>
				<form id="createScheduleForm" onSubmit={handleSubmit}>
					<div className="flex flex-col 2xl:flex-row justify-between 2xl:items-center space-y-4 2xl:space-y-0 2xl:space-x-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="typeWeek">Тип тижня</Label>
							<Select value={typeWeek} onValueChange={setTypeWeek}>
								<SelectTrigger id="typeWeek">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(TypeWeekMap).map(([value, label]) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="day">День</Label>
							<Select value={day} onValueChange={setDay}>
								<SelectTrigger id="day">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(daysOfWeek).map(([value, label]) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="timeStart">*Початок</Label>
							<Input type="time" id="timeStart" value={timeStart} onChange={e => setTimeStart(e.target.value)} required />
						</div>

						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="timeEnd">*Завершення</Label>
							<Input type="time" id="timeEnd" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} required />
						</div>

						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="title">*Назва</Label>
							<Input id="title" maxLength={64} value={title} onChange={e => setTitle(e.target.value)} required />
						</div>

						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="lessonType">*Тип заняття</Label>
							<Input id="lessonType" maxLength={64} value={lessonType} onChange={e => setLessonType(e.target.value)} required />
						</div>

						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="cabinet">Кабінет</Label>
							<Input id="cabinet" maxLength={5} value={cabinet} onChange={e => setCabinet(e.target.value)} />
						</div>

						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="linkFirst">Посилання №1</Label>
							<Input id="linkFirst" type="url" maxLength={256} value={linkFirst} onChange={e => setLinkFirst(e.target.value)} />
						</div>

						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="linkSecond">Посилання №2</Label>
							<Input id="linkSecond" type="url" maxLength={256} value={linkSecond} onChange={e => setLinkSecond(e.target.value)} />
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex flex-col 2xl:flex-row gap-4 justify-between">
					{errorValidation && <p className="text-retro-red">Будь ласка, заповніть всі необхідні поля</p>}
					{successCreated && <p className="text-green-500">Заняття додано до таблиці</p>}

					<div className='w-full 2xl:w-fit flex flex-row justify-between 2xl:justify-end 2xl:ml-auto items-center space-x-4'>
						<Button className='w-full 2xl:w-fit' variant="outline" type="reset" onClick={handleClear}>
							Очистити
						</Button>
						<Button className='w-full 2xl:w-fit' type="submit" onClick={handleSubmit}>
							Додати
						</Button>
					</div>
			</CardFooter>
		</Card>
		</div>
	);
}
