import React, { useState } from 'react';
            import { z } from 'zod';
            import { InputField } from '../components/InputField';
            import { Link, useNavigate } from "react-router-dom";
            import axios from 'axios';

            const signupSchema = z.object({
                roleName: z.enum(['User', 'Owner']),
                email: z.string().email(),
                password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
                confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters long" }),
                firstName: z.string().min(1),
                lastName: z.string().min(1),
                phoneno: z.string(),
                dob: z.string(),
                companyName: z.string().optional(),
                gender: z.enum(['Male', 'Female']),
                locality: z.string().min(1, { message: "Locality is required" }),
            }).refine(data => data.password === data.confirmPassword, {
                message: "Passwords don't match",
                path: ['confirmPassword'],
            });

            interface FormData {
                roleName: string;
                email: string;
                password: string;
                confirmPassword: string;
                firstName: string;
                lastName: string;
                phoneno: string;
                dob: string;
                companyName?: string;
                gender: 'Male' | 'Female';
                locality: string;
            }

            const Signup: React.FC = () => {
                const [roleName, setRoleName] = useState<string>('User');
                const [formData, setFormData] = useState<FormData>({
                    roleName: 'User',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    phoneno: '',
                    dob: '',
                    companyName: '',
                    gender: 'Male',
                    locality: '',
                });
                const [errors, setErrors] = useState<Record<string, z.ZodIssue[]>>({});
                const navigate = useNavigate();

                const handleRoleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
                    setRoleName(event.target.value);
                    setFormData({ ...formData, roleName: event.target.value });
                };

                const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                    const { name, value, type } = event.target;
                    const checked = (event.target as HTMLInputElement).checked;
                    setFormData({
                        ...formData,
                        [name]: type === 'checkbox' ? checked : value,
                    });
                };

                const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    console.log('Form data before validation:', formData);
                    const result = signupSchema.safeParse(formData);
                    if (!result.success) {
                        const formattedErrors = result.error.format();
                        setErrors(formattedErrors);
                        console.log('Validation errors:', formattedErrors);
                    } else {
                        setErrors({});
                        try {
                            console.log('Sending signup request with data:', formData);
                            const response = await axios.post(`http://localhost:3000/api/auth/register`, formData, {
                                withCredentials: true,
                            });
                            navigate("/login");
                            console.log('Signup successful:', response.data);
                        } catch (error: unknown) {
                            if (axios.isAxiosError(error)) {
                                console.error('Signup error:', error.response?.data || error.message);
                            } else {
                                console.error('Signup error:', error);
                            }
                        }
                    }
                };

                return (
                    <div className="bg-gradient-to-r from-[#4158D0] via-[#C850C0] to-[#FFCC70] min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                <form method="POST" action="#" onSubmit={handleSubmit}>
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700" htmlFor="role_name">
                                            Role
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="role_name"
                                                name="roleName"
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={roleName}
                                                onChange={handleRoleNameChange}
                                            >
                                                <option value="User">User</option>
                                                <option value="Owner">Owner</option>
                                            </select>
                                        </div>
                                    </div>
                                    <InputField label="Email address" type="email" name="email" placeholder="abc@gmail.com"
                                                autoComplete="email" onChange={handleChange}/>
                                    {errors.email && <p className="text-red-500 text-xs">{errors.email[0].message}</p>}
                                    <InputField label="Password" type="password" name="password" autoComplete="current-password"
                                                onChange={handleChange}/>
                                    {errors.password && <p className="text-red-500 text-xs">{errors.password[0].message}</p>}
                                    <InputField label="Confirm Password" type="password" name="confirmPassword"
                                                autoComplete="current-password" onChange={handleChange}/>
                                    {errors.confirmPassword &&
                                        <p className="text-red-500 text-xs">{errors.confirmPassword[0].message}</p>}
                                    <InputField label="First Name" type="text" name="firstName" placeholder="andrew"
                                                onChange={handleChange}/>
                                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName[0].message}</p>}
                                    <InputField label="Last Name" type="text" name="lastName" placeholder="Garfield"
                                                onChange={handleChange}/>
                                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName[0].message}</p>}
                                    <InputField label="Phone number" type="number" name="phoneno" placeholder="1234567890"
                                                onChange={handleChange}/>
                                    {errors.phoneno && <p className="text-red-500 text-xs">{errors.phoneno[0].message}</p>}
                                    <InputField label="Date of Birth" type="date" name="dob" onChange={handleChange}/>
                                    {errors.dob && <p className="text-red-500 text-xs">{errors.dob[0].message}</p>}
                                    {roleName === 'Owner' && (
                                        <>
                                            <InputField label="Company Name" type="text" name="companyName"
                                                        placeholder="Company Name" onChange={handleChange}/>
                                            {errors.companyName &&
                                                <p className="text-red-500 text-xs">{errors.companyName[0].message}</p>}
                                        </>
                                    )}
                                    <InputField label="Locality" type="text" name="locality" placeholder="Enter your locality"
                                                onChange={handleChange}/>
                                    {errors.locality && <p className="text-red-500 text-xs">{errors.locality[0].message}</p>}

                                    <div className="flex items-center justify-center mt-6">
                                        <span className="mr-3 text-gray-700 font-medium">Gender:</span>
                                        <label className="inline-flex items-center">
                                            <input type="radio" className="form-radio h-5 w-5 text-pink-600" name="gender"
                                                   value="Male" checked={formData.gender === 'Male'} onChange={handleChange}/>
                                            <span className="ml-2 text-gray-700">Male</span>
                                        </label>
                                        <label className="inline-flex items-center ml-6">
                                            <input type="radio" className="form-radio h-5 w-5 text-purple-600" name="gender"
                                                   value="Female" checked={formData.gender === 'Female'} onChange={handleChange}/>
                                            <span className="ml-2 text-gray-700">Female</span>
                                        </label>
                                    </div>
                                    {errors.gender && <p className="text-red-500 text-xs">{errors.gender[0].message}</p>}
                                    <div className="mt-6">
                                        <button
                                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            type="submit"
                                        >
                                            Sign up
                                        </button>
                                    </div>
                                </form>
                                <div className="signup-link flex m-2 ">
                                    <span>Have an account? </span>
                                    <Link to="/" className="text-blue-500 hover:underline"> Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            };

            export default Signup;