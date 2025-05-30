import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAxios from "@/hooks/useAxios";
import { env } from "@/lib/env";
import useAuthStore from "@/store/zustand";
import { useEffect } from "react";

const formSchema = z.object({
	email: z.string(),
	password: z.string().min(6, "Password should have atleast 6 characters"),
});

const Login = () => {
	const { isLoading, error, makeAxiosRequest } = useAxios();
	const { updateUser } = useAuthStore((state) => state);

	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await makeAxiosRequest(`${env.SERVER_URL}/login`, "POST", {}, values);
		if (!res) return;
		updateUser({
			id: res.data.id,
			email: res.data.email,
			tokens: res.data.tokens,
			auth: res.data.auth,
		});
		navigate("/");
	}
	useEffect(() => {}, [error]);

	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
				<div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white cursor-none">
					<img className="w-8 h-8 mr-2" src="/icon.ico" alt="logo" />
					QuickVideo
				</div>
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Login to continue!
						</h1>
						{error && <div className="text-red-500/80 italic">{error}</div>}
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													placeholder="mail@domain.com"
													type="email"
													{...field}
													className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 py-5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="********"
													type="password"
													{...field}
													className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 py-5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="cursor-pointer" disabled={isLoading}>
									Login
								</Button>
							</form>
						</Form>
						<p className="text-sm font-light text-gray-500 dark:text-gray-400">
							Don’t have an account yet?{" "}
							<Link
								to={"/signup"}
								className="font-medium text-primary-600 hover:underline dark:text-primary-500">
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Login;
