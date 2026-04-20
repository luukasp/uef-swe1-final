import { auth } from "./better_auth";

export async function signUpWithEmail({
  email,
  password,
  name,
  username,
}: {
  email: string;
  password: string;
  name: string;
  username: string;
}) {
  const { data, error } = await auth.signUp.email(
    {
      email,
      password,
      name,
      username: username,
    },
    {
      onRequest: (ctx) => {
        //show loading
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
      },
      onError: (ctx) => {
        // display the error message
        alert(ctx.error.message);
      },
    },
  );
  return { data, error };
}

export async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await auth.signIn.email(
    {
      /**
       * The user email
       */
      email,
      /**
       * The user password
       */
      password,
      /**
       * A URL to redirect to after the user verifies their email (optional)
       */
      callbackURL: "/",
      /**
       * remember the user session after the browser is closed.
       * @default true
       */
      rememberMe: false,
    },
    {
      //callbacks
    },
  );
  return { data, error };
}

export async function signInWithUsername() {
  const { data, error } = await auth.signIn.username({
    username: "test", // required
    password: "password1234", // required
  });
  return { data, error };
}
