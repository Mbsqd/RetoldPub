"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
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

interface SigninFormInputs {
  email: string;
  password: string;
}

// Схема валидации с помощью yup
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email не може бути порожнім")
    .max(64, "Максимальна довжина 64 символа")
    .email("Некоректний формат email"),
  password: yup.string().required("Пароль не може бути порожнім"),
});

export function SigninForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetServerMessages = () => {
    setServerError(null);
  };

  const { register, handleSubmit, formState: { errors } } = useForm<SigninFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SigninFormInputs) => {
    resetServerMessages();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/Authorization/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
		credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Something went wrong");
      }

      setServerError(null);
      router.refresh();
    } catch (error) {
	  setServerError("Невірний email або пароль");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form className='mt-10 px-2.5' onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold">Вхід</CardTitle>
            <CardDescription>Введіть дані для входу в акаунт</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="user@example.com"
                autoComplete="username"
                {...register("email")}
                onChange={resetServerMessages}
              />
              {errors.email && <p className="text-retro-red text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  autoComplete="current-password"
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
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {serverError && <p className="text-retro-red text-sm">{serverError}</p>}
            <button
              type="submit"
              className={`w-full bg-primary text-black border py-2 rounded hover:shadow-md transition-shadow ease-out duration-500${
                isSubmitting ? " opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Завантаження..." : "Ввійти"}
            </button>
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          Немає аккаунту?
          <Link className="underline ml-2" href="/signup">
            Зареєструватися
          </Link>
        </div>
      </form>
    </div>
  );
}
