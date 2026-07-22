"use server";

import { redirect } from "next/navigation";
import { hashUserPassword, verifyPassword } from "../lib/hashpassword";
import { createUsers, getUserByEmailWrapper } from "../lib/users";
import destorySession, { createAuthSession } from "../lib/auth";

interface ErrorState {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    general?: string;
}

interface SignupResponse {
    errors: ErrorState;
}

interface SigninErrorState {
    email?: string;
}

interface SigninResponse {
    errors: SigninErrorState;
}

export async function signup(prevState: unknown, formData: FormData): Promise<SignupResponse | undefined> {
    const users_name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm_password = formData.get("confirmPassword") as string;

    const errors: Partial<ErrorState> = {};

    // Name validation
    if (!users_name.trim()) {
        errors.name = "Name is required";
    } else if (users_name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
    }

    // Check if user already exists
    const existingUser = await getUserByEmailWrapper(email);
    if (existingUser) {
        errors.email = "It seems there is an account already created with this email!";
    }

    if (!email.includes("@")) {
        errors.email = "Invalid email, please make sure you use the '@' sign!";
    } else if (!email.trim()) {
        errors.email = "Email is required";
    }
    
    if (password.trim().length < 8) {
        errors.password = "Your password should be up to 8 characters";
    } else if (!password) {
        errors.password = "Password is required";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (password.trim() !== confirm_password.trim()) {
        errors.confirm_password = "Your password doesn't match";
    } else if (!confirm_password) {
        errors.confirm_password = "Please confirm your password";
    }

    if (Object.keys(errors).length > 0) {
        return {
            errors: {
                name: errors.name || "",
                email: errors.email || "",
                password: errors.password || "",
                confirm_password: errors.confirm_password || "",
                general: errors.general || ""
            },
        };
    }

    const hashPassword = await hashUserPassword(password);

    try {
        const user = await createUsers(users_name, email, hashPassword);
        await createAuthSession(user.id as string);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
        console.error("Signup error:", error);
        return {
            errors: {
                name: "",
                email: "",
                password: "",
                confirm_password: "",
                general: message
            }
        };
    }
    
    redirect("/home");
}

export async function signin(prevState: unknown, formData: FormData): Promise<SigninResponse | undefined> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const loginExsistingUser = await getUserByEmailWrapper(email);
    if (!loginExsistingUser) {
        return {
            errors: {
                email: "Could not authenticate, please check your e-mail"
            }
        };
    }
    const isValidPassword = await verifyPassword(loginExsistingUser.password as string, password);
    if (!isValidPassword) {
        return {
            errors: {
                email: "Could not authenticate, please check your password"
            }
        };
    }
    await createAuthSession(loginExsistingUser.id as string);
    redirect("/home");
}

export async function logout(): Promise<never> {
  await destorySession();
  redirect("/login");
}