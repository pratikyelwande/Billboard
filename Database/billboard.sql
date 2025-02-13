--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.1

-- Started on 2025-02-12 17:22:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16390)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 233 (class 1255 OID 16475)
-- Name: update_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 16440)
-- Name: billboard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billboard (
    billboard_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    size character varying(50) NOT NULL,
    location text NOT NULL,
    billboard_type character varying(50) NOT NULL,
    price numeric(10,2) NOT NULL,
    available boolean DEFAULT true,
    amenities text,
    b_img text,
    b_review text,
    b_description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    owner_id uuid NOT NULL,
    is_approved boolean DEFAULT false
);


ALTER TABLE public.billboard OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16456)
-- Name: booking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking (
    booking_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    billboard_id uuid NOT NULL,
    user_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    offered_price numeric(10,2) NOT NULL,
    status character varying(10) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.booking OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16406)
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    document_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document text
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16401)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_name character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16414)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    firstname character varying(100),
    lastname character varying(100),
    gender character varying(50),
    phoneno character varying(15),
    phone_verified boolean DEFAULT false,
    company_name character varying(255),
    is_verified boolean DEFAULT false,
    locality character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role_name character varying(50) DEFAULT 'Admin'::character varying NOT NULL,
    document_id uuid,
    CONSTRAINT users_phoneno_check CHECK (((phoneno)::text ~ '^\+?[0-9]{10,15}$'::text))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4958 (class 0 OID 16440)
-- Dependencies: 221
-- Data for Name: billboard; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.billboard (billboard_id, size, location, billboard_type, price, available, amenities, b_img, b_review, b_description, created_at, updated_at, owner_id, is_approved) FROM stdin;
a2b01c2c-1273-43bf-93b6-a2e2bf5aae04	56x45	Pune	Printed	535.00	f	Light	assets\\1739352746612-5d2ee1163397047.63e4fe2c8aedb.jpg	Good	Good	2025-02-12 09:32:26.986	2025-02-12 15:18:37.016478	21fe30db-a775-49cb-ada9-c4960aac23bc	t
80b5bd30-138e-4f08-90a8-6a6212b59716	69x69	Pune	Digital	10000.00	f	CCTV, Gated Security, Cleaning, Insurance	assets\\1739037472557-andrae-ricketts-J01aau733v0-unsplash.jpg,assets\\1739037472668-nelson-ndongala-6VBVp-V0txQ-unsplash.jpg,assets\\1739037472734-yucel-moran-ami8yb80TCw-unsplash.jpg	Good	This billboard property is in very crowded area come and join with us.	2025-02-12 05:41:34.212	2025-02-12 15:18:38.430362	21fe30db-a775-49cb-ada9-c4960aac23bc	t
c11d829e-87a1-41d0-a946-d729305495c4	65x34	Pune	Digital	699.00	f	Wifi	assets\\1739339269583-5d2ee1163397047.63e4fe2c8aedb.jpg	Good	Good	2025-02-12 05:47:49.604	2025-02-12 15:18:39.090367	21fe30db-a775-49cb-ada9-c4960aac23bc	t
bcf952fb-022f-4507-99dd-be98f38c8412	7x8	Beatae consectetur 	Digital	544.00	f	Magna voluptas offic	assets\\1739037472557-andrae-ricketts-J01aau733v0-unsplash.jpg,assets\\1739037472668-nelson-ndongala-6VBVp-V0txQ-unsplash.jpg,assets\\1739037472734-yucel-moran-ami8yb80TCw-unsplash.jpg	Nesciunt anim accus	Quasi labore dolores	2025-02-08 17:57:52.923	2025-02-10 10:12:25.291027	ac17e839-4f4b-453a-b955-1f2eac4a8553	t
07c3e6db-0580-4ebd-bc9b-3382c9e5b571	14x48	Downtown, Main Street	Digital	5000.00	t	Lighting, Wi-Fi	https://images.unsplash.com/photo-1560196327-cca0a731441b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D	Highly visible location with heavy foot traffic.	A prime digital billboard located in the heart of downtown, offering excellent visibility to both pedestrians and drivers.	2025-02-05 06:30:44.902	2025-02-10 15:46:06.634678	ac17e839-4f4b-453a-b955-1f2eac4a8553	t
70182e4a-02ae-4592-845e-19b3dca78f05	14x48	Downtown, Main Street	Digital	5000.00	t	Lighting, Wi-Fi	https://images.unsplash.com/photo-1560196327-cca0a731441b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D	Highly visible location with heavy foot traffic.	A prime digital billboard located in the heart of downtown, offering excellent visibility to both pedestrians and drivers.	2025-02-05 09:59:00.377	2025-02-10 17:08:09.753087	ac17e839-4f4b-453a-b955-1f2eac4a8553	t
29ffc685-4e70-4ed2-b6c3-c440c4e3d74f	5x5	Culpa minus est qui	Printed	385.00	f	Aute officia duis om	assets\\1739173207055-nelson-ndongala-6VBVp-V0txQ-unsplash.jpg	sq	qs	2025-02-10 07:40:07.42	2025-02-12 15:04:55.784573	ac17e839-4f4b-453a-b955-1f2eac4a8553	t
4d6cd3bd-e45a-49a1-aab4-effa2161c0bf	34x45	Karve Nagar	Digital	5000.00	f	CCTV	assets\\1739037472557-andrae-ricketts-J01aau733v0-unsplash.jpg,assets\\1739037472668-nelson-ndongala-6VBVp-V0txQ-unsplash.jpg,assets\\1739037472734-yucel-moran-ami8yb80TCw-unsplash.jpg		Good	2025-02-12 05:43:47.143	2025-02-12 15:50:24.719453	21fe30db-a775-49cb-ada9-c4960aac23bc	t
691f19a0-6663-467e-a602-fc5ac3eefb9d	5x5	pune	Printed	535.00	f	CCTV	https://images.unsplash.com/photo-1560196327-cca0a731441b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D	gfff	fffff	2025-02-05 10:26:07.839	2025-02-12 15:50:25.28711	ac17e839-4f4b-453a-b955-1f2eac4a8553	t
7a5acb94-8ee5-46e2-bfad-f83e255ed95d	67x34	Pune	Digital	858.00	f	cctv	assets\\1739355667750-images.jpg		Good	2025-02-12 10:21:07.758	2025-02-12 15:51:34.094785	985dbdf2-c254-4a83-8f0b-4d2d3fa63af3	t
\.


--
-- TOC entry 4959 (class 0 OID 16456)
-- Dependencies: 222
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking (booking_id, billboard_id, user_id, start_date, end_date, offered_price, status, created_at, updated_at) FROM stdin;
4a5e0c93-f34e-4ea1-9060-de824adcb02f	691f19a0-6663-467e-a602-fc5ac3eefb9d	ac17e839-4f4b-453a-b955-1f2eac4a8553	2023-12-01	2023-12-10	500.00	approved	2025-02-12 06:51:47.355	2025-02-12 12:25:22.27016
11127bd2-f38d-4381-bf93-70e163ba3047	07c3e6db-0580-4ebd-bc9b-3382c9e5b571	21fe30db-a775-49cb-ada9-c4960aac23bc	2025-02-12	2025-04-15	250.00	pending	2025-02-12 07:16:59.995	2025-02-12 07:16:59.995
adb2114e-9a1d-430d-8d94-32f122eeb4c1	bcf952fb-022f-4507-99dd-be98f38c8412	21fe30db-a775-49cb-ada9-c4960aac23bc	2025-02-04	2025-02-20	800.00	pending	2025-02-12 09:38:39.869	2025-02-12 09:38:39.869
69913fa1-9c12-4d45-a389-7baa8dfe39a1	c11d829e-87a1-41d0-a946-d729305495c4	21fe30db-a775-49cb-ada9-c4960aac23bc	2025-02-13	2025-02-20	800.00	approved	2025-02-12 09:39:08.297	2025-02-12 15:10:41.196193
6150cddc-6939-4a68-9cce-a1623f24a6a5	a2b01c2c-1273-43bf-93b6-a2e2bf5aae04	985dbdf2-c254-4a83-8f0b-4d2d3fa63af3	2025-02-13	2025-02-26	3000.00	approved	2025-02-12 09:45:39.15	2025-02-12 15:18:37.005921
4255bef3-35e1-49ed-9254-bc3d72d89429	80b5bd30-138e-4f08-90a8-6a6212b59716	985dbdf2-c254-4a83-8f0b-4d2d3fa63af3	2025-02-13	2025-02-26	3000.00	approved	2025-02-12 09:45:51.384	2025-02-12 15:18:38.422852
45f68273-5871-4b81-ac59-a442a1ec5404	c11d829e-87a1-41d0-a946-d729305495c4	21fe30db-a775-49cb-ada9-c4960aac23bc	2025-02-13	2025-02-21	1000.00	approved	2025-02-12 09:41:32.19	2025-02-12 15:18:39.082859
01010b85-af03-4aa9-85e6-ab1527f3434d	7a5acb94-8ee5-46e2-bfad-f83e255ed95d	985dbdf2-c254-4a83-8f0b-4d2d3fa63af3	2025-02-13	2025-02-14	5000.00	rejected	2025-02-12 10:21:50.365	2025-02-12 15:52:02.883087
ce9bca1e-7ebe-451b-837a-deb7ef793489	7a5acb94-8ee5-46e2-bfad-f83e255ed95d	985dbdf2-c254-4a83-8f0b-4d2d3fa63af3	2025-02-06	2025-02-13	9000.00	rejected	2025-02-12 10:35:11.159	2025-02-12 16:05:18.807244
\.


