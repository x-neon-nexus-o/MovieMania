import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddMoviePage from './pages/AddMoviePage';
import EditMoviePage from './pages/EditMoviePage';
import MovieDetailPage from './pages/MovieDetailPage';
import StatsPage from './pages/StatsPage';
import WatchlistPage from './pages/WatchlistPage';
import CollectionsPage from './pages/CollectionsPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
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

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
