import { useEffect, useState } from "react";
                                                    import B1 from "../components/B1";
                                                    import Loader from "../components/Loader";

                                                    interface Billboard {
                                                        _id: string;
                                                        id?: string;
                                                        imageUrl?: string;
                                                        bImg?: string[];
                                                        title: string;
                                                        location: string;
                                                        description: string;
                                                        size: string;
                                                        totalArea: string;
                                                        price: number;
                                                        status: string;
                                                        type: string;
                                                        ownerId: string;
                                                        amenities?: string;
                                                    }

                                                    const ShowProperties = () => {
                                                        const [billboards, setBillboards] = useState<Billboard[]>([]);
                                                        const [loading, setLoading] = useState<boolean>(true);
                                                        const [error, setError] = useState<string | null>(null);

                                                        useEffect(() => {
                                                            const fetchBillboards = async () => {
                                                                try {
                                                                    const token = localStorage.getItem("authToken");

                                                                    const response = await fetch("http://localhost:3000/api/protected/billboards", {
                                                                        method: "GET",
                                                                        headers: {
                                                                            "Authorization": `Bearer ${token || ''}`,
                                                                            "Content-Type": "application/json",
                                                                        },
                                                                        credentials: "include"
                                                                    });

                                                                    if (!response.ok) {
                                                                        const errorData = await response.json();
                                                                        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                                                                    }

                                                                    const result = await response.json();

                                                                    const mappedData = result.data.map((billboard: any) => {
                                                                        console.log("Billboard Type:", billboard.billboardType); // Log the type
                                                                        return {
                                                                            ...billboard,
                                                                            _id: billboard._id || billboard.id,
                                                                            description: billboard.bDescription, // Map bDescription to description
                                                                            bImg: billboard.bImg ? billboard.bImg.split(',') : [], // Split bImg into an array
                                                                            type: billboard.billboardType, // Map billboardType to type
                                                                        };
                                                                    });

                                                                    setBillboards(mappedData);
                                                                } catch (err) {
                                                                    setError(err instanceof Error ? err.message : 'Failed to fetch billboards');
                                                                } finally {
                                                                    setLoading(false);
                                                                }
                                                            };

                                                            fetchBillboards();
                                                        }, []);

                                                        if (loading) return <Loader />;
                                                        if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
                                                        if (billboards.length === 0) return <div className="text-center p-4">No billboards available</div>;

                                                        return (
                                                            <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
                                                                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Billboards</h1>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                    {billboards.map((billboard) => {
                                                                        return (
                                                                            <div key={billboard._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                                                                <div className="relative h-48">
                                                                                    {billboard.bImg && billboard.bImg.length > 0 && (
                                                                                        <Slideshow images={billboard.bImg} />
                                                                                    )}
                                                                                </div>
                                                                                <div className="p-4">
                                                                                    <p className="text-gray-700 flex items-center mb-2">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin mr-2">
                                                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                                                                            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                                                                                        </svg>
                                                                                        <strong>Location:</strong> {billboard.location}
                                                                                    </p>
                                                                                    <div className="flex justify-between mb-2">
                                                                                        <p className="text-gray-700 flex items-center">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-ruler-3 mr-2">
                                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                                <path d="M19.875 8c.621 0 1.125 .512 1.125 1.143v5.714c0 .631 -.504 1.143 -1.125 1.143h-15.875a1 1 0 0 1 -1 -1v-5.857c0 -.631 .504 -1.143 1.125 -1.143h15.75z" />
                                                                                                <path d="M9 8v2" />
                                                                                                <path d="M6 8v3" />
                                                                                                <path d="M12 8v3" />
                                                                                                <path d="M18 8v3" />
                                                                                                <path d="M15 8v2" />
                                                                                            </svg>
                                                                                            <strong>Size:</strong> {billboard.size}
                                                                                        </p>
                                                                                        <p className="text-gray-700 flex items-center">
                                                                                            <strong>Price:</strong> {billboard.price}
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-coin-rupee ml-2">
                                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                                                                <path d="M15 8h-6h1a3 3 0 0 1 0 6h-1l3 3" />
                                                                                                <path d="M9 11h6" />
                                                                                            </svg>
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="flex justify-between mb-2">
                                                                                        <p className="text-gray-700 flex items-center">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-torchain mr-2">
                                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                                <path d="M15.588 15.537l-3.553 -3.537l-7.742 8.18c-.791 .85 .153 2.18 1.238 1.73l9.616 -4.096a1.398 1.398 0 0 0 .44 -2.277z" />
                                                                                                <path d="M8.412 8.464l3.553 3.536l7.742 -8.18c.791 -.85 -.153 -2.18 -1.238 -1.73l-9.616 4.098a1.398 1.398 0 0 0 -.44 2.277z" />
                                                                                            </svg>
                                                                                            <strong>Type:</strong> {billboard.type}
                                                                                        </p>
                                                                                        <p className="text-gray-700 flex items-center">
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-badge-right mr-2">
                                                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                                <path d="M13 7h-6l4 5l-4 5h6l4 -5z" />
                                                                                            </svg>
                                                                                            <strong>Amenities:</strong> {billboard.amenities}
                                                                                        </p>
                                                                                    </div>
                                                                                    <p className="text-gray-700 mb-4">{billboard.description}</p>
                                                                                    <div className="flex justify-center">
                                                                                        <B1 buttonName="Book billboard" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        );
                                                    };

                                                    const Slideshow = ({ images }: { images: string[] }) => {
                                                        const [currentIndex, setCurrentIndex] = useState(0);

                                                        const nextSlide = () => {
                                                            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                                                        };

                                                        const prevSlide = () => {
                                                            setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
                                                        };

                                                        return (
                                                            <div className="relative h-full">
                                                                <img
                                                                    src={`http://localhost:3000/${images[currentIndex]}`}
                                                                    alt={`Slide ${currentIndex}`}
                                                                    className="object-cover w-full h-full transition-opacity duration-500 ease-in-out opacity-100"
                                                                    key={currentIndex}
                                                                />
                                                                <button
                                                                    onClick={prevSlide}
                                                                    className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-full"
                                                                >
                                                                    &#10094;
                                                                </button>
                                                                <button
                                                                    onClick={nextSlide}
                                                                    className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-full"
                                                                >
                                                                    &#10095;
                                                                </button>
                                                            </div>
                                                        );
                                                    };

                                                    export default ShowProperties;