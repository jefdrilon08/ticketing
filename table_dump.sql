--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.15 (Ubuntu 14.15-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: areas; Type: TABLE; Schema: public; Owner: kasaganaka
--

CREATE TABLE public.areas (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name character varying,
    short_name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.areas OWNER TO kasaganaka;

--
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: kasaganaka
--

COPY public.areas (id, name, short_name, created_at, updated_at) FROM stdin;
71882cb9-40dd-4c4a-9dcd-e9139afb9614	CENTRAL	C	2019-01-03 08:19:27.934997	2019-01-03 08:19:51.202537
ac74b500-88cc-4162-842c-1ad2a5331fdd	NORTH	N	2018-10-25 06:15:01.143161	2019-01-03 08:20:06.607768
06a78557-bbc4-491a-bef9-b6c2e6938671	HEAD OFFICE	ho	2018-12-28 09:18:32.238195	2019-01-04 00:40:14.814651
074a8979-6912-49e0-a61d-41b975d22979	EAST	E	2018-12-28 09:18:32.238195	2019-01-04 00:40:50.145612
950ebd0a-24c3-422b-b10b-c505e36bf3ab	SOUTH	S	2018-10-25 06:15:01.143161	2019-01-04 00:41:01.841748
\.


--
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: kasaganaka
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

