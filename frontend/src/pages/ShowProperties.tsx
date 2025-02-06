import { useEffect, useState } from "react";
                               import { Square } from "lucide-react";

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
                                               const mappedData = result.data.map((billboard: Billboard) => ({
                                                   ...billboard,
                                                   _id: billboard._id || billboard.id,
                                               }));
                                               setBillboards(mappedData);
                                           } catch (err) {
                                               setError(err instanceof Error ? err.message : 'Failed to fetch billboards');
                                           } finally {
                                               setLoading(false);
                                           }
                                       };

                                       fetchBillboards();
                                   }, []);

                                   if (loading) return <div className="text-center p-4">Loading...</div>;
                                   if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
                                   if (billboards.length === 0) return <div className="text-center p-4">No billboards available</div>;

                                   return (
                                       <div className="container mx-auto p-6">
                                           <h1 className="text-2xl font-bold mb-6">Available Billboards</h1>
                                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                               {billboards.map((billboard) => {
                                                   return (
                                                       <div key={billboard._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                                           <div className="relative h-48">
                                                               <img
                                                                   src={billboard.bImg || billboard.imageUrl || "/assets/demo.jpg"}
                                                                   alt={billboard.title}
                                                                   className="w-full h-full object-cover"
                                                               />
                                                               <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                                                                   {billboard.status}
                                                               </span>
                                                           </div>
                                                           <div className="p-4">
                                                               <h2 className="text-xl font-bold mb-2">{billboard.title}</h2>
                                                               <p className="text-gray-600">{billboard.location}</p>
                                                               <p className="text-gray-500 mt-2">{billboard.description}</p>
                                                               <div className="space-y-2 mt-4">
                                                                   <div className="flex items-center gap-2">
                                                                       <Square className="h-4 w-4" />
                                                                       <span>Size: {billboard.size}</span>
                                                                   </div>
                                                                   <div className="flex items-center gap-2">
                                                                       <Square className="h-4 w-4" />
                                                                       <span>Area: {billboard.totalArea} sq.ft</span>
                                                                   </div>
                                                                   <div className="flex items-center gap-2">
                                                                       <span className="font-semibold">₹{billboard.price}/month</span>
                                                                   </div>
                                                               </div>
                                                               <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                                                                   View Details
                                                               </button>
                                                           </div>
                                                       </div>
                                                   );
                                               })}
                                           </div>
                                       </div>
                                   );
                               };

                               export default ShowProperties;