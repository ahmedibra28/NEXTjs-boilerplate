# NEXTjs Boilerplate

This is a boilerplate project for a Next.js 13 app using TypeScript, Tailwind CSS, DaisyUI, Prisma, and Postgres, React Query. It includes features such as login, user management, user roles, user permissions, user profile, forgot password, reset password, nodemailer and more.

## Getting started

To use this boilerplate, clone the repository and install the dependencies:

```bash
git clone https://github.com/ahmedibra28/NEXTjs-boilerplate.git
cd NEXTjs-boilerplate
npm install
```

### Environment setup

Create a `.env.local` file in the root directory of the project with the following variables:

```
DATABASE_URL=postgres://user:password@localhost:5432/db_name
SMTP_SERVER=smtp.host.com
SMTP_PORT=465
SMTP_USER=user@host.com
SMTP_KEY=password
```

Make sure to replace `user`, `password`, and `db_name` with your own Postgres credentials, and `smtp.host.com`, `user@host.com`, and `password` with your own SMTP credentials.

# Nano ID for postgres

Creating a blank migration for Custom function to the PostgreSQL instance using:

```bash
npx prisma migrate dev --create-only
```

You can name this migration 'nanoid'. Open the file created by the migration and paste the nanoid function

```bash
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION nanoid(size int DEFAULT 21)
RETURNS text AS $$
DECLARE
  id text := '';
  i int := 0;
  urlAlphabet char(64) := 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';
  bytes bytea := gen_random_bytes(size);
  byte int;
  pos int;
BEGIN
  WHILE i < size LOOP
    byte := get_byte(bytes, i);
    pos := (byte & 63) + 1; -- + 1 because substr starts at 1 for some reason
    id := id || substr(urlAlphabet, pos, 1);
    i = i + 1;
  END LOOP;
  RETURN id;
END
$$ LANGUAGE PLPGSQL STABLE;
```

Then you can run this migration using:

```bash
npx prisma migrate dev
```

### Starting the development server

To start the development server, run:

```bash
npm run dev
```

### Seeding data

To seed data, make a GET request to `http://localhost:3000/api/seeds?secret=ts&option=reset` in your browser or with a tool like Postman. This will create default user roles and permissions and create a default admin user with the email `info@ahmedibra.com` and password `123456`.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
