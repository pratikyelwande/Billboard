import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
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

                if (response.data && response.data.data) {
                    setBillboards(response.data.data);
                } else {
                    throw new Error('Unexpected response structure');
                }
            } catch (err) {
                console.error('Error fetching billboards:', err);
                setError('Error fetching billboards');
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
        return <div className="slideshow-container">Loading billboards...</div>;
    }

    if (error) {
        return <div className="slideshow-container">{error}</div>;
    }

    return (
        <div className="slideshow-container">
            <div className="navbar">
                <div>
                    <a onClick={handleProfile} style={{ cursor: 'pointer' }}>Profile</a>
                </div>
                <div>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="header-text">
                Admin Dashboard: Unapproved Billboards
            </div>
            <div className="button-container">
                <button onClick={handleViewProperties}>View Properties</button>
            </div>
            <div className="billboard-list">
                {billboards.length > 0 ? (
                    <ul>
                        {billboards.map((billboard) => (
                            <li key={billboard.id} className="billboard-card">
                                {/* Image first */}
                                <img src={billboard.bImg} alt={billboard.location} className="billboard-image" />
                                {/* Then location */}
                                <h2>{billboard.location}</h2>
                                {/* Then size, price, and description */}
                                <p>Size: {billboard.size}</p>
                                <p>Price: ${billboard.price}</p>
                                <p>Description: {billboard.bDescription}</p>
                                {/* Approve and Reject buttons */}
                                <div className="billboard-buttons">
                                    <button onClick={() => handleApprove(billboard.id)} className="approve-button">
                                        Approve
                                    </button>
                                    <button onClick={() => handleReject(billboard.id)} className="reject-button">
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: 'white', textAlign: 'center' }}>No unapproved billboards found</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
