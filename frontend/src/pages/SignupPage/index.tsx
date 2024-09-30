import { SignupForm } from './SignupForm';

const SignupPage = () => {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="bg-black p-4"></div>
      <div className="bg-white p-4">
        <SignupForm />
      </div>
    </div>
  );
};
export default SignupPage;
