"use client";
import { useState } from "react";
import Button from "@/components/Button";
import InputForm from "@/components/InputForm";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
interface SignInPageProps {
  email: string;
  password: string;
}
export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const methods = useForm<SignInPageProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async ({ email, password }: SignInPageProps) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Credenciales inválidas");
    } else {
      toast.success("Inicio de sesión exitoso");
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-card p-8 shadow-lg z-10">
        <div className="text-center space-y-3">
          <div className="w-1/3 m-auto aspect-video relative block md:hidden">
            <Image src="/logo-auth.svg" alt="Logo" fill />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Iniciar sesión
          </h2>
          <p className=" text-foreground/80">
            Inicia sesión para gestionar tu cuenta
          </p>
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            <div className="space-y-4 flex flex-col">
              <InputForm
                label="E-mail"
                formKey="email"
                type="email"
                required
                placeholder="Ingresa tu correo"
              />
              <div className="relative">
                {" "}
                <InputForm
                  label="Contraseña"
                  formKey="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-foreground/60 hover:text-foreground transition-colors"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                variant="wine"
                disabled={methods.formState.isSubmitting}
                isLoading={methods.formState.isSubmitting}
                name="login"
                size="full"
              >
                Iniciar sesión
              </Button>
              <p className="text-center">
                ¿No tienes una cuenta?
                <Link
                  className="text-btn-primary mx-2 font-semibold"
                  href={"register"}
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
