import { LoginForm } from '@/features/auth/components/LoginForm';
import otterLogo from '@/assets/img/otter.png';

const frases = [
  "Con toda la energía y con toda la actitud.",
  "'(...) El día siguiente traerá sus propias preocupaciones. Bastante hay con los problemas de cada día.' - Mateo 6:34",
  "Podemos con todo, pero no con todo al tiempo.",
  "¡Siempre con actitud positiva!",
  "'¿Quién de ustedes, por angustiarse, puede alargar un solo codo la duración de su vida' - Mateo 6:27",
];

export const LoginPage = (): JSX.Element => {
  const randomFrase =
    frases[Math.floor(Math.random() * frases.length)];

  return (
    <section className="min-h-screen bg-slate-100 flex items-center px-8">

      <div className="mx-auto grid w-full max-w-[1250px] gap-12 lg:grid-cols-[1.2fr_0.9fr]">

        {/* Panel izquierdo */}
        <div className="hidden lg:flex flex-col justify-center rounded-[32px] bg-cyan-700 p-12 text-white shadow-2xl min-h-[620px] text-center">

          <img
            src={otterLogo}
            alt="Lutra"
            className="w-32 mb-10 mx-auto "
          />

          <h1 className="text-4xl font-bold leading-tight">
            Lutra FE
          </h1>

          <p className="mt-6 text-lg text-cyan-100">
            Gestiona tus comprobantes electrónicos de manera
            rápida, segura y eficiente.
          </p>

          <div className="mt-12 rounded-2xl bg-white/10 p-6">
            <p className="lato-thin-italic">
              {randomFrase}
            </p>
          </div>

        </div>

        {/* Login */}
        <div className="flex items-center justify-center flex-col justify-center">

          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-10 shadow-2xl min-h-[620px] flex flex-col justify-center">

            {/* Mobile logo */}
            <div className="mb-8 flex flex-col items-center lg:hidden">

              <img
                src={otterLogo}
                alt="Lutra"
                className="w-20"
              />

              <h1 className="mt-4 text-2xl font-bold text-slate-900">
                Lutra FE
              </h1>

            </div>

            <div className="mb-8 text-center ">

              <h2 className="text-3xl font-bold text-slate-900">
                Bienvenido
              </h2>

              <p className="mt-2 text-slate-500">
                Inicia sesión para acceder al sistema.
              </p>

            </div>

            <LoginForm />

            <div className="mt-8 text-center text-xs text-slate-400">
              Acceso protegido mediante autenticación segura.
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};