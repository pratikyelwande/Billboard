import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import { useNavigate } from "react-router-dom";
    import Loader from '../../components/Loader.tsx'; // Import your Loader component
    import './Dashboard.css';

    interface Billboard {
        id: string;
        size: string;
        location: string;
        billboardType: string;
        price: number;
        bDescription: string;
        bImg: string;
    }

    const AdminDashboard: React.FC = () => {
        const [billboards, setBillboards] = useState<Billboard[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string>('');
        const navigate = useNavigate();

        useEffect(() => {
            const fetchBillboards = async () => {
                try {
                    const authToken = localStorage.getItem('token');
                    if (!authToken) {
                        throw new Error('Authorization token is missing');
                    }
                    const apiUrl = `${import.meta.env.VITE_API_URL}/api/protected/admin/billboards`;

                    const response = await axios.get(apiUrl, {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                        },
                    });

                    setBillboards(response.data?.data || []);
                } catch (err) {
                    console.error('Error fetching billboards:', err);
                    setError(err instanceof Error ? err.message : 'Failed to fetch billboards');
                } finally {
                    setLoading(false);
                }
            };

            fetchBillboards();
        }, []);

        const handleApprove = async (id: string) => {
            try {
                const authToken = localStorage.getItem('token');
                if (!authToken) {
                    throw new Error('Authorization token is missing');
                }
                const apiUrl = `${import.meta.env.VITE_API_URL}/api/protected/billboards/${id}/approve`;
                const response = await axios.put(apiUrl, {}, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                });
                console.log(response.data.message);
                // Remove the approved billboard from the state so it no longer displays
                setBillboards(prev => prev.filter(billboard => billboard.id !== id));
            } catch (err) {
                console.error('Error approving billboard:', err);
                alert('Error approving billboard');
            }
        };

        const handleReject = (id: string) => {
            console.log(`Rejected billboard with ID: ${id}`);
            // For now, simply remove the billboard from the list; extend this as needed
            setBillboards(prev => prev.filter(billboard => billboard.id !== id));
        };

        const handleLogout = () => {
            localStorage.removeItem('token');
            navigate('/login');
        };

        const handleProfile = () => {
            navigate('/profile');
        };

        const handleViewProperties = () => {
            navigate('/showproperties');
        };

        if (loading) {
            return <Loader />;
        }

        if (error) {
            return <div className="slideshow-container">{error}</div>;
        }

        return (
            <div className="admin-container">
                <nav className="admin-navbar">
                    <div className="nav-left">
                        <h1 className="admin-title">Billboard Admin</h1>
                    </div>
                    <div className="nav-right">
                        <button className="nav-link" onClick={handleProfile}>Profile</button>
                        <button className="nav-link" onClick={handleViewProperties}>Properties</button>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                </nav>

                <header className="dashboard-header">
                    <h2>Unapproved Billboards</h2>
                    {billboards.length > 0 && <span className="count-badge">{billboards.length} pending</span>}
                </header>

                <main className="dashboard-content">
                    {billboards.length > 0 ? (
                        <div className="billboard-grid">
                            {billboards.map((billboard) => (
                                <article key={billboard.id} className="billboard-card">
                                    <div className="card-image">
                                        <img
                                            src={`http://localhost:3000/${billboard.bImg}`}
                                            alt={billboard.location}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/fallback-image.jpg';
                                            }}
                                        />
                                    </div>
                                    <div className="card-content">
                                        <h3>{billboard.location}</h3>
                                        <div className="card-meta">
                                            <span>{billboard.size}</span>
                                            <span>•</span>
                                            <span>{billboard.billboardType}</span>
                                        </div>
                                        <p className="price">${billboard.price}/month</p>
                                        <p className="description">{billboard.bDescription}</p>
                                        <div className="card-actions">
                                            <button
                                                className="approve-button"
                                                onClick={() => handleApprove(billboard.id)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="reject-button"
                                                onClick={() => handleReject(billboard.id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>No unapproved billboards found</p>
                        </div>
                    )}
                </main>
            </div>
        );
    };

    export default AdminDashboard;