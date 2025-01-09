
# Taskore

Taskore is a Shadcn grid which supports column wise sorting and global search by name


## Folder Structure

`app`: This contains our routes (only / route in this case) \
`components`: It contains the components created for the app
`components/ui`: It contains the components added by shadcn \
`lib`: It contains the util functions, static data, and types\
`store`: It contain the zustand global store for the app \
`public`: contains the static assets (nothing in our case)


### System Design

- The `layout.tsx` is the main wrapper around app, it defines the metadata and HTML layout.
- The `app/page.tsx` is the entry point, which imports the MainComponent and renders it by wrapping into suspense. Suspense because I'm using `useSearchParams` and it executes on client side
- The MainComponent access all the params, fetch all the tasks on load.
- It also filters the tasks based on the values of params.
- Inside `store/useAppStore.tsx`, there is a fetchTasks function which applies a fake delay of 1s and returns the tasks array.


## Run Locally

Clone the project

```bash
  git clone https://github.com/RamGoel/taskore
```

Go to the project directory

```bash
  cd taskore
```

Install dependencies

```bash
  npm install 
```

Start the application

```bash
  npm run dev
```