--
-- TOC entry 4956 (class 0 OID 16406)
-- Dependencies: 219
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (document_id, document) FROM stdin;
a384d4ef-f90d-4eae-8266-a17bd6368bbf	This is a sample document for the user profile.
\.


--
-- TOC entry 4955 (class 0 OID 16401)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_name) FROM stdin;
User
Admin
Owner
\.


--
-- TOC entry 4957 (class 0 OID 16414)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password, firstname, lastname, gender, phoneno, phone_verified, company_name, is_verified, locality, created_at, updated_at, role_name, document_id) FROM stdin;
63881f91-32fa-4e2e-83e9-758b267d8916	testuser@example.com	$2a$12$LtamBUQL33lLUWwtEe7VHePI.R5gOnGbQtpyXv5tOmzCYmWYkN8Li	\N	\N	Male	+1234567890	f	\N	f	Test Locality	2025-02-08 17:25:43.277	2025-02-08 17:25:43.277	Admin	\N
b74eda9d-0a22-47dd-a2c5-2156ec3e5b4d	celezulehe@mailinator.com	$2a$12$vsh2F6QYCrSOrlDsjQi1tuL1KF73k2UnqxjTMXkizfvMMyCmci46W	Rebekah	Raymond	Female	9865789564	f		f	Magni rerum est veni	2025-02-08 17:34:12.5	2025-02-08 17:34:12.5	User	\N
ac17e839-4f4b-453a-b955-1f2eac4a8553	johndoe@example.com	$2a$12$9fU9M026UmDas8O5kIJJ2uiZRgBM4iXA5dC2sNrJRX6uVmAfqknQS	\N	\N	Male	+12345678901	f	\N	f	Downtown	2025-02-05 06:21:50.403	2025-02-10 09:12:05.377736	Admin	\N
985dbdf2-c254-4a83-8f0b-4d2d3fa63af3	bhau@gmail.com	$2a$12$roF8.6mMkvxshpZgC8adQu.tKc.bu5YXuwOddtSj4kCEC2XAnADsC	bhau	bhau	Male	6969696969	f		f	Pune	2025-02-10 10:17:40.793	2025-02-10 10:17:40.793	User	\N
21fe30db-a775-49cb-ada9-c4960aac23bc	rajpatil@69.com	$2a$12$YoVrsBFwfV5SjiAx6VfDyOR/Bn2ixp9IRojVn0cU0P2JLYQLhqWHS	Raj	Patil	Male	6969696969	f	69 squares	f	Akola	2025-02-12 05:38:42.009	2025-02-12 05:38:42.009	Owner	\N
\.


--
-- TOC entry 4797 (class 2606 OID 16450)
-- Name: billboard billboard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billboard
    ADD CONSTRAINT billboard_pkey PRIMARY KEY (billboard_id);


--
-- TOC entry 4801 (class 2606 OID 16464)
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 4789 (class 2606 OID 16413)
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (document_id);


--
-- TOC entry 4787 (class 2606 OID 16405)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_name);


--
-- TOC entry 4791 (class 2606 OID 16429)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4794 (class 2606 OID 16427)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4795 (class 1259 OID 16483)
-- Name: billboard_approval_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX billboard_approval_idx ON public.billboard USING btree (is_approved);


--
-- TOC entry 4798 (class 1259 OID 16480)
-- Name: billboard_price_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX billboard_price_idx ON public.billboard USING btree (price);


--
-- TOC entry 4799 (class 1259 OID 16481)
-- Name: booking_dates_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX booking_dates_idx ON public.booking USING brin (start_date, end_date);


--
-- TOC entry 4792 (class 1259 OID 16479)
-- Name: users_location_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_location_idx ON public.users USING btree (locality);


--
-- TOC entry 4808 (class 2620 OID 16477)
-- Name: billboard billboard_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER billboard_update BEFORE UPDATE ON public.billboard FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4809 (class 2620 OID 16478)
-- Name: booking booking_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER booking_update BEFORE UPDATE ON public.booking FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4807 (class 2620 OID 16476)
-- Name: users users_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER users_update BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();


--
-- TOC entry 4804 (class 2606 OID 16451)
-- Name: billboard billboard_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billboard
    ADD CONSTRAINT billboard_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4805 (class 2606 OID 16465)
-- Name: booking booking_billboard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_billboard_id_fkey FOREIGN KEY (billboard_id) REFERENCES public.billboard(billboard_id) ON DELETE CASCADE;


--
-- TOC entry 4806 (class 2606 OID 16470)
-- Name: booking booking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4802 (class 2606 OID 16435)
-- Name: users users_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(document_id) ON DELETE SET NULL;


--
-- TOC entry 4803 (class 2606 OID 16430)
-- Name: users users_role_name_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_name_fkey FOREIGN KEY (role_name) REFERENCES public.roles(role_name) ON DELETE SET DEFAULT;


-- Completed on 2025-02-12 17:22:49

--
-- PostgreSQL database dump complete
--

