# Coupon Distribution System

A round-robin coupon distribution system with abuse prevention mechanisms.
Frontend Link: https://coupon-distribution-snowy.vercel.app/
 Backend Link: https://coupon-distribution-pemp.onrender.com/

## Features

- Sequential coupon distribution
- IP-based claim tracking
- Browser-based claim tracking
- Rate limiting (1 claim per hour)
- Real-time feedback
- Beautiful, responsive UI

## Tech Stack

- Frontend: React, JavaScript, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Additional: Rate limiting, Transaction support

## Setup Instructions

1. Install dependencies:

   ```bash
   # Frontend
   npm install

   # Backend
   cd server
   npm install
   ```

2. Set up MongoDB:

   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in `server/.env`

3. Start the development servers:

   ```bash
   # Backend (in server directory)
   npm run dev

   # Frontend (in root directory)
   npm run dev
   ```

## Abuse Prevention Strategies

1. IP Address Tracking

   - Records IP address for each claim
   - Prevents multiple claims from same IP within 1 hour

2. Browser Tracking

   - Uses browser ID stored in localStorage
   - Prevents multiple claims from same browser within 1 hour

3. Rate Limiting

   - Express rate limiter middleware
   - Limits API requests to 1 per hour per IP

4. Transaction Safety
   - Uses MongoDB transactions
   - Ensures atomic operations for claim process
   - Prevents race conditions

## API Endpoints

- GET `/api/coupons/next`: Get next available coupon
- POST `/api/coupons/claim/:id`: Claim a specific coupon

## Security Considerations

- Rate limiting on sensitive endpoints
- IP and browser tracking
- Atomic transactions
- Input validation
- Error handling
- No sensitive data exposure

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
