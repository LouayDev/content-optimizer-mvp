import { LoginForm } from './LoginForm';

const LoginPage = () => {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="bg-black p-4">Left Side</div>
      <div className="bg-white p-4">
        <LoginForm />
      </div>
    </div>
  );
};
export default LoginPage;
