import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface BlockData {
	id: number;
	title: string;
	description: string;
	onDelete: () => void;
	onUpdate: () => void;
}

export const BlockItem: React.FC<BlockData> = ( { id, title, description, onDelete, onUpdate } ) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editableTitle, setEditableTitle] = useState(title);
	const [editableDescription, setEditableDescription] = useState(description);

	const handleEditClick = () => {
		setIsEditing(true);
	}

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditableTitle(e.target.value);
	}

	const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditableDescription(e.target.value);
	}

	const handleSaveChanges = async () => {
		try {
			const titleResponse = await fetch(`/api/Blocks/update-title/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", 
				body: JSON.stringify({newTitle: editableTitle}), 
			});

			if(!titleResponse.ok) {
				const errorData = await titleResponse.text();
				throw new Error(errorData || "Failed to update title");
			}

            const descriptionResponse = await fetch(`/api/Blocks/update-description/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ newDescription: editableDescription }),
            });

			if (!descriptionResponse.ok) {
                const errorData = await descriptionResponse.text();
                throw new Error(errorData || "Failed to update description");
            }

			setIsEditing(false);
			onUpdate();
		} catch (error) {
			console.error(error); 
		} 
	}; 

	return (
		<div className="w-full mx-auto">
			<form className='flex flex-col gap-5 max-w-4xl justify-center items-center px-2 mx-auto' action="">
			<Card className='w-full bg-retro-black text-white rounded-lg'>
				<CardHeader>
					{isEditing ? (
						<Input
							name="title"
							value={editableTitle}
							onChange={handleTitleChange}
							maxLength={64}
							className="text-lg bg-transparent border-none"
						/>
					) : (
						<CardTitle className='font-normal text-lg'>
							{title}
						</CardTitle>
					)}
					<hr />
				</CardHeader>
					<CardContent className='font-normal text-sm'>
                        {isEditing ? (
                            <Textarea
                                name="description"
                                value={editableDescription}
                                onChange={handleDescriptionChange}
								maxLength={256}
                                className="border-none bg-transparent resize-none overflow-hidden"
                                rows={3}
                            />
                        ) : (
                            description
                        )}
                    </CardContent>
			</Card>

			<div className='w-full flex justify-between'>
				<div className='flex gap-4'>
					<Link href={`/blocks/schedules/${id}`}>
						<Button className='text-xs md:text-sm bg-retro-green hover:bg-retro-green/90 text-retro-black px-2 py-1 md:px-4 md:py-2' type="button">Розклад</Button>
					</Link>
		
					<Link href={`/blocks/consultations/${id}`}>
						<Button className='text-xs md:text-sm bg-retro-red hover:bg-retro-red/90 text-retro-black px-2 py-1 md:px-4 md:py-2' type="button">Консультації</Button>
					</Link>
				</div>
				<div className='flex gap-4'>
					{isEditing ? (
						<>
							<Button className='bg-retro-green hover:bg-retro-green/90 h-10 w-10 px-3 py-1' type="button" onClick={handleSaveChanges}>
								<Image src="/ok.svg" width="0" height="0" style={{ width: "15px", height: "auto"}} alt='Save'/>
							</Button>
							<Button className='bg-retro-red hover:bg-retro-red/90 h-10 w-10 px-3 py-1' type="button" onClick={() => setIsEditing(false)}>
								<Image src="/cancel.svg" width={12} height={12} alt='Cancel'/>
							</Button>
						</>
					) : (
						<>
						<Button className='bg-retro-green hover:bg-retro-green/90 h-10 w-10 px-3 py-1' type="button" onClick={handleEditClick}>
							<Image src="/edit.svg" width={15} height={15} alt='Edit'/>
						</Button>
						<Button className='bg-retro-red hover:bg-retro-red/90 h-10 w-10 px-3 py-1' type="button" onClick={onDelete}>
							<Image src="/delete.svg" width="0" height="0" style={{ width: "13px", height: "auto"}} alt='Delete'/>
						</Button>
						</>
					)}

				</div>
			</div>

			</form>
		</div>
	);
}

