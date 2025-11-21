'use client';
import Button from '@/components/Button';
import InputForm from '@/components/InputForm';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'react-toastify';
interface SignInPageProps {
  email: string;
  password: string;
}
export default function SignInPage() {
  const router = useRouter();
  const methods = useForm<SignInPageProps>({
    defaultValues: {
      email: '',
      password: '',
    }
  });
  const onSubmit = async ({ email, password }: SignInPageProps) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error('Credenciales inválidas');
    } else {
      toast.success('Inicio de sesión exitoso');
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-card p-8 shadow-lg z-10">
        <div className="text-center space-y-2">
          <h1 className='text-2xl font-bold md:hidden text-foreground'>Testimonial CMS Global Edtech</h1>
          <p className=" text-foreground/80">
            Inicia sesión para gestionar tu cuenta
          </p>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4 flex flex-col">
              <InputForm label="E-mail" formKey="email" type="email" required placeholder='Ingresa tu correo' />
              <InputForm label="Contraseña" formKey="password" type="password" required placeholder='Ingresa tu contraseña' />
            </div>

            <div className='space-y-4'>
              <Button type="submit" disabled={methods.formState.isSubmitting} isLoading={methods.formState.isSubmitting} name='login' size='full'>
                iniciar sesión
              </Button>
              <p className='text-center'>
                ¿No tienes una cuenta?
                <Link className="text-btn-primary mx-2 font-semibold" href={'register'}>Regístrate</Link>
              </p>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
