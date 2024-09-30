import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import userSchema from '../../../../shared/schemas/userSchema';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { baseApi } from '@/service/fetchApi';
import { AxiosError } from 'axios';

export function SignupForm() {
  const navigate = useNavigate();

  // Redirect the user if they are already logged in
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     navigate('/home');
  //   }
  // }, [isLoggedIn, navigate]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    try {
      console.log('Submitting form', values);
      const res = await baseApi.post('/users/newUser', values);
      localStorage.setItem('user', JSON.stringify(res.data)); // Store user in localStorage
      navigate('/home');

      console.log('Login successful:', res.data);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const status = error.response.status;

        if (status === 401) {
          form.setError('password', { message: 'Password invalid' });
        }

        if (status === 404) {
          form.setError('username', {
            message: "Username doesn't exist",
          });
        }
      }
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
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
                <Input placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      <div>
        Already have an account?{'  '}
        <Link className="text-cyan-500 font-bold" to="/login">
          Login
        </Link>{' '}
      </div>
    </Form>
  );
}
