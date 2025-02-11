import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
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

const ShowProperties: React.FC = () => {
    const [billboards, setBillboards] = useState<Billboard[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBillboards = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log(token);
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
                            {billboard.bImg && billboard.bImg.length > 0 && (
                                <Slideshow images={billboard.bImg} />
                            )}
                        </ImageContainer>
                        <CardContent>
                            <InfoRow>
                                <InfoIconWrapper>
                                    <svg
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        height={24}
                                        width={24}
                                        xmlns="http://www.w3.org/2000/svg"
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
                                            d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
                                        />
                                    </svg>
                                </InfoIconWrapper>
                                <InfoText>
                                    <strong>Location:</strong> {billboard.location}
                                </InfoText>
                            </InfoRow>
                            <InfoRow>
                                <InfoText>
                                    <strong>Size:</strong> {billboard.size}
                                </InfoText>
                                <InfoText>
                                    <strong>Price:</strong> {billboard.price}
                                </InfoText>
                            </InfoRow>
                            <InfoRow>
                                <InfoText>
                                    <strong>Type:</strong> {billboard.type}
                                </InfoText>
                                <InfoText>
                                    <strong>Amenities:</strong> {billboard.amenities}
                                </InfoText>
                            </InfoRow>
                            <Description>{billboard.description}</Description>
                            <ButtonWrapper>
                                <B1 buttonName="Book billboard" />
                            </ButtonWrapper>
                        </CardContent>
                    </Card>
                ))}
            </Grid>
        </StyledWrapper>
    );
};

const Slideshow: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <SlideContainer>
            <SlideImage
                src={`http://localhost:3000/${images[currentIndex]}`}
                alt={`Slide ${currentIndex}`}
            />
            <SlideButtonLeft onClick={prevSlide}>&#10094;</SlideButtonLeft>
            <SlideButtonRight onClick={nextSlide}>&#10095;</SlideButtonRight>
        </SlideContainer>
    );
};

/* Styled Components */

const StyledWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    background-color: #f3f4f6;
    min-height: 100vh;
`;

const Title = styled.h1`
    font-size: 1.875rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #374151;
`;

const Grid = styled.div`
    display: grid;
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    grid-template-columns: 1fr;

    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

const Card = styled.div`
    background-color: #ffffff;
    border-radius: 0.5rem;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const ImageContainer = styled.div`
    position: relative;
    height: 12rem;
`;

const CardContent = styled.div`
    padding: 1rem;
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
`;

const InfoIconWrapper = styled.div`
    margin-right: 0.5rem;
    svg {
        width: 20px;
        height: 20px;
    }
`;

const InfoText = styled.p`
    color: #4b5563;
    font-size: 0.875rem;
    margin: 0;
`;

const Description = styled.p`
    color: #4b5563;
    margin-bottom: 1rem;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const SlideContainer = styled.div`
    position: relative;
    height: 100%;
`;

const SlideImage = styled.img`
    object-fit: cover;
    width: 100%;
    height: 100%;
    transition: opacity 0.5s ease-in-out;
    opacity: 1;
`;

const SlideButtonLeft = styled.button`
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-color: #1f2937;
    color: #ffffff;
    padding: 0.5rem;
    border: none;
    border-radius: 50%;
    cursor: pointer;
`;

const SlideButtonRight = styled.button`
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background-color: #1f2937;
    color: #ffffff;
    padding: 0.5rem;
    border: none;
    border-radius: 50%;
    cursor: pointer;
`;

const ErrorMessage = styled.div`
    color: red;
    text-align: center;
    padding: 1rem;
`;

const NoBillboards = styled.div`
    text-align: center;
    padding: 1rem;
`;

export default ShowProperties;