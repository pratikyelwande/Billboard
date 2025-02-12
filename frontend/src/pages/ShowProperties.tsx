import React, { useEffect, useState, useRef } from "react";
    import styled from "styled-components";
    import axios from "axios";
    import B1 from "../components/B1";
    import Loader from "../components/Loader";

    interface Billboard {
        _id: string;
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

    interface BookingFormData {
        start_date: string;
        end_date: string;
        offered_price: number;
        user_id: string;
        billboard_id: string;
    }

    const ShowProperties: React.FC = () => {
        const [billboards, setBillboards] = useState<Billboard[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
        const [showForm, setShowForm] = useState<boolean>(false);
        const [selectedBillboardId, setSelectedBillboardId] = useState<string | null>(null);
        const [formData, setFormData] = useState<BookingFormData>({
            start_date: "",
            end_date: "",
            offered_price: 0,
            user_id: localStorage.getItem("user_id") || "",
            billboard_id: "",
        });

        const formRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const fetchBillboards = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get("http://localhost:3000/api/protected/billboards", {
                        headers: {
                            "Authorization": `Bearer ${token || ""}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    });

                    if (response.data.status === "success") {
                        const mappedData = response.data.data.map((billboard: any) => ({
                            ...billboard,
                            _id: billboard.id,
                            description: billboard.bDescription,
                            bImg: billboard.bImg ? billboard.bImg.split(",") : [],
                            type: billboard.billboardType,
                        }));
                        setBillboards(mappedData);
                    } else {
                        throw new Error(response.data.message || "Failed to fetch billboards");
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to fetch billboards");
                } finally {
                    setLoading(false);
                }
            };

            fetchBillboards();
        }, []);

        const handleBookClick = (billboardId: string) => {
            setSelectedBillboardId(billboardId);
            setFormData({
                ...formData,
                billboard_id: billboardId,
                user_id: localStorage.getItem("user_id") || "",
            });
            setShowForm(true);
        };

        const handleFormSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                const token = localStorage.getItem("token");
                const response = await axios.post(
                    "http://localhost:3000/api/protected/bookings",
                    formData,
                    {
                        headers: {
                            "Authorization": `Bearer ${token || ""}`,
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );

                if (response.data.status === "success") {
                    alert("Booking request submitted successfully!");
                    setShowForm(false);
                } else {
                    throw new Error(response.data.message || "Failed to submit booking request");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to submit booking request");
            }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(e.target as Node)) {
                setShowForm(false);
            }
        };

        useEffect(() => {
            if (showForm) {
                document.addEventListener("mousedown", handleClickOutside);
            } else {
                document.removeEventListener("mousedown", handleClickOutside);
            }

            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [showForm]);

        if (loading) return <Loader />;
        if (error) return <ErrorMessage>{error}</ErrorMessage>;
        if (billboards.length === 0) return <NoBillboards>No billboards available</NoBillboards>;

        return (
            <StyledWrapper>
                <Title>Available Billboards</Title>
                <Grid>
                    {billboards.map((billboard) => (
                        <Card key={billboard._id}>
                            <ImageContainer>
                                {billboard.bImg?.length ? (
                                    <Slideshow images={billboard.bImg} />
                                ) : (
                                    <NoImage>No images available</NoImage>
                                )}
                            </ImageContainer>
                            <CardContent>
                                <InfoRow>
                                    <LocationIcon />
                                    <InfoText>
                                        <strong>Location:</strong> {billboard.location}
                                    </InfoText>
                                </InfoRow>
                                <InfoRow>
                                    <InfoText>
                                        <strong>Size:</strong> {billboard.size}
                                    </InfoText>
                                    <InfoText>
                                        <strong>Price:</strong> ${billboard.price}
                                    </InfoText>
                                </InfoRow>
                                <InfoRow>
                                    <InfoText>
                                        <strong>Type:</strong> {billboard.type}
                                    </InfoText>
                                    <InfoText>
                                        <strong>Amenities:</strong> {billboard.amenities || "N/A"}
                                    </InfoText>
                                </InfoRow>
                                <Description>{billboard.description}</Description>
                                <ButtonWrapper>
                                    <B1 buttonName="Book Billboard" onClick={() => handleBookClick(billboard._id)} />
                                </ButtonWrapper>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>

                {showForm && (
                    <FormOverlay>
                        <FormContainer ref={formRef}>
                            <FormTitle>Book Billboard</FormTitle>
                            <Form onSubmit={handleFormSubmit}>
                                <FormGroup>
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Offered Price</Label>
                                    <Input
                                        type="number"
                                        name="offered_price"
                                        value={formData.offered_price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </FormGroup>
                                <ButtonWrapper>
                                    <B1 buttonName="Submit" type="submit" />
                                    <B1 buttonName="Cancel" onClick={() => setShowForm(false)} />
                                </ButtonWrapper>
                            </Form>
                        </FormContainer>
                    </FormOverlay>
                )}
            </StyledWrapper>
        );
    };

    const Slideshow: React.FC<{ images: string[] }> = ({ images }) => {
        const [currentIndex, setCurrentIndex] = useState<number>(0);

        useEffect(() => {
            const intervalId = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000);

            return () => clearInterval(intervalId);
        }, [images.length]);

        return (
            <SlideshowContainer>
                <SlideshowImage src={`http://localhost:3000/${images[currentIndex]}`} alt="Billboard" />
                <SlideshowDots>
                    {images.map((_, index) => (
                        <SlideshowDot
                            key={index}
                            active={index === currentIndex}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </SlideshowDots>
            </SlideshowContainer>
        );
    };

    // Styled Components
    const StyledWrapper = styled.div`
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
    `;

    const Title = styled.h1`
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 30px;
        color: #333;
    `;

    const Grid = styled.div`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 25px;
    `;

    const Card = styled.div`
        border: 1px solid #ddd;
        border-radius: 12px;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    
        &:hover {
            transform: translateY(-10px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
    `;

    const ImageContainer = styled.div`
        height: 200px;
        overflow: hidden;
        border-radius: 12px 12px 0 0;
        position: relative;
    `;

    const NoImage = styled.div`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f1f1f1;
        color: #888;
        font-size: 14px;
    `;

    const CardContent = styled.div`
        padding: 20px;
    `;

    const InfoRow = styled.div`
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
    `;

    const InfoText = styled.p`
        margin: 0;
        font-size: 14px;
        color: #555;
    `;

    const LocationIcon = () => (
        <svg
            fill="none"
            viewBox="0 0 24 24"
            height={24}
            width={24}
        >
            <path
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="1.5"
                stroke="#141B34"
                d="M7 8.5L9.94202 10.2394C11.6572 11.2535 12.3428 11.2535 14.058 10.2394L17 8.5"
            />
            <path
                strokeLinejoin="round"
                strokeWidth="1.5"
                stroke="#141B34"
                d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 7.72492 19.8391"
            />
        </svg>
    );

    const Description = styled.p`
        font-size: 14px;
        color: #666;
        margin-bottom: 20px;
    `;

    const ButtonWrapper = styled.div`
        text-align: center;
        margin-top: 20px;
    `;

    const ErrorMessage = styled.div`
        color: red;
        text-align: center;
        font-size: 16px;
    `;

    const NoBillboards = styled.div`
        text-align: center;
        font-size: 18px;
        color: #777;
    `;

    const FormOverlay = styled.div`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const FormContainer = styled.div`
        background: #fff;
        padding: 30px;
        border-radius: 12px;
        width: 400px;
        max-width: 100%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    const FormTitle = styled.h2`
        text-align: center;
        font-size: 1.8rem;
        margin-bottom: 20px;
        color: #333;
    `;

    const Form = styled.form``;

    const FormGroup = styled.div`
        margin-bottom: 20px;
    `;

    const Label = styled.label`
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 5px;
        display: block;
        color: #555;
    `;

    const Input = styled.input`
        width: 100%;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #ddd;
        font-size: 14px;
        color: #333;
        background: #f9f9f9;
        transition: border-color 0.3s ease;
    
        &:focus {
            border-color: #007bff;
            outline: none;
        }
    `;

    const SlideshowContainer = styled.div`
        position: relative;
        width: 100%;
        height: 100%;
    `;

    const SlideshowImage = styled.img`
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px 12px 0 0;
    `;

    const SlideshowDots = styled.div`
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 5px;
    `;

    const SlideshowDot = styled.div<{ active: boolean }>`
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${({ active }) => (active ? "#007bff" : "#ccc")};
        cursor: pointer;
        transition: background 0.3s ease;
    `;

    export default ShowProperties;