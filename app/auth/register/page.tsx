'use client';
import Button from '@/components/Button';
import InputForm from '@/components/InputForm';
import api from '@/services/config';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'react-toastify';
interface RegisterPageProps {
  name: string;
  email: string;
  password: string;
}
export default function RegisterPage() {
  const router = useRouter();
  const methods = useForm<RegisterPageProps>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });
  const createAccount = useMutation({
    mutationFn: async ({ email, password }: RegisterPageProps) => {
      const response = await api.post('/auth/register', { email, password });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Cuenta creada exitosamente');
      router.push('/auth/login');
    },
    onError: (error: { response: { data: { message: string; }; }; }) => {
      toast.error('Error al crear la cuenta. ' + error.response.data.message || '');
    }
  });
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-card p-8 shadow-lg z-10">
        <div className="text-center space-y-2">
          <h1 className='text-2xl font-bold md:hidden text-foreground'>Testimonial CMS Global Edtech</h1>
          <h2 className="text-xl font-semibold text-foreground">Regístrate</h2>
          <p className="mt-2 text-sm text-foreground/60">
            Completa tus datos para crear tu cuenta
          </p>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit((data) => createAccount.mutate(data))} className="mt-8 space-y-6">
            <div className="space-y-4 flex flex-col">
              <InputForm label="Nombre y Apellido" formKey="name" required placeholder='Ingresa tu nombre completo' />
              <InputForm label="Correo" formKey="email" type="email" required placeholder='Ingresa tu correo' pattern={/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/} errorMessage="Ingresa un correo válido" />
              <InputForm label="Contraseña" formKey="password" type="password" required placeholder='Ingresa tu contraseña' pattern={/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/} errorMessage="La contraseña debe tener al menos 6 caracteres, incluyendo letras y números" minLength={8} />
            </div>

            <div className='space-y-4'>
              <Button type="submit" disabled={createAccount.isPending} isLoading={createAccount.isPending} name='register' size='full'>
                Regístrate
              </Button>
              <p className='text-center'>
                ¿Ya tienes una cuenta?
                <Link className="text-btn-primary mx-2 font-semibold" href={'login'}>Iniciar Sesión</Link>
              </p>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
