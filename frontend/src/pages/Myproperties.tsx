import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader.tsx';
import './Myproperties.css';

interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    phoneno: string;
    companyName: string;
    locality: string;
}

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    offeredPrice: number;
    createdAt: string;
    user: User;
}

interface Billboard {
    id: string;
    size: string;
    location: string;
    billboardType: string;
    price: number;
    bDescription: string;
    bImg: string;
    amenities: string;
    available: boolean;
    bookings: Booking[];
}

const MyProperties: React.FC = () => {
    const [billboards, setBillboards] = useState<Billboard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBillboards = async () => {
            try {
                const authToken = localStorage.getItem('token');
                if (!authToken) {
                    throw new Error('Authorization token is missing');
                }

                const billboardsResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/protected/my-billboards`,
                    { headers: { Authorization: `Bearer ${authToken}` } }
                );

                const billboardsWithBookings = await Promise.all(
                    billboardsResponse.data.data.map(async (billboard: Billboard) => {
                        const bookingsResponse = await axios.get(
                            `${import.meta.env.VITE_API_URL}/api/protected/bookings?billboardId=${billboard.id}`,
                            { headers: { Authorization: `Bearer ${authToken}` } }
                        );
                        return { ...billboard, bookings: bookingsResponse.data.data };
                    })
                );

                setBillboards(billboardsWithBookings);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchBillboards();
    }, []);

    const handleBookingStatus = async (bookingId: string, status: 'approved' | 'rejected') => {
        try {
            const authToken = localStorage.getItem('token');
            if (!authToken) throw new Error('Authorization token missing');

            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/protected/bookings/${bookingId}`,
                { status },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            setBillboards((prev) =>
                prev.map((billboard) => ({
                    ...billboard,
                    bookings: billboard.bookings.map((booking) =>
                        booking.id === bookingId ? { ...booking, status } : booking
                    ),
                }))
            );
        } catch (err) {
            console.error('Error updating booking status:', err);
            alert('Error updating booking status');
        }
    };

    const filteredBillboards = useMemo(() => {
        return billboards.map(billboard => ({
            ...billboard,
            bookings: billboard.bookings.filter(booking =>
                filterStatus === 'all' ? true : booking.status === filterStatus
            )
        }));
    }, [billboards, filterStatus]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="admin-container">
            <nav className="admin-navbar">
                <div className="nav-left">
                    <h1 className="admin-title">My Billboards</h1>
                </div>
                <div className="nav-center">
                    <select
                        className="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Requests</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div className="nav-right">
                    <button className="nav-link" onClick={() => navigate('/profile')}>
                        Profile
                    </button>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <main className="dashboard-content">
                {filteredBillboards.length > 0 ? (
                    <div className="billboard-grid">
                        {filteredBillboards.map((billboard) => (
                            <article key={billboard.id} className="billboard-card">
                                <div className="card-image">
                                    <img
                                        src={`http://localhost:3000/${billboard.bImg}`}
                                        alt={billboard.location}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/fallback-image.jpg';
                                        }}
                                    />
                                    <div className="availability-badge" data-available={billboard.available}>
                                        {billboard.available ? 'Available' : 'Not Available'}
                                    </div>
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
                                    {billboard.amenities && (
                                        <p className="amenities">
                                            <strong>Amenities:</strong> {billboard.amenities}
                                        </p>
                                    )}

                                    <div className="bookings-section">
                                        <h4>Booking Requests ({billboard.bookings.length})</h4>
                                        {billboard.bookings.length > 0 ? (
                                            <div className="booking-list">
                                                {billboard.bookings.map((booking) => (
                                                    <div key={booking.id} className="booking-item">
                                                        <div className="booking-info">
                                                            <div className="user-details">
                                                                <h5>Requester Details</h5>
                                                                <p className="user-name">
                                                                    <strong>Name:</strong> {booking.user.firstname} {booking.user.lastname}
                                                                </p>
                                                                <p className="user-email">
                                                                    <strong>Email:</strong> {booking.user.email}
                                                                </p>
                                                                <p className="user-phone">
                                                                    <strong>Phone:</strong> {booking.user.phoneno}
                                                                </p>
                                                                {booking.user.companyName && (
                                                                    <p className="company-name">
                                                                        <strong>Company:</strong> {booking.user.companyName}
                                                                    </p>
                                                                )}
                                                                <p className="user-location">
                                                                    <strong>Location:</strong> {booking.user.locality}
                                                                </p>
                                                            </div>
                                                            <div className="booking-details">
                                                                <p className="booking-dates">
                                                                    <strong>Duration:</strong>{' '}
                                                                    {new Date(booking.startDate).toLocaleDateString()} -{' '}
                                                                    {new Date(booking.endDate).toLocaleDateString()}
                                                                </p>
                                                                <p className="offer-price">
                                                                    <strong>Offered Price:</strong>{' '}
                                                                    ${booking.offeredPrice}/month
                                                                </p>
                                                                <p className="request-date">
                                                                    <strong>Requested on:</strong>{' '}
                                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                                </p>
                                                                <span className={`status-badge ${booking.status}`}>
                                                                    {booking.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {booking.status === 'pending' && (
                                                            <div className="booking-actions">
                                                                <button
                                                                    className="approve-button"
                                                                    onClick={() => handleBookingStatus(booking.id, 'approved')}
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    className="reject-button"
                                                                    onClick={() => handleBookingStatus(booking.id, 'rejected')}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="no-bookings">No booking requests yet</p>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>You haven't posted any billboards yet</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyProperties;