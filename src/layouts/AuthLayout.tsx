import { Outlet } from 'react-router-dom';

export const AuthLayout = (): JSX.Element => (
  <main className="w-screen h-screen mx-auto flex items-center justify-center">
    <Outlet />
  </main>
);
