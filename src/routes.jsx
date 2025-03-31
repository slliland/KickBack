import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes = [
  {
    exact: 'true',
    path: '/login',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/overview/default',
        element: lazy(() => import('./views/overview'))
      },
      // Nations and Legacy group routes
      {
        exact: 'true',
        path: '/nations/countries',
        element: lazy(() => import('./views/nations/countries'))
      },
      {
        exact: 'true',
        path: '/nations/trends',
        element: lazy(() => import('./views/nations/trends'))
      },
      {
        exact: 'true',
        path: '/nations/flag-map',
        element: lazy(() => import('./views/nations/flag-map'))
      },
      {
        exact: 'true',
        path: '/nations/timeline',
        element: lazy(() => import('./views/nations/timeline'))
      },
      {
        exact: 'true',
        path: '/performance/Eurostats',
        element: lazy(() => import('./views/performance/EuroStats'))
      },
      {
        exact: 'true',
        path: '/performance/insights',
        element: lazy(() => import('./views/performance/insights'))
      },
      {
        exact: 'true',
        path: 'profile-page',
        element: lazy(() => import('./views/extra/ProfilePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default routes;
