// src/routes/AppRoutes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Root from '../layouts/Root';
import Home from '../pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />, // A layout component wrapping your content (header, footer, etc.)
    children: [],
  },
]);

export default router;
