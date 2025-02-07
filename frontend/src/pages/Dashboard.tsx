import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
                     import axios from 'axios';
                     import { useNavigate } from "react-router-dom";
                     import './Dashboard.css'; // Import the CSS file

                     interface BillboardFormData {
                         size: string;
                         location: string;
                         billboardType: string;
                         price: string;
                         available: string;
                         amenities: string;
                         bImg: File | null;
                         bReview: string;
                         bDescription: string;
                     }

                     export const Dashboard = () => {
                         const [showForm, setShowForm] = useState(false);
                         const [formData, setFormData] = useState<BillboardFormData>({
                             size: '',
                             location: '',
                             billboardType: 'Digital',
                             price: '',
                             available: 'Yes',
                             amenities: '',
                             bImg: null,
                             bReview: '',
                             bDescription: '',
                         });
                         const formRef = useRef<HTMLDivElement>(null);
                         const navigate = useNavigate();

                         const handleClick = () => {
                             setShowForm(!showForm);
                         };

                         const handleClick1 = () => {
                             navigate("/showproperties");
                         };

                         const handleClickOutside = (event: MouseEvent) => {
                             if (formRef.current && !formRef.current.contains(event.target as Node)) {
                                 setShowForm(false);
                             }
                         };

                         useEffect(() => {
                             if (showForm) {
                                 document.addEventListener('mousedown', handleClickOutside);
                             } else {
                                 document.removeEventListener('mousedown', handleClickOutside);
                             }

                             return () => {
                                 document.removeEventListener('mousedown', handleClickOutside);
                             };
                         }, [showForm]);

                         const handleChange = (
                             e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
                         ) => {
                             const { name, value } = e.target;
                             setFormData(prev => ({
                                 ...prev,
                                 [name]: value
                             }));
                         };

                         const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
                             if (e.target.files?.[0]) {
                                 setFormData(prev => ({
                                     ...prev,
                                     bImg: e.target.files![0]
                                 }));
                             }
                         };

                         const handleSubmit = async (e: FormEvent) => {
                             e.preventDefault();

                             try {
                                 const token = localStorage.getItem('token');
                                 if (!token) {
                                     throw new Error('No authentication token found');
                                 }

                                 // Create JSON data for Prisma
                                 const jsonData = {
                                     size: formData.size,
                                     location: formData.location,
                                     billboardType: formData.billboardType,
                                     price: parseFloat(formData.price),
                                     available: formData.available === 'Yes',
                                     amenities: formData.amenities,
                                     bReview: formData.bReview,
                                     bDescription: formData.bDescription
                                 };

                                 console.log('Sending data:', jsonData);

                                 // If there's an image, use FormData
                                 if (formData.bImg) {
                                     const formDataWithFile = new FormData();
                                     formDataWithFile.append('bImg', formData.bImg);

                                     // Add all other fields to FormData
                                     Object.entries(jsonData).forEach(([key, value]) => {
                                         formDataWithFile.append(key, value.toString());
                                     });

                                     const response = await axios.post(
                                         `${import.meta.env.VITE_API_URL}/api/protected/billboards`,
                                         formDataWithFile,
                                         {
                                             headers: {
                                                 'Authorization': `Bearer ${token}`,
                                                 'Content-Type': 'multipart/form-data'
                                             }
                                         }
                                     );

                                     if (response.data.status === 'success') {
                                         alert('Billboard created successfully!');
                                         setShowForm(false);
                                         resetForm();
                                     }
                                 } else {
                                     // If no image, send JSON directly
                                     const response = await axios.post(
                                         `${import.meta.env.VITE_API_URL}/api/protected/billboards`,
                                         jsonData,
                                         {
                                             headers: {
                                                 'Authorization': `Bearer ${token}`,
                                                 'Content-Type': 'application/json'
                                             }
                                         }
                                     );

                                     if (response.data.status === 'success') {
                                         alert('Billboard created successfully!');
                                         setShowForm(false);
                                         resetForm();
                                     }
                                 }
                             } catch (error: any) {
                                 console.error('Full error:', error);
                                 if (error.response?.data) {
                                     console.error('Error response data:', error.response.data);
                                     alert(error.response.data.message || 'Failed to create billboard');
                                 } else {
                                     alert('Failed to create billboard');
                                 }
                             }
                         };

                         const resetForm = () => {
                             setFormData({
                                 size: '',
                                 location: '',
                                 billboardType: 'Digital',
                                 price: '',
                                 available: 'Yes',
                                 amenities: '',
                                 bImg: null,
                                 bReview: '',
                                 bDescription: '',
                             });
                         };

                         const handleLogout = () => {
                             localStorage.removeItem('token');
                             navigate('/login');
                         };

                         return (
                             <div className="slideshow-container">
                                 <button className="logout-button" onClick={handleLogout}>
                                     Logout
                                 </button>
                                 <div className="button-container">
                                     <button onClick={handleClick}>
                                         Post Property
                                     </button>
                                     <button onClick={handleClick1}>
                                         View Properties
                                     </button>
                                 </div>

                                 {showForm && (
                                     <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
                                         <div ref={formRef} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                                             <form onSubmit={handleSubmit} className="space-y-4">
                                                 <div>
                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
                                                         Size *
                                                     </label>
                                                     <input
                                                         required
                                                         name="size"
                                                         value={formData.size}
                                                         onChange={handleChange}
                                                         placeholder="e.g., 14x48"
                                                         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                     />
                                                 </div>

                                                 <div>
                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
                                                         Location *
                                                     </label>
                                                     <input
                                                         required
                                                         name="location"
                                                         value={formData.location}
                                                         onChange={handleChange}
                                                         placeholder="e.g., Downtown, Main Street"
                                                         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                     />
                                                 </div>

                                                 <div>
                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
                                                         Billboard Type
                                                     </label>
                                                     <select
                                                         name="billboardType"
                                                         value={formData.billboardType}
                                                         onChange={handleChange}
                                                         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                     >
                                                         <option value="Digital">Digital</option>
                                                         <option value="Printed">Printed</option>
                                                     </select>
                                                 </div>

                                                 <div>
                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
                                                         Price *
                                                     </label>
                                                     <input
                                                         required
                                                         type="number"
                                                         name="price"
                                                         value={formData.price}
                                                         onChange={handleChange}
                                                         placeholder="Enter price"
                                                         min="0"
                                                         step="0.01"
                                                         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                     />
                                                 </div>

                                                 <div>
                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
                                                         Available
                                                     </label>
                                                     <select
                                                         name="available"
                                                         value={formData.available}
                                                         onChange={handleChange}
                                                         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                     >
                                                         <option value="Yes">Yes</option>
                                                         <option value="No">No</option>
                                                     </select>
                                                 </div>

                                                 <div>
                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
                                                         Amenities
                                                     </label>
                                                     <input
                                                         name="amenities"
                                                         value={formData.amenities}
                                                         onChange={handleChange}
                                                         placeholder="e.g., Lighting, Wi-Fi"
                                                         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                     />
                                                 </div>

                                                 <div>
                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
                                                         Image
                                                     </label>
                                                     <input
                                                         type="file"
                                                         name="bImg"
                                                         onChange={handleFileChange}
                                                         accept="image/*"
                                                         className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                     />
                                                 </div>

                                                 <div>
                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
                                                         Review
                                                     </label>
                                                     <textarea
                                                         name="bReview"
                                                         value={formData.bReview}
                                                         onChange={handleChange}
                                                         placeholder="Enter review"
                                                         rows={3}
                                                         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                     />
                                                 </div>

                                                 <div>
                                                     <label className="block text-sm font-medium text-gray-700 mb-1">
                                                         Description
                                                     </label>
                                                     <textarea
                                                         name="bDescription"
                                                         value={formData.bDescription}
                                                         onChange={handleChange}
                                                         placeholder="Enter description"
                                                         rows={4}
                                                         className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                     />
                                                 </div>

                                                 <div className="flex justify-end space-x-3">
                                                     <button
                                                         type="button"
                                                         onClick={() => setShowForm(false)}
                                                         className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                                     >
                                                         Cancel
                                                     </button>
                                                     <button
                                                         type="submit"
                                                         className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                                                     >
                                                         Submit
                                                     </button>
                                                 </div>
                                             </form>
                                         </div>
                                     </div>
                                 )}
                             </div>
                         );
                     };

                     export default Dashboard;