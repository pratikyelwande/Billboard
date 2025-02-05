import LoginPage from "./pages/LoginPage.tsx";
                    import { Routes, Route } from "react-router-dom";
                    import Signup from "./pages/Signup.tsx";
                    import { Dashboard } from "./pages/Dashboard.tsx";
                    import ProtectedRoute from "./components/ProtectedRoute.tsx";
                    import { AuthProvider } from "./components/AuthContext.tsx";
                    import { PostProperty } from "./pages/PostProperty.tsx";

                    function App() {
                        return (
                            <AuthProvider>
                                <Routes>
                                    <Route path="/" element={<LoginPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/signup" element={<Signup />} />
                                    <Route path="/dashboard" element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/postproperty" element={
                                        <ProtectedRoute>
                                            <PostProperty />
                                        </ProtectedRoute>
                                    } />

                                </Routes>
                            </AuthProvider>
                        );
                    }

                    export default App;