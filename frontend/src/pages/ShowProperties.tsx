import { useEffect, useState } from "react";
                                                            import B1 from "../components/B1";
                                                            import Loader from "../components/Loader";

                                                            interface Billboard {
                                                                _id: string;
                                                                id?: string;
                                                                imageUrl?: string;
                                                                bImg?: string;
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
                                                                            console.log("API Response:", result); // Log the API response

                                                                            const mappedData = result.data.map((billboard: any) => ({
                                                                                ...billboard,
                                                                                _id: billboard._id || billboard.id,
                                                                                description: billboard.bDescription, // Map bDescription to description
                                                                            }));
                                                                            console.log("Mapped Data:", mappedData); // Log the mapped data

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
                                                                        <div className="container mx-auto p-6">
                                                                            <h1 className="text-2xl font-bold mb-6">Available Billboards</h1>
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                                {billboards.map((billboard) => {
                                                                                    console.log("Description:", billboard.description); // Log the description
                                                                                    return (
                                                                                        <div key={billboard._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                                                                            <div className="relative h-48">
                                                                                                <img
                                                                                                    src={billboard.bImg || billboard.imageUrl || "/assets/image2.jpg"}
                                                                                                    alt={billboard.title}
                                                                                                    className="w-full h-full object-cover"
                                                                                                />
                                                                                                <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                                                                                                    {billboard.status}
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="p-4">
                                                                                                <h2 className="text-xl font-bold mb-2">{billboard.title}</h2>
                                                                                                <div className="flex items-center text-gray-600">
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-map-pin">
                                                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                                                                                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                                                                                                    </svg>
                                                                                                    <span className="ml-2">{billboard.location}</span>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-4 mt-4"> {/* Added gap-4 for spacing */}
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-ruler-3">
                                                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                                        <path d="M19.875 8c.621 0 1.125 .512 1.125 1.143v5.714c0 .631 -.504 1.143 -1.125 1.143h-15.875a1 1 0 0 1 -1 -1v-5.857c0 -.631 .504 -1.143 1.125 -1.143h15.75z" />
                                                                                                        <path d="M9 8v2" />
                                                                                                        <path d="M6 8v3" />
                                                                                                        <path d="M12 8v3" />
                                                                                                        <path d="M18 8v3" />
                                                                                                        <path d="M15 8v2" />
                                                                                                    </svg>
                                                                                                    <span>Size: {billboard.size}</span>
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-ruler-3">
                                                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                                        <path d="M19.875 8c.621 0 1.125 .512 1.125 1.143v5.714c0 .631 -.504 1.143 -1.125 1.143h-15.875a1 1 0 0 1 -1 -1v-5.857c0 -.631 .504 -1.143 1.125 -1.143h15.75z" />
                                                                                                        <path d="M9 8v2" />
                                                                                                        <path d="M6 8v3" />
                                                                                                        <path d="M12 8v3" />
                                                                                                        <path d="M18 8v3" />
                                                                                                        <path d="M15 8v2" />
                                                                                                    </svg>
                                                                                                    <span>Area: {billboard.totalArea} sq.ft</span>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-2 mt-2">
                                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-currency-rupee">
                                                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                                        <path d="M18 5h-11h3a4 4 0 0 1 0 8h-3l6 6" />
                                                                                                        <path d="M7 9l11 0" />
                                                                                                    </svg>
                                                                                                    <span className="font-semibold">₹{billboard.price}/month</span>
                                                                                                </div>
                                                                                                {billboard.amenities && (
                                                                                                    <div className="mt-4 flex items-center gap-2">
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-badge-right">
                                                                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                                                                            <path d="M13 7h-6l4 5l-4 5h6l4 -5z" />
                                                                                                        </svg>
                                                                                                        <h3 className="text-sm font-semibold">Amenities:</h3> {/* Changed text-lg to text-sm */}
                                                                                                        <p className="text-sm">{billboard.amenities}</p> {/* Changed text-lg to text-sm */}
                                                                                                    </div>
                                                                                                )}
                                                                                                <p className="text-gray-500 mt-2">{billboard.description}</p>
                                                                                            </div>
                                                                                            <div className="flex justify-center p-4">
                                                                                                <B1 buttonName="Book Billboard" onClick={() => console.log(`Booking billboard ${billboard._id}`)} />
                                                                                            </div>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                );
                                                            };

                                                            export default ShowProperties;