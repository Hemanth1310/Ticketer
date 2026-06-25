import z from 'zod'




const emailRules = z.string().email("Invalid email format").trim().toLowerCase()

// Define password rules ONCE so they are identical everywhere
const passwordRules = z.string()
    .min(8, "Please enter at least 8 characters")
    .regex(/[!@#$%^&*]/, "Please enter atleast one special charecter e.g. !@#$%^&*");


export const registerSchema = z.object({
    email: emailRules,
    password: passwordRules,
    firstName: z.string().min(1,'Firstname cannot be empty'),
    lastName: z.string().min(1,'Lastname cannot be empty'),
})

export const loginSchema = z.object({
    email: emailRules,
    password: passwordRules
})