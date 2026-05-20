import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth/better-auth";

// 1. Define the Validation Schema
const registerSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  terms: z.boolean().refine((val) => val === true, "You must accept the terms"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

export function RegisterPage() {
  const navigate = useNavigate();

  // 2. Initialize the Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  });

  const onSubmit = async (values: RegisterValues) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`,
      },
      {
        onSuccess: () => navigate({ to: "/parents" }),
        onError: (ctx) => {
          // Handle server-side errors (e.g., user already exists)
          alert(ctx.error.message);
        },
      },
    );
  };

  return (
    <Card className="border-2 rounded-[2.5rem] shadow-xl animate-in slide-in-from-right-8 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black tracking-tight">
          Create Account
        </CardTitle>
        <CardDescription>Join our school community today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="ml-1">First Name</Label>
              <Input
                {...register("firstName")}
                className="rounded-2xl bg-secondary/50 border-none h-11"
                placeholder="Jane"
              />
              {errors.firstName && (
                <p className="text-destructive text-[10px] ml-2 font-bold uppercase tracking-wider">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="ml-1">Last Name</Label>
              <Input
                {...register("lastName")}
                className="rounded-2xl bg-secondary/50 border-none h-11"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-destructive text-[10px] ml-2 font-bold uppercase tracking-wider">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="ml-1">Email</Label>
            <Input
              {...register("email")}
              className="rounded-2xl bg-secondary/50 border-none h-11"
              type="email"
              placeholder="jane@example.com"
            />
            {errors.email && (
              <p className="text-destructive text-[10px] ml-2 font-bold uppercase tracking-wider">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label className="ml-1">Password</Label>
            <Input
              {...register("password")}
              className="rounded-2xl bg-secondary/50 border-none h-11"
              type="password"
            />
            {errors.password && (
              <p className="text-destructive text-[10px] ml-2 font-bold leading-tight uppercase tracking-wider">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={watch("terms")}
                onCheckedChange={(checked) => setValue("terms", !!checked)}
                className="rounded-md border-primary"
              />
              <label
                htmlFor="terms"
                className="text-xs text-muted-foreground leading-none"
              >
                I agree to the friendly terms and conditions.
              </label>
            </div>
            {errors.terms && (
              <p className="text-destructive text-[10px] font-bold uppercase tracking-wider">
                {errors.terms.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all mt-2"
          >
            {isSubmitting ? "Creating Account..." : "Register Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
