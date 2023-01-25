This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Working with dependencies
Whenever you change dependencies (adding, removing, or updating), there are various files that must be kept up-to-date. Newly added, or updated dependencies, can introduce unwanted scripts that runs unknowingly, that could introduce risks for users and/or developers. The `lavamoat allow-scripts` feature allows us to control this with a zero trust approach, but adds some additional steps to the usual workflow.

`yarn.lock`:
- Instead of running `yarn` or `yarn install`, run `yarn setup` to ensure the `yarn.lock` file is in sync and that the dependency scripts are run according to the `allow-script` policy (set in `packages.json`)

The `allow-scripts` configuration in `package.json`:
- Run `yarn allow-scripts auto` to update the `allow-scripts` configuration automatically. This config determines whether the package's install/postinstall scripts are allowed to run.
- Alternatively update the allow-scripts section manually.
- Review each new package to determine whether the install script needs to run or not, testing if necessary.
- Use `npx can-i-ignore-scripts` to help assessing whether scripts are needed


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
