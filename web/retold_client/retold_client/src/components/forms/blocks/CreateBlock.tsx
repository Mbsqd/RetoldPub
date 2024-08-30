'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from 'react'

interface BlockData {
	title: string;
	description: string;
}

export default function CreateBlockForm() {
	const [blockData, setBlockData] = useState<BlockData>({title: "", description: ""});
	const [isCreate, setIsCreate] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setBlockData(prevState => ({ ...prevState, [name]: value }));
	};

	const handleSendBlock = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/Blocks/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				  },
				  credentials: "include",
				  body: JSON.stringify(blockData),
			});

			if(!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "Something went wrong");
			}
			setBlockData({ title: "", description: "" });
			setIsCreate(true);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<div className="w-full mx-auto">
			<form className='flex gap-5 max-w-4xl justify-center items-center px-2 mx-auto' onSubmit={handleSendBlock}>
				<div className='w-full'>
				<Card className='w-full bg-retro-black text-white rounded-lg'>
					<CardHeader>
						<CardTitle>
							<Input
							name="title"
							value={blockData.title}
							onChange={handleChange}
							placeholder="Enter title"
							maxLength={64}
							className="text-lg bg-transparent border-none"
							/>
						</CardTitle>
						<hr />
					</CardHeader>
					<CardContent>
						<Textarea
						name="description"
						value={blockData.description}
						onChange={handleChange}
						placeholder="Enter description here..."
						maxLength={256}
						className="border-none bg-transparent resize-none overflow-hidden"
						rows={3}
						/>
					</CardContent>
				</Card>
				{ isCreate && <p className='text-xl mx-auto text-green-500 pt-8'>Блок успішно створено, для відображення оновіть сторінку</p>}
			</div>
			<div className='flex flex-col gap-4'>
				<Button className='h-10 w-10 bg-retro-green hover:bg-retro-green/90 px-3 py-1' type="submit"><Image src="/ok.svg" width={21} height={21} alt='Apply'/></Button>
				<Button className='h-10 w-10 bg-retro-red hover:bg-retro-red/90 px-3 py-1' type="button" onClick={() => setBlockData({ title: "", description: "" })}><Image src="/cancel.svg" width={14} height={14} alt='Reset'/></Button>
			</div>

			</form>
		</div>
	);
}