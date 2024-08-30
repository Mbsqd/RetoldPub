"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from 'next/navigation'

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Схема валидации с помощью yup
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Username не може бути порожнім")
    .min(3, "Мінімальна довжина 3 символа")
	.max(64, "Максимальна довжина 64 символа")
    .matches(/^[a-zA-Z0-9_]+$/, "Дозволені лише букви, цифри і символ '_'"),
  email: yup
    .string()
    .required("Email не може бути порожнім")
	.max(64, "Максимальна довжина 64 символа")
    .email("Некоректний формат email"),
  password: yup
    .string()
    .required("Пароль не може бути порожнім")
    .min(8, "Мінімальна довжина 8 символів")
	.max(64, "Максимальна довжина 64 символа"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Паролі неоднакові")
    .required("Підтвердження паролю обов'язкове"),
});

export function SignupForm() {
	const router = useRouter();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); 

	const resetServerMessages = () => {
		setServerError(null);
		setSuccessMessage(null);
	};

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormInputs>({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data: SignupFormInputs) => {
		const { confirmPassword, ...dataToSend } = data;
		try {
			const response = await fetch("/api/Authorization/register", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(dataToSend),
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "Something went wrong");
			}

			setServerError(null);
			setSuccessMessage("Реєстрація успішна! Переадресація на сторінку входу...");
			setTimeout(() => {
				router.replace("/signin");
			}, 2000);
		} catch (error) {
			setSuccessMessage(null);

			if (error instanceof Error) {
				if (error.message == "Email is already taken") {
					setServerError("Користувач із таким email вже існує");
				} else if (error.message == "Name is already taken") {
					setServerError("Користувач із таким username вже існує");
				}
			} else {
				setServerError("Помилка реєстрації, спробуйте пізніше");
			}
		}
	};

	return (
		<div className="w-full max-w-md">
			<form className='mt-10 px-2.5' onSubmit={handleSubmit(onSubmit)}>
				<Card>
					<CardHeader className="space-y-1">
						<CardTitle className="text-3xl font-bold">Реєстрація</CardTitle>
						<CardDescription>Введіть дані для створення облікового запису</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="username">Username</Label>
							<Input id="username" type="text" placeholder="username" autoComplete="username" {...register("name")} onChange={resetServerMessages} />
							{errors.name && <p className="text-retro-red text-sm">{errors.name.message}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="text"
								placeholder="name@example.com"
								autoComplete="email"
								{...register("email")}
								onChange={resetServerMessages}
							/>
							{errors.email && <p className="text-retro-red text-sm">{errors.email.message}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="password"
									{...register("password")}
									onChange={resetServerMessages}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
								>
									{showPassword ? "Приховати" : "Показати"}
								</button>
							</div>
							{errors.password && <p className="text-retro-red text-sm">{errors.password.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Підтвердіть пароль</Label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									placeholder="password"
									{...register("confirmPassword")}
									onChange={resetServerMessages}
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
								>
									{showConfirmPassword ? "Приховати" : "Показати"}
								</button>
							</div>
							{errors.confirmPassword && <p className="text-retro-red text-sm">{errors.confirmPassword.message}</p>}
						</div>
					</CardContent>
					<CardFooter className="flex flex-col">
						<div className="space-y-4 w-full">
							{serverError && <p className="text-retro-red text-sm">{serverError}</p>}
							{successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

							<label className="flex items-center space-x-2">
							<input 
								type="checkbox" 
								required 
								onChange={(e) => setIsCheckboxChecked(e.target.checked)} 
								className='pr-4'
							/> 
							<span>
								Я згоден з <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-retro-blue hover:underline">Умовами користування сайтом</Link>
							</span>
						</label>

							<button
								type="submit"
								className={`w-full bg-primary text-retro-black border py-2 rounded hover:shadow-md transition-shadow ease-out duration-500${
									isSubmitting || !isCheckboxChecked ? "opacity-50 cursor-not-allowed" : ""
								}`}
								disabled={isSubmitting || !isCheckboxChecked}
							>
								{isSubmitting ? "Завантаження..." : "Зареєструватися"}
							</button>
						</div>
					</CardFooter>
				</Card>
				<div className="mt-4 mb-10 text-center text-sm">
					Вже маєте аккаунт?
					<Link className="underline ml-2" href="/signin">
						Ввійти
					</Link>
				</div>
			</form>
		</div>
	);
}
