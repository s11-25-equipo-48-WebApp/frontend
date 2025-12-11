"use client";
import Button from "@/components/Button";
import InputForm from "@/components/InputForm";
import api from "@/services/config";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface RegisterPageProps {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const methods = useForm<RegisterPageProps>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const createAccount = useMutation({
    mutationFn: async ({
      fullName,
      email,
      password,
    }: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const response = await api.post("/auth/register", {
        fullName,
        email,
        password,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cuenta creada exitosamente");
      router.push("/auth/login");
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(
        "Error al crear la cuenta. " + error.response.data.message || ""
      );
    },
  });

  const onSubmit = (data: RegisterPageProps) => {
    // Validación adicional antes de enviar
    if (data.password !== data.confirmPassword) {
      methods.setError("confirmPassword", {
        type: "manual",
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    const { confirmPassword, ...registerData } = data;
    createAccount.mutate(registerData);
  };

  const password = methods.watch("password");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-card p-8 shadow-lg z-10">
        <div className="text-center space-y-3">
          <div className="w-1/3 m-auto aspect-video relative block md:hidden">
            <Image src="/logo-auth.svg" alt="Logo" fill />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Regístrate</h2>
          <p className="mt-2 text-sm text-foreground/60">
            Completa tus datos para crear tu cuenta
          </p>
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
            noValidate
          >
            <div className="space-y-4 flex flex-col">
              <InputForm
                label="Nombre y Apellido"
                formKey="fullName"
                required
                placeholder="Ingresa tu nombre completo"
              />

              <InputForm
                label="Correo"
                formKey="email"
                type="email"
                required
                placeholder="Ingresa tu correo"
                pattern={/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/}
                errorMessage="Ingresa un correo válido"
              />

              <div className="relative">
                <InputForm
                  label="Contraseña"
                  formKey="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Ingresa tu contraseña"
                  pattern={/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/}
                  errorMessage="La contraseña debe tener al menos 8 caracteres, incluyendo letras y números"
                  minLength={8}
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

              <div className="relative">
                <InputForm
                  label="Confirmar Contraseña"
                  formKey="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Repetir tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-foreground/60 hover:text-foreground transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? (
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
                disabled={createAccount.isPending}
                isLoading={createAccount.isPending}
                name="register"
                size="full"
              >
                Regístrate
              </Button>
              <p className="text-center">
                ¿Ya tienes una cuenta?
                <Link
                  className="text-btn-primary mx-2 font-semibold"
                  href={"login"}
                >
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
