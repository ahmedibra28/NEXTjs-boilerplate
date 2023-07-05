# NEXTjs Boilerplate

This is a boilerplate project for a Next.js 13 app using TypeScript, Tailwind CSS, DaisyUI, Prisma, and Postgres, React Query. It includes features such as login, user management, user roles, user permissions, user profile, forgot password, reset password, nodemailer and more.

## Getting started

To use this boilerplate, clone the repository and install the dependencies:

```bash
git clone https://github.com/ahmedibradotcom/NEXTjs-boilerplate.git
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
