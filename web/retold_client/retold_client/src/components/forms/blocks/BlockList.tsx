'use client';

import { BlockItem } from '@/components/forms/blocks/BlockItem';
import { useEffect, useState } from 'react';
import Image from "next/image";

interface Block {
	id: number;
	title: string;
	description: string;
}

export const BlockList = () => {
	const [blocks, setBlocks] = useState<Block[]>([]);
	const [blockExist, setBlockExist] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchBlocks();
	}, []);

	const fetchBlocks = async () => {
		setLoading(true);
		try {
			const response = await fetch("/api/Blocks/get-all-blocks", {
				method: "GET",
				credentials: "include",
			});
			const data: Block[] = await response.json();
			setBlocks(data);
			setBlockExist(data.length > 0);
			setError(null);
		} catch (error) {
			setBlockExist(false);
			setError("Блоки не знайдено");
			console.error("Error when loading blocks:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: number) => {
		try {
			const response = await fetch(`/api/Blocks/delete-block/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "Failed to delete block");
			}

			setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
		} catch (error) {
			setError("Failed to delete block.");
			console.error(error);
		}
	};

	const handleUpdate = async () => {
		await fetchBlocks(); 
	};

	return (
		<div className="w-full max-w-4xl flex flex-col items-start space-y-8">
			{loading && <p className='text-xl mx-auto'>Завантаження...</p>}
			{error && <p className='text-retro-red text-xl mx-auto'>{error}</p>}
			{blockExist ? (
				blocks.map((block, index) => (
					<div key={block.id} className="w-full flex flex-col space-y-8">
						<BlockItem
							key={block.id}
							id={block.id}
							title={block.title}
							description={block.description}
							onDelete={() => handleDelete(block.id)}
							onUpdate={handleUpdate} // Pass onUpdate to refresh list
						/>
						{index < blocks.length - 1 && (
							<Image src="/big-divide-line.svg" width="0" height="0" style={{ width: "900px", height: "auto"}} alt="Divide line"  className='px-2'/>
						)}
					</div>
				))
			) : (
					<></>
			)}
		</div>
	);
};
