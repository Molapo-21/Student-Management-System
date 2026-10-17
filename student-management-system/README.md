# NOIR / CAMPUS — Interactive Student Management System

A React + JavaScript student records application built for the DIWA2110 Web Application Development individual assignment. The UI uses the provided Gothic Noir palette: black `#000000`, grey `#D1D0D0`, mauve `#988686`, and taupe `#5C4E4E`.

## Features
- Student dashboard with summary metrics and a searchable/filterable directory
- Create, view, edit, and delete student records
- Functional add/edit forms and delete confirmation modal
- Validation for required name, age range (16–100), email format, course, and status
- Automatically generated student IDs
- React state updates and persistent browser `localStorage`
- CSV export, empty state, success messages, keyboard Escape modal close
- Responsive desktop, tablet, and mobile layouts

## Requirements
- Node.js 18 or newer recommended
- npm

## Run locally
1. Extract the project folder.
2. Open a terminal in the folder containing `package.json`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local URL shown in the terminal (usually `http://localhost:5173`).

To verify a production build:
```bash
npm run build
npm run preview
```

## Deploy to Netlify
1. Push this project to a GitHub repository. Do not upload `node_modules`.
2. In Netlify, choose **Add new site → Import an existing project** and connect the repository.
3. Set build command to `npm run build` and publish directory to `dist`.
4. Deploy, open the public URL, and test add/edit/delete and filters.

## Deploy to Vercel
1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Use the Vite framework preset; build command `npm run build`, output directory `dist`.
4. Deploy and test the public URL.

## GitHub upload
From the project folder:
```bash
git init
git add .
git commit -m "Build Gothic Noir student management system"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Testing checklist
- [ ] Add a valid student and confirm it appears without refreshing.
- [ ] Try submitting blank name, invalid age, and invalid email; confirm errors appear and no record is saved.
- [ ] Edit a student and confirm updated information appears.
- [ ] Open delete confirmation, cancel, and verify the student remains.
- [ ] Confirm deletion and verify the student disappears.
- [ ] Search by name, ID, email, and course.
- [ ] Filter by status and course; clear filters.
- [ ] Export CSV and verify the downloaded file.
- [ ] Refresh the page and verify records persist in the same browser.
- [ ] Test the empty state and a narrow/mobile viewport.
- [ ] Verify deployed public URL works in a private/incognito window.

## JavaScript and React concepts demonstrated
- **Strings:** name, email, ID, course, status.
- **Number:** age.
- **Boolean:** validation checks and conditional UI expressions.
- **Array:** student records and course options.
- **Objects:** each student and form/error state.
- **`const`:** values and function references that are not reassigned.
- **`let`:** not required in this implementation; `const` and React state are sufficient. Use `let` in a local example if demonstrating reassignment explicitly.
- **Functions and arrow functions:** reusable validation, ID generation, CSV export, save/delete handlers.
- **Array methods:** `map`, `filter`, `reduce`, `some`.
- **React:** functional components, JSX, props, `useState`, `useEffect`, `useMemo`, event handlers, and modal state.

## Data storage note
Records are saved in the browser's local storage on the current device/browser. This is a front-end assignment demonstration, not a shared server database. Clearing browser storage or switching devices may remove or hide saved records. Sample records are fictional.
