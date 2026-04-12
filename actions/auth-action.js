"use server";

import { redirect } from "next/navigation";
import { hashUserPassword, verifyPassword } from "../lib/hashpassword";
import { createUsers } from "../lib/users";
import getUserByEmailWrapper from "../lib/users";

export async function signup(prevState, formData) {
    const users_name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirm_password = formData.get("confirmPassword");

    let errors = {};
    
    // Check if user already exists
    const existingUser = getUserByEmailWrapper(email);
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
            errors,
        };
    }

    const hashPassword = await hashUserPassword(password);
     
    try {
        createUsers(users_name, email, hashPassword);
        redirect("/login");
    } catch (error) {
        console.error("Signup error:", error);
        return {
            errors: {
                general: "Something went wrong. Please try again."
            }
        };
    }
}

export async function signin(prevState,formData) {
    const email = formData.get("email");
    const password = formData.get("password");

    const loginExsistingUser = getUserByEmailWrapper(email);
    if (!loginExsistingUser) {
        return{
            errors:{
                email:"Could not authenticate, please check your e-mail "
            }
        }
    }
    const isValidPassword = await verifyPassword(loginExsistingUser.password, password);
    if (!isValidPassword) {
        return {
            errors:{
                email:"Could not authenticate, please check your password "
            }
        }
    }
    // await createAuthSession(loginExsistingUser.id);
    redirect("/home")
}