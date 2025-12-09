import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetailPage from './pages/MovieDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { PageLoader } from './components/common/LoadingSpinner';

// Lazy load heavy pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AddMoviePage = lazy(() => import('./pages/AddMoviePage'));
const EditMoviePage = lazy(() => import('./pages/EditMoviePage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const CollectionDetailPage = lazy(() => import('./pages/CollectionDetailPage'));
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));

function App() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Public routes */}
                        <Route index element={<HomePage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="movie/:id" element={<MovieDetailPage />} />
                        <Route path="stats" element={<StatsPage />} />

                        {/* Protected routes */}
                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="watchlist"
                            element={
                                <ProtectedRoute>
                                    <WatchlistPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="collections"
                            element={
                                <ProtectedRoute>
                                    <CollectionsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="collections/:id"
                            element={
                                <ProtectedRoute>
                                    <CollectionDetailPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="add"
                            element={
                                <ProtectedRoute>
                                    <AddMoviePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="edit/:id"
                            element={
                                <ProtectedRoute>
                                    <EditMoviePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="for-you"
                            element={
                                <ProtectedRoute>
                                    <RecommendationsPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
}

export default App;
