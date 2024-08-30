"use client";

import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import * as yup from "yup";

const schemaUsername = yup.object().shape({
  username: yup
    .string()
    .required("Username не може бути порожнім")
    .min(3, "Мінімальна довжина 3 символа")
    .max(64, "Максимальна довжина 64 символа")
    .matches(/^[a-zA-Z0-9_]+$/, "Дозволені лише букви, цифри і символ '_'"),
});

const schemaEmail = yup.object().shape({
  email: yup
    .string()
    .required("Email не може бути порожнім")
    .email("Некоректний формат email")
    .max(64, "Максимальна довжина 64 символа"),
});

const schemaPassword = yup.object().shape({
  oldPassword: yup
    .string()
    .required("Старий пароль не може бути порожнім"),
  newPassword: yup
    .string()
    .required("Новий пароль не може бути порожнім")
    .min(8, "Мінімальна довжина 8 символів")
    .max(64, "Максимальна довжина 64 символа"),
});

interface UpdateUsernameInput {
  username: string;
}

interface UpdateEmailInput {
  email: string;
}

interface UpdatePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export default function UserProfile() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [telegram, setTelegram] = useState("");

	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	const [serverErrorUsername, setServerErrorUsername] = useState("");
	const [serverSuccessUsername, setServerSuccessUsername] = useState("");

	const [serverErrorEmail, setServerErrorEmail] = useState("");
	const [serverSuccessEmail, setServerSuccessEmail] = useState("");

	const [serverErrorPassword, setServerErrorPassword] = useState("");
	const [serverSuccessPassword, setServerSuccessPassword] = useState("");

	const [serverErrorTelegram, setServerErrorTelegram] = useState("");
	const [serverSuccessTelegram, setServerSuccessTelegram] = useState("");
	const [copyToken, setCopyToken] = useState("");

	const resetServerStatusUsername = () => {
		setServerErrorUsername("");
		setServerSuccessEmail("");
	}

	const resetServerStatusEmail = () => {
		setServerErrorEmail("");
		setServerSuccessEmail("");
	}

	const resetServerStatusPassword = () => {
		setServerErrorPassword("");
		setServerSuccessPassword("");
	}
  
	// Получите данные пользователя при загрузке компонента
	useEffect(() => {
	  const fetchUserData = async () => {
		try {
		  const response = await fetch("/api/Users/get-user", {
			method: "GET",
			credentials: "include",
		  });
		  if (!response.ok) {
			throw new Error("Ошибка при получении данных пользователя");
		  }
		  const data = await response.json();
		  setUsername(data.username);
		  setEmail(data.email);
		  setTelegram(data.telegramCode);
		} catch (error) {
		  console.error(error);
		}
	  };
  
	  fetchUserData();
	}, []);
  
	const { register: registerUsername, handleSubmit: handleSubmitUsername, formState: { errors: errorsUsername, isSubmitting: isSubmittingUsername } } = useForm<UpdateUsernameInput>({
	  resolver: yupResolver(schemaUsername),
	  defaultValues: {username}
	});
  
	const { register: registerEmail, handleSubmit: handleSubmitEmail, formState: { errors: errorsEmail, isSubmitting: isSubmittingEmail } } = useForm<UpdateEmailInput>({
	  resolver: yupResolver(schemaEmail),
	});
  
	const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword } } = useForm<UpdatePasswordInput>({
	  resolver: yupResolver(schemaPassword),
	});
  
	const handleUpdateUsername = async (data: UpdateUsernameInput) => {
		try {
		  const response = await fetch("/api/Users/username", {
			method: "PUT",
			headers: {
			  "Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ username: data.username }),
		  });

		  if(!response.ok) {
			const errorData = await response.text();
			throw new Error(errorData || "Something went wrong");
		  }
	  
		  setServerErrorUsername("");
		  setServerSuccessUsername("Логін оновлено");
		} catch (error) {
			console.error(error);
			setServerSuccessUsername("");
			if(error instanceof Error) {
				if(error.message == "The new username cannot be the same as the current.") {
					setServerErrorUsername("Новий логін не може бути таким самим");
				} else if (error.message == "Name is already taken") {
					setServerErrorUsername("Такий логін вже зайнятий");
				} 
			} else {
				setServerErrorUsername("Сталася помилка, спробуйте пізніше");
			}
		}
	};
  
	const handleUpdateEmail = async (data: UpdateEmailInput) => {	  
	  try {
		const response = await fetch("/api/Users/email", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ email: data.email }), 
		});

		if(!response.ok) {
			const errorData = await response.text();
			throw new Error(errorData || "Something went wrong");
		}

		setServerErrorEmail("");
		setServerSuccessEmail("Пошту оновлено"); 
	  } catch (error) {
		console.error(error);
		setServerSuccessEmail("");
		if(error instanceof Error) {
			if(error.message == "The new email cannot be the same as the current.") {
				setServerErrorEmail("Нова пошта не може бути такою самою");
			} else if (error.message == "Email is already taken") {
				setServerErrorEmail("Така пошта вже зайнята");
			}
		} else {
			setServerErrorEmail("Сталася помилка, спробуйте пізніше");
		}
	  }
	};
  
	const handleUpdatePassword = async (data: UpdatePasswordInput) => {
		try {
			const response = await fetch("/api/Users/password", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ oldPassword: data.oldPassword, newPassword: data.newPassword }),
			});

			if(!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || "Something went wrong");
			}

			setServerErrorPassword("");
			setServerSuccessPassword("Пароль змінено");
		} catch (error) {
			console.error(error); 
			setServerSuccessPassword("");
			if(error instanceof Error) {
				if(error.message == "Current password is incorrect") {
					setServerErrorPassword("Поточний пароль невірний");
				}
			} else {
				setServerErrorPassword("Сталася помилка, спробуйте пізніше"); 
			}
		}
	};
  
	const handleCopyTelegram = () => {
		navigator.clipboard.writeText(telegram);
		setCopyToken("Токен успішно скопійовано");
		setTimeout(() => {
			setCopyToken("");
		}, 2000);
	};

	const handleUpdateTelegram = async () => {	  
	  try {
		const response = await fetch("/api/Users/telegram-code", {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
			},
			credentials: "include",
		});

		if(!response.ok) {
			const errorData = await response.text();
			throw new Error(errorData || "Something went wrong");
		}

		const newTokenResponse = await response.text();
		const newCleanToken = newTokenResponse.slice(1, -1);
		setTelegram(newCleanToken);

		setServerErrorTelegram("");
		setServerSuccessTelegram("Токен успішно оновлено");

		setTimeout(() => {
			setServerSuccessTelegram("");
		}, 2000);
	  } catch (error) {
		setServerSuccessTelegram("");
		setServerErrorTelegram("Помилка, спробуйте пізніше");
	  }
	};

  return (
	<div className='px-2.5'>
    <Card className="w-full max-w-lg mx-auto my-10">
      <CardHeader>
        <CardTitle className="text-2xl">Профіль користувача</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <form onSubmit={handleSubmitUsername(handleUpdateUsername)}>
            <Label htmlFor="username">Логін</Label>
            <div className='flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-2'>
              <Input
                id="username"
                {...registerUsername('username')}
				placeholder={username}
				onChange={resetServerStatusUsername}
              />
              <Button className='w-full md:w-fit' type="submit" disabled={isSubmittingUsername}>Оновити логін</Button>
            </div>
            {errorsUsername.username && <p className='text-retro-red mt-2'>{errorsUsername.username.message}</p>}
			{serverErrorUsername && <p className="text-retro-red mt-2">{serverErrorUsername}</p>}
			{serverSuccessUsername && <p className="text-green-500 mt-2">{serverSuccessUsername}</p>}
          </form>

          <form onSubmit={handleSubmitEmail(handleUpdateEmail)}>
            <Label htmlFor="email">Пошта</Label>
            <div className='flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-2'>
              <Input
                id="email"
				placeholder={email}
                {...registerEmail('email')}
				onChange={resetServerStatusEmail}
              />
              <Button className='w-full md:w-fit' type="submit" disabled={isSubmittingEmail}>Оновити пошту</Button>
            </div>
            {errorsEmail.email && <p className='text-retro-red mt-2'>{errorsEmail.email.message}</p>}
			{serverErrorEmail && <p className="text-retro-red mt-2">{serverErrorEmail}</p>}
			{serverSuccessEmail && <p className="text-green-500 mt-2">{serverSuccessEmail}</p>}
          </form>

          <form onSubmit={handleSubmitPassword(handleUpdatePassword)}>
            <div>
              <Label htmlFor="old-password">Старий пароль</Label>
              <div className='relative'>
                <Input
                  id="old-password"
				  placeholder="••••••••"
				  type={showOldPassword ? "text" : "password"}
                  {...registerPassword('oldPassword')}
				  onChange={resetServerStatusPassword}
                />
				<button
					type="button"
					onClick={() => setShowOldPassword(!showOldPassword)}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
				>
					{showOldPassword ? "Приховати" : "Показати"}
				</button>
              </div>
              {errorsPassword.oldPassword && <p className='text-retro-red mt-2'>{errorsPassword.oldPassword.message}</p>}
            </div>

            <div>
              <Label htmlFor="new-password">Новий пароль</Label>
              <div className='relative'>
                <Input
                  id="new-password"
				  placeholder="••••••••"
                  type={showNewPassword ? "text" : "password"}
                  {...registerPassword('newPassword')}
				  onChange={resetServerStatusPassword}
                />
				<button
					type="button"
					onClick={() => setShowNewPassword(!showNewPassword)}
					className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
				>
					{showNewPassword ? "Приховати" : "Показати"}
				</button>
              </div>
              {errorsPassword.newPassword && <p className='text-retro-red mt-2'>{errorsPassword.newPassword.message}</p>}
			  {serverErrorPassword && <p className="text-retro-red mt-2">{serverErrorPassword}</p>}
			  {serverSuccessPassword && <p className="text-green-500 mt-2">{serverSuccessPassword}</p>}
            </div>

            <Button type="submit" className="mt-2 w-full md:w-fit" disabled={isSubmittingPassword}>Оновити пароль</Button>
          </form>

		  <div className="flex flex-col space-y-2">
		  <Label htmlFor="telegram">Telegram токен</Label>
				<div className='relative space-y-2'>
					<Input
						id="telegram"
						value={telegram}
						readOnly
						className='w-full'
					/>
				<div className='flex flex-row items-center justify-between space-x-2'>
					<Button onClick={handleCopyTelegram} className="w-full">Копіювати</Button>
					<Button onClick={handleUpdateTelegram} className="w-full">Оновити</Button>
				</div>
			</div>
				{serverErrorTelegram && <p className="text-retro-red mt-2">{serverErrorTelegram}</p>}
				{serverSuccessTelegram && <p className="text-green-500 mt-2">{serverSuccessTelegram}</p>}
				{copyToken && <p className="text-green-500 mt-2">{copyToken}</p>}
		  </div>
        </div>
      </CardContent>
    </Card>
	</div>
  );
}
