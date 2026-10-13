--
-- PostgreSQL database dump
--

\restrict DofamuMwYSD3XSECcIufG7J6WFfUeBeyr9U3apnfvbH97txKH252qEBOK7f29f1

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.11

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
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: backgrounds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backgrounds (
    id text NOT NULL,
    workspace text DEFAULT 'all'::text NOT NULL,
    gender_target text DEFAULT 'all'::text,
    wear_type_id text,
    sub_category text,
    name_en text NOT NULL,
    name_te text NOT NULL,
    prompt_directive text NOT NULL,
    color_hex text,
    thumbnail_url text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    camera_framing text,
    face_visibility_rule text,
    preview_image_url text,
    storage_path text
);


--
-- Name: background; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.background AS
 SELECT id,
    workspace,
    gender_target,
    wear_type_id,
    sub_category,
    name_en,
    name_te,
    prompt_directive,
    color_hex,
    thumbnail_url,
    display_order,
    is_active,
    metadata,
    created_at,
    updated_at,
    camera_framing,
    face_visibility_rule,
    preview_image_url,
    storage_path
   FROM public.backgrounds;


--
-- Name: business_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.business_categories (
    id text NOT NULL,
    workspace text DEFAULT 'garment'::text NOT NULL,
    gender_target text DEFAULT 'all'::text NOT NULL,
    name_en text NOT NULL,
    name_te text NOT NULL,
    icon text,
    banner_url text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT business_categories_workspace_check CHECK ((workspace = ANY (ARRAY['garment'::text, 'jewelry'::text, 'general'::text])))
);


--
-- Name: catalog_item_backgrounds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_item_backgrounds (
    catalog_item_id text NOT NULL,
    background_id text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: catalog_item_poses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_item_poses (
    catalog_item_id text NOT NULL,
    pose_id text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: catalog_item_presentations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_item_presentations (
    catalog_item_id text NOT NULL,
    presentation_id text NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: catalog_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_items (
    id text NOT NULL,
    business_category_id text,
    workspace text DEFAULT 'garment'::text NOT NULL,
    gender_target text DEFAULT 'unisex'::text NOT NULL,
    name_en text NOT NULL,
    name_te text NOT NULL,
    prompt_directive text NOT NULL,
    placement_directive text,
    icon text,
    sample_image_url text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    wear_type text NOT NULL,
    CONSTRAINT catalog_items_workspace_check CHECK ((workspace = ANY (ARRAY['garment'::text, 'jewelry'::text])))
);


--
-- Name: faces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faces (
    id text NOT NULL,
    workspace text DEFAULT 'all'::text NOT NULL,
    gender_target text DEFAULT 'all'::text,
    wear_type_id text,
    sub_category text,
    name_en text NOT NULL,
    name_te text NOT NULL,
    prompt_directive text NOT NULL,
    preview_image_url text,
    storage_path text,
    thumbnail_url text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    camera_framing text,
    face_visibility_rule text,
    color_hex text
);


--
-- Name: genders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.genders (
    id text NOT NULL,
    code text NOT NULL,
    name_en text NOT NULL,
    name_te text NOT NULL,
    description text,
    icon text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: otps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    code_hash text NOT NULL,
    purpose text DEFAULT 'login'::text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    is_used boolean DEFAULT false NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    razorpay_order_id text NOT NULL,
    razorpay_payment_id text,
    razorpay_signature text,
    amount integer NOT NULL,
    currency text DEFAULT 'INR'::text NOT NULL,
    status text DEFAULT 'created'::text NOT NULL,
    credits_added integer DEFAULT 0 NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: poses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poses (
    id text NOT NULL,
    workspace text DEFAULT 'all'::text NOT NULL,
    gender_target text DEFAULT 'all'::text,
    wear_type_id text,
    sub_category text,
    name_en text NOT NULL,
    name_te text NOT NULL,
    prompt_directive text NOT NULL,
    camera_framing text,
    face_visibility_rule text,
    thumbnail_url text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    preview_image_url text,
    storage_path text,
    color_hex text
);


--
-- Name: presentations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.presentations (
    id text NOT NULL,
    workspace text DEFAULT 'all'::text NOT NULL,
    gender_target text DEFAULT 'all'::text,
    wear_type_id text,
    sub_category text,
    name_en text NOT NULL,
    name_te text NOT NULL,
    prompt_directive text NOT NULL,
    camera_framing text,
    face_visibility_rule text,
    thumbnail_url text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    preview_image_url text,
    storage_path text,
    color_hex text
);


--
-- Name: studio_presets; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.studio_presets AS
 SELECT faces.id,
    'face'::text AS type,
    faces.workspace,
    faces.gender_target,
    faces.wear_type_id,
    faces.sub_category,
    faces.name_en,
    faces.name_te,
    faces.prompt_directive,
    faces.camera_framing,
    faces.face_visibility_rule,
    faces.thumbnail_url,
    faces.preview_image_url,
    faces.storage_path,
    faces.color_hex,
    faces.display_order,
    faces.is_active,
    faces.metadata,
    faces.created_at,
    faces.updated_at
   FROM public.faces
UNION ALL
 SELECT poses.id,
    'pose'::text AS type,
    poses.workspace,
    poses.gender_target,
    poses.wear_type_id,
    poses.sub_category,
    poses.name_en,
    poses.name_te,
    poses.prompt_directive,
    poses.camera_framing,
    poses.face_visibility_rule,
    poses.thumbnail_url,
    poses.preview_image_url,
    poses.storage_path,
    poses.color_hex,
    poses.display_order,
    poses.is_active,
    poses.metadata,
    poses.created_at,
    poses.updated_at
   FROM public.poses
UNION ALL
 SELECT presentations.id,
    'presentation'::text AS type,
    presentations.workspace,
    presentations.gender_target,
    presentations.wear_type_id,
    presentations.sub_category,
    presentations.name_en,
    presentations.name_te,
    presentations.prompt_directive,
    presentations.camera_framing,
    presentations.face_visibility_rule,
    presentations.thumbnail_url,
    presentations.preview_image_url,
    presentations.storage_path,
    presentations.color_hex,
    presentations.display_order,
    presentations.is_active,
    presentations.metadata,
    presentations.created_at,
    presentations.updated_at
   FROM public.presentations
UNION ALL
 SELECT backgrounds.id,
    'background'::text AS type,
    backgrounds.workspace,
    backgrounds.gender_target,
    backgrounds.wear_type_id,
    backgrounds.sub_category,
    backgrounds.name_en,
    backgrounds.name_te,
    backgrounds.prompt_directive,
    backgrounds.camera_framing,
    backgrounds.face_visibility_rule,
    backgrounds.thumbnail_url,
    backgrounds.preview_image_url,
    backgrounds.storage_path,
    backgrounds.color_hex,
    backgrounds.display_order,
    backgrounds.is_active,
    backgrounds.metadata,
    backgrounds.created_at,
    backgrounds.updated_at
   FROM public.backgrounds;


--
-- Name: system_lookups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_lookups (
    id text NOT NULL,
    type text NOT NULL,
    code text NOT NULL,
    name_en text NOT NULL,
    name_te text NOT NULL,
    description text,
    icon text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_settings (
    key text NOT NULL,
    category text NOT NULL,
    value jsonb NOT NULL,
    description text,
    updated_by uuid,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT system_settings_category_check CHECK ((category = ANY (ARRAY['ai'::text, 'pricing'::text, 'fidelity'::text, 'security'::text, 'general'::text])))
);


--
-- Name: usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    workspace text DEFAULT 'garment'::text NOT NULL,
    item_type text NOT NULL,
    credits_deducted integer DEFAULT 1 NOT NULL,
    prompt text,
    status text DEFAULT 'pending'::text NOT NULL,
    error_message text,
    latency_ms integer,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    gender_target text
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    phone text NOT NULL,
    avatar_url text,
    role text DEFAULT 'user'::text NOT NULL,
    wallet_balance integer DEFAULT 10 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    gender text
);


--
-- Name: wear_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wear_types (
    id text NOT NULL,
    workspace text NOT NULL,
    code text NOT NULL,
    name_en text NOT NULL,
    name_te text NOT NULL,
    description text,
    icon text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: workspaces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workspaces (
    id text NOT NULL,
    code text NOT NULL,
    name_en text NOT NULL,
    name_te text NOT NULL,
    description text,
    icon text,
    display_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	2671d2565ff15c1f6c8a3d782ab3dd6974ee87b8e1335b782b72b3ade89c9cbe	1789043046720
2	a037201cf953b83d8b1ed19348a5152196576dad94a41b2aa73af00175205fe2	1789111819286
3	1a7c21b64428714c04190515a586552e3a1e711f9ab8832c33140d252d228adf	1789124850346
\.


--
-- Data for Name: backgrounds; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backgrounds (id, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, color_hex, thumbnail_url, display_order, is_active, metadata, created_at, updated_at, camera_framing, face_visibility_rule, preview_image_url, storage_path) FROM stdin;
luxury_studio	all	all	\N	\N	Luxury Studio	లగ్జరీ స్టూడియో (Luxury Studio)	a high-end luxury fashion photography studio with professional softbox three-point lighting and subtle architectural shadow modeling	\N	\N	2	t	{}	2026-10-03 12:10:47.324167+00	2026-10-04 11:49:21.517695+00	\N	\N	\N	\N
minimal_beige	all	all	\N	\N	Minimal Beige	మినిమల్ లేత గోధుమరంగు (Beige)	a warm minimalist beige limewash textured wall with soft diffused afternoon window lighting	\N	\N	4	t	{}	2026-10-03 12:10:47.49996+00	2026-10-04 11:49:21.517695+00	\N	\N	\N	\N
modern_loft	all	all	\N	\N	Modern Urban Loft	మోడ్రన్ లాఫ్ట్ (Modern Loft)	a sleek urban industrial loft with floor-to-ceiling glass windows, polished concrete accents, and bright daylight	\N	\N	5	t	{}	2026-10-03 12:10:47.587241+00	2026-10-04 11:49:21.517695+00	\N	\N	\N	\N
festive_haveli	all	all	\N	\N	Royal Haveli Courtyard	రాయల్ హవేలీ (Royal Haveli)	an opulent Indian heritage palace courtyard with carved sandstone pillars, brass lantern accents, and warm sunlit bokeh	\N	\N	3	t	{}	2026-10-03 12:10:47.412241+00	2026-10-04 11:49:21.517695+00	\N	\N	\N	\N
plain	all	all	\N	indoor	Plain Studio Backdrop	సాదా రంగు (Plain Color)	against a clean seamless minimalist solid plain studio background with soft natural drop shadow	#fdfbf7	\N	1	t	{}	2026-10-03 12:10:47.235795+00	2026-10-04 18:32:22.812908+00	\N	\N	\N	\N
studio	all	all	\N	indoor	Studio Lighting	స్టూడియో లైటింగ్	in a high-end luxury fashion photography studio, professional softbox three-point lighting, subtle shadows, professional editorial style	\N	\N	2	t	{}	2026-10-04 02:56:15.793398+00	2026-10-04 18:32:22.913963+00	\N	\N	\N	\N
traditional	all	all	\N	outdoor	Indian Heritage Courtyard	భారతీయ సాంప్రదాయం	inside an elegant, beautifully lit rich Indian courtyard, traditional arch design, warm light, premium ethnic background	\N	\N	3	t	{}	2026-10-04 02:56:15.875214+00	2026-10-04 18:32:22.998467+00	\N	\N	\N	\N
luxury	all	all	\N	indoor	Italian Marble Floor	లగ్జరీ మార్బుల్ నేల	on a magnificent polished Italian white marble floor with luxurious golden accents and elegant reflection	\N	\N	5	t	{}	2026-10-04 02:56:16.039032+00	2026-10-04 18:32:23.168442+00	\N	\N	\N	\N
royal	all	all	\N	outdoor	Royal Palace Balcony	రాజభవనం	in front of an ornate royal palace balcony at sunset, soft warm golden hour light, majestic heritage Indian setting	\N	\N	6	t	{}	2026-10-04 02:56:16.126613+00	2026-10-04 18:32:23.254828+00	\N	\N	\N	\N
wood	jewelry	all	\N	indoor	Solid Teak Wood	చెక్క బల్ల	placed beautifully on a rustic dark polished solid teak wood table, with soft warm side-lighting, organic and premium feel	\N	\N	7	t	{}	2026-10-04 02:56:16.210463+00	2026-10-04 18:32:23.340328+00	\N	\N	\N	\N
beach	jewelry	all	\N	outdoor	Fine Golden Sand	బీచ్ వాతావరణం	placed on fine golden sand in a photographic frame composition of sand, warm coastal sunlight	\N	\N	8	t	{}	2026-10-04 02:56:16.2923+00	2026-10-04 18:32:23.425277+00	\N	\N	\N	\N
velvet	jewelry	all	\N	indoor	Deep Crimson Velvet	వెల్వెట్ బ్యాక్‌గ్రౌండ్	nestled inside a luxurious deep-crimson velvet textile fabric background, creating beautiful contrast and high-fashion editorial aura	\N	\N	9	t	{}	2026-10-04 02:56:16.374+00	2026-10-04 18:32:23.509717+00	\N	\N	\N	\N
silk	jewelry	all	\N	indoor	Pure Royal Blue Silk	పట్టు వస్త్రం (సిల్క్)	resting gracefully on a drape of pure royal-blue silk saree cloth, reflecting soft warm light and magnificent texture	\N	\N	10	t	{}	2026-10-04 02:56:16.479728+00	2026-10-04 18:32:23.594046+00	\N	\N	\N	\N
mirror	jewelry	all	\N	indoor	Dark Reflective Mirror	అద్దం ప్రతిబింబం	placed on a polished dark reflective mirror plate, capturing a flawless symmetric luxury reflection under dim atmospheric warm lighting	\N	\N	12	t	{}	2026-10-04 02:56:16.662234+00	2026-10-04 18:32:23.766666+00	\N	\N	\N	\N
urban	garment	all	\N	outdoor	Downtown Urban Brick Wall	నగర వీధి (అర్బన్)	against a fashionable chic downtown urban brick wall background with modern street cafe vibe, soft natural daylight	\N	\N	13	t	{}	2026-10-04 02:56:16.743612+00	2026-10-04 18:32:23.853226+00	\N	\N	\N	\N
vintage	garment	all	\N	indoor	Vintage Palace Room	పాతకాలపు గది (వింటేజ్)	inside a magnificent vintage Indian palace room, featuring hand-carved heritage arches, antique royal wooden columns, vintage brass chandeliers, and soft atmospheric golden light filtering through ornamental windows	\N	\N	14	t	{}	2026-10-04 02:56:16.826+00	2026-10-04 18:32:23.937723+00	\N	\N	\N	\N
modern_office	garment	all	\N	indoor	Modern Architectural Office	ఆధునిక ఆఫీస్	inside a clean high-end architectural corporate office space with large windows and a beautiful city skyline background	\N	\N	15	t	{}	2026-10-04 02:56:16.90756+00	2026-10-04 18:32:24.021781+00	\N	\N	\N	\N
festival	all	all	\N	indoor	Festive Lights & Diyas	పండుగ / దీపావళి వెలుగులు	decorated for Diwali festival, surrounded by warm glittering bokeh lights, glowing clay oil lamps (diyas), elegant traditional backdrop	\N	\N	4	t	{}	2026-10-04 02:56:15.956323+00	2026-10-04 18:32:23.082923+00	\N	\N	\N	\N
granite	jewelry	all	\N	indoor	Polished Black Granite	గ్రానైట్ నేల	placed elegantly on a slab of rough-textured polished black granite stone, with architectural side spotlight shadows	\N	\N	11	t	{}	2026-10-04 02:56:16.574037+00	2026-10-04 18:32:23.680288+00	\N	\N	\N	\N
\.


--
-- Data for Name: business_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.business_categories (id, workspace, gender_target, name_en, name_te, icon, banner_url, display_order, is_active, metadata, created_at, updated_at) FROM stdin;
garment_female	garment	female	Female Collection	మహిళల కలెక్షన్	Sparkles	\N	1	t	{}	2026-10-03 12:10:42.30132+00	2026-10-04 18:32:05.711075+00
garment_male	garment	male	Male Collection	పురుషుల కలెక్షన్	Shirt	\N	2	t	{}	2026-10-03 12:10:42.395919+00	2026-10-04 18:32:05.79659+00
jewelry_female	jewelry	female	Female Collection	మహిళల కలెక్షన్	Gem	\N	3	t	{}	2026-10-03 12:10:42.489678+00	2026-10-04 18:32:05.880674+00
jewelry_male	jewelry	male	Male Collection	పురుషుల కలెక్షన్	Watch	\N	4	t	{}	2026-10-03 12:10:42.578714+00	2026-10-04 18:32:05.965714+00
\.


--
-- Data for Name: catalog_item_backgrounds; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_item_backgrounds (catalog_item_id, background_id, display_order, created_at) FROM stdin;
blouse	luxury_studio	2	2026-10-04 15:41:10.151689+00
blouse	minimal_beige	4	2026-10-04 15:41:10.151689+00
blouse	modern_loft	5	2026-10-04 15:41:10.151689+00
blouse	festive_haveli	3	2026-10-04 15:41:10.151689+00
blouse	plain	1	2026-10-04 15:41:10.151689+00
blouse	studio	2	2026-10-04 15:41:10.151689+00
blouse	traditional	3	2026-10-04 15:41:10.151689+00
blouse	festival	4	2026-10-04 15:41:10.151689+00
blouse	luxury	5	2026-10-04 15:41:10.151689+00
blouse	royal	6	2026-10-04 15:41:10.151689+00
blouse	urban	13	2026-10-04 15:41:10.151689+00
blouse	vintage	14	2026-10-04 15:41:10.151689+00
blouse	modern_office	15	2026-10-04 15:41:10.151689+00
shirt	luxury_studio	2	2026-10-04 15:41:10.151689+00
shirt	minimal_beige	4	2026-10-04 15:41:10.151689+00
shirt	modern_loft	5	2026-10-04 15:41:10.151689+00
shirt	festive_haveli	3	2026-10-04 15:41:10.151689+00
shirt	plain	1	2026-10-04 15:41:10.151689+00
shirt	studio	2	2026-10-04 15:41:10.151689+00
shirt	traditional	3	2026-10-04 15:41:10.151689+00
shirt	festival	4	2026-10-04 15:41:10.151689+00
shirt	luxury	5	2026-10-04 15:41:10.151689+00
shirt	royal	6	2026-10-04 15:41:10.151689+00
shirt	urban	13	2026-10-04 15:41:10.151689+00
shirt	vintage	14	2026-10-04 15:41:10.151689+00
shirt	modern_office	15	2026-10-04 15:41:10.151689+00
sherwani	luxury_studio	2	2026-10-04 15:41:10.151689+00
sherwani	minimal_beige	4	2026-10-04 15:41:10.151689+00
sherwani	modern_loft	5	2026-10-04 15:41:10.151689+00
sherwani	festive_haveli	3	2026-10-04 15:41:10.151689+00
sherwani	plain	1	2026-10-04 15:41:10.151689+00
sherwani	studio	2	2026-10-04 15:41:10.151689+00
sherwani	traditional	3	2026-10-04 15:41:10.151689+00
sherwani	festival	4	2026-10-04 15:41:10.151689+00
sherwani	luxury	5	2026-10-04 15:41:10.151689+00
sherwani	royal	6	2026-10-04 15:41:10.151689+00
sherwani	urban	13	2026-10-04 15:41:10.151689+00
sherwani	vintage	14	2026-10-04 15:41:10.151689+00
sherwani	modern_office	15	2026-10-04 15:41:10.151689+00
dhoti	luxury_studio	2	2026-10-04 15:41:10.151689+00
dhoti	minimal_beige	4	2026-10-04 15:41:10.151689+00
dhoti	modern_loft	5	2026-10-04 15:41:10.151689+00
dhoti	festive_haveli	3	2026-10-04 15:41:10.151689+00
dhoti	plain	1	2026-10-04 15:41:10.151689+00
dhoti	studio	2	2026-10-04 15:41:10.151689+00
dhoti	traditional	3	2026-10-04 15:41:10.151689+00
dhoti	festival	4	2026-10-04 15:41:10.151689+00
dhoti	luxury	5	2026-10-04 15:41:10.151689+00
dhoti	royal	6	2026-10-04 15:41:10.151689+00
dhoti	urban	13	2026-10-04 15:41:10.151689+00
dhoti	vintage	14	2026-10-04 15:41:10.151689+00
dhoti	modern_office	15	2026-10-04 15:41:10.151689+00
salwar	luxury_studio	2	2026-10-04 15:41:10.151689+00
salwar	minimal_beige	4	2026-10-04 15:41:10.151689+00
salwar	modern_loft	5	2026-10-04 15:41:10.151689+00
salwar	festive_haveli	3	2026-10-04 15:41:10.151689+00
salwar	plain	1	2026-10-04 15:41:10.151689+00
salwar	studio	2	2026-10-04 15:41:10.151689+00
salwar	traditional	3	2026-10-04 15:41:10.151689+00
salwar	festival	4	2026-10-04 15:41:10.151689+00
salwar	luxury	5	2026-10-04 15:41:10.151689+00
salwar	royal	6	2026-10-04 15:41:10.151689+00
salwar	urban	13	2026-10-04 15:41:10.151689+00
salwar	vintage	14	2026-10-04 15:41:10.151689+00
salwar	modern_office	15	2026-10-04 15:41:10.151689+00
skirt	luxury_studio	2	2026-10-04 15:41:10.151689+00
skirt	minimal_beige	4	2026-10-04 15:41:10.151689+00
skirt	modern_loft	5	2026-10-04 15:41:10.151689+00
skirt	festive_haveli	3	2026-10-04 15:41:10.151689+00
skirt	plain	1	2026-10-04 15:41:10.151689+00
skirt	studio	2	2026-10-04 15:41:10.151689+00
skirt	traditional	3	2026-10-04 15:41:10.151689+00
skirt	festival	4	2026-10-04 15:41:10.151689+00
skirt	luxury	5	2026-10-04 15:41:10.151689+00
skirt	royal	6	2026-10-04 15:41:10.151689+00
skirt	urban	13	2026-10-04 15:41:10.151689+00
skirt	vintage	14	2026-10-04 15:41:10.151689+00
skirt	modern_office	15	2026-10-04 15:41:10.151689+00
crop_top	luxury_studio	2	2026-10-04 15:41:10.151689+00
crop_top	minimal_beige	4	2026-10-04 15:41:10.151689+00
crop_top	modern_loft	5	2026-10-04 15:41:10.151689+00
crop_top	festive_haveli	3	2026-10-04 15:41:10.151689+00
crop_top	plain	1	2026-10-04 15:41:10.151689+00
crop_top	studio	2	2026-10-04 15:41:10.151689+00
crop_top	traditional	3	2026-10-04 15:41:10.151689+00
crop_top	festival	4	2026-10-04 15:41:10.151689+00
crop_top	luxury	5	2026-10-04 15:41:10.151689+00
crop_top	royal	6	2026-10-04 15:41:10.151689+00
crop_top	urban	13	2026-10-04 15:41:10.151689+00
crop_top	vintage	14	2026-10-04 15:41:10.151689+00
crop_top	modern_office	15	2026-10-04 15:41:10.151689+00
blazer	luxury_studio	2	2026-10-04 15:41:10.151689+00
blazer	minimal_beige	4	2026-10-04 15:41:10.151689+00
blazer	modern_loft	5	2026-10-04 15:41:10.151689+00
blazer	festive_haveli	3	2026-10-04 15:41:10.151689+00
blazer	plain	1	2026-10-04 15:41:10.151689+00
blazer	studio	2	2026-10-04 15:41:10.151689+00
blazer	traditional	3	2026-10-04 15:41:10.151689+00
blazer	festival	4	2026-10-04 15:41:10.151689+00
blazer	luxury	5	2026-10-04 15:41:10.151689+00
blazer	royal	6	2026-10-04 15:41:10.151689+00
blazer	urban	13	2026-10-04 15:41:10.151689+00
blazer	vintage	14	2026-10-04 15:41:10.151689+00
blazer	modern_office	15	2026-10-04 15:41:10.151689+00
tracksuit	luxury_studio	2	2026-10-04 15:41:10.151689+00
tracksuit	minimal_beige	4	2026-10-04 15:41:10.151689+00
tracksuit	modern_loft	5	2026-10-04 15:41:10.151689+00
tracksuit	festive_haveli	3	2026-10-04 15:41:10.151689+00
tracksuit	plain	1	2026-10-04 15:41:10.151689+00
tracksuit	studio	2	2026-10-04 15:41:10.151689+00
tracksuit	traditional	3	2026-10-04 15:41:10.151689+00
tracksuit	festival	4	2026-10-04 15:41:10.151689+00
tracksuit	luxury	5	2026-10-04 15:41:10.151689+00
tracksuit	royal	6	2026-10-04 15:41:10.151689+00
tracksuit	urban	13	2026-10-04 15:41:10.151689+00
tracksuit	vintage	14	2026-10-04 15:41:10.151689+00
tracksuit	modern_office	15	2026-10-04 15:41:10.151689+00
hoodie	luxury_studio	2	2026-10-04 15:41:10.151689+00
hoodie	minimal_beige	4	2026-10-04 15:41:10.151689+00
hoodie	modern_loft	5	2026-10-04 15:41:10.151689+00
hoodie	festive_haveli	3	2026-10-04 15:41:10.151689+00
hoodie	plain	1	2026-10-04 15:41:10.151689+00
hoodie	studio	2	2026-10-04 15:41:10.151689+00
hoodie	traditional	3	2026-10-04 15:41:10.151689+00
hoodie	festival	4	2026-10-04 15:41:10.151689+00
hoodie	luxury	5	2026-10-04 15:41:10.151689+00
hoodie	royal	6	2026-10-04 15:41:10.151689+00
hoodie	urban	13	2026-10-04 15:41:10.151689+00
hoodie	vintage	14	2026-10-04 15:41:10.151689+00
hoodie	modern_office	15	2026-10-04 15:41:10.151689+00
kurta	luxury_studio	2	2026-10-04 15:41:10.151689+00
kurta	minimal_beige	4	2026-10-04 15:41:10.151689+00
kurta	modern_loft	5	2026-10-04 15:41:10.151689+00
kurta	festive_haveli	3	2026-10-04 15:41:10.151689+00
kurta	plain	1	2026-10-04 15:41:10.151689+00
kurta	studio	2	2026-10-04 15:41:10.151689+00
kurta	traditional	3	2026-10-04 15:41:10.151689+00
kurta	festival	4	2026-10-04 15:41:10.151689+00
kurta	luxury	5	2026-10-04 15:41:10.151689+00
kurta	royal	6	2026-10-04 15:41:10.151689+00
kurta	urban	13	2026-10-04 15:41:10.151689+00
kurta	vintage	14	2026-10-04 15:41:10.151689+00
kurta	modern_office	15	2026-10-04 15:41:10.151689+00
suit	luxury_studio	2	2026-10-04 15:41:10.151689+00
suit	minimal_beige	4	2026-10-04 15:41:10.151689+00
suit	modern_loft	5	2026-10-04 15:41:10.151689+00
suit	festive_haveli	3	2026-10-04 15:41:10.151689+00
suit	plain	1	2026-10-04 15:41:10.151689+00
suit	studio	2	2026-10-04 15:41:10.151689+00
suit	traditional	3	2026-10-04 15:41:10.151689+00
suit	festival	4	2026-10-04 15:41:10.151689+00
suit	luxury	5	2026-10-04 15:41:10.151689+00
suit	royal	6	2026-10-04 15:41:10.151689+00
suit	urban	13	2026-10-04 15:41:10.151689+00
suit	vintage	14	2026-10-04 15:41:10.151689+00
suit	modern_office	15	2026-10-04 15:41:10.151689+00
tshirt	luxury_studio	2	2026-10-04 15:41:10.151689+00
tshirt	minimal_beige	4	2026-10-04 15:41:10.151689+00
tshirt	modern_loft	5	2026-10-04 15:41:10.151689+00
tshirt	festive_haveli	3	2026-10-04 15:41:10.151689+00
tshirt	plain	1	2026-10-04 15:41:10.151689+00
tshirt	studio	2	2026-10-04 15:41:10.151689+00
tshirt	traditional	3	2026-10-04 15:41:10.151689+00
tshirt	festival	4	2026-10-04 15:41:10.151689+00
tshirt	luxury	5	2026-10-04 15:41:10.151689+00
tshirt	royal	6	2026-10-04 15:41:10.151689+00
tshirt	urban	13	2026-10-04 15:41:10.151689+00
tshirt	vintage	14	2026-10-04 15:41:10.151689+00
tshirt	modern_office	15	2026-10-04 15:41:10.151689+00
jeans	luxury_studio	2	2026-10-04 15:41:10.151689+00
jeans	minimal_beige	4	2026-10-04 15:41:10.151689+00
jeans	modern_loft	5	2026-10-04 15:41:10.151689+00
jeans	festive_haveli	3	2026-10-04 15:41:10.151689+00
jeans	plain	1	2026-10-04 15:41:10.151689+00
jeans	studio	2	2026-10-04 15:41:10.151689+00
jeans	traditional	3	2026-10-04 15:41:10.151689+00
jeans	festival	4	2026-10-04 15:41:10.151689+00
jeans	luxury	5	2026-10-04 15:41:10.151689+00
jeans	royal	6	2026-10-04 15:41:10.151689+00
jeans	urban	13	2026-10-04 15:41:10.151689+00
jeans	vintage	14	2026-10-04 15:41:10.151689+00
jeans	modern_office	15	2026-10-04 15:41:10.151689+00
necklace	luxury_studio	2	2026-10-04 15:41:10.151689+00
necklace	minimal_beige	4	2026-10-04 15:41:10.151689+00
necklace	modern_loft	5	2026-10-04 15:41:10.151689+00
necklace	festive_haveli	3	2026-10-04 15:41:10.151689+00
necklace	plain	1	2026-10-04 15:41:10.151689+00
necklace	studio	2	2026-10-04 15:41:10.151689+00
necklace	traditional	3	2026-10-04 15:41:10.151689+00
necklace	festival	4	2026-10-04 15:41:10.151689+00
necklace	luxury	5	2026-10-04 15:41:10.151689+00
necklace	royal	6	2026-10-04 15:41:10.151689+00
necklace	wood	7	2026-10-04 15:41:10.151689+00
necklace	beach	8	2026-10-04 15:41:10.151689+00
necklace	velvet	9	2026-10-04 15:41:10.151689+00
necklace	silk	10	2026-10-04 15:41:10.151689+00
necklace	granite	11	2026-10-04 15:41:10.151689+00
necklace	mirror	12	2026-10-04 15:41:10.151689+00
earrings	luxury_studio	2	2026-10-04 15:41:10.151689+00
earrings	minimal_beige	4	2026-10-04 15:41:10.151689+00
earrings	modern_loft	5	2026-10-04 15:41:10.151689+00
earrings	festive_haveli	3	2026-10-04 15:41:10.151689+00
earrings	plain	1	2026-10-04 15:41:10.151689+00
earrings	studio	2	2026-10-04 15:41:10.151689+00
earrings	traditional	3	2026-10-04 15:41:10.151689+00
earrings	festival	4	2026-10-04 15:41:10.151689+00
earrings	luxury	5	2026-10-04 15:41:10.151689+00
earrings	royal	6	2026-10-04 15:41:10.151689+00
earrings	wood	7	2026-10-04 15:41:10.151689+00
earrings	beach	8	2026-10-04 15:41:10.151689+00
earrings	velvet	9	2026-10-04 15:41:10.151689+00
earrings	silk	10	2026-10-04 15:41:10.151689+00
earrings	granite	11	2026-10-04 15:41:10.151689+00
earrings	mirror	12	2026-10-04 15:41:10.151689+00
chain	luxury_studio	2	2026-10-04 15:41:10.151689+00
chain	minimal_beige	4	2026-10-04 15:41:10.151689+00
chain	modern_loft	5	2026-10-04 15:41:10.151689+00
chain	festive_haveli	3	2026-10-04 15:41:10.151689+00
chain	plain	1	2026-10-04 15:41:10.151689+00
chain	studio	2	2026-10-04 15:41:10.151689+00
chain	traditional	3	2026-10-04 15:41:10.151689+00
chain	festival	4	2026-10-04 15:41:10.151689+00
chain	luxury	5	2026-10-04 15:41:10.151689+00
chain	royal	6	2026-10-04 15:41:10.151689+00
chain	wood	7	2026-10-04 15:41:10.151689+00
chain	beach	8	2026-10-04 15:41:10.151689+00
chain	velvet	9	2026-10-04 15:41:10.151689+00
chain	silk	10	2026-10-04 15:41:10.151689+00
chain	granite	11	2026-10-04 15:41:10.151689+00
chain	mirror	12	2026-10-04 15:41:10.151689+00
pendant	luxury_studio	2	2026-10-04 15:41:10.151689+00
pendant	minimal_beige	4	2026-10-04 15:41:10.151689+00
pendant	modern_loft	5	2026-10-04 15:41:10.151689+00
pendant	festive_haveli	3	2026-10-04 15:41:10.151689+00
pendant	plain	1	2026-10-04 15:41:10.151689+00
pendant	studio	2	2026-10-04 15:41:10.151689+00
pendant	traditional	3	2026-10-04 15:41:10.151689+00
pendant	festival	4	2026-10-04 15:41:10.151689+00
pendant	luxury	5	2026-10-04 15:41:10.151689+00
pendant	royal	6	2026-10-04 15:41:10.151689+00
pendant	wood	7	2026-10-04 15:41:10.151689+00
pendant	beach	8	2026-10-04 15:41:10.151689+00
pendant	velvet	9	2026-10-04 15:41:10.151689+00
pendant	silk	10	2026-10-04 15:41:10.151689+00
pendant	granite	11	2026-10-04 15:41:10.151689+00
pendant	mirror	12	2026-10-04 15:41:10.151689+00
bangles	luxury_studio	2	2026-10-04 15:41:10.151689+00
bangles	minimal_beige	4	2026-10-04 15:41:10.151689+00
bangles	modern_loft	5	2026-10-04 15:41:10.151689+00
bangles	festive_haveli	3	2026-10-04 15:41:10.151689+00
bangles	plain	1	2026-10-04 15:41:10.151689+00
bangles	studio	2	2026-10-04 15:41:10.151689+00
bangles	traditional	3	2026-10-04 15:41:10.151689+00
bangles	festival	4	2026-10-04 15:41:10.151689+00
bangles	luxury	5	2026-10-04 15:41:10.151689+00
bangles	royal	6	2026-10-04 15:41:10.151689+00
bangles	wood	7	2026-10-04 15:41:10.151689+00
bangles	beach	8	2026-10-04 15:41:10.151689+00
bangles	velvet	9	2026-10-04 15:41:10.151689+00
bangles	silk	10	2026-10-04 15:41:10.151689+00
bangles	granite	11	2026-10-04 15:41:10.151689+00
bangles	mirror	12	2026-10-04 15:41:10.151689+00
maang_tikka	luxury_studio	2	2026-10-04 15:41:10.151689+00
maang_tikka	minimal_beige	4	2026-10-04 15:41:10.151689+00
maang_tikka	modern_loft	5	2026-10-04 15:41:10.151689+00
maang_tikka	festive_haveli	3	2026-10-04 15:41:10.151689+00
maang_tikka	plain	1	2026-10-04 15:41:10.151689+00
maang_tikka	studio	2	2026-10-04 15:41:10.151689+00
maang_tikka	traditional	3	2026-10-04 15:41:10.151689+00
maang_tikka	festival	4	2026-10-04 15:41:10.151689+00
maang_tikka	luxury	5	2026-10-04 15:41:10.151689+00
maang_tikka	royal	6	2026-10-04 15:41:10.151689+00
maang_tikka	wood	7	2026-10-04 15:41:10.151689+00
maang_tikka	beach	8	2026-10-04 15:41:10.151689+00
maang_tikka	velvet	9	2026-10-04 15:41:10.151689+00
maang_tikka	silk	10	2026-10-04 15:41:10.151689+00
maang_tikka	granite	11	2026-10-04 15:41:10.151689+00
maang_tikka	mirror	12	2026-10-04 15:41:10.151689+00
matha_patti	luxury_studio	2	2026-10-04 15:41:10.151689+00
matha_patti	minimal_beige	4	2026-10-04 15:41:10.151689+00
matha_patti	modern_loft	5	2026-10-04 15:41:10.151689+00
matha_patti	festive_haveli	3	2026-10-04 15:41:10.151689+00
matha_patti	plain	1	2026-10-04 15:41:10.151689+00
matha_patti	studio	2	2026-10-04 15:41:10.151689+00
matha_patti	traditional	3	2026-10-04 15:41:10.151689+00
matha_patti	festival	4	2026-10-04 15:41:10.151689+00
matha_patti	luxury	5	2026-10-04 15:41:10.151689+00
matha_patti	royal	6	2026-10-04 15:41:10.151689+00
matha_patti	wood	7	2026-10-04 15:41:10.151689+00
matha_patti	beach	8	2026-10-04 15:41:10.151689+00
matha_patti	velvet	9	2026-10-04 15:41:10.151689+00
matha_patti	silk	10	2026-10-04 15:41:10.151689+00
matha_patti	granite	11	2026-10-04 15:41:10.151689+00
matha_patti	mirror	12	2026-10-04 15:41:10.151689+00
lehenga	luxury_studio	2	2026-10-04 15:41:10.151689+00
lehenga	minimal_beige	4	2026-10-04 15:41:10.151689+00
lehenga	modern_loft	5	2026-10-04 15:41:10.151689+00
lehenga	festive_haveli	3	2026-10-04 15:41:10.151689+00
lehenga	plain	1	2026-10-04 15:41:10.151689+00
lehenga	studio	2	2026-10-04 15:41:10.151689+00
lehenga	traditional	3	2026-10-04 15:41:10.151689+00
lehenga	festival	4	2026-10-04 15:41:10.151689+00
lehenga	luxury	5	2026-10-04 15:41:10.151689+00
lehenga	royal	6	2026-10-04 15:41:10.151689+00
lehenga	urban	13	2026-10-04 15:41:10.151689+00
lehenga	vintage	14	2026-10-04 15:41:10.151689+00
lehenga	modern_office	15	2026-10-04 15:41:10.151689+00
gown	luxury_studio	2	2026-10-04 15:41:10.151689+00
gown	minimal_beige	4	2026-10-04 15:41:10.151689+00
gown	modern_loft	5	2026-10-04 15:41:10.151689+00
gown	festive_haveli	3	2026-10-04 15:41:10.151689+00
gown	plain	1	2026-10-04 15:41:10.151689+00
gown	studio	2	2026-10-04 15:41:10.151689+00
gown	traditional	3	2026-10-04 15:41:10.151689+00
gown	festival	4	2026-10-04 15:41:10.151689+00
gown	luxury	5	2026-10-04 15:41:10.151689+00
gown	royal	6	2026-10-04 15:41:10.151689+00
gown	urban	13	2026-10-04 15:41:10.151689+00
gown	vintage	14	2026-10-04 15:41:10.151689+00
gown	modern_office	15	2026-10-04 15:41:10.151689+00
western_wear	luxury_studio	2	2026-10-04 15:41:10.151689+00
western_wear	minimal_beige	4	2026-10-04 15:41:10.151689+00
western_wear	modern_loft	5	2026-10-04 15:41:10.151689+00
western_wear	festive_haveli	3	2026-10-04 15:41:10.151689+00
western_wear	plain	1	2026-10-04 15:41:10.151689+00
western_wear	studio	2	2026-10-04 15:41:10.151689+00
western_wear	traditional	3	2026-10-04 15:41:10.151689+00
western_wear	festival	4	2026-10-04 15:41:10.151689+00
western_wear	luxury	5	2026-10-04 15:41:10.151689+00
western_wear	royal	6	2026-10-04 15:41:10.151689+00
western_wear	urban	13	2026-10-04 15:41:10.151689+00
western_wear	vintage	14	2026-10-04 15:41:10.151689+00
western_wear	modern_office	15	2026-10-04 15:41:10.151689+00
choker	luxury_studio	2	2026-10-04 15:41:10.151689+00
choker	minimal_beige	4	2026-10-04 15:41:10.151689+00
choker	modern_loft	5	2026-10-04 15:41:10.151689+00
choker	festive_haveli	3	2026-10-04 15:41:10.151689+00
choker	plain	1	2026-10-04 15:41:10.151689+00
choker	studio	2	2026-10-04 15:41:10.151689+00
choker	traditional	3	2026-10-04 15:41:10.151689+00
choker	festival	4	2026-10-04 15:41:10.151689+00
choker	luxury	5	2026-10-04 15:41:10.151689+00
choker	royal	6	2026-10-04 15:41:10.151689+00
choker	wood	7	2026-10-04 15:41:10.151689+00
choker	beach	8	2026-10-04 15:41:10.151689+00
choker	velvet	9	2026-10-04 15:41:10.151689+00
choker	silk	10	2026-10-04 15:41:10.151689+00
choker	granite	11	2026-10-04 15:41:10.151689+00
choker	mirror	12	2026-10-04 15:41:10.151689+00
ring	luxury_studio	2	2026-10-04 15:41:10.151689+00
ring	minimal_beige	4	2026-10-04 15:41:10.151689+00
ring	modern_loft	5	2026-10-04 15:41:10.151689+00
ring	festive_haveli	3	2026-10-04 15:41:10.151689+00
ring	plain	1	2026-10-04 15:41:10.151689+00
ring	studio	2	2026-10-04 15:41:10.151689+00
ring	traditional	3	2026-10-04 15:41:10.151689+00
ring	festival	4	2026-10-04 15:41:10.151689+00
ring	luxury	5	2026-10-04 15:41:10.151689+00
ring	royal	6	2026-10-04 15:41:10.151689+00
ring	wood	7	2026-10-04 15:41:10.151689+00
ring	beach	8	2026-10-04 15:41:10.151689+00
ring	velvet	9	2026-10-04 15:41:10.151689+00
ring	silk	10	2026-10-04 15:41:10.151689+00
ring	granite	11	2026-10-04 15:41:10.151689+00
ring	mirror	12	2026-10-04 15:41:10.151689+00
nose_ring	luxury_studio	2	2026-10-04 15:41:10.151689+00
nose_ring	minimal_beige	4	2026-10-04 15:41:10.151689+00
nose_ring	modern_loft	5	2026-10-04 15:41:10.151689+00
nose_ring	festive_haveli	3	2026-10-04 15:41:10.151689+00
nose_ring	plain	1	2026-10-04 15:41:10.151689+00
nose_ring	studio	2	2026-10-04 15:41:10.151689+00
nose_ring	traditional	3	2026-10-04 15:41:10.151689+00
nose_ring	festival	4	2026-10-04 15:41:10.151689+00
nose_ring	luxury	5	2026-10-04 15:41:10.151689+00
nose_ring	royal	6	2026-10-04 15:41:10.151689+00
nose_ring	wood	7	2026-10-04 15:41:10.151689+00
nose_ring	beach	8	2026-10-04 15:41:10.151689+00
nose_ring	velvet	9	2026-10-04 15:41:10.151689+00
nose_ring	silk	10	2026-10-04 15:41:10.151689+00
nose_ring	granite	11	2026-10-04 15:41:10.151689+00
nose_ring	mirror	12	2026-10-04 15:41:10.151689+00
waistband	luxury_studio	2	2026-10-04 15:41:10.151689+00
waistband	minimal_beige	4	2026-10-04 15:41:10.151689+00
waistband	modern_loft	5	2026-10-04 15:41:10.151689+00
waistband	festive_haveli	3	2026-10-04 15:41:10.151689+00
waistband	plain	1	2026-10-04 15:41:10.151689+00
waistband	studio	2	2026-10-04 15:41:10.151689+00
waistband	traditional	3	2026-10-04 15:41:10.151689+00
waistband	festival	4	2026-10-04 15:41:10.151689+00
waistband	luxury	5	2026-10-04 15:41:10.151689+00
waistband	royal	6	2026-10-04 15:41:10.151689+00
waistband	wood	7	2026-10-04 15:41:10.151689+00
waistband	beach	8	2026-10-04 15:41:10.151689+00
waistband	velvet	9	2026-10-04 15:41:10.151689+00
waistband	silk	10	2026-10-04 15:41:10.151689+00
waistband	granite	11	2026-10-04 15:41:10.151689+00
waistband	mirror	12	2026-10-04 15:41:10.151689+00
payal	luxury_studio	2	2026-10-04 15:41:10.151689+00
payal	minimal_beige	4	2026-10-04 15:41:10.151689+00
payal	modern_loft	5	2026-10-04 15:41:10.151689+00
payal	festive_haveli	3	2026-10-04 15:41:10.151689+00
payal	plain	1	2026-10-04 15:41:10.151689+00
payal	studio	2	2026-10-04 15:41:10.151689+00
payal	traditional	3	2026-10-04 15:41:10.151689+00
payal	festival	4	2026-10-04 15:41:10.151689+00
payal	luxury	5	2026-10-04 15:41:10.151689+00
payal	royal	6	2026-10-04 15:41:10.151689+00
payal	wood	7	2026-10-04 15:41:10.151689+00
payal	beach	8	2026-10-04 15:41:10.151689+00
payal	velvet	9	2026-10-04 15:41:10.151689+00
payal	silk	10	2026-10-04 15:41:10.151689+00
payal	granite	11	2026-10-04 15:41:10.151689+00
payal	mirror	12	2026-10-04 15:41:10.151689+00
toe_ring	luxury_studio	2	2026-10-04 15:41:10.151689+00
toe_ring	minimal_beige	4	2026-10-04 15:41:10.151689+00
toe_ring	modern_loft	5	2026-10-04 15:41:10.151689+00
toe_ring	festive_haveli	3	2026-10-04 15:41:10.151689+00
toe_ring	plain	1	2026-10-04 15:41:10.151689+00
toe_ring	studio	2	2026-10-04 15:41:10.151689+00
toe_ring	traditional	3	2026-10-04 15:41:10.151689+00
toe_ring	festival	4	2026-10-04 15:41:10.151689+00
toe_ring	luxury	5	2026-10-04 15:41:10.151689+00
toe_ring	royal	6	2026-10-04 15:41:10.151689+00
toe_ring	wood	7	2026-10-04 15:41:10.151689+00
toe_ring	beach	8	2026-10-04 15:41:10.151689+00
toe_ring	velvet	9	2026-10-04 15:41:10.151689+00
toe_ring	silk	10	2026-10-04 15:41:10.151689+00
toe_ring	granite	11	2026-10-04 15:41:10.151689+00
toe_ring	mirror	12	2026-10-04 15:41:10.151689+00
watch	luxury_studio	2	2026-10-04 15:41:10.151689+00
watch	minimal_beige	4	2026-10-04 15:41:10.151689+00
watch	modern_loft	5	2026-10-04 15:41:10.151689+00
watch	festive_haveli	3	2026-10-04 15:41:10.151689+00
watch	plain	1	2026-10-04 15:41:10.151689+00
watch	studio	2	2026-10-04 15:41:10.151689+00
watch	traditional	3	2026-10-04 15:41:10.151689+00
watch	festival	4	2026-10-04 15:41:10.151689+00
watch	luxury	5	2026-10-04 15:41:10.151689+00
watch	royal	6	2026-10-04 15:41:10.151689+00
watch	wood	7	2026-10-04 15:41:10.151689+00
watch	beach	8	2026-10-04 15:41:10.151689+00
watch	velvet	9	2026-10-04 15:41:10.151689+00
watch	silk	10	2026-10-04 15:41:10.151689+00
watch	granite	11	2026-10-04 15:41:10.151689+00
watch	mirror	12	2026-10-04 15:41:10.151689+00
kada	luxury_studio	2	2026-10-04 15:41:10.151689+00
kada	minimal_beige	4	2026-10-04 15:41:10.151689+00
kada	modern_loft	5	2026-10-04 15:41:10.151689+00
kada	festive_haveli	3	2026-10-04 15:41:10.151689+00
kada	plain	1	2026-10-04 15:41:10.151689+00
kada	studio	2	2026-10-04 15:41:10.151689+00
kada	traditional	3	2026-10-04 15:41:10.151689+00
kada	festival	4	2026-10-04 15:41:10.151689+00
kada	luxury	5	2026-10-04 15:41:10.151689+00
kada	royal	6	2026-10-04 15:41:10.151689+00
kada	wood	7	2026-10-04 15:41:10.151689+00
kada	beach	8	2026-10-04 15:41:10.151689+00
kada	velvet	9	2026-10-04 15:41:10.151689+00
kada	silk	10	2026-10-04 15:41:10.151689+00
kada	granite	11	2026-10-04 15:41:10.151689+00
kada	mirror	12	2026-10-04 15:41:10.151689+00
brooch	luxury_studio	2	2026-10-04 15:41:10.151689+00
brooch	minimal_beige	4	2026-10-04 15:41:10.151689+00
brooch	modern_loft	5	2026-10-04 15:41:10.151689+00
brooch	festive_haveli	3	2026-10-04 15:41:10.151689+00
brooch	plain	1	2026-10-04 15:41:10.151689+00
brooch	studio	2	2026-10-04 15:41:10.151689+00
brooch	traditional	3	2026-10-04 15:41:10.151689+00
brooch	festival	4	2026-10-04 15:41:10.151689+00
brooch	luxury	5	2026-10-04 15:41:10.151689+00
brooch	royal	6	2026-10-04 15:41:10.151689+00
brooch	wood	7	2026-10-04 15:41:10.151689+00
brooch	beach	8	2026-10-04 15:41:10.151689+00
brooch	velvet	9	2026-10-04 15:41:10.151689+00
brooch	silk	10	2026-10-04 15:41:10.151689+00
brooch	granite	11	2026-10-04 15:41:10.151689+00
brooch	mirror	12	2026-10-04 15:41:10.151689+00
saree	plain	0	2026-10-04 15:49:45.35698+00
saree	studio	1	2026-10-04 15:49:45.35698+00
saree	luxury_studio	2	2026-10-04 15:49:45.35698+00
saree	festive_haveli	3	2026-10-04 15:49:45.35698+00
saree	traditional	4	2026-10-04 15:49:45.35698+00
saree	minimal_beige	5	2026-10-04 15:49:45.35698+00
saree	festival	6	2026-10-04 15:49:45.35698+00
saree	modern_loft	7	2026-10-04 15:49:45.35698+00
saree	luxury	8	2026-10-04 15:49:45.35698+00
saree	royal	9	2026-10-04 15:49:45.35698+00
saree	urban	10	2026-10-04 15:49:45.35698+00
saree	vintage	11	2026-10-04 15:49:45.35698+00
saree	modern_office	12	2026-10-04 15:49:45.35698+00
\.


--
-- Data for Name: catalog_item_poses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_item_poses (catalog_item_id, pose_id, display_order, created_at) FROM stdin;
necklace	close_neck_chest	5	2026-10-04 15:41:10.151689+00
earrings	close_neck_chest	5	2026-10-04 15:41:10.151689+00
chain	close_neck_chest	5	2026-10-04 15:41:10.151689+00
pendant	close_neck_chest	5	2026-10-04 15:41:10.151689+00
bangles	close_neck_chest	5	2026-10-04 15:41:10.151689+00
maang_tikka	close_neck_chest	5	2026-10-04 15:41:10.151689+00
matha_patti	close_neck_chest	5	2026-10-04 15:41:10.151689+00
choker	close_neck_chest	5	2026-10-04 15:41:10.151689+00
ring	close_neck_chest	5	2026-10-04 15:41:10.151689+00
nose_ring	close_neck_chest	5	2026-10-04 15:41:10.151689+00
waistband	close_neck_chest	5	2026-10-04 15:41:10.151689+00
payal	close_neck_chest	5	2026-10-04 15:41:10.151689+00
toe_ring	close_neck_chest	5	2026-10-04 15:41:10.151689+00
watch	close_neck_chest	5	2026-10-04 15:41:10.151689+00
kada	close_neck_chest	5	2026-10-04 15:41:10.151689+00
brooch	close_neck_chest	5	2026-10-04 15:41:10.151689+00
blouse	top_upper_portrait	7	2026-10-04 15:41:10.151689+00
shirt	top_upper_portrait	7	2026-10-04 15:41:10.151689+00
crop_top	top_upper_portrait	7	2026-10-04 15:41:10.151689+00
blazer	top_upper_portrait	7	2026-10-04 15:41:10.151689+00
hoodie	top_upper_portrait	7	2026-10-04 15:41:10.151689+00
tshirt	top_upper_portrait	7	2026-10-04 15:41:10.151689+00
blouse	top_three_quarter	9	2026-10-04 15:41:10.151689+00
shirt	top_three_quarter	9	2026-10-04 15:41:10.151689+00
crop_top	top_three_quarter	9	2026-10-04 15:41:10.151689+00
blazer	top_three_quarter	9	2026-10-04 15:41:10.151689+00
hoodie	top_three_quarter	9	2026-10-04 15:41:10.151689+00
tshirt	top_three_quarter	9	2026-10-04 15:41:10.151689+00
blouse	top_casual_cross	11	2026-10-04 15:41:10.151689+00
shirt	top_casual_cross	11	2026-10-04 15:41:10.151689+00
crop_top	top_casual_cross	11	2026-10-04 15:41:10.151689+00
blazer	top_casual_cross	11	2026-10-04 15:41:10.151689+00
hoodie	top_casual_cross	11	2026-10-04 15:41:10.151689+00
tshirt	top_casual_cross	11	2026-10-04 15:41:10.151689+00
dhoti	bottom_seated_cross	16	2026-10-04 15:41:10.151689+00
skirt	bottom_seated_cross	16	2026-10-04 15:41:10.151689+00
jeans	bottom_seated_cross	16	2026-10-04 15:41:10.151689+00
dhoti	bottom_3q_lower	17	2026-10-04 15:41:10.151689+00
skirt	bottom_3q_lower	17	2026-10-04 15:41:10.151689+00
jeans	bottom_3q_lower	17	2026-10-04 15:41:10.151689+00
earrings	side_ear_profile	25	2026-10-04 15:41:10.151689+00
earrings	ear_head_tilt	27	2026-10-04 15:41:10.151689+00
earrings	ear_front_balanced	29	2026-10-04 15:41:10.151689+00
earrings	ear_over_shoulder	30	2026-10-04 15:41:10.151689+00
bangles	wrist_side_arm	35	2026-10-04 15:41:10.151689+00
ring	wrist_side_arm	35	2026-10-04 15:41:10.151689+00
watch	wrist_side_arm	35	2026-10-04 15:41:10.151689+00
kada	wrist_side_arm	35	2026-10-04 15:41:10.151689+00
bangles	wrist_gesture	36	2026-10-04 15:41:10.151689+00
ring	wrist_gesture	36	2026-10-04 15:41:10.151689+00
watch	wrist_gesture	36	2026-10-04 15:41:10.151689+00
kada	wrist_gesture	36	2026-10-04 15:41:10.151689+00
bangles	finger_hands_clasped	51	2026-10-04 15:41:10.151689+00
ring	finger_hands_clasped	51	2026-10-04 15:41:10.151689+00
watch	finger_hands_clasped	51	2026-10-04 15:41:10.151689+00
kada	finger_hands_clasped	51	2026-10-04 15:41:10.151689+00
bangles	finger_holding_prop	52	2026-10-04 15:41:10.151689+00
ring	finger_holding_prop	52	2026-10-04 15:41:10.151689+00
watch	finger_holding_prop	52	2026-10-04 15:41:10.151689+00
kada	finger_holding_prop	52	2026-10-04 15:41:10.151689+00
bangles	finger_macro_ring	53	2026-10-04 15:41:10.151689+00
ring	finger_macro_ring	53	2026-10-04 15:41:10.151689+00
watch	finger_macro_ring	53	2026-10-04 15:41:10.151689+00
kada	finger_macro_ring	53	2026-10-04 15:41:10.151689+00
payal	anklet_floor_cross_legged	55	2026-10-04 15:41:10.151689+00
toe_ring	anklet_floor_cross_legged	55	2026-10-04 15:41:10.151689+00
necklace	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
earrings	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
chain	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
pendant	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
bangles	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
maang_tikka	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
matha_patti	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
choker	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
ring	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
nose_ring	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
waistband	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
payal	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
toe_ring	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
watch	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
kada	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
brooch	three_quarter_gaze	71	2026-10-04 15:41:10.151689+00
blouse	top_front_direct	12	2026-10-04 15:41:10.151689+00
shirt	top_front_direct	12	2026-10-04 15:41:10.151689+00
crop_top	top_front_direct	12	2026-10-04 15:41:10.151689+00
blazer	top_front_direct	12	2026-10-04 15:41:10.151689+00
hoodie	top_front_direct	12	2026-10-04 15:41:10.151689+00
tshirt	top_front_direct	12	2026-10-04 15:41:10.151689+00
dhoti	bottom_walking_step	14	2026-10-04 15:41:10.151689+00
skirt	bottom_walking_step	14	2026-10-04 15:41:10.151689+00
jeans	bottom_walking_step	14	2026-10-04 15:41:10.151689+00
dhoti	bottom_side_leg	15	2026-10-04 15:41:10.151689+00
skirt	bottom_side_leg	15	2026-10-04 15:41:10.151689+00
jeans	bottom_side_leg	15	2026-10-04 15:41:10.151689+00
bangles	wrist_resting_lap	32	2026-10-04 15:41:10.151689+00
ring	wrist_resting_lap	32	2026-10-04 15:41:10.151689+00
watch	wrist_resting_lap	32	2026-10-04 15:41:10.151689+00
kada	wrist_resting_lap	32	2026-10-04 15:41:10.151689+00
waistband	hip_waist_mid	37	2026-10-04 15:41:10.151689+00
waistband	hip_hands_on_waist	38	2026-10-04 15:41:10.151689+00
waistband	hip_royal_standing	39	2026-10-04 15:41:10.151689+00
waistband	hip_saree_drape	41	2026-10-04 15:41:10.151689+00
nose_ring	nose_3q_headturn	45	2026-10-04 15:41:10.151689+00
nose_ring	nose_bridal_veil	46	2026-10-04 15:41:10.151689+00
nose_ring	nose_macro_focus	48	2026-10-04 15:41:10.151689+00
bangles	finger_hand_gesture	49	2026-10-04 15:41:10.151689+00
ring	finger_hand_gesture	49	2026-10-04 15:41:10.151689+00
watch	finger_hand_gesture	49	2026-10-04 15:41:10.151689+00
kada	finger_hand_gesture	49	2026-10-04 15:41:10.151689+00
bangles	finger_chin_rest	50	2026-10-04 15:41:10.151689+00
ring	finger_chin_rest	50	2026-10-04 15:41:10.151689+00
watch	finger_chin_rest	50	2026-10-04 15:41:10.151689+00
kada	finger_chin_rest	50	2026-10-04 15:41:10.151689+00
bangles	finger_side_hand	54	2026-10-04 15:41:10.151689+00
ring	finger_side_hand	54	2026-10-04 15:41:10.151689+00
watch	finger_side_hand	54	2026-10-04 15:41:10.151689+00
kada	finger_side_hand	54	2026-10-04 15:41:10.151689+00
payal	anklet_ankle_close	58	2026-10-04 15:41:10.151689+00
toe_ring	anklet_ankle_close	58	2026-10-04 15:41:10.151689+00
payal	anklet_step_forward	59	2026-10-04 15:41:10.151689+00
toe_ring	anklet_step_forward	59	2026-10-04 15:41:10.151689+00
necklace	neck_collarbone	19	2026-10-04 15:41:10.151689+00
chain	neck_collarbone	19	2026-10-04 15:41:10.151689+00
pendant	neck_collarbone	19	2026-10-04 15:41:10.151689+00
choker	neck_collarbone	19	2026-10-04 15:41:10.151689+00
necklace	neck_royal_gaze	22	2026-10-04 15:41:10.151689+00
chain	neck_royal_gaze	22	2026-10-04 15:41:10.151689+00
pendant	neck_royal_gaze	22	2026-10-04 15:41:10.151689+00
choker	neck_royal_gaze	22	2026-10-04 15:41:10.151689+00
nose_ring	nose_close_profile	43	2026-10-04 15:41:10.151689+00
nose_ring	nose_soft_smile	47	2026-10-04 15:41:10.151689+00
payal	anklet_floor_kneeling_mehendi	57	2026-10-04 15:41:10.151689+00
toe_ring	anklet_floor_kneeling_mehendi	57	2026-10-04 15:41:10.151689+00
payal	anklet_seated_foot	60	2026-10-04 15:41:10.151689+00
toe_ring	anklet_seated_foot	60	2026-10-04 15:41:10.151689+00
payal	anklet_toering_focus	63	2026-10-04 15:41:10.151689+00
toe_ring	anklet_toering_focus	63	2026-10-04 15:41:10.151689+00
maang_tikka	forehead_tikka_center	64	2026-10-04 15:41:10.151689+00
matha_patti	forehead_tikka_center	64	2026-10-04 15:41:10.151689+00
maang_tikka	forehead_mathapatti_frame	65	2026-10-04 15:41:10.151689+00
matha_patti	forehead_mathapatti_frame	65	2026-10-04 15:41:10.151689+00
maang_tikka	forehead_bridal_veil	67	2026-10-04 15:41:10.151689+00
matha_patti	forehead_bridal_veil	67	2026-10-04 15:41:10.151689+00
maang_tikka	forehead_side_passa	68	2026-10-04 15:41:10.151689+00
matha_patti	forehead_side_passa	68	2026-10-04 15:41:10.151689+00
maang_tikka	forehead_front_portrait	69	2026-10-04 15:41:10.151689+00
matha_patti	forehead_front_portrait	69	2026-10-04 15:41:10.151689+00
necklace	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
earrings	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
chain	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
pendant	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
bangles	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
maang_tikka	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
matha_patti	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
choker	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
ring	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
nose_ring	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
waistband	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
payal	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
toe_ring	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
watch	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
kada	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
brooch	hand_face_gesture	70	2026-10-04 15:41:10.151689+00
necklace	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
earrings	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
chain	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
pendant	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
bangles	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
maang_tikka	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
matha_patti	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
choker	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
ring	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
nose_ring	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
waistband	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
payal	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
toe_ring	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
watch	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
kada	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
brooch	front_direct_portrait	72	2026-10-04 15:41:10.151689+00
necklace	macro_ear	6	2026-10-04 15:41:10.151689+00
earrings	macro_ear	6	2026-10-04 15:41:10.151689+00
chain	macro_ear	6	2026-10-04 15:41:10.151689+00
pendant	macro_ear	6	2026-10-04 15:41:10.151689+00
bangles	macro_ear	6	2026-10-04 15:41:10.151689+00
maang_tikka	macro_ear	6	2026-10-04 15:41:10.151689+00
matha_patti	macro_ear	6	2026-10-04 15:41:10.151689+00
choker	macro_ear	6	2026-10-04 15:41:10.151689+00
ring	macro_ear	6	2026-10-04 15:41:10.151689+00
nose_ring	macro_ear	6	2026-10-04 15:41:10.151689+00
waistband	macro_ear	6	2026-10-04 15:41:10.151689+00
payal	macro_ear	6	2026-10-04 15:41:10.151689+00
toe_ring	macro_ear	6	2026-10-04 15:41:10.151689+00
watch	macro_ear	6	2026-10-04 15:41:10.151689+00
kada	macro_ear	6	2026-10-04 15:41:10.151689+00
brooch	macro_ear	6	2026-10-04 15:41:10.151689+00
necklace	wrist_chest	7	2026-10-04 15:41:10.151689+00
earrings	wrist_chest	7	2026-10-04 15:41:10.151689+00
chain	wrist_chest	7	2026-10-04 15:41:10.151689+00
pendant	wrist_chest	7	2026-10-04 15:41:10.151689+00
bangles	wrist_chest	7	2026-10-04 15:41:10.151689+00
maang_tikka	wrist_chest	7	2026-10-04 15:41:10.151689+00
matha_patti	wrist_chest	7	2026-10-04 15:41:10.151689+00
choker	wrist_chest	7	2026-10-04 15:41:10.151689+00
ring	wrist_chest	7	2026-10-04 15:41:10.151689+00
nose_ring	wrist_chest	7	2026-10-04 15:41:10.151689+00
waistband	wrist_chest	7	2026-10-04 15:41:10.151689+00
payal	wrist_chest	7	2026-10-04 15:41:10.151689+00
toe_ring	wrist_chest	7	2026-10-04 15:41:10.151689+00
watch	wrist_chest	7	2026-10-04 15:41:10.151689+00
kada	wrist_chest	7	2026-10-04 15:41:10.151689+00
brooch	wrist_chest	7	2026-10-04 15:41:10.151689+00
sherwani	standing_front	1	2026-10-04 15:41:10.151689+00
salwar	standing_front	1	2026-10-04 15:41:10.151689+00
tracksuit	standing_front	1	2026-10-04 15:41:10.151689+00
kurta	standing_front	1	2026-10-04 15:41:10.151689+00
suit	standing_front	1	2026-10-04 15:41:10.151689+00
lehenga	standing_front	1	2026-10-04 15:41:10.151689+00
gown	standing_front	1	2026-10-04 15:41:10.151689+00
western_wear	standing_front	1	2026-10-04 15:41:10.151689+00
sherwani	standing_three_quarter	3	2026-10-04 15:41:10.151689+00
salwar	standing_three_quarter	3	2026-10-04 15:41:10.151689+00
tracksuit	standing_three_quarter	3	2026-10-04 15:41:10.151689+00
kurta	standing_three_quarter	3	2026-10-04 15:41:10.151689+00
suit	standing_three_quarter	3	2026-10-04 15:41:10.151689+00
lehenga	standing_three_quarter	3	2026-10-04 15:41:10.151689+00
gown	standing_three_quarter	3	2026-10-04 15:41:10.151689+00
western_wear	standing_three_quarter	3	2026-10-04 15:41:10.151689+00
sherwani	walking_candid	4	2026-10-04 15:41:10.151689+00
salwar	walking_candid	4	2026-10-04 15:41:10.151689+00
tracksuit	walking_candid	4	2026-10-04 15:41:10.151689+00
kurta	walking_candid	4	2026-10-04 15:41:10.151689+00
suit	walking_candid	4	2026-10-04 15:41:10.151689+00
lehenga	walking_candid	4	2026-10-04 15:41:10.151689+00
gown	walking_candid	4	2026-10-04 15:41:10.151689+00
western_wear	walking_candid	4	2026-10-04 15:41:10.151689+00
sherwani	sitting_casual	6	2026-10-04 15:41:10.151689+00
salwar	sitting_casual	6	2026-10-04 15:41:10.151689+00
tracksuit	sitting_casual	6	2026-10-04 15:41:10.151689+00
kurta	sitting_casual	6	2026-10-04 15:41:10.151689+00
suit	sitting_casual	6	2026-10-04 15:41:10.151689+00
lehenga	sitting_casual	6	2026-10-04 15:41:10.151689+00
gown	sitting_casual	6	2026-10-04 15:41:10.151689+00
western_wear	sitting_casual	6	2026-10-04 15:41:10.151689+00
blouse	top_shoulder_profile	10	2026-10-04 15:41:10.151689+00
shirt	top_shoulder_profile	10	2026-10-04 15:41:10.151689+00
crop_top	top_shoulder_profile	10	2026-10-04 15:41:10.151689+00
blazer	top_shoulder_profile	10	2026-10-04 15:41:10.151689+00
hoodie	top_shoulder_profile	10	2026-10-04 15:41:10.151689+00
tshirt	top_shoulder_profile	10	2026-10-04 15:41:10.151689+00
necklace	neck_3q_shoulder	21	2026-10-04 15:41:10.151689+00
chain	neck_3q_shoulder	21	2026-10-04 15:41:10.151689+00
pendant	neck_3q_shoulder	21	2026-10-04 15:41:10.151689+00
choker	neck_3q_shoulder	21	2026-10-04 15:41:10.151689+00
necklace	neck_front_direct	23	2026-10-04 15:41:10.151689+00
chain	neck_front_direct	23	2026-10-04 15:41:10.151689+00
pendant	neck_front_direct	23	2026-10-04 15:41:10.151689+00
choker	neck_front_direct	23	2026-10-04 15:41:10.151689+00
necklace	neck_side_drape	24	2026-10-04 15:41:10.151689+00
chain	neck_side_drape	24	2026-10-04 15:41:10.151689+00
pendant	neck_side_drape	24	2026-10-04 15:41:10.151689+00
choker	neck_side_drape	24	2026-10-04 15:41:10.151689+00
earrings	ear_hair_tuck	26	2026-10-04 15:41:10.151689+00
earrings	ear_3q_face	28	2026-10-04 15:41:10.151689+00
bangles	wrist_cross_arms	33	2026-10-04 15:41:10.151689+00
ring	wrist_cross_arms	33	2026-10-04 15:41:10.151689+00
watch	wrist_cross_arms	33	2026-10-04 15:41:10.151689+00
kada	wrist_cross_arms	33	2026-10-04 15:41:10.151689+00
bangles	wrist_hand_chest	34	2026-10-04 15:41:10.151689+00
ring	wrist_hand_chest	34	2026-10-04 15:41:10.151689+00
watch	wrist_hand_chest	34	2026-10-04 15:41:10.151689+00
kada	wrist_hand_chest	34	2026-10-04 15:41:10.151689+00
waistband	hip_side_turn	40	2026-10-04 15:41:10.151689+00
waistband	hip_front_direct	42	2026-10-04 15:41:10.151689+00
nose_ring	nose_front_portrait	44	2026-10-04 15:41:10.151689+00
sherwani	standing_side	2	2026-10-04 15:41:10.151689+00
salwar	standing_side	2	2026-10-04 15:41:10.151689+00
tracksuit	standing_side	2	2026-10-04 15:41:10.151689+00
kurta	standing_side	2	2026-10-04 15:41:10.151689+00
suit	standing_side	2	2026-10-04 15:41:10.151689+00
lehenga	standing_side	2	2026-10-04 15:41:10.151689+00
gown	standing_side	2	2026-10-04 15:41:10.151689+00
western_wear	standing_side	2	2026-10-04 15:41:10.151689+00
sherwani	sitting_chair	5	2026-10-04 15:41:10.151689+00
salwar	sitting_chair	5	2026-10-04 15:41:10.151689+00
tracksuit	sitting_chair	5	2026-10-04 15:41:10.151689+00
kurta	sitting_chair	5	2026-10-04 15:41:10.151689+00
suit	sitting_chair	5	2026-10-04 15:41:10.151689+00
lehenga	sitting_chair	5	2026-10-04 15:41:10.151689+00
gown	sitting_chair	5	2026-10-04 15:41:10.151689+00
western_wear	sitting_chair	5	2026-10-04 15:41:10.151689+00
blouse	top_standing_mid	8	2026-10-04 15:41:10.151689+00
shirt	top_standing_mid	8	2026-10-04 15:41:10.151689+00
crop_top	top_standing_mid	8	2026-10-04 15:41:10.151689+00
blazer	top_standing_mid	8	2026-10-04 15:41:10.151689+00
hoodie	top_standing_mid	8	2026-10-04 15:41:10.151689+00
tshirt	top_standing_mid	8	2026-10-04 15:41:10.151689+00
dhoti	bottom_full_leg	13	2026-10-04 15:41:10.151689+00
skirt	bottom_full_leg	13	2026-10-04 15:41:10.151689+00
jeans	bottom_full_leg	13	2026-10-04 15:41:10.151689+00
dhoti	bottom_front_stance	18	2026-10-04 15:41:10.151689+00
skirt	bottom_front_stance	18	2026-10-04 15:41:10.151689+00
jeans	bottom_front_stance	18	2026-10-04 15:41:10.151689+00
necklace	neck_chest_portrait	20	2026-10-04 15:41:10.151689+00
chain	neck_chest_portrait	20	2026-10-04 15:41:10.151689+00
pendant	neck_chest_portrait	20	2026-10-04 15:41:10.151689+00
choker	neck_chest_portrait	20	2026-10-04 15:41:10.151689+00
bangles	wrist_hand_display	31	2026-10-04 15:41:10.151689+00
ring	wrist_hand_display	31	2026-10-04 15:41:10.151689+00
watch	wrist_hand_display	31	2026-10-04 15:41:10.151689+00
kada	wrist_hand_display	31	2026-10-04 15:41:10.151689+00
payal	anklet_floor_legs_extended	56	2026-10-04 15:41:10.151689+00
toe_ring	anklet_floor_legs_extended	56	2026-10-04 15:41:10.151689+00
payal	anklet_side_foot	61	2026-10-04 15:41:10.151689+00
toe_ring	anklet_side_foot	61	2026-10-04 15:41:10.151689+00
payal	anklet_both_feet	62	2026-10-04 15:41:10.151689+00
toe_ring	anklet_both_feet	62	2026-10-04 15:41:10.151689+00
maang_tikka	forehead_3q_headturn	66	2026-10-04 15:41:10.151689+00
matha_patti	forehead_3q_headturn	66	2026-10-04 15:41:10.151689+00
saree	standing_front	0	2026-10-04 15:49:45.52793+00
saree	standing_side	1	2026-10-04 15:49:45.52793+00
saree	standing_three_quarter	2	2026-10-04 15:49:45.52793+00
saree	walking_candid	3	2026-10-04 15:49:45.52793+00
saree	sitting_chair	4	2026-10-04 15:49:45.52793+00
saree	sitting_casual	5	2026-10-04 15:49:45.52793+00
\.


--
-- Data for Name: catalog_item_presentations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_item_presentations (catalog_item_id, presentation_id, display_order, created_at) FROM stdin;
blouse	model	1	2026-10-04 15:41:10.151689+00
blouse	partial_face	2	2026-10-04 15:41:10.151689+00
blouse	no_face	3	2026-10-04 15:41:10.151689+00
blouse	mannequin	5	2026-10-04 15:41:10.151689+00
blouse	hanger	6	2026-10-04 15:41:10.151689+00
blouse	ghost	7	2026-10-04 15:41:10.151689+00
blouse	flat_lay	8	2026-10-04 15:41:10.151689+00
blouse	folded	9	2026-10-04 15:41:10.151689+00
blouse	shelf	10	2026-10-04 15:41:10.151689+00
blouse	shopwindow	11	2026-10-04 15:41:10.151689+00
shirt	model	1	2026-10-04 15:41:10.151689+00
shirt	partial_face	2	2026-10-04 15:41:10.151689+00
shirt	no_face	3	2026-10-04 15:41:10.151689+00
shirt	mannequin	5	2026-10-04 15:41:10.151689+00
shirt	hanger	6	2026-10-04 15:41:10.151689+00
shirt	ghost	7	2026-10-04 15:41:10.151689+00
shirt	flat_lay	8	2026-10-04 15:41:10.151689+00
shirt	folded	9	2026-10-04 15:41:10.151689+00
shirt	shelf	10	2026-10-04 15:41:10.151689+00
shirt	shopwindow	11	2026-10-04 15:41:10.151689+00
sherwani	model	1	2026-10-04 15:41:10.151689+00
sherwani	partial_face	2	2026-10-04 15:41:10.151689+00
sherwani	no_face	3	2026-10-04 15:41:10.151689+00
sherwani	mannequin	5	2026-10-04 15:41:10.151689+00
sherwani	hanger	6	2026-10-04 15:41:10.151689+00
sherwani	ghost	7	2026-10-04 15:41:10.151689+00
sherwani	flat_lay	8	2026-10-04 15:41:10.151689+00
sherwani	folded	9	2026-10-04 15:41:10.151689+00
sherwani	shelf	10	2026-10-04 15:41:10.151689+00
sherwani	shopwindow	11	2026-10-04 15:41:10.151689+00
dhoti	model	1	2026-10-04 15:41:10.151689+00
dhoti	partial_face	2	2026-10-04 15:41:10.151689+00
dhoti	no_face	3	2026-10-04 15:41:10.151689+00
dhoti	mannequin	5	2026-10-04 15:41:10.151689+00
dhoti	hanger	6	2026-10-04 15:41:10.151689+00
dhoti	ghost	7	2026-10-04 15:41:10.151689+00
dhoti	flat_lay	8	2026-10-04 15:41:10.151689+00
dhoti	folded	9	2026-10-04 15:41:10.151689+00
dhoti	shelf	10	2026-10-04 15:41:10.151689+00
dhoti	shopwindow	11	2026-10-04 15:41:10.151689+00
salwar	model	1	2026-10-04 15:41:10.151689+00
salwar	partial_face	2	2026-10-04 15:41:10.151689+00
salwar	no_face	3	2026-10-04 15:41:10.151689+00
salwar	mannequin	5	2026-10-04 15:41:10.151689+00
salwar	hanger	6	2026-10-04 15:41:10.151689+00
salwar	ghost	7	2026-10-04 15:41:10.151689+00
salwar	flat_lay	8	2026-10-04 15:41:10.151689+00
salwar	folded	9	2026-10-04 15:41:10.151689+00
salwar	shelf	10	2026-10-04 15:41:10.151689+00
salwar	shopwindow	11	2026-10-04 15:41:10.151689+00
skirt	model	1	2026-10-04 15:41:10.151689+00
skirt	partial_face	2	2026-10-04 15:41:10.151689+00
skirt	no_face	3	2026-10-04 15:41:10.151689+00
skirt	mannequin	5	2026-10-04 15:41:10.151689+00
skirt	hanger	6	2026-10-04 15:41:10.151689+00
skirt	ghost	7	2026-10-04 15:41:10.151689+00
skirt	flat_lay	8	2026-10-04 15:41:10.151689+00
skirt	folded	9	2026-10-04 15:41:10.151689+00
skirt	shelf	10	2026-10-04 15:41:10.151689+00
skirt	shopwindow	11	2026-10-04 15:41:10.151689+00
crop_top	model	1	2026-10-04 15:41:10.151689+00
crop_top	partial_face	2	2026-10-04 15:41:10.151689+00
crop_top	no_face	3	2026-10-04 15:41:10.151689+00
crop_top	mannequin	5	2026-10-04 15:41:10.151689+00
crop_top	hanger	6	2026-10-04 15:41:10.151689+00
crop_top	ghost	7	2026-10-04 15:41:10.151689+00
crop_top	flat_lay	8	2026-10-04 15:41:10.151689+00
crop_top	folded	9	2026-10-04 15:41:10.151689+00
crop_top	shelf	10	2026-10-04 15:41:10.151689+00
crop_top	shopwindow	11	2026-10-04 15:41:10.151689+00
blazer	model	1	2026-10-04 15:41:10.151689+00
blazer	partial_face	2	2026-10-04 15:41:10.151689+00
blazer	no_face	3	2026-10-04 15:41:10.151689+00
blazer	mannequin	5	2026-10-04 15:41:10.151689+00
blazer	hanger	6	2026-10-04 15:41:10.151689+00
blazer	ghost	7	2026-10-04 15:41:10.151689+00
blazer	flat_lay	8	2026-10-04 15:41:10.151689+00
blazer	folded	9	2026-10-04 15:41:10.151689+00
blazer	shelf	10	2026-10-04 15:41:10.151689+00
blazer	shopwindow	11	2026-10-04 15:41:10.151689+00
tracksuit	model	1	2026-10-04 15:41:10.151689+00
tracksuit	partial_face	2	2026-10-04 15:41:10.151689+00
tracksuit	no_face	3	2026-10-04 15:41:10.151689+00
tracksuit	mannequin	5	2026-10-04 15:41:10.151689+00
tracksuit	hanger	6	2026-10-04 15:41:10.151689+00
tracksuit	ghost	7	2026-10-04 15:41:10.151689+00
tracksuit	flat_lay	8	2026-10-04 15:41:10.151689+00
tracksuit	folded	9	2026-10-04 15:41:10.151689+00
tracksuit	shelf	10	2026-10-04 15:41:10.151689+00
tracksuit	shopwindow	11	2026-10-04 15:41:10.151689+00
hoodie	model	1	2026-10-04 15:41:10.151689+00
hoodie	partial_face	2	2026-10-04 15:41:10.151689+00
hoodie	no_face	3	2026-10-04 15:41:10.151689+00
hoodie	mannequin	5	2026-10-04 15:41:10.151689+00
hoodie	hanger	6	2026-10-04 15:41:10.151689+00
hoodie	ghost	7	2026-10-04 15:41:10.151689+00
hoodie	flat_lay	8	2026-10-04 15:41:10.151689+00
hoodie	folded	9	2026-10-04 15:41:10.151689+00
hoodie	shelf	10	2026-10-04 15:41:10.151689+00
hoodie	shopwindow	11	2026-10-04 15:41:10.151689+00
kurta	model	1	2026-10-04 15:41:10.151689+00
kurta	partial_face	2	2026-10-04 15:41:10.151689+00
kurta	no_face	3	2026-10-04 15:41:10.151689+00
kurta	mannequin	5	2026-10-04 15:41:10.151689+00
kurta	hanger	6	2026-10-04 15:41:10.151689+00
kurta	ghost	7	2026-10-04 15:41:10.151689+00
kurta	flat_lay	8	2026-10-04 15:41:10.151689+00
kurta	folded	9	2026-10-04 15:41:10.151689+00
kurta	shelf	10	2026-10-04 15:41:10.151689+00
kurta	shopwindow	11	2026-10-04 15:41:10.151689+00
suit	model	1	2026-10-04 15:41:10.151689+00
suit	partial_face	2	2026-10-04 15:41:10.151689+00
suit	no_face	3	2026-10-04 15:41:10.151689+00
suit	mannequin	5	2026-10-04 15:41:10.151689+00
suit	hanger	6	2026-10-04 15:41:10.151689+00
suit	ghost	7	2026-10-04 15:41:10.151689+00
suit	flat_lay	8	2026-10-04 15:41:10.151689+00
suit	folded	9	2026-10-04 15:41:10.151689+00
suit	shelf	10	2026-10-04 15:41:10.151689+00
suit	shopwindow	11	2026-10-04 15:41:10.151689+00
tshirt	model	1	2026-10-04 15:41:10.151689+00
tshirt	partial_face	2	2026-10-04 15:41:10.151689+00
tshirt	no_face	3	2026-10-04 15:41:10.151689+00
tshirt	mannequin	5	2026-10-04 15:41:10.151689+00
tshirt	hanger	6	2026-10-04 15:41:10.151689+00
tshirt	ghost	7	2026-10-04 15:41:10.151689+00
tshirt	flat_lay	8	2026-10-04 15:41:10.151689+00
tshirt	folded	9	2026-10-04 15:41:10.151689+00
tshirt	shelf	10	2026-10-04 15:41:10.151689+00
tshirt	shopwindow	11	2026-10-04 15:41:10.151689+00
jeans	model	1	2026-10-04 15:41:10.151689+00
jeans	partial_face	2	2026-10-04 15:41:10.151689+00
jeans	no_face	3	2026-10-04 15:41:10.151689+00
jeans	mannequin	5	2026-10-04 15:41:10.151689+00
jeans	hanger	6	2026-10-04 15:41:10.151689+00
jeans	ghost	7	2026-10-04 15:41:10.151689+00
jeans	flat_lay	8	2026-10-04 15:41:10.151689+00
jeans	folded	9	2026-10-04 15:41:10.151689+00
jeans	shelf	10	2026-10-04 15:41:10.151689+00
jeans	shopwindow	11	2026-10-04 15:41:10.151689+00
necklace	model	1	2026-10-04 15:41:10.151689+00
necklace	partial_face	2	2026-10-04 15:41:10.151689+00
necklace	no_face	3	2026-10-04 15:41:10.151689+00
necklace	body_part	4	2026-10-04 15:41:10.151689+00
necklace	bust	12	2026-10-04 15:41:10.151689+00
earrings	model	1	2026-10-04 15:41:10.151689+00
earrings	partial_face	2	2026-10-04 15:41:10.151689+00
earrings	no_face	3	2026-10-04 15:41:10.151689+00
earrings	body_part	4	2026-10-04 15:41:10.151689+00
earrings	bust	12	2026-10-04 15:41:10.151689+00
chain	model	1	2026-10-04 15:41:10.151689+00
chain	partial_face	2	2026-10-04 15:41:10.151689+00
chain	no_face	3	2026-10-04 15:41:10.151689+00
chain	body_part	4	2026-10-04 15:41:10.151689+00
chain	bust	12	2026-10-04 15:41:10.151689+00
pendant	model	1	2026-10-04 15:41:10.151689+00
pendant	partial_face	2	2026-10-04 15:41:10.151689+00
pendant	no_face	3	2026-10-04 15:41:10.151689+00
pendant	body_part	4	2026-10-04 15:41:10.151689+00
pendant	bust	12	2026-10-04 15:41:10.151689+00
bangles	model	1	2026-10-04 15:41:10.151689+00
bangles	partial_face	2	2026-10-04 15:41:10.151689+00
bangles	no_face	3	2026-10-04 15:41:10.151689+00
bangles	body_part	4	2026-10-04 15:41:10.151689+00
bangles	bust	12	2026-10-04 15:41:10.151689+00
maang_tikka	model	1	2026-10-04 15:41:10.151689+00
maang_tikka	partial_face	2	2026-10-04 15:41:10.151689+00
maang_tikka	no_face	3	2026-10-04 15:41:10.151689+00
maang_tikka	body_part	4	2026-10-04 15:41:10.151689+00
maang_tikka	bust	12	2026-10-04 15:41:10.151689+00
matha_patti	model	1	2026-10-04 15:41:10.151689+00
matha_patti	partial_face	2	2026-10-04 15:41:10.151689+00
matha_patti	no_face	3	2026-10-04 15:41:10.151689+00
matha_patti	body_part	4	2026-10-04 15:41:10.151689+00
matha_patti	bust	12	2026-10-04 15:41:10.151689+00
lehenga	model	1	2026-10-04 15:41:10.151689+00
lehenga	partial_face	2	2026-10-04 15:41:10.151689+00
lehenga	no_face	3	2026-10-04 15:41:10.151689+00
lehenga	mannequin	5	2026-10-04 15:41:10.151689+00
lehenga	hanger	6	2026-10-04 15:41:10.151689+00
lehenga	ghost	7	2026-10-04 15:41:10.151689+00
lehenga	flat_lay	8	2026-10-04 15:41:10.151689+00
lehenga	folded	9	2026-10-04 15:41:10.151689+00
lehenga	shelf	10	2026-10-04 15:41:10.151689+00
lehenga	shopwindow	11	2026-10-04 15:41:10.151689+00
gown	model	1	2026-10-04 15:41:10.151689+00
gown	partial_face	2	2026-10-04 15:41:10.151689+00
gown	no_face	3	2026-10-04 15:41:10.151689+00
gown	mannequin	5	2026-10-04 15:41:10.151689+00
gown	hanger	6	2026-10-04 15:41:10.151689+00
gown	ghost	7	2026-10-04 15:41:10.151689+00
gown	flat_lay	8	2026-10-04 15:41:10.151689+00
gown	folded	9	2026-10-04 15:41:10.151689+00
gown	shelf	10	2026-10-04 15:41:10.151689+00
gown	shopwindow	11	2026-10-04 15:41:10.151689+00
western_wear	model	1	2026-10-04 15:41:10.151689+00
western_wear	partial_face	2	2026-10-04 15:41:10.151689+00
western_wear	no_face	3	2026-10-04 15:41:10.151689+00
western_wear	mannequin	5	2026-10-04 15:41:10.151689+00
western_wear	hanger	6	2026-10-04 15:41:10.151689+00
western_wear	ghost	7	2026-10-04 15:41:10.151689+00
western_wear	flat_lay	8	2026-10-04 15:41:10.151689+00
western_wear	folded	9	2026-10-04 15:41:10.151689+00
western_wear	shelf	10	2026-10-04 15:41:10.151689+00
western_wear	shopwindow	11	2026-10-04 15:41:10.151689+00
choker	model	1	2026-10-04 15:41:10.151689+00
choker	partial_face	2	2026-10-04 15:41:10.151689+00
choker	no_face	3	2026-10-04 15:41:10.151689+00
choker	body_part	4	2026-10-04 15:41:10.151689+00
choker	bust	12	2026-10-04 15:41:10.151689+00
ring	model	1	2026-10-04 15:41:10.151689+00
ring	partial_face	2	2026-10-04 15:41:10.151689+00
ring	no_face	3	2026-10-04 15:41:10.151689+00
ring	body_part	4	2026-10-04 15:41:10.151689+00
ring	bust	12	2026-10-04 15:41:10.151689+00
nose_ring	model	1	2026-10-04 15:41:10.151689+00
nose_ring	partial_face	2	2026-10-04 15:41:10.151689+00
nose_ring	no_face	3	2026-10-04 15:41:10.151689+00
nose_ring	body_part	4	2026-10-04 15:41:10.151689+00
nose_ring	bust	12	2026-10-04 15:41:10.151689+00
waistband	model	1	2026-10-04 15:41:10.151689+00
waistband	partial_face	2	2026-10-04 15:41:10.151689+00
waistband	no_face	3	2026-10-04 15:41:10.151689+00
waistband	body_part	4	2026-10-04 15:41:10.151689+00
waistband	bust	12	2026-10-04 15:41:10.151689+00
payal	model	1	2026-10-04 15:41:10.151689+00
payal	partial_face	2	2026-10-04 15:41:10.151689+00
payal	no_face	3	2026-10-04 15:41:10.151689+00
payal	body_part	4	2026-10-04 15:41:10.151689+00
payal	bust	12	2026-10-04 15:41:10.151689+00
toe_ring	model	1	2026-10-04 15:41:10.151689+00
toe_ring	partial_face	2	2026-10-04 15:41:10.151689+00
toe_ring	no_face	3	2026-10-04 15:41:10.151689+00
toe_ring	body_part	4	2026-10-04 15:41:10.151689+00
toe_ring	bust	12	2026-10-04 15:41:10.151689+00
watch	model	1	2026-10-04 15:41:10.151689+00
watch	partial_face	2	2026-10-04 15:41:10.151689+00
watch	no_face	3	2026-10-04 15:41:10.151689+00
watch	body_part	4	2026-10-04 15:41:10.151689+00
watch	bust	12	2026-10-04 15:41:10.151689+00
kada	model	1	2026-10-04 15:41:10.151689+00
kada	partial_face	2	2026-10-04 15:41:10.151689+00
kada	no_face	3	2026-10-04 15:41:10.151689+00
kada	body_part	4	2026-10-04 15:41:10.151689+00
kada	bust	12	2026-10-04 15:41:10.151689+00
brooch	model	1	2026-10-04 15:41:10.151689+00
brooch	partial_face	2	2026-10-04 15:41:10.151689+00
brooch	no_face	3	2026-10-04 15:41:10.151689+00
brooch	body_part	4	2026-10-04 15:41:10.151689+00
brooch	bust	12	2026-10-04 15:41:10.151689+00
saree	model	0	2026-10-04 15:49:45.187299+00
saree	partial_face	1	2026-10-04 15:49:45.187299+00
saree	no_face	2	2026-10-04 15:49:45.187299+00
saree	mannequin	3	2026-10-04 15:49:45.187299+00
saree	hanger	4	2026-10-04 15:49:45.187299+00
saree	ghost	5	2026-10-04 15:49:45.187299+00
saree	flat_lay	6	2026-10-04 15:49:45.187299+00
saree	folded	7	2026-10-04 15:49:45.187299+00
saree	shelf	8	2026-10-04 15:49:45.187299+00
saree	shopwindow	9	2026-10-04 15:49:45.187299+00
\.


--
-- Data for Name: catalog_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_items (id, business_category_id, workspace, gender_target, name_en, name_te, prompt_directive, placement_directive, icon, sample_image_url, display_order, is_active, metadata, created_at, updated_at, wear_type) FROM stdin;
blouse	garment_female	garment	female	Designer Blouse	బ్లౌజ్ (Blouse)	an exquisitely embroidered designer Indian saree blouse with artistic back-neck patterns and zardozi embellishment	Fits the chest, shoulders, and back snugly with tailored neckline and decorative piping.	\N	\N	7	t	{}	2026-10-03 12:10:43.218215+00	2026-10-04 18:32:06.564024+00	top_wear
shirt	garment_male	garment	male	Button-Down Shirt	షర్టు (Shirt)	a tailored premium casual cotton button-down shirt with elegant collar design and clean cuffs	Fits cleanly over the upper torso, shoulders, and chest, displaying realistic fabric tension around collar and placket.	\N	\N	8	t	{}	2026-10-03 12:10:43.308482+00	2026-10-04 18:32:06.64904+00	top_wear
saree	garment_female	garment	female	Saree	చీర (Saree)	a luxurious traditional Indian silk saree with exquisite border embroidery and ornate pallu craftsmanship	The full-length garment drapes gracefully from the shoulder down to the ankles, showcasing authentic silk pleats and woven golden border.	\N	\N	1	t	{}	2026-10-03 12:10:42.668738+00	2026-10-04 18:32:06.052422+00	full_wear
sherwani	garment_male	garment	male	Royal Sherwani	షేర్వానీ (Sherwani)	a magnificent royal Indian sherwani with intricate handwoven Zardozi embroidery, regal mandarin collar, wedding couture wear	The long structured sherwani coat extends to the knees over churidar trousers with royal symmetrical buttons.	\N	\N	9	t	{}	2026-10-03 12:10:43.397069+00	2026-10-04 18:32:06.734746+00	full_wear
dhoti	garment_male	garment	male	Traditional Dhoti	ధోతీ (Dhoti)	a pristine traditional Indian dhoti paired elegantly with a rich ethnic silk border and crisp pleated wraps	Wraps cleanly around the waist and legs with traditional center pleats draped down to the ankles.	\N	\N	10	t	{}	2026-10-03 12:10:43.486093+00	2026-10-04 18:32:06.821382+00	bottom_wear
salwar	garment_female	garment	female	Salwar Kameez	సల్వార్ కమీజ్ (Salwar)	an elegant traditional salwar kameez suit with beautiful dupatta drape, delicate neck embroidery, and tailored trousers	The tunic drapes naturally over the torso with tailored trousers and dupatta draped symmetrically over the shoulders.	\N	\N	3	t	{}	2026-10-03 12:10:42.852676+00	2026-10-04 18:32:06.222741+00	full_wear
tracksuit	garment_male	garment	male	Athletic Tracksuit	ట్రాక్‌సూట్ (Tracksuit)	a stylish modern athletic fleece tracksuit with precise fits and clean sporty panelling	Complete two-piece coordinated set covering torso and legs in streamlined active silhouette.	\N	\N	12	t	{}	2026-10-03 12:10:43.672497+00	2026-10-04 18:32:06.993281+00	full_wear
hoodie	garment_male	garment	male	Pullover Hoodie	హుడీ (Hoodie)	a cozy premium organic cotton pullover hoodie with relaxed fit and soft luxurious textile finish	Rests relaxed over the torso and hips with drawstring hood framing the neck.	\N	\N	13	t	{}	2026-10-03 12:10:43.760807+00	2026-10-04 18:32:07.077423+00	top_wear
kurta	garment_female	garment	unisex	Ethnic Kurta	కుర్తా (Kurta)	a traditional Indian premium cotton kurta with subtle elegant embroidery and side slits	Drapes comfortably from shoulders down to knees with clean neckline and natural fabric fall.	\N	\N	14	t	{}	2026-10-03 12:10:43.85032+00	2026-10-04 18:32:07.161873+00	full_wear
suit	garment_male	garment	unisex	Two-Piece Suit	సూట్ (Suit)	a sharp handsome bespoke tailored classic two-piece suit with sleek lapels and matching trousers	Structured tailored jacket and crisp trousers with clean vertical drape.	\N	\N	15	t	{}	2026-10-03 12:10:43.938236+00	2026-10-04 18:32:07.246252+00	full_wear
western_wear	garment_female	garment	unisex	Western Ensemble	వెస్ట్రన్ వేర్ (Western Wear)	a high-fashion chic western wear full outfit, sophisticated modern dress or contemporary co-ord apparel set with impeccable tailoring	Fits and drapes seamlessly as a complete full-body outfit with modern tailored lines.	\N	\N	16	t	{}	2026-10-03 12:10:44.026328+00	2026-10-04 18:32:07.330854+00	full_wear
tshirt	garment_female	garment	unisex	Crewneck T-Shirt	టీ-షర్టు (T-Shirt)	a modern casual cotton t-shirt with great fit, ribbed crewneck, and clean soft texture	Fits upper body cleanly, resting at the hips with natural sleeve drape.	\N	\N	17	t	{}	2026-10-03 12:10:44.11505+00	2026-10-04 18:32:07.415225+00	top_wear
necklace	jewelry_female	jewelry	female	Royal Necklace	నెక్లెస్ (Necklace)	a breathtaking luxury Indian bridal necklace crafted with 22K yellow gold filigree and sparkling emerald stones	Rests symmetrically around the collarbone and upper chest with gravitational hang.	\N	\N	19	t	{}	2026-10-03 12:10:44.295599+00	2026-10-04 18:32:07.588777+00	neck_wear
earrings	jewelry_female	jewelry	female	Jhumka Earrings	చెవి కమ్మలు (Earrings)	a pair of exquisite handcrafted traditional Indian jhumka earrings with pearl drops and intricate gold filigree	Dangles gracefully from earlobes with authentic three-dimensional depth.	\N	\N	20	t	{}	2026-10-03 12:10:44.385603+00	2026-10-04 18:32:07.673417+00	ear_wear
chain	jewelry_male	jewelry	unisex	Gold Chain	గొలుసు (Chain)	a sleek, polished gold chain necklace with subtle reflective links and clean modern finish	Drapes smoothly around the neck base over skin or collar.	\N	\N	21	t	{}	2026-10-03 12:10:44.476835+00	2026-10-04 18:32:07.757982+00	neck_wear
pendant	jewelry_female	jewelry	unisex	Solitaire Pendant	లాకెట్ (Pendant)	an elegant designer pendant set on a delicate gold chain with a brilliant centerpiece solitaire gemstone	Centrally poised over the sternum with light-reflecting facets.	\N	\N	23	t	{}	2026-10-03 12:10:44.653121+00	2026-10-04 18:32:07.932968+00	neck_wear
bangles	jewelry_female	jewelry	female	Gold Bangles	గాజులు (Bangles)	a set of traditional royal Indian gold bangles with delicate filigree engraving and ruby accents	Worn snugly on wrist and lower forearm with metallic luster.	\N	\N	24	t	{}	2026-10-03 12:10:44.742936+00	2026-10-04 18:32:08.017315+00	wrist_wear
matha_patti	jewelry_female	jewelry	female	Matha Patti	మథాపట్టీ (Matha Patti)	an elaborate royal bridal matha patti headpiece with multiple pearl strands framing the forehead	Framing both sides of the forehead hairline down to the ears.	\N	\N	31	t	{}	2026-10-03 12:10:45.367428+00	2026-10-04 18:32:08.614368+00	forehead_wear
lehenga	garment_female	garment	female	Lehenga	లెహంగా (Lehenga)	a stunning traditional bridal lehenga choli with heavy golden embroidery, flared skirt volume, and flowing dupatta	The flared lehenga skirt rests comfortably at the waist flowing into full majestic volume down to the feet.	\N	\N	2	t	{}	2026-10-03 12:10:42.762561+00	2026-10-04 18:32:06.138155+00	full_wear
gown	garment_female	garment	female	Evening Gown	గౌను (Gown)	a breathtaking, flowing modern evening gown with elegant fabric draping, structured bodice, and premium couture feel	The gown fits smoothly through the bodice and cascades fluidly to a floor-sweeping hem.	\N	\N	4	t	{}	2026-10-03 12:10:42.941151+00	2026-10-04 18:32:06.306895+00	full_wear
skirt	garment_female	garment	female	Flared Skirt	స్కర్ట్ (Skirt)	a fashionable stylish casual flared skirt with subtle pleat details and beautiful textile print	Sits cleanly at the waistline, draping naturally down to the calves with fluid motion.	\N	\N	5	t	{}	2026-10-03 12:10:43.030204+00	2026-10-04 18:32:06.39174+00	bottom_wear
crop_top	garment_female	garment	female	Crop Top	క్రాప్ టాప్ (Crop Top)	a trendy chic crop top with elegant neckline, modern silhouette and fine stitching	Fits the upper torso cleanly, resting just above the waistline with crisp seams.	\N	\N	6	t	{}	2026-10-03 12:10:43.128363+00	2026-10-04 18:32:06.477387+00	top_wear
blazer	garment_male	garment	male	Slim Blazer	బ్లేజర్ (Blazer)	a premium tailored modern slim-fit blazer with elegant fabric sheen and crisp notched lapels	Drapes with tailored shoulder padding and structured chest silhouette over trousers.	\N	\N	11	t	{}	2026-10-03 12:10:43.579514+00	2026-10-04 18:32:06.909109+00	top_wear
jeans	garment_female	garment	unisex	Denim Jeans	జీన్స్ (Jeans)	a classic stylish denim jeans trouser with premium cotton texture, authentic washed indigo tone, and brass rivets	Fits hips and legs naturally down to ankles with authentic five-pocket detailing.	\N	\N	18	t	{}	2026-10-03 12:10:44.204461+00	2026-10-04 18:32:07.50169+00	bottom_wear
choker	jewelry_female	jewelry	female	Polki Choker	చోకర్ (Choker)	a majestic traditional royal choker necklace encrusted with uncut Polki diamonds and Kundan work	Fits closely around the middle neck with multi-tiered gem rows.	\N	\N	22	t	{}	2026-10-03 12:10:44.565409+00	2026-10-04 18:32:07.844494+00	neck_wear
maang_tikka	jewelry_female	jewelry	female	Maang Tikka	పాపిడి బిళ్ళ (Maang Tikka)	a stunning traditional Indian maang tikka resting along the hair parting with pearls and Kundan work	Suspended in the center of the forehead along the hairline.	\N	\N	30	t	{}	2026-10-03 12:10:45.278265+00	2026-10-04 18:32:08.525406+00	forehead_wear
toe_ring	jewelry_female	jewelry	female	Toe Ring	మెట్టెలు (Toe Ring)	a pair of exquisite traditional Indian silver toe rings (bichhiya) with fine carved floral motifs	Fitted cleanly on the second toe in an intimate foot macro pose.	\N	\N	29	t	{}	2026-10-03 12:10:45.188206+00	2026-10-04 18:32:08.439781+00	leg_wear
watch	jewelry_male	jewelry	unisex	Chronograph Watch	చేతి గడియారం (Watch)	a luxury chronograph wristwatch with polished stainless steel bezel, sapphire glass, and textured leather strap	Fitted around the wrist above the wrist bone with metallic shine.	\N	\N	32	t	{}	2026-10-03 12:10:45.458849+00	2026-10-04 18:32:08.698615+00	wrist_wear
kada	jewelry_male	jewelry	male	Royal Kada	కడా (Kada)	a bold traditional solid silver or gold Kada bracelet with etched patterns and masculine polish	Worn snugly on the forearm or wrist with substantial metallic thickness.	\N	\N	33	t	{}	2026-10-03 12:10:45.548109+00	2026-10-04 18:32:09.036863+00	wrist_wear
brooch	jewelry_male	jewelry	unisex	Gemstone Brooch	బ్రూచ్ (Brooch)	an ornate royal jewel brooch with sparkling gemstones and antique gold craftsmanship	Pinned cleanly to the left chest lapel or sherwani chest.	\N	\N	34	t	{}	2026-10-03 12:10:45.636535+00	2026-10-04 18:32:09.372832+00	other_wear
ring	jewelry_female	jewelry	unisex	Solitaire Ring	ఉంగరం (Ring)	an exquisite solitaire gemstone ring with a brilliant-cut diamond mounted on a polished platinum band	Fitted securely on the finger with pristine contact shadows and prong clarity.	\N	\N	25	t	{}	2026-10-03 12:10:44.836382+00	2026-10-04 18:32:08.101337+00	wrist_wear
nose_ring	jewelry_female	jewelry	female	Bridal Nath	ముక్కుపుడక (Nose Ring)	a delicate traditional Indian nose ring (nath) with fine gold wirework and dangling pearl accents	Positioned delicately on the side of the nostril aligned with facial profile.	\N	\N	26	t	{}	2026-10-03 12:10:44.92443+00	2026-10-04 18:32:08.185572+00	nose_wear
waistband	jewelry_female	jewelry	female	Kamarbandh	వడ్డాణం (Waistband)	a majestic royal Indian kamarbandh (waist chain) with ornate gold filigree and dangling pearl drops	Wrapped gracefully around waist/hips over apparel.	\N	\N	27	t	{}	2026-10-03 12:10:45.012155+00	2026-10-04 18:32:08.270112+00	hip_wear
payal	jewelry_female	jewelry	female	Silver Payal	పట్టీలు (Payal)	a pair of traditional Indian silver anklets (payal) with delicate ghungroo bells and filigree links	Draped gracefully around the ankle bone resting on the foot.	\N	\N	28	t	{}	2026-10-03 12:10:45.100332+00	2026-10-04 18:32:08.35495+00	leg_wear
\.


--
-- Data for Name: faces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.faces (id, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, preview_image_url, storage_path, thumbnail_url, display_order, is_active, metadata, created_at, updated_at, camera_framing, face_visibility_rule, color_hex) FROM stdin;
indian_m3	all	male	\N	\N	Kabir	కబీర్	a ruggedly handsome Indian male model portrait with defined masculine features, groomed beard, charismatic gaze, soft shadow modeling	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/kabir.jpg	model-faces/kabir.jpg	\N	7	t	{"gender": "male", "ethnicity": "indian"}	2026-10-03 12:10:46.521715+00	2026-10-04 04:53:06.011555+00	\N	\N	\N
african_m	all	male	\N	african	Kwame	క్వామే	a professional, ultra-high-resolution close-up studio headshot of a handsome African male model, looking directly at camera with a warm confident expression, smooth dark skin, sharp features, even studio lighting, solid neutral background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/kwame.jpg	model-faces/kwame.jpg	\N	19	t	{"gender": "male", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:04.859214+00	2026-10-04 18:32:10.998765+00	\N	\N	\N
african_m4	all	male	\N	african	Tariq_af	తారిఖ్	a studio commercial headshot of a Black male model with confident expression, clean shave, sharp facial symmetry, professional key light	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/tariq_af.jpg	model-faces/tariq_af.jpg	\N	22	t	{"gender": "male", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:05.110595+00	2026-10-04 18:32:11.257549+00	\N	\N	\N
african_m5	all	male	\N	african	Kofi	కోఫీ	a close-up portrait of an African male fashion model, charming smile, sharp cheekbones, studio illumination, clean neutral background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/kofi.jpg	model-faces/kofi.jpg	\N	23	t	{"gender": "male", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:05.213093+00	2026-10-04 18:32:11.342376+00	\N	\N	\N
african_m6	all	male	\N	african	Oumar	ఒమర్	a studio headshot of a strong Black male model with focused gaze, clean facial features, soft directional key lighting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/oumar.jpg	model-faces/oumar.jpg	\N	24	t	{"gender": "male", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:05.295618+00	2026-10-04 18:32:11.427439+00	\N	\N	\N
asian_f2	all	female	\N	asian	Mei-Ling	మేయ్-లింగ్	an editorial studio portrait of a Chinese female fashion model with razor-sharp cheekbones, intense gaze, flawless Porcelain complexion, minimal backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/meiling.jpg	model-faces/meiling.jpg	\N	26	t	{"gender": "female", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:05.459529+00	2026-10-04 18:32:11.597447+00	\N	\N	\N
korean_m	all	male	\N	asian	Min-Ho	మిన్-హో	a professional, ultra-high-resolution close-up studio headshot of a handsome Korean male model, looking directly at camera with a clean confident expression, sharp features, even studio lighting, solid neutral background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/minho.jpg	model-faces/minho.jpg	\N	31	t	{"gender": "male", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:05.872391+00	2026-10-04 18:32:12.024736+00	\N	\N	\N
nordic_f	all	female	\N	western	Freja	ఫ్రెజా	a professional ultra-high-resolution close-up studio headshot of a fair European female model with serene expression, clear blue eyes, delicate features, clean balanced studio light, neutral backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/freja.jpg	model-faces/freja.jpg	\N	38	t	{"gender": "female", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:06.45453+00	2026-10-04 18:32:12.621901+00	\N	\N	\N
western_f4	all	female	\N	western	Charlotte	షార్లెట్	a studio commercial portrait of an attractive Western female model with warm smile, hazel eyes, smooth skin tone, clean backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/charlotte.jpg	model-faces/charlotte.jpg	\N	40	t	{"gender": "female", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:06.629028+00	2026-10-04 18:32:12.794394+00	\N	\N	\N
western_f6	all	female	\N	western	Hannah	హన్నా	a commercial face shot of a young Western female model with charismatic smile, bright eyes, professional studio flash	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/hannah.jpg	model-faces/hannah.jpg	\N	42	t	{"gender": "female", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:06.807494+00	2026-10-04 18:32:12.964129+00	\N	\N	\N
nordic_m	all	male	\N	western	Lucas	లూకాస్	a professional ultra-high-resolution close-up studio headshot of a fair European male model, direct gaze into camera, clean natural look, soft studio key light, neutral solid background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/lucas.jpg	model-faces/lucas.jpg	\N	44	t	{"gender": "male", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:06.98652+00	2026-10-04 18:32:13.133664+00	\N	\N	\N
mideast_m4	all	male	\N	mideast	Amir	అమీర్	a commercial headshot of a Middle Eastern male model with confident pose, groomed facial hair, professional key illumination	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/amir.jpg	model-faces/amir.jpg	\N	58	t	{"gender": "male", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:08.142383+00	2026-10-04 18:32:14.330375+00	\N	\N	\N
latina_f4	all	female	\N	latina	Valentina	వాలెంటినా	a commercial face shot of a young Latina female model with charismatic smile, golden skin tone, professional softbox illumination	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/valentina.jpg	model-faces/valentina.jpg	\N	64	t	{"gender": "female", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:08.634041+00	2026-10-04 18:32:14.842377+00	\N	\N	\N
indian_f4	all	female	\N	indian	Kavya	కావ్య	a professional ultra-high-resolution close-up studio headshot of a charming North Indian female model with gentle smile, expressive eyes, warm skin tone, clean studio backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/kavya.jpg	model-faces/kavya.jpg	\N	4	t	{"gender": "female", "category": "indian", "ethnicity": "indian"}	2026-10-03 12:10:46.000886+00	2026-10-04 18:32:09.721534+00	\N	\N	\N
indian_f5	all	female	\N	indian	Diya	దియా	a studio portrait of a glamorous Indian female fashion model with radiant smile, glossy hair, flawless complexion, professional rim lighting, neutral studio background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/diya.jpg	model-faces/diya.jpg	\N	5	t	{"gender": "female", "category": "indian", "ethnicity": "indian"}	2026-10-04 02:56:03.698573+00	2026-10-04 18:32:09.806075+00	\N	\N	\N
indian_m	all	male	\N	indian	Rohan	రోహన్	a professional, ultra-high-resolution close-up studio headshot of a handsome Indian male model, looking directly at the camera with a confident, friendly expression, neatly groomed stubble, sharp features, even studio lighting, solid neutral background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/rohan.jpg	model-faces/rohan.jpg	\N	7	t	{"gender": "male", "category": "indian", "ethnicity": "indian"}	2026-10-03 12:10:46.093471+00	2026-10-04 18:32:09.974757+00	\N	\N	\N
indian_m5	all	male	\N	indian	Kabir	కబీర్	a close-up portrait of an attractive South Indian male model, groomed facial hair, warm expression, direct gaze, neutral studio setting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/kabir.jpg	model-faces/kabir.jpg	\N	11	t	{"gender": "male", "category": "indian", "ethnicity": "indian"}	2026-10-04 02:56:04.195539+00	2026-10-04 18:32:10.318805+00	\N	\N	\N
indian_m6	all	male	\N	indian	Suresh	సురేష్	a commercial portrait headshot of a South Indian male model with charismatic smile, sharp clear features, studio portrait illumination	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/suresh.jpg	model-faces/suresh.jpg	\N	12	t	{"gender": "male", "category": "indian", "ethnicity": "indian"}	2026-10-04 02:56:04.280632+00	2026-10-04 18:32:10.403383+00	\N	\N	\N
african_f	all	female	\N	african	Amara	అమరా	a professional, ultra-high-resolution close-up studio headshot of a stunning African female model with smooth clear dark skin, radiant warm smile, sharp high cheekbones, looking directly at camera, soft studio lighting, clean background, face unobscured	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/amara.jpg	model-faces/amara.jpg	\N	13	t	{"gender": "female", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:04.362012+00	2026-10-04 18:32:10.487438+00	\N	\N	\N
african_f2	all	female	\N	african	Zuri	జూరి	an editorial fashion studio portrait of a regal African female model with glowing melanin skin, intense expressive eyes, elegant posture, soft key lighting, minimal grey backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/zuri.jpg	model-faces/zuri.jpg	\N	14	t	{"gender": "female", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:04.444639+00	2026-10-04 18:32:10.573729+00	\N	\N	\N
african_f3	all	female	\N	african	Nia	నియా	a close-up studio portrait of a beautiful West African female model with natural smile, flawless dark skin tone, clear gaze, balanced key light	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/nia.jpg	model-faces/nia.jpg	\N	15	t	{"gender": "female", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:04.526704+00	2026-10-04 18:32:10.660709+00	\N	\N	\N
african_f4	all	female	\N	african	Aaliyah	ఆలియా	a high-resolution studio face portrait of a glamorous African female model, bright confident eyes, smooth skin tone, professional studio flash	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/aaliyah.jpg	model-faces/aaliyah.jpg	\N	16	t	{"gender": "female", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:04.611134+00	2026-10-04 18:32:10.745098+00	\N	\N	\N
african_f5	all	female	\N	african	Fatoumata	ఫాతుమాతా	a studio headshot of an African fashion model with vibrant smile, delicate features, clean neutral backdrop, soft studio fill	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/fatoumata.jpg	model-faces/fatoumata.jpg	\N	17	t	{"gender": "female", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:04.694256+00	2026-10-04 18:32:10.829828+00	\N	\N	\N
african_m2	all	male	\N	african	Malik	మాలిక్	an editorial fashion studio headshot of a handsome African male model with sculpted jawline, intense eyes, subtle stubble, clean studio rim light	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/malik.jpg	model-faces/malik.jpg	\N	20	t	{"gender": "male", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:04.942209+00	2026-10-04 18:32:11.085182+00	\N	\N	\N
asian_f3	all	female	\N	asian	Yoko	యోకో	a studio face portrait of a Japanese female model with gentle serene smile, smooth skin, clear dark eyes, soft studio illumination	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/yoko.jpg	model-faces/yoko.jpg	\N	27	t	{"gender": "female", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:05.541601+00	2026-10-04 18:32:11.6831+00	\N	\N	\N
asian_f4	all	female	\N	asian	Linh	లిన్	a close-up studio headshot of a Vietnamese female model with radiant complexion, confident open smile, softbox lighting, clean grey setting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/linh.jpg	model-faces/linh.jpg	\N	28	t	{"gender": "female", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:05.623264+00	2026-10-04 18:32:11.770069+00	\N	\N	\N
asian_f5	all	female	\N	asian	Ji-Eun	జి-ఇయున్	a commercial face shot of a young East Asian female model with luminous skin, subtle makeup, direct camera contact, even studio light	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/jieun.jpg	model-faces/jieun.jpg	\N	29	t	{"gender": "female", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:05.705274+00	2026-10-04 18:32:11.854169+00	\N	\N	\N
mideast_m6	all	male	\N	mideast	Youssef	యూసఫ్	a studio portrait of a young Arab male model with clear skin, natural posture, looking directly into camera lens	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/youssef.jpg	model-faces/youssef.jpg	\N	60	t	{"gender": "male", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:08.30648+00	2026-10-04 18:32:14.500676+00	\N	\N	\N
latina_f2	all	female	\N	latina	Camila	కామిలా	an editorial fashion portrait of a stunning Latina female model with glowing bronzed skin, bright dark eyes, radiant smile, studio flash	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/camila.jpg	model-faces/camila.jpg	\N	62	t	{"gender": "female", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:08.470625+00	2026-10-04 18:32:14.67046+00	\N	\N	\N
indian_m2	all	male	\N	indian	Arjun	అర్జున్	a professional, ultra-high-resolution studio headshot of a charming South Asian male model, clear eye contact, gentle confident expression, sharp jawline, clean professional lighting, solid grey studio background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/arjun.jpg	model-faces/arjun.jpg	\N	8	t	{"gender": "male", "category": "indian", "ethnicity": "indian"}	2026-10-03 12:10:46.433553+00	2026-10-04 18:32:10.061381+00	\N	\N	\N
editorial_m	all	male	\N	indian	Vikram	విక్రమ్	an ultra-high-resolution close-up studio headshot of a sharp male fashion model, sculpted jawline, intense focused gaze, subtle beard, crisp lighting contrast, high-end commercial model portfolio photo	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/vikram.jpg	model-faces/vikram.jpg	\N	9	t	{"gender": "male", "category": "indian", "ethnicity": "indian"}	2026-10-04 02:56:04.029048+00	2026-10-04 18:32:10.147401+00	\N	\N	\N
indian_m4	all	male	\N	indian	Aaditya	ఆదిత్య	a studio headshot of a handsome young Indian male model with well-defined jawline, confident warm smile, studio softbox lighting, clean grey backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/aaditya.jpg	model-faces/aaditya.jpg	\N	10	t	{"gender": "male", "category": "indian", "ethnicity": "indian"}	2026-10-04 02:56:04.112455+00	2026-10-04 18:32:10.232056+00	\N	\N	\N
asian_m3	all	male	\N	asian	Wei	వేయ్	a studio face portrait of a handsome East Asian male model with clear skin, polite confident smile, balanced key studio lighting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/wei.jpg	model-faces/wei.jpg	\N	33	t	{"gender": "male", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:06.036022+00	2026-10-04 18:32:12.197469+00	\N	\N	\N
asian_m4	all	male	\N	asian	Sang-Woo	సాంగ్-వూ	a close-up portrait of a Korean male fashion model with sleek hairstyle, sharp eye contact, minimalist grey studio background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/sangwoo.jpg	model-faces/sangwoo.jpg	\N	34	t	{"gender": "male", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:06.123562+00	2026-10-04 18:32:12.282844+00	\N	\N	\N
asian_m5	all	male	\N	asian	Hiroshi	హిరోషి	a commercial face headshot of an East Asian male model with warm expression, sharp jawline, professional flash illumination	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/hiroshi.jpg	model-faces/hiroshi.jpg	\N	35	t	{"gender": "male", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:06.205235+00	2026-10-04 18:32:12.367719+00	\N	\N	\N
asian_m6	all	male	\N	asian	Bao	బావో	a close-up studio face photo of a young East Asian male model with clean flawless features, looking directly into lens	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/bao.jpg	model-faces/bao.jpg	\N	36	t	{"gender": "male", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:06.291192+00	2026-10-04 18:32:12.451843+00	\N	\N	\N
usa_f	all	female	\N	western	Sophia	సోఫియా	a professional, ultra-high-resolution close-up studio headshot of a Caucasian female model with natural friendly expression, bright sharp eyes, soft even commercial lighting, solid light grey background, face fully visible with clear features	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/sophia.jpg	model-faces/sophia.jpg	\N	37	t	{"gender": "female", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:06.372828+00	2026-10-04 18:32:12.536333+00	\N	\N	\N
western_m3	all	male	\N	western	Alexander	అలెక్సాండర్	an editorial fashion studio headshot of a Caucasian male model with strong jawline, blue eyes, groomed hair, clean grey backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/alexander.jpg	model-faces/alexander.jpg	\N	45	t	{"gender": "male", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:07.068787+00	2026-10-04 18:32:13.219927+00	\N	\N	\N
western_m5	all	male	\N	western	Oliver	ఓలివర్	a studio commercial headshot of a European male model with light stubble, focused direct gaze, soft key light	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/oliver.jpg	model-faces/oliver.jpg	\N	47	t	{"gender": "male", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:07.233997+00	2026-10-04 18:32:13.39018+00	\N	\N	\N
western_m6	all	male	\N	western	Daniel	డానియెల్	a close-up studio portrait of a young Caucasian male model with friendly approachable gaze, clear skin, neutral background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/daniel.jpg	model-faces/daniel.jpg	\N	48	t	{"gender": "male", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:07.315561+00	2026-10-04 18:32:13.474931+00	\N	\N	\N
mideast_f	all	female	\N	mideast	Layla	లైలా	a professional, ultra-high-resolution close-up studio headshot of a Middle Eastern female model with big dark expressive eyes, warm gentle expression, clear studio lighting, solid background, unobscured face	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/layla.jpg	model-faces/layla.jpg	\N	49	t	{"gender": "female", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:07.397183+00	2026-10-04 18:32:13.559666+00	\N	\N	\N
mideast_f2	all	female	\N	mideast	Noor	నూర్	an editorial studio portrait of a regal Middle Eastern female model with captivating dark eyes, olive complexion, elegant facial symmetry	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/noor.jpg	model-faces/noor.jpg	\N	50	t	{"gender": "female", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:07.481811+00	2026-10-04 18:32:13.645709+00	\N	\N	\N
mideast_f3	all	female	\N	mideast	Yasmin	యాస్మిన్	a studio face portrait of a beautiful Arab female model with soft warm smile, expressive dark eyes, flawless smooth skin, studio key light	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/yasmin.jpg	model-faces/yasmin.jpg	\N	51	t	{"gender": "female", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:07.563638+00	2026-10-04 18:32:13.731113+00	\N	\N	\N
mideast_f4	all	female	\N	mideast	Farah	ఫరా	a close-up studio headshot of a glamorous Middle Eastern female model with luminous complexion, soft rim light, clean grey setting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/farah.jpg	model-faces/farah.jpg	\N	52	t	{"gender": "female", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:07.644933+00	2026-10-04 18:32:13.815375+00	\N	\N	\N
mideast_f5	all	female	\N	mideast	Mariam	మరియం	a commercial face shot of a young Middle Eastern female model with gentle smile, clear eye contact, studio flash illumination	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/mariam.jpg	model-faces/mariam.jpg	\N	53	t	{"gender": "female", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:07.729778+00	2026-10-04 18:32:13.902856+00	\N	\N	\N
mideast_f6	all	female	\N	mideast	Zeina	జైనా	a close-up portrait headshot of an Arab model with striking facial features, elegant posture, balanced studio flash	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/zeina.jpg	model-faces/zeina.jpg	\N	54	t	{"gender": "female", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:07.813286+00	2026-10-04 18:32:13.987253+00	\N	\N	\N
african_f6	all	female	\N	african	Binta	బింటా	a close-up commercial studio face shot of an East African female model with warm smile, radiant skin, looking straight into lens	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/binta.jpg	model-faces/binta.jpg	\N	18	t	{"gender": "female", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:04.775797+00	2026-10-04 18:32:10.914548+00	\N	\N	\N
asian_f6	all	female	\N	asian	Chen	చెన్	a high-fashion close-up headshot of an East Asian model with delicate features, elegant pose, clean studio key illumination	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/chen.jpg	model-faces/chen.jpg	\N	30	t	{"gender": "female", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:05.786996+00	2026-10-04 18:32:11.940385+00	\N	\N	\N
asian_m2	all	male	\N	asian	Kenji	కెంజి	an editorial fashion studio headshot of a Japanese male model with sharp jawline, stylish hairstyle, focused gaze, subtle rim lighting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/kenji.jpg	model-faces/kenji.jpg	\N	32	t	{"gender": "male", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:05.954231+00	2026-10-04 18:32:12.10989+00	\N	\N	\N
western_f5	all	female	\N	western	Chloe	క్లోయి	a close-up fashion portrait of a Caucasian female model with sculpted jawline, intense clear gaze, soft directional light	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/chloe.jpg	model-faces/chloe.jpg	\N	41	t	{"gender": "female", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:06.710953+00	2026-10-04 18:32:12.878921+00	\N	\N	\N
western_m4	all	male	\N	western	Liam	లియామ్	a close-up portrait of an attractive Western male model with confident smile, sharp facial features, studio flash lighting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/liam.jpg	model-faces/liam.jpg	\N	46	t	{"gender": "male", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:07.152087+00	2026-10-04 18:32:13.304556+00	\N	\N	\N
mideast_m	all	male	\N	mideast	Tariq_me	తారిఖ్	a professional, ultra-high-resolution close-up studio headshot of a Middle Eastern male model, looking directly at camera with a confident expression, neat beard, sharp eyes, even lighting, solid background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/tariq_me.jpg	model-faces/tariq_me.jpg	\N	55	t	{"gender": "male", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:07.89478+00	2026-10-04 18:32:14.071693+00	\N	\N	\N
mideast_m2	all	male	\N	mideast	Omar	ఒమర్	an editorial studio headshot of a handsome Middle Eastern male model with neatly groomed beard, intense gaze, sculpted jawline, grey backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/omar.jpg	model-faces/omar.jpg	\N	56	t	{"gender": "male", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:07.977887+00	2026-10-04 18:32:14.157704+00	\N	\N	\N
mideast_m5	all	male	\N	mideast	Hassan	హసన్	a close-up studio headshot of an attractive Middle Eastern male model with charming smile, sharp jawline, directional softbox flash	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/hassan.jpg	model-faces/hassan.jpg	\N	59	t	{"gender": "male", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:08.224116+00	2026-10-04 18:32:14.415037+00	\N	\N	\N
latina_f3	all	female	\N	latina	Sofia	సోఫియా	a close-up studio headshot of a Hispanic female model with razor-sharp cheekbones, intense gaze, smooth complexion, minimal backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/sofia.jpg	model-faces/sofia.jpg	\N	63	t	{"gender": "female", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:08.55255+00	2026-10-04 18:32:14.756875+00	\N	\N	\N
latina_f5	all	female	\N	latina	Elena	ఎలెనా	a studio portrait face photo of a Latin American female model with warm friendly expression, clear dark gaze, soft fill light	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/elena.jpg	model-faces/elena.jpg	\N	65	t	{"gender": "female", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:08.715424+00	2026-10-04 18:32:14.927176+00	\N	\N	\N
latina_f6	all	female	\N	latina	Lucia	లూసియా	a close-up headshot of a Latina fashion model with delicate facial features, elegant pose, clean studio key light	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/lucia.jpg	model-faces/lucia.jpg	\N	66	t	{"gender": "female", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:08.796819+00	2026-10-04 18:32:15.01166+00	\N	\N	\N
latino_m	all	male	\N	latina	Mateo	మాటియో	a professional, ultra-high-resolution close-up studio headshot of a Latino male model with warm tan complexion, friendly open smile, sharp clear features, studio lighting, plain background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/mateo.jpg	model-faces/mateo.jpg	\N	67	t	{"gender": "male", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:08.879509+00	2026-10-04 18:32:15.096306+00	\N	\N	\N
latina_m2	all	male	\N	latina	Santiago	సాంటియాగో	an editorial fashion studio headshot of a Latino male model with sculpted jawline, dark hair, confident direct gaze, grey setting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/santiago.jpg	model-faces/santiago.jpg	\N	68	t	{"gender": "male", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:08.961501+00	2026-10-04 18:32:15.181975+00	\N	\N	\N
latina_m3	all	male	\N	latina	Diego	డియాగో	a close-up face portrait of an attractive Hispanic male model with warm open smile, tan skin tone, studio key illumination	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/diego.jpg	model-faces/diego.jpg	\N	69	t	{"gender": "male", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:09.043482+00	2026-10-04 18:32:15.26883+00	\N	\N	\N
latina_m4	all	male	\N	latina	Carlos	కార్లోస్	a studio commercial headshot of a Latino male model with light stubble, focused eyes, professional softbox flash	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/carlos.jpg	model-faces/carlos.jpg	\N	70	t	{"gender": "male", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:09.125321+00	2026-10-04 18:32:15.353376+00	\N	\N	\N
latina_m5	all	male	\N	latina	Alejandro	అలెహాండ్రో	a close-up studio portrait of a young Latino male model with well-defined jawline, charming smile, neutral grey backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/alejandro.jpg	model-faces/alejandro.jpg	\N	71	t	{"gender": "male", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:09.209709+00	2026-10-04 18:32:15.437993+00	\N	\N	\N
latina_m6	all	male	\N	latina	Gabriel	గాబ్రియెల్	a studio face shot of a Hispanic male model with natural gaze, smooth skin tone, clear directional studio flash	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/gabriel.jpg	model-faces/gabriel.jpg	\N	72	t	{"gender": "male", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:09.303374+00	2026-10-04 18:32:15.522809+00	\N	\N	\N
african_m3	all	male	\N	african	Zain	జైన్	a close-up portrait shot of an attractive Black male model with friendly smile, warm dark skin tone, direct gaze, solid grey studio setting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/zain.jpg	model-faces/zain.jpg	\N	21	t	{"gender": "male", "category": "african", "ethnicity": "african"}	2026-10-04 02:56:05.026675+00	2026-10-04 18:32:11.171237+00	\N	\N	\N
korean_f	all	female	\N	asian	Soo-Jin	సూ-జిన్	a professional, ultra-high-resolution close-up studio headshot of a Korean female model with flawless glass skin, looking directly at camera with a polite soft smile, sharp clean features, even studio lighting, solid light neutral background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/soojin.jpg	model-faces/soojin.jpg	\N	25	t	{"gender": "female", "category": "asian", "ethnicity": "asian"}	2026-10-04 02:56:05.377707+00	2026-10-04 18:32:11.512498+00	\N	\N	\N
western_f3	all	female	\N	western	Emma	ఎమ్మా	a high-fashion editorial studio headshot of a European female model with radiant blonde hair, bright blue eyes, soft studio illumination	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/emma.jpg	model-faces/emma.jpg	\N	39	t	{"gender": "female", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:06.536806+00	2026-10-04 18:32:12.709394+00	\N	\N	\N
indian_f	all	female	\N	indian	Ananya	అనన్య	a professional, ultra-high-resolution close-up studio headshot of a beautiful Indian female model with a soft, warm commercial smile, bright expressive dark eyes, glowing smooth skin, looking directly at the camera, solid neutral light studio background, face fully visible with no hair or accessories covering facial features	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/ananya.jpg	model-faces/ananya.jpg	\N	1	t	{"gender": "female", "category": "indian", "ethnicity": "indian"}	2026-10-03 12:10:45.727622+00	2026-10-04 18:32:09.458207+00	\N	\N	\N
indian_f2	all	female	\N	indian	Priya	ప్రియా	a professional, ultra-high-resolution studio portrait headshot of an elegant South Indian female model with regal features, soft natural expression, radiant complexion, looking directly at camera with clear eye contact, neutral clean background, face unobscured	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/priya.jpg	model-faces/priya.jpg	\N	2	t	{"gender": "female", "category": "indian", "ethnicity": "indian"}	2026-10-03 12:10:45.825242+00	2026-10-04 18:32:09.544686+00	\N	\N	\N
editorial_f	all	female	\N	indian	Meera	మీరా	an ultra-high-resolution close-up high-fashion editorial studio portrait of a striking Indian female model with intense gaze, razor-sharp jawline, glowing flawless skin, elegant facial symmetry, soft studio rim light, minimalist grey backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/meera.jpg	model-faces/meera.jpg	\N	3	t	{"gender": "female", "category": "indian", "ethnicity": "indian"}	2026-10-03 12:10:45.913066+00	2026-10-04 18:32:09.629069+00	\N	\N	\N
indian_f6	all	female	\N	indian	Pooja	పూజ	a close-up headshot of a confident modern Indian female model, soft natural studio lighting, direct eye contact, clean solid backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/pooja.jpg	model-faces/pooja.jpg	\N	6	t	{"gender": "female", "category": "indian", "ethnicity": "indian"}	2026-10-04 02:56:03.780575+00	2026-10-04 18:32:09.890431+00	\N	\N	\N
usa_m	all	male	\N	western	Ethan	ఈథన్	a professional, ultra-high-resolution close-up studio headshot of a Caucasian male model, looking directly at camera with a friendly approachable expression, sharp eyes, even professional lighting, solid neutral background	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/ethan.jpg	model-faces/ethan.jpg	\N	43	t	{"gender": "male", "category": "western", "ethnicity": "western"}	2026-10-04 02:56:06.904619+00	2026-10-04 18:32:13.048723+00	\N	\N	\N
mideast_m3	all	male	\N	mideast	Zayd	జైద్	a close-up face portrait of an Arab male fashion model with polite smile, warm skin tone, sharp eye contact, studio setting	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/zayd.jpg	model-faces/zayd.jpg	\N	57	t	{"gender": "male", "category": "mideast", "ethnicity": "mideast"}	2026-10-04 02:56:08.060553+00	2026-10-04 18:32:14.246072+00	\N	\N	\N
latina_f	all	female	\N	latina	Isabella	ఇసబెల్లా	a professional, ultra-high-resolution close-up studio headshot of a Latina female model with warm golden skin tone, confident friendly expression, clear dark eyes, soft studio illumination, clean backdrop	https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/isabella.jpg	model-faces/isabella.jpg	\N	61	t	{"gender": "female", "category": "latina", "ethnicity": "latina"}	2026-10-04 02:56:08.388454+00	2026-10-04 18:32:14.585403+00	\N	\N	\N
\.


--
-- Data for Name: genders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.genders (id, code, name_en, name_te, description, icon, display_order, is_active, metadata, created_at, updated_at) FROM stdin;
female	female	Female	మహిళలు	Women fashion models, garments, jewelry, and feminine presentation	lucide:user	1	t	{}	2026-10-04 04:53:06.011555+00	2026-10-04 18:32:03.80946+00
male	male	Male	పురుషులు	Men fashion models, garments, jewelry, and masculine presentation	lucide:user-check	2	t	{}	2026-10-04 04:53:06.011555+00	2026-10-04 18:32:03.896417+00
unisex	unisex	Unisex	యూనిసెక్స్	Gender-neutral fashion garments, jewelry, and versatile items	lucide:users	3	t	{}	2026-10-04 04:53:06.011555+00	2026-10-04 18:32:03.984361+00
all	all	All Collections	అన్ని కలెక్షన్లు	Universal vertical and presentation modes for all audiences	lucide:asterisk	4	t	{}	2026-10-04 04:53:06.011555+00	2026-10-04 18:32:04.071651+00
\.


--
-- Data for Name: otps; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.otps (id, identifier, code_hash, purpose, expires_at, is_used, attempts, created_at) FROM stdin;
6d38ec32-cb68-4427-b1b6-72fd692db7af	+919876543210	$2b$10$1wIlumN8HMYwx.IpX9AaNOcnBlzWU7IJJ/1/mGD1.ETzxe/F9oSE2	login	2026-09-11 06:09:52.775+00	f	0	2026-09-11 05:59:52.866562+00
62c880ca-6a8b-4a51-8d2e-1d67e8f547db	+919876543210	$2b$10$D7mJpMVDwBsGY.TsNM4A0uFCguhs3XDal6JyGe9JI3SThQ3jVhh0S	login	2026-09-11 06:11:41.552+00	t	0	2026-09-11 06:01:41.640084+00
66903681-9def-4a49-b1f3-49d0c724d4a6	+919059108434	$2b$10$Pu/LN7TntQYwTGQtYCVEs.DG0e0k40dGBV70i7fIPDrXQnnxcfkV.	login	2026-09-11 06:27:06.519+00	f	1	2026-09-11 06:17:06.596852+00
1d38aef9-acda-4ab8-b938-d92e3f771f85	+919059108434	$2b$10$5rG101AA5kSkxJ9Ac9AuieQNE07DVU.RB5iTTuQqRlyVxr5PeUWvO	login	2026-09-11 06:28:23.623+00	t	0	2026-09-11 06:18:23.695855+00
7596671f-22fa-49e8-95ef-a65639acbd98	+919876543210	$2b$10$1n0k0vVbouo1agd9VWuOcOMMBApLsjaezwBxU6uphFkjut.6KoBWy	login	2026-09-11 06:40:34.387+00	t	0	2026-09-11 06:30:34.553864+00
347658c6-21d8-4398-a043-6e491ba24f93	+919059108434	$2b$10$Cpu7ARNIKJGi70sQ3r/AyOTuslmDcX9xoy7KN9gHhIcN.i.SEzkKO	login	2026-09-11 07:13:10.266+00	t	0	2026-09-11 07:03:10.395387+00
13f23f6e-d7f0-40f3-87a3-f7d997d8fa0b	+919059108434	$2b$10$dG.nQ2BMUK7Ss3MXHcXSPueawIezSpRebtjba.Dx3yuja0cVqrmvu	login	2026-09-11 07:49:51.124+00	t	0	2026-09-11 07:39:51.207306+00
754f4e6d-79e1-4a63-974f-9d7afa613994	+919059108434	$2b$10$Zih3LwTDI6qZ0beMY4vSM./WzllgJ2LOxsWJM/Iiao8kv9eB10uuK	login	2026-09-11 16:45:01.762+00	f	0	2026-09-11 16:35:01.756411+00
ab5f0564-c09e-47ec-908c-ce6eca7d24a0	+919059108434	$2b$10$qEIaBFSP26U7CBk/xAUjOukno/CP3TOt15vyHGrqx7pWQ5XW9Uos6	login	2026-09-11 19:04:51.46+00	t	0	2026-09-11 18:54:51.454921+00
fc0bfa16-a7a2-4eaf-bd27-10639ef070a7	+919059108434	$2b$10$W/NG1MhdzswJtbHgLv98GOXGvmeex7W5CvzibJWRL1SbB40c4beAO	login	2026-09-19 09:19:13.478+00	t	0	2026-09-19 09:09:13.47455+00
62a2aeed-a432-4fd3-b2f2-54bb3c32fe74	+919059108434	$2b$10$2J6mpaPnm9/.s7dSNzhfxOP/MloSLu3WOjq475Exqm29KLbJ64wpC	login	2026-10-03 11:19:12.51+00	t	0	2026-10-03 11:09:14.712379+00
ce6156ca-2a26-466d-bd4d-6f468fd7e53b	+919059108434	$2b$10$RZwPswxD1em/n/.jBUot5uqw/AwAcMQhJmq1m2lbE3V91iMQfhYBG	login	2026-10-03 19:38:57.941+00	f	0	2026-10-03 19:28:58.213396+00
d6bf98ed-e98a-44cf-b0be-86c165f7eb9b	+919059108434	$2b$10$9DLQeYDTEJViIOxRr0GQKOUCnh1qvSXH5T65unSoAC45iUjhEo0Qe	login	2026-10-04 02:48:04.077+00	t	0	2026-10-04 02:38:05.230396+00
00a5e92f-bb1c-4d79-870c-d20c39aa5c25	+919059108434	$2b$10$ZGY6qrwa7TspCYmtqicwV.JFCg2S2Dd38IpyIY1/hsncie4g7EBP2	login	2026-10-04 17:14:53.148+00	f	1	2026-10-04 17:04:53.430928+00
5ec096f5-1973-478f-9b46-ddc0b73c3238	+919059108434	$2b$10$X/AJwk7SIYzwYecJRkeTmePxdgBm9fcsoZiiYV8JQ89y0eSLRYoY6	login	2026-10-07 17:57:23.221+00	t	0	2026-10-07 17:47:26.351457+00
c052c431-d2ec-4cf6-ab8e-5838e41f10eb	+919059108434	$2b$10$4V3/0v0D.ldEzhdMn5XUievDaIwkOdRwryl6SSqFJWOTzVrXDyvKu	login	2026-10-08 17:35:54.109+00	t	0	2026-10-08 17:26:00.410114+00
a7081222-ca57-4453-b88f-58dc1ab325de	+919059108434	$2b$10$hdzF3rvTKQO3Ry2M80/DGuZKb4Orbjwb2OLKVY2AaSclwlRi.VDOK	login	2026-10-08 18:34:44.176+00	t	0	2026-10-08 18:24:50.588701+00
e194b03d-d63d-4426-b59b-d5e36b3804cf	+919059108434	$2b$10$mX.dCA15VVmRjf7Di9HOnO16/D2H.x4641j2.v3TGwQx3ZPjNDQJK	login	2026-10-12 17:54:32.529+00	f	0	2026-10-12 17:44:51.830886+00
72a41871-2240-4e7e-8ff1-2e86148516c6	+919059108434	$2b$10$K6aHS3VHGlB4OII3ckLYWuuJfKFlk8wLYGADQoFtG8k0vB3gNEYmC	login	2026-10-12 17:58:29.552+00	t	0	2026-10-12 17:48:48.854531+00
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, user_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, status, credits_added, metadata, created_at, updated_at) FROM stdin;
74e5887a-c154-491e-8928-f5e87a03d252	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	order_TaoFukp8S1gimD	\N	\N	100	INR	created	1	{"packName": "1 Credits Top-up"}	2026-09-11 17:18:58.423214+00	2026-09-11 17:18:58.423214+00
17b8ea35-2f76-4be6-9df7-e976b5bef9ef	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	order_TaoM6mSjWcpZSx	\N	\N	10000	INR	created	50	{"packName": "Basic Pack"}	2026-09-11 17:24:50.272841+00	2026-09-11 17:24:50.272841+00
dde0c7cb-90fc-4d2e-a6b1-10851dc3d709	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	order_TaoR2OZYvITsd6	pay_TaoRaQAViQFG6F	\N	100	INR	paid	1	{"packName": "1 Credits Top-up"}	2026-09-11 17:29:30.264487+00	2026-09-11 17:30:03.459+00
9638bff3-b259-4901-858c-98e261ffefc6	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	order_TaoxBUy5IKaIoN	\N	\N	20000	INR	created	220	{"packName": "Pack ₹200 (200+20 Credits)"}	2026-09-11 17:59:56.208422+00	2026-09-11 17:59:56.208422+00
dfdcb9f8-9998-4acc-b4c3-8fbc293e193c	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	order_TapOlLJRVwEZwp	\N	\N	500	INR	created	5	{"packName": "5 Credits Top-up"}	2026-09-11 18:26:02.653642+00	2026-09-11 18:26:02.653642+00
34fb2d72-2f62-439f-803c-934796cede2d	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	order_TapQ2O64w2URP7	\N	\N	600	INR	created	6	{"packName": "6 Credits Top-up"}	2026-09-11 18:27:15.057674+00	2026-09-11 18:27:15.057674+00
1913372d-7a8e-4667-afc5-25f8a155a4c3	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	order_TapQPV8Pjo9z3g	\N	\N	700	INR	created	7	{"packName": "7 Credits Top-up"}	2026-09-11 18:27:36.228369+00	2026-09-11 18:27:36.228369+00
391bffa2-92e1-4008-9b6c-76a2895366e1	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	order_TapQs5LST5tZYP	\N	\N	200	INR	created	2	{"packName": "2 Credits Top-up"}	2026-09-11 18:28:02.412679+00	2026-09-11 18:28:02.412679+00
59cda45a-fdd0-435e-a6fb-5344478badf6	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	order_TapwL8NpdKoVzv	\N	\N	500	INR	created	5	{"packName": "5 Credits Top-up"}	2026-09-11 18:57:49.849262+00	2026-09-11 18:57:49.849262+00
\.


--
-- Data for Name: poses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.poses (id, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, display_order, is_active, metadata, created_at, updated_at, preview_image_url, storage_path, color_hex) FROM stdin;
close_neck_chest	jewelry	all	\N	\N	Neck & Collarbone Focus	మెడ & ఛాతీ ఫోకస్ (Neck)	macro beauty close-up shot focused on the necklace or chain draped gracefully along the neck and collarbone	macro close-up 85mm portrait focusing from chin to chest	partial_face	\N	5	t	{}	2026-10-03 12:10:46.96961+00	2026-10-04 11:49:21.638627+00	\N	\N	\N
bottom_seated_cross	garment	all	bottom_wear	bottom_wear	Seated Leg Showcase	కూర్చున్న కాలు ప్రదర్శన	seated leg showcase with crossed knees displaying fabric stretch (face partially or fully shown in relaxed seating)	Seated leg showcase framing crossed knees, fabric stretch, and hem finish (face partially or fully shown in relaxed seating)	partial_face	\N	16	t	{}	2026-10-04 02:56:10.688716+00	2026-10-04 18:32:16.890644+00	\N	\N	\N
bottom_3q_lower	garment	all	bottom_wear	bottom_wear	3/4 Lower Body Angle	3/4 కింది శరీరం యాంగిల్	three-quarter lower body catalog angle (face partially shown or cropped near chest)	Three-quarter lower body catalog framing centered on hips and trousers (face partially shown or cropped near chest)	partial_face	\N	17	t	{}	2026-10-04 02:56:10.770552+00	2026-10-04 18:32:16.97486+00	\N	\N	\N
side_ear_profile	jewelry	all	ear_wear	ear_wear	Ear Profile & Jawline	చెవి ప్రొఫైల్ & దవడ	in an elegant side profile angle highlighting earlobe, jawline, and neck (face partially shown in side profile, focusing on ear and cheekbone)	Side profile beauty camera angle focusing on earlobe, cheekbone, and jawline (face partially shown in side profile, focusing on ear and cheekbone)	partial_face	\N	25	t	{}	2026-10-04 02:56:11.434711+00	2026-10-04 18:32:17.662802+00	\N	\N	\N
ear_head_tilt	jewelry	all	ear_wear	ear_wear	Gentle Head Tilt Profile	సున్నితమైన తల వాల్చిన ప్రొఫైల్	with a gentle head tilt showcasing earring drop length (face fully shown with graceful head angle)	Gentle head tilt angle showcasing earring drop length and sparkling reflections (face fully shown with graceful head angle)	full_face	\N	27	t	{}	2026-10-04 02:56:11.60733+00	2026-10-04 18:32:17.836186+00	\N	\N	\N
ear_front_balanced	jewelry	all	ear_wear	ear_wear	Both Ears Frontal Shot	రెండు చెవుల ముందు షాట్	in a direct frontal portrait displaying both dangling earrings symmetrically (face fully shown centered in frame)	Direct frontal symmetry framing both dangling earrings equally alongside facial features (face fully shown centered in frame)	full_face	\N	29	t	{}	2026-10-04 02:56:11.776884+00	2026-10-04 18:32:18.006237+00	\N	\N	\N
ear_over_shoulder	jewelry	all	ear_wear	ear_wear	Over-The-Shoulder Turn	భుజం పైనుండి చూసే యాంగిల్	in an over-the-shoulder glance highlighting ear profile and jawline (face partially shown in over-the-shoulder view)	Over-the-shoulder glance framing ear profile, jawline, and back hair drape (face partially shown in over-the-shoulder view)	partial_face	\N	30	t	{}	2026-10-04 02:56:11.876835+00	2026-10-04 18:32:18.101383+00	\N	\N	\N
wrist_side_arm	jewelry	all	wrist_wear	wrist_ring	Side Arm Extension	పక్క చేయి చాచిన భంగిమ	in a side arm extension highlighting watch dial or bangle stack (face partially shown / focused on forearm and wrist)	Side arm extension close-up focusing on forearm, wrist stack, and bangles (face partially shown / focused on forearm and wrist)	partial_face	\N	35	t	{}	2026-10-04 02:56:12.398364+00	2026-10-04 18:32:18.531157+00	\N	\N	\N
wrist_gesture	jewelry	all	wrist_wear	wrist_ring	Fluid Hand Gesture	చేతి సున్నితమైన కదలిక	in a fluid hand gesture in mid-motion showcasing sparkling wristwear (face fully or partially shown in background)	Mid-motion hand gesture framing wristwear against soft studio background (face fully or partially shown in background)	partial_face	\N	36	t	{}	2026-10-04 02:56:12.480788+00	2026-10-04 18:32:18.620192+00	\N	\N	\N
finger_hands_clasped	jewelry	all	wrist_wear	finger	Hands Clasped Together	చేతులు కలిపిన ఉంగరాల షాట్	with hands clasped together in front of chest showcasing multiple rings (face fully or partially shown)	Mid-shot framing clasped hands in front of chest showcasing multiple rings (face fully or partially shown)	full_face	\N	51	t	{}	2026-10-04 02:56:13.897386+00	2026-10-04 18:32:19.903303+00	\N	\N	\N
finger_holding_prop	jewelry	all	wrist_wear	finger	Delicate Hand Pose	సున్నితమైన చేతి ఉంగరం భంగిమ	in a delicate hand pose holding silk fabric showcasing ring facets (face partially shown / focus on hand and ring)	Close-up hand framing holding silk fabric showcasing ring facets (face partially shown / focus on hand and ring)	partial_face	\N	52	t	{}	2026-10-04 02:56:13.979234+00	2026-10-04 18:32:19.988336+00	\N	\N	\N
finger_macro_ring	jewelry	all	wrist_wear	finger	Macro Ring Diamond Focus	ఉంగరం డైమండ్ ఫోకస్	in a macro focus on solitaire diamond ring on finger (face partially shown / macro focus on hand)	Ultra macro focus centering solitaire diamond ring on finger (face partially shown / macro focus on hand)	partial_face	\N	53	t	{}	2026-10-04 02:56:14.061236+00	2026-10-04 18:32:20.07297+00	\N	\N	\N
anklet_floor_cross_legged	jewelry	all	leg_wear	leg	Cross-Legged Floor Pose	నేలపై క్రాస్-లెగ్డ్ కూర్చున్న భంగిమ	seated cross-legged on a polished wooden/marbled floor, with legs neatly folded displaying payal drapes and toe ring details (lower body / feet close-up focus)	Seated cross-legged posture on smooth floor/carpet framing ankles, payal, and toe rings gracefully (lower body/feet focus)	no_face	\N	55	t	{}	2026-10-04 02:56:14.224706+00	2026-10-04 18:32:20.243439+00	\N	\N	\N
three_quarter_gaze	jewelry	all	\N	accessories	Three-Quarter Elegance	మూడు వంతుల ముఖచిత్రం	in a classic three-quarter high-fashion beauty portrait with a subtle head tilt and serene gaze (face fully shown in 3/4 high-fashion gaze)	Three-quarter elegance portrait, subtle head tilt and studio gaze, capturing harmonized necklace and earring brilliance (face fully shown)	full_face	\N	71	t	{}	2026-10-04 02:56:15.546747+00	2026-10-04 18:32:21.607872+00	\N	\N	\N
top_upper_portrait	garment	all	top_wear	top_wear	Upper Body Portrait	పైభాగం పోర్ట్రెయిట్	high-chest portrait framing upper garment and shoulders (face fully shown centered in frame)	Upper torso portrait framing shoulders, collarline, chest, and face (face fully shown centered in frame)	full_face	\N	7	t	{}	2026-10-04 02:56:09.883884+00	2026-10-04 18:32:16.124629+00	\N	\N	\N
top_three_quarter	garment	all	top_wear	top_wear	3/4 Upper Body Angle	3/4 పైభాగం యాంగిల్	three-quarter upper body studio angle (face fully shown in 3/4 turn)	Three-quarter angle upper body portrait framing chest, shoulders, and sleeve length (face fully shown in 3/4 turn)	full_face	\N	9	t	{}	2026-10-04 02:56:10.090864+00	2026-10-04 18:32:16.294287+00	\N	\N	\N
top_casual_cross	garment	all	top_wear	top_wear	Arms Crossed Pose	చేతులు కట్టుకున్న భంగిమ	casual crossed-arms posture highlighting chest and fit (face fully shown directly facing camera)	Frontal mid-shot framing crossed arms over chest and garment structure (face fully shown facing camera)	full_face	\N	11	t	{}	2026-10-04 02:56:10.264087+00	2026-10-04 18:32:16.463001+00	\N	\N	\N
wrist_resting_lap	jewelry	all	wrist_wear	wrist_ring	Resting Hand on Lap	ఒడిలో పెట్టిన చేయి	with hands resting gracefully on lap showcasing bracelets and bangles (face partially shown / lower torso frame)	Lower torso camera framing with hands resting gracefully on lap showcasing wristwear (face partially shown / lower torso frame)	partial_face	\N	32	t	{}	2026-10-04 02:56:12.103367+00	2026-10-04 18:32:18.274777+00	\N	\N	\N
hip_waist_mid	jewelry	all	hip_wear	hip	Midsection Waist Focus	నడుము మధ్య భాగం ఫోకస్	in a midsection waist focus framing waistline ornament over ethnic drapes (face partially shown — cropped near lower ribs or chin, prioritizing waistline)	Midsection waist close-up framing hip chain or kamarbandh over apparel drapes (face partially shown — cropped near lower ribs or chin, prioritizing waistline)	partial_face	\N	37	t	{}	2026-10-04 02:56:12.574682+00	2026-10-04 18:32:18.704749+00	\N	\N	\N
hip_hands_on_waist	jewelry	all	hip_wear	hip	Hands-on-Waist 3/4 Pose	నడుముపై చేతులు ఉంచిన 3/4 భంగిమ	with hands on waist in three-quarter pose framing hip chain (face fully or partially shown)	Hands-on-waist three-quarter shot framing waistline ornament and hip curve (face fully or partially shown)	full_face	\N	38	t	{}	2026-10-04 02:56:12.658693+00	2026-10-04 18:32:18.792329+00	\N	\N	\N
hip_royal_standing	jewelry	all	hip_wear	hip	Regal Standing Waistline	రాయల్ నిలబడే నడుము పట్టి వ్యూ	in a regal standing posture showcasing full waistline and lower apparel (face fully shown with tall posture)	Tall standing posture framing full waistline and royal hip ornament (face fully shown with tall posture)	full_face	\N	39	t	{}	2026-10-04 02:56:12.757706+00	2026-10-04 18:32:18.879298+00	\N	\N	\N
hip_saree_drape	jewelry	all	hip_wear	hip	Saree Draped Waistline	చీర డ్రేప్‌లో నడుము పట్టి వ్యూ	in a saree draped waistline shot focusing on central motif (face fully or partially shown)	Traditional saree drape shot centering waistband motif against pleated silk (face fully or partially shown)	full_face	\N	41	t	{}	2026-10-04 02:56:12.928942+00	2026-10-04 18:32:19.048768+00	\N	\N	\N
nose_3q_headturn	jewelry	all	nose_wear	nose	3/4 Head Turn Angle	3/4 తల తిరిగిన నాథ్ యాంగిల్	in a three-quarter head turn capturing nath chain connecting to hair (face fully shown in 3/4 turn)	Three-quarter head turn angle capturing nath chain connecting to hair (face fully shown in 3/4 turn)	full_face	\N	45	t	{}	2026-10-04 02:56:13.386227+00	2026-10-04 18:32:19.390271+00	\N	\N	\N
nose_bridal_veil	jewelry	all	nose_wear	nose	Bridal Veil Side Angle	పెళ్ళికూతురు ముసుగు సైడ్ యాంగిల్	in a bridal veil side angle with sheer dupatta framing nose ring and eyes (face partially shown / softly veiled)	Bridal veil side angle with sheer dupatta framing nose ring, eyes, and cheek (face partially shown / softly veiled)	partial_face	\N	46	t	{}	2026-10-04 02:56:13.480385+00	2026-10-04 18:32:19.475407+00	\N	\N	\N
nose_macro_focus	jewelry	all	nose_wear	nose	Ultra Macro Nosepin	అల్ట్రా మాక్రో ముక్కు పుడక	in an ultra macro nosepin focus centering the nose ornament (face partially shown — tight macro crop on nose and cheek)	Ultra macro beauty close-up centering the nose ornament and skin texture (face partially shown — tight macro crop on nose and cheek)	partial_face	\N	48	t	{}	2026-10-04 02:56:13.650471+00	2026-10-04 18:32:19.645516+00	\N	\N	\N
finger_hand_gesture	jewelry	all	wrist_wear	finger	Hand & Finger Close-Up	చేతి వేళ్ళు & ఉంగరం క్లోజ్-అప్	in a hand and finger close-up gesture displaying rings on manicured fingers (face partially shown — softly blurred or cropped above chest)	Close-up hand gesture shot displaying rings on manicured fingers (face partially shown — softly blurred or cropped above chest)	partial_face	\N	49	t	{}	2026-10-04 02:56:13.731838+00	2026-10-04 18:32:19.733416+00	\N	\N	\N
finger_chin_rest	jewelry	all	wrist_wear	finger	Hand Resting on Chin	గడ్డం కింద చేయి ఆనించిన భంగిమ	with hand softly resting on chin/cheek highlighting ring on finger near lips (face fully shown with hand touching chin)	Beauty close-up with hand resting softly near chin/cheek, framing finger ring near facial features (face fully shown with hand touching chin)	full_face	\N	50	t	{}	2026-10-04 02:56:13.813374+00	2026-10-04 18:32:19.818189+00	\N	\N	\N
finger_side_hand	jewelry	all	wrist_wear	finger	Side Profile Hand Placement	పక్క చేయి ఆనించిన భంగిమ	in a side profile hand placement highlighting ring band detail (face partially shown / focus on hand profile)	Side profile hand placement highlighting ring band and setting depth (face partially shown / focus on hand profile)	partial_face	\N	54	t	{}	2026-10-04 02:56:14.142702+00	2026-10-04 18:32:20.157727+00	\N	\N	\N
anklet_ankle_close	jewelry	all	leg_wear	leg	Lower Leg & Ankle Focus	కాలు & పట్టీలు క్లోజ్-అప్	in a lower leg and ankle focus close-up showcasing payal and ghungroo bells (face partially shown — strictly lower leg focus, face cropped out of frame)	Lower leg macro close-up framing ankle, payal, and ghungroo bells (face partially shown — strictly lower leg focus, face cropped out of frame)	no_face	\N	58	t	{}	2026-10-04 02:56:14.470892+00	2026-10-04 18:32:20.499076+00	\N	\N	\N
anklet_step_forward	jewelry	all	leg_wear	leg	Forward Step Motion	అడుగు ముందుకు వేసిన పాయల్ భంగిమ	in a forward step motion highlighting anklet drape on foot (face partially shown — lower body/feet focus, face cropped out)	Dynamic forward step stride framing anklet drape on foot and heel (face partially shown — lower body/feet focus, face cropped out of frame)	no_face	\N	59	t	{}	2026-10-04 02:56:14.552719+00	2026-10-04 18:32:20.584233+00	\N	\N	\N
top_front_direct	garment	all	top_wear	top_wear	Direct Front Chest Shot	నేరుగా ముందు ఛాతీ షాట్	direct frontal torso alignment with symmetrical shoulders (face fully shown in frontal symmetry)	Symmetrical frontal upper-body shot highlighting chest pattern and collar geometry (face fully shown in direct symmetry)	full_face	\N	12	t	{}	2026-10-04 02:56:10.355067+00	2026-10-04 18:32:16.54739+00	\N	\N	\N
bottom_walking_step	garment	all	bottom_wear	bottom_wear	Walking Step Motion	నడక అడుగు మోషన్	walking step motion highlighting pant drape and footwear (face partially shown or cropped above waist)	Dynamic lower-body walking stride shot framing legs and hemline motion (face partially shown or cropped above waist)	partial_face	\N	14	t	{}	2026-10-04 02:56:10.522906+00	2026-10-04 18:32:16.718135+00	\N	\N	\N
bottom_side_leg	garment	all	bottom_wear	bottom_wear	Side Leg Profile	సైడ్ కాలు ప్రొఫైల్	side leg profile showcasing waistline, pockets, and side seams (face partially shown / lower body focus)	Side leg profile shot highlighting waistline, side seams, and pocket detailing (face partially shown / lower body focus)	partial_face	\N	15	t	{}	2026-10-04 02:56:10.604935+00	2026-10-04 18:32:16.805196+00	\N	\N	\N
nose_soft_smile	jewelry	all	nose_wear	nose	Subtle Smile Close-Up	చిరునవ్వుతో ముక్కు పుడక షాట్	in a subtle smile close-up accentuating nose pin shimmer near lips (face fully shown with gentle expression)	Subtle smile close-up accentuating nose pin shimmer near lips (face fully shown with gentle expression)	full_face	\N	47	t	{}	2026-10-04 02:56:13.566195+00	2026-10-04 18:32:19.560327+00	\N	\N	\N
anklet_floor_kneeling_mehendi	jewelry	all	leg_wear	leg	Floor Kneeling / Mehendi Pose	నేలపై మోకాళ్ళపై మెహందీ భంగిమ	kneeling gracefully on a rich carpeted or marble floor, top-down angle capturing payal chainwork, ghungroo drops, and shimmering toe rings against floor decor	Kneeling posture on decorative floor/carpet, top-down angle showcasing payal bells, heel drapes, and toe ornaments (lower body focus)	no_face	\N	57	t	{}	2026-10-04 02:56:14.388828+00	2026-10-04 18:32:20.414202+00	\N	\N	\N
anklet_seated_foot	jewelry	all	leg_wear	leg	Seated Foot Display Pose	కూర్చుని పట్టీలు చూపే షాట్	in a seated foot display pose with foot resting on cushion (face partially shown — feet and lower leg focus)	Seated foot framing with foot resting on cushion showcasing anklet links (face partially shown — feet and lower leg focus)	no_face	\N	60	t	{}	2026-10-04 02:56:14.635524+00	2026-10-04 18:32:20.669264+00	\N	\N	\N
anklet_toering_focus	jewelry	all	leg_wear	leg	Toe Ring & Ankle Focus	మెట్టెలు & పట్టీల క్లోజ్-అప్	in a toe ring and ankle focus close-up (face partially shown — feet and toes focus)	Intimate toe ring and foot arch close-up (face partially shown — feet and toes focus)	no_face	\N	63	t	{}	2026-10-04 02:56:14.887476+00	2026-10-04 18:32:20.926028+00	\N	\N	\N
forehead_tikka_center	jewelry	all	forehead_wear	forehead	Center Forehead Tikka Focus	పాపిడి బిళ్ళ క్లోజ్-అప్	in a close-up direct forehead and hairline beauty shot, highlighting center-placed maang tikka or borla (face fully shown — centered on upper face, eyes, and forehead)	Close-up forehead and hairline camera angle centering maang tikka or borla (face fully shown — centered on upper face, eyes, and forehead)	full_face	\N	64	t	{}	2026-10-04 02:56:14.969448+00	2026-10-04 18:32:21.011038+00	\N	\N	\N
forehead_mathapatti_frame	jewelry	all	forehead_wear	forehead	Full Hairline Matha Patti	మాతా పట్టీ పూర్తి హెయిర్‌లైన్ షాట్	in a frontal beauty portrait framing full forehead and hairline, displaying elaborate Kundan matha patti craftsmanship (face fully shown in frontal beauty portrait)	Frontal beauty portrait framing full forehead and hairline with matha patti (face fully shown in frontal beauty portrait)	full_face	\N	65	t	{}	2026-10-04 02:56:15.052808+00	2026-10-04 18:32:21.095662+00	\N	\N	\N
forehead_bridal_veil	jewelry	all	forehead_wear	forehead	Bridal Dupatta / Veil Frame	పెళ్ళికూతురు ముసుగు హెడ్‌పీస్ యాంగిల్	in a side angle bridal portrait with sheer dupatta framing forehead ornament and eyes (face partially shown / veiled face with eyes and forehead clear)	Side angle bridal portrait with sheer dupatta framing forehead ornament and eyes (face partially shown / veiled face with eyes and forehead clear)	partial_face	\N	67	t	{}	2026-10-04 02:56:15.216416+00	2026-10-04 18:32:21.26771+00	\N	\N	\N
forehead_side_passa	jewelry	all	forehead_wear	forehead	Side Temple Passa Focus	సైడ్ ఝుమర్ / పస్సా ప్రొఫైల్	in a side profile head angle highlighting passa / jhumar draped gracefully over temple and hair (face partially shown in side profile focusing on temple and hair)	Side profile head angle highlighting passa / jhumar draped over temple and hair (face partially shown in side profile focusing on temple and hair)	partial_face	\N	68	t	{}	2026-10-04 02:56:15.300832+00	2026-10-04 18:32:21.352837+00	\N	\N	\N
forehead_front_portrait	jewelry	all	forehead_wear	forehead	Direct Forehead Beauty Portrait	నేరుగా పాపిడి అలంకరణ పోర్ట్రెయిట్	in a symmetrical front-facing beauty portrait centering forehead jewelry, eyes, and regal poise (face fully shown in regal symmetry)	Direct front-facing beauty portrait centering forehead jewelry, eyes, and regal poise (face fully shown in regal symmetry)	full_face	\N	69	t	{}	2026-10-04 02:56:15.382732+00	2026-10-04 18:32:21.43861+00	\N	\N	\N
hand_face_gesture	jewelry	all	\N	accessories	Hand-to-Face Gesture	చేతితో ముఖం తాకే భంగిమ	in a graceful beauty pose with manicured hand and fingers softly resting near the cheek or chin (face fully shown in beauty portrait)	Hand-to-face beauty gesture shot, manicured fingers touching cheek/chin, framing rings and bracelets alongside facial poise (face fully shown)	full_face	\N	70	t	{}	2026-10-04 02:56:15.464553+00	2026-10-04 18:32:21.523283+00	\N	\N	\N
front_direct_portrait	jewelry	all	\N	accessories	Direct Frontal Portrait	నేరుగా నిలువు ముఖచిత్రం	in a regal direct-facing portrait looking into the camera with poised confidence (face fully shown looking directly into camera)	Direct frontal close-up beauty portrait, framing face, neckline, and shoulders with high-fashion symmetry (face fully shown)	full_face	\N	72	t	{}	2026-10-04 02:56:15.628552+00	2026-10-04 18:32:21.692886+00	\N	\N	\N
neck_collarbone	jewelry	all	neck_wear	neck_ear	Neck & Collarbone Focus	మెడ & కాలర్‌బోన్ ఫోకస్	in an intimate macro close-up portrait focusing on the neck, collarbone, and neckline (face partially shown — cropped cleanly from chin/lower lip to chest, emphasizing necklace drape)	Intimate macro close-up framing upper chest, collarbone, and neck (face partially shown — cropped cleanly from chin/lower lip to chest, emphasizing necklace drape)	partial_face	\N	19	t	{}	2026-10-04 02:56:10.939566+00	2026-10-04 18:32:17.143806+00	\N	\N	\N
neck_royal_gaze	jewelry	all	neck_wear	neck_ear	Regal Royal Posture	రాయల్ భంగిమ	in a regal posture looking slightly upward into golden studio light (face fully shown with serene gaze)	Regal portrait angle with model looking slightly upward, framing neckwear and facial poise (face fully shown with serene gaze)	full_face	\N	22	t	{}	2026-10-04 02:56:11.186184+00	2026-10-04 18:32:17.405002+00	\N	\N	\N
nose_close_profile	jewelry	all	nose_wear	nose	Nostril Profile Focus	ముక్కు ప్రొఫైల్ ఫోకస్	in a nostril profile focus close-up highlighting delicate nath loop and pearl drop (face partially shown — close macro focus on nose, lips, and cheek)	Macro nostril profile camera shot highlighting delicate nath loop and pearl drop (face partially shown — close macro focus on nose, lips, and cheek)	partial_face	\N	43	t	{}	2026-10-04 02:56:13.101251+00	2026-10-04 18:32:19.218418+00	\N	\N	\N
macro_ear	jewelry	all	\N	\N	Ear Profile Focus	చెవి ప్రొఫైల్ (Ear)	macro beauty shot focused on the earlobe and earring dangling against jawline with soft hair tuck	tight macro side-profile framing on ear and jawline	partial_face	\N	6	t	{}	2026-10-03 12:10:47.059239+00	2026-10-04 11:49:21.638627+00	\N	\N	\N
wrist_chest	jewelry	all	\N	\N	Wrist & Bangle Gesture	చేతి గాజులు (Wrist)	intimate beauty gesture with hand resting lightly near collarbone showcasing bangles or watch	medium macro framing highlighting wrist adornments	partial_face	\N	7	t	{}	2026-10-03 12:10:47.147715+00	2026-10-04 11:49:21.638627+00	\N	\N	\N
sitting_casual	garment	all	full_wear	full_wear	Sitting Casually	సాధారణంగా కూర్చుని	sitting in a casual, relaxed lounge style posture, natural poise (face fully shown)	Relaxed full-length seated lounge framing showcasing fabric folds (face fully shown)	full_face	\N	6	t	{}	2026-10-04 02:56:09.802083+00	2026-10-04 18:32:16.038613+00	\N	\N	\N
top_shoulder_profile	garment	all	top_wear	top_wear	Shoulder & Collar Focus	భుజం & కాలర్ ఫోకస్	side profile shoulder angle showcasing neckline and sleeve cut (face fully shown in side profile view)	Side shoulder profile shot showcasing neckline cut, armholes, and back detail (face fully shown in side profile view)	full_face	\N	10	t	{}	2026-10-04 02:56:10.181559+00	2026-10-04 18:32:16.378471+00	\N	\N	\N
neck_3q_shoulder	jewelry	all	neck_wear	neck_ear	3/4 Shoulder Angle	3/4 భుజం యాంగిల్	in a three-quarter shoulder turn highlighting neckwear angle and shoulder drape (face fully shown in 3/4 beauty angle)	Three-quarter shoulder turn highlighting neckwear angle and shoulder drape (face fully shown in 3/4 beauty angle)	full_face	\N	21	t	{}	2026-10-04 02:56:11.104057+00	2026-10-04 18:32:17.320414+00	\N	\N	\N
neck_front_direct	jewelry	all	neck_wear	neck_ear	Direct Front Neckline	నేరుగా నెక్లైన్ వ్యూ	in a direct frontal close-up framing symmetrical necklace and collarbone (face fully shown or lower face framed in direct symmetry)	Direct frontal close-up framing symmetrical necklace and collarbone structure (face fully shown or lower face framed in direct symmetry)	full_face	\N	23	t	{}	2026-10-04 02:56:11.270506+00	2026-10-04 18:32:17.490618+00	\N	\N	\N
neck_side_drape	jewelry	all	neck_wear	neck_ear	Side Angle Drape	పక్క యాంగిల్ డ్రేప్	in a side profile neck drape angle showcasing clasp and side links (face partially shown in side profile focusing on neck and jawline)	Side profile neck drape angle showcasing clasp, side chainwork, and jawline (face partially shown in side profile focusing on neck and jawline)	partial_face	\N	24	t	{}	2026-10-04 02:56:11.35309+00	2026-10-04 18:32:17.575415+00	\N	\N	\N
ear_hair_tuck	jewelry	all	ear_wear	ear_wear	Hair Tucked Behind Ear	చెవి వెనుక జుట్టు తిప్పిన యాంగిల్	with hair tucked behind ear revealing dangling earring details (face fully or partially shown in side profile angle)	Side angle close-up with hair tucked behind ear, framing dangling earring details (face fully or partially shown in side profile angle)	partial_face	\N	26	t	{}	2026-10-04 02:56:11.517805+00	2026-10-04 18:32:17.749316+00	\N	\N	\N
ear_3q_face	jewelry	all	ear_wear	ear_wear	3/4 Face Framing Angle	3/4 ముఖం ఫ్రేమింగ్ యాంగిల్	in a three-quarter face turn framing earring and cheek contour (face fully shown in 3/4 beauty gaze)	Three-quarter beauty portrait framing earring drop against cheek contour (face fully shown in 3/4 beauty gaze)	full_face	\N	28	t	{}	2026-10-04 02:56:11.689121+00	2026-10-04 18:32:17.920863+00	\N	\N	\N
wrist_cross_arms	jewelry	all	wrist_wear	wrist_ring	Crossed Arms Wrist Angle	చేతులు కట్టుకున్న మణికట్టు యాంగిల్	in a crossed arms posture highlighting wrist accessories over sleeves (face fully or partially shown in confident pose)	Mid-shot framing crossed arms showcasing wrist accessories over apparel sleeves (face fully or partially shown in confident pose)	full_face	\N	33	t	{}	2026-10-04 02:56:12.199865+00	2026-10-04 18:32:18.359986+00	\N	\N	\N
wrist_hand_chest	jewelry	all	wrist_wear	wrist_ring	Hand Placed Near Chest	ఛాతీ దగ్గర చేయి ఆనించిన భంగిమ	with hand placed near chest/collarbone bringing wrist and rings near neckline (face fully shown with hand touching chest)	Upper chest framing bringing manicured wrist and rings near neckline (face fully shown with hand touching chest)	full_face	\N	34	t	{}	2026-10-04 02:56:12.281917+00	2026-10-04 18:32:18.446242+00	\N	\N	\N
hip_side_turn	jewelry	all	hip_wear	hip	Side Hip Curve Angle	పక్క నడుము మలుపు యాంగిల్	in a side hip curve angle accentuating waist belt drapes (face partially or fully shown in side angle)	Side hip curve angle accentuating waist belt drapes and side clasp (face partially or fully shown in side angle)	partial_face	\N	40	t	{}	2026-10-04 02:56:12.847495+00	2026-10-04 18:32:18.964501+00	\N	\N	\N
hip_front_direct	jewelry	all	hip_wear	hip	Direct Frontal Midsection	నేరుగా నడుము మధ్య భాగం	in a direct frontal midsection alignment centering hip ornament (face partially shown / lower torso focus)	Direct frontal midsection alignment highlighting symmetrical waist ornament (face partially shown / lower torso focus)	partial_face	\N	42	t	{}	2026-10-04 02:56:13.014749+00	2026-10-04 18:32:19.133682+00	\N	\N	\N
nose_front_portrait	jewelry	all	nose_wear	nose	Direct Facial Portrait	నేరుగా ముఖ పోర్ట్రెయిట్	in a direct frontal facial beauty portrait framing nose ring and lips (face fully shown in direct symmetry)	Direct frontal beauty portrait framing nose ring and lips in high fashion symmetry (face fully shown in direct symmetry)	full_face	\N	44	t	{}	2026-10-04 02:56:13.304521+00	2026-10-04 18:32:19.305248+00	\N	\N	\N
standing_front	garment	all	full_wear	full_wear	Standing Front Pose	ముందు నిలబడి (Front)	standing straight in a polished professional catalog front pose (face fully shown in clean catalog alignment)	Full-length catalog shot, direct frontal camera framing capturing head to toe (face fully shown in clean catalog alignment)	full_face	\N	1	t	{}	2026-10-03 12:10:46.610943+00	2026-10-04 18:32:15.608569+00	\N	\N	\N
standing_three_quarter	garment	all	full_wear	full_wear	Three-Quarter Standing	మూడు వంతుల నిలబడి	standing in an elegant three-quarter angle studio catalog pose (face fully shown in studio gaze)	Three-quarter camera perspective balancing full outfit drape and model posture (face fully shown in studio gaze)	full_face	\N	3	t	{}	2026-10-04 02:56:09.554142+00	2026-10-04 18:32:15.783376+00	\N	\N	\N
walking_candid	garment	all	full_wear	full_wear	Walking Candid Pose	నడుస్తూ (Walking)	captured in a dynamic, stylish walking candid street style pose (face fully shown in natural candid movement)	Dynamic full-body street-style candid shot with forward stride motion (face fully shown in natural movement)	full_face	\N	4	t	{}	2026-10-03 12:10:46.789533+00	2026-10-04 18:32:15.86848+00	\N	\N	\N
standing_side	garment	all	full_wear	full_wear	Standing Side Profile	సైడ్ ప్రొఫైల్ (Side)	standing in an elegant three-quarter side profile showcase pose (face fully shown in 3/4 side profile view)	Full-body three-quarter side profile angle showcasing side silhouette and outfit fall (face fully shown in 3/4 side profile view)	full_face	\N	2	t	{}	2026-10-03 12:10:46.699738+00	2026-10-04 18:32:15.695521+00	\N	\N	\N
sitting_chair	garment	all	full_wear	full_wear	Sitting on Chair	కుర్చీలో కూర్చుని (Sitting)	sitting elegantly on a stylish studio chair in a professional catalog pose (face fully shown in poised sitting posture)	Full-body seated studio composition framing outfit drapes on chair (face fully shown in poised sitting posture)	full_face	\N	5	t	{}	2026-10-03 12:10:46.87761+00	2026-10-04 18:32:15.953927+00	\N	\N	\N
neck_chest_portrait	jewelry	all	neck_wear	neck_ear	High Chest Portrait	పై ఛాతీ పోర్ట్రెయిట్	in a high chest beauty portrait framing neckwear over collarbone and upper chest (face fully shown or lower face framed cleanly above necklace)	High chest beauty portrait framing neckwear over collarbone and upper chest (face fully shown or lower face framed cleanly above necklace)	full_face	\N	20	t	{}	2026-10-04 02:56:11.022107+00	2026-10-04 18:32:17.229987+00	\N	\N	\N
wrist_hand_display	jewelry	all	wrist_wear	wrist_ring	Wrist & Arm Pose	మణికట్టు & చేయి భంగిమ	in a refined close-up gesture focusing on hand, wrist, and forearm placement (face partially shown — softly blurred or cropped above chest, prioritizing wrist accessories)	Close-up hand and wrist gesture shot, framing watch dials, bangles, or bracelets (face partially shown — softly blurred or cropped above chest, prioritizing wrist accessories)	partial_face	\N	31	t	{}	2026-10-04 02:56:11.98911+00	2026-10-04 18:32:18.187815+00	\N	\N	\N
anklet_floor_legs_extended	jewelry	all	leg_wear	leg	Floor Seated Legs Extended	నేలపై కాళ్ళు చాపి కూర్చున్న భంగిమ	sitting gracefully on the floor with legs extended forward, displaying shimmering anklet chains and intricate toe rings resting gently on smooth floor (feet and lower leg focus)	Seated floor posture with legs extended forward, ankles and feet resting side by side highlighting payal and toe rings (lower body focus)	no_face	\N	56	t	{}	2026-10-04 02:56:14.30702+00	2026-10-04 18:32:20.328628+00	\N	\N	\N
anklet_side_foot	jewelry	all	leg_wear	leg	Side Ankle & Heel Angle	పక్క మడమ & పట్టీల యాంగిల్	in a side ankle and heel angle showcasing delicate chainwork (face partially shown — foot and ankle focus)	Side angle heel and ankle profile close-up (face partially shown — foot and ankle focus)	no_face	\N	61	t	{}	2026-10-04 02:56:14.717663+00	2026-10-04 18:32:20.75583+00	\N	\N	\N
forehead_3q_headturn	jewelry	all	forehead_wear	forehead	3/4 Head Turn Angle	3/4 తల తిరిగిన అలంకరణ భంగిమ	in a three-quarter head turn angle showcasing forehead ornament, temple detailing, and facial contouring (face fully shown in 3/4 angle)	Three-quarter head turn angle showcasing forehead ornament and temple detailing (face fully shown in 3/4 angle)	full_face	\N	66	t	{}	2026-10-04 02:56:15.134469+00	2026-10-04 18:32:21.180787+00	\N	\N	\N
top_standing_mid	garment	all	top_wear	top_wear	Mid-Shot Standing	మిడ్-షాట్ నిలబడి	standing mid-length portrait framing torso down to hips (face fully shown with poised posture)	Mid-length camera framing from head down to hips, highlighting waistline and upper fit (face fully shown)	full_face	\N	8	t	{}	2026-10-04 02:56:09.981161+00	2026-10-04 18:32:16.209556+00	\N	\N	\N
bottom_full_leg	garment	all	bottom_wear	bottom_wear	Waist-to-Ankle Shot	నడుము నుండి మడమ దాకా	waist-to-ankle shot showcasing leg silhouette, trousers, or skirt (face partially shown or cropped above waist depending on framing height)	Lower body shot framing waist to ankles, prioritizing pant drape and leg silhouette (face partially shown or cropped above waist depending on framing height)	partial_face	\N	13	t	{}	2026-10-04 02:56:10.437683+00	2026-10-04 18:32:16.632383+00	\N	\N	\N
bottom_front_stance	garment	all	bottom_wear	bottom_wear	Wide Stance Stride	విస్తృత నిలబడే భంగిమ	wide stance stride showcasing fit across hips and thighs (face partially or fully shown depending on vertical crop)	Wide stance lower-body shot displaying fabric fall across thighs and legs (face partially or fully shown depending on vertical crop)	partial_face	\N	18	t	{}	2026-10-04 02:56:10.855755+00	2026-10-04 18:32:17.059291+00	\N	\N	\N
anklet_both_feet	jewelry	all	leg_wear	leg	Both Feet Draped Together	రెండు కాళ్ళ పట్టీలు కనిపించే షాట్	with both feet draped together displaying pair of payals (face partially shown — feet focus)	Camera framing both feet draped together displaying pair of payals (face partially shown — feet focus)	no_face	\N	62	t	{}	2026-10-04 02:56:14.799508+00	2026-10-04 18:32:20.84116+00	\N	\N	\N
\.


--
-- Data for Name: presentations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.presentations (id, workspace, gender_target, wear_type_id, sub_category, name_en, name_te, prompt_directive, camera_framing, face_visibility_rule, thumbnail_url, display_order, is_active, metadata, created_at, updated_at, preview_image_url, storage_path, color_hex) FROM stdin;
model	all	all	\N	\N	Live Human Model	మనిషి మోడల్	worn gracefully by a professional fashion model with authentic natural posture and realistic fabric drape	\N	full_face	\N	1	t	{}	2026-10-03 12:10:47.675526+00	2026-10-04 18:32:21.780127+00	\N	\N	\N
partial_face	all	all	\N	\N	Human Model (Partial Face)	మానవ మోడల్ (పాక్షిక ముఖం)	worn on authentic human skin with a human skin partial face macro close-up framing, showing clean skin texture, natural pores, and soft studio lighting while cropping full facial identity	\N	partial_face	\N	2	t	{}	2026-10-04 02:56:17.071788+00	2026-10-04 18:32:21.865203+00	\N	\N	\N
no_face	all	all	\N	\N	Human Model (No Face / Headless)	మానవ మోడల్ (ముఖం లేకుండా)	worn on an authentic live human model skin backdrop, with primary macro camera focus and razor-sharp depth-of-field centered strictly on product details, while the human face is strictly cropped out of frame, turned away, or headless (showing NO human eyes, nose, lips, or face)	\N	no_face	\N	3	t	{}	2026-10-03 12:10:47.763266+00	2026-10-04 18:32:21.951012+00	\N	\N	\N
body_part	jewelry	all	\N	\N	Body Part Close-Up	శరీర భాగం (క్లోజప్ షాట్)	macro close-up shot focused on the jewelry item placed cleanly and naturally on a real human body part (such as neck, ear, wrist, finger, waist, nose, or ankle depending on item type) with smooth authentic skin texture and natural pores. This mode strictly uses NO face reference and does NOT generate any face identity, head, eyes, nose, or lips	\N	no_face	\N	4	t	{}	2026-10-04 02:56:17.235589+00	2026-10-04 18:32:22.035876+00	\N	\N	\N
mannequin	garment	all	\N	\N	Realistic Studio Mannequin	బొమ్మ (మెనకిన్)	displayed on a modern high-end realistic studio showroom clothing mannequin without human skin	\N	no_face	\N	5	t	{}	2026-10-03 12:10:48.149419+00	2026-10-04 18:32:22.120703+00	\N	\N	\N
hanger	garment	all	\N	\N	Boutique Hanger Display	హ్యాంగర్ స్టాండ్	hanging neatly on a minimalist wooden hanger in a beautiful high-end boutique wardrobe	\N	no_face	\N	6	t	{}	2026-10-04 02:56:17.399378+00	2026-10-04 18:32:22.205073+00	\N	\N	\N
ghost	garment	all	\N	\N	3D Ghost Mannequin	అదృశ్య బొమ్మ	photographed in flat lay ghost mannequin style, 3D hollow garment fit showing inner lining	\N	no_face	\N	7	t	{}	2026-10-03 12:10:48.39426+00	2026-10-04 18:32:22.293195+00	\N	\N	\N
shelf	garment	all	\N	\N	Boutique Retail Shelf	రిటైల్ షెల్ఫ్	placed beautifully on a minimalist floating boutique retail shelf, warm soft spot lighting	\N	no_face	\N	10	t	{}	2026-10-04 02:56:17.743324+00	2026-10-04 18:32:22.547623+00	\N	\N	\N
shopwindow	garment	all	\N	\N	Showroom Window Display	షాప్ విండో	featured in a premium luxury high-street showroom window display glass showcase box	\N	no_face	\N	11	t	{}	2026-10-04 02:56:17.825569+00	2026-10-04 18:32:22.631914+00	\N	\N	\N
bust	jewelry	all	\N	\N	Jewelry Display Stand / Bust	ఆభరణాల స్టాండ్	mounted elegantly on a specialized luxury non-human jewelry display stand mount, neck bust, cushion, or porcelain sculpture	\N	no_face	\N	12	t	{"subMounts": ["head", "neck", "wrist", "ankle", "finger", "hand", "naturally", "ear"]}	2026-10-04 02:56:17.90688+00	2026-10-04 18:32:22.717918+00	\N	\N	\N
flat_lay	garment	all	\N	\N	Studio Flat Lay	ఫ్లాట్ లే డిజైన్	perfectly arranged in a professional fashion flat-lay style on a clean neutral studio board	\N	no_face	\N	8	t	{}	2026-10-03 12:10:48.48476+00	2026-10-04 18:32:22.37771+00	\N	\N	\N
folded	garment	all	\N	\N	Retail Folded Display	మడతపెట్టిన ప్రదర్శన	folded immaculately in a clean neat square shape in high-end luxury retail boutique style on a flat surface, with the main signature feature, pallu, collar, chest embroidery, or primary decorative motif prominently visible on top facing directly up towards the camera	\N	no_face	\N	9	t	{}	2026-10-04 02:56:17.661018+00	2026-10-04 18:32:22.462951+00	\N	\N	\N
\.


--
-- Data for Name: system_lookups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_lookups (id, type, code, name_en, name_te, description, icon, display_order, is_active, metadata, created_at, updated_at) FROM stdin;
bg_indoor	background_type	indoor	Indoor	ఇండోర్	Studio lighting, luxury rooms, showroom setups, and ambient interior decors	lucide:home	1	t	{"tags": ["studio", "lighting", "interior", "luxury"]}	2026-10-04 03:56:42.843052+00	2026-10-04 18:32:25.048+00
bg_outdoor	background_type	outdoor	Outdoor	అవుట్‌డోర్	Indian heritage courtyards, architecture, gardens, nature, and scenic outdoor environments	lucide:trees	2	t	{"tags": ["courtyard", "heritage", "nature", "scenic"]}	2026-10-04 03:56:42.843052+00	2026-10-04 18:32:25.133+00
gender_female	gender	female	Female	మహిళలు	Women fashion models and feminine presentation	lucide:user	1	t	{"defaultWorkspace": "garment"}	2026-10-04 03:56:42.843052+00	2026-10-04 18:32:25.218+00
gender_male	gender	male	Male	పురుషులు	Men fashion models and masculine presentation	lucide:user	2	t	{"defaultWorkspace": "garment"}	2026-10-04 03:56:42.843052+00	2026-10-04 18:32:25.303+00
gender_unisex	gender	unisex	Unisex	యూనిసెక్స్	Gender-neutral garments and versatile options	lucide:users	3	t	{"defaultWorkspace": "garment"}	2026-10-04 04:53:06.011555+00	2026-10-04 18:32:25.389+00
gender_all	gender	all	All Collections	అన్ని కలెక్షన్లు	Universal options across all categories	lucide:asterisk	4	t	{"defaultWorkspace": "all"}	2026-10-04 04:53:06.011555+00	2026-10-04 18:32:25.474+00
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_settings (key, category, value, description, updated_by, updated_at) FROM stdin;
ai_gateway	ai	{"provider": "OpenAI Managed Gateway", "timeoutMs": 60000, "temperature": 0.7, "defaultModel": "gpt-image-2.5-sunburst", "fallbackModel": "gemini-2.5-flash-image"}	AI Model Routing, Gateway fallbacks, and execution parameters	\N	2026-10-04 18:32:24.106878+00
pricing_rules	pricing	{"packs": [{"id": "starter", "name": "Starter Pack", "credits": 50, "priceInPaise": 9900}, {"id": "pro", "name": "Pro Studio Pack", "credits": 200, "priceInPaise": 29900}, {"id": "enterprise", "name": "Brand Enterprise Pack", "credits": 1000, "priceInPaise": 99900}], "resolutionTiers": {"1k": 1, "2k": 2, "4k": 4}, "freeSignupCredits": 10, "aspectRatioMultipliers": {"1:1": 1, "3:4": 1, "16:9": 1, "9:16": 1}}	Credit costs per photoshoot resolution, aspect ratio, and Razorpay recharge packs	\N	2026-10-04 18:32:24.19331+00
negative_exclusions	fidelity	{"prohibitions": ["Strictly no price tags, barcode stickers, brand logos, company watermarks, or sale badges", "Strictly no unrequested secondary jewelry or accessories on the model's body", "Strictly no CGI plastic textures, fake glossy skin smoothing, or artificial wax figures", "Strictly no distorted fingers, extra limbs, or anatomy mutations"], "highest_priority_exclusion_rule": "STRICTLY NO PRICE TAGS, HANGTAGS, BRAND TAGS, COMPANY LOGOS, OR TEXT OVERLAYS"}	Exclusion directives and negative prompts preventing unwanted artifacts	\N	2026-10-04 18:32:24.456959+00
option_mappings	general	{"jewelryBustMapping": {"toe": ["ankle", "naturally"], "kada": ["wrist", "naturally"], "nath": ["head", "naturally"], "nose": ["head", "naturally"], "ring": ["finger", "hand", "naturally"], "borla": ["head", "naturally"], "chain": ["neck", "naturally"], "noise": ["head", "naturally"], "passa": ["head", "naturally"], "payal": ["ankle", "naturally"], "watch": ["wrist", "naturally"], "anklet": ["ankle", "naturally"], "choker": ["neck", "naturally"], "bangles": ["wrist", "naturally"], "pendant": ["neck", "naturally"], "bracelet": ["wrist", "hand", "naturally"], "earrings": ["head", "ear", "naturally"], "headband": ["head", "naturally"], "necklace": ["neck", "naturally"], "nose_pin": ["head", "naturally"], "toe_ring": ["ankle", "naturally"], "cufflinks": ["wrist", "naturally"], "hip_chain": ["wrist", "naturally"], "nose_ring": ["head", "naturally"], "solitaire": ["finger", "hand", "naturally"], "waistband": ["wrist", "naturally"], "kamarbandh": ["wrist", "naturally"], "thumb_ring": ["finger", "hand", "naturally"], "finger_ring": ["finger", "hand", "naturally"], "maang_tikka": ["head", "naturally"], "matha_patti": ["head", "naturally"]}, "genderGarmentMapping": {"male": ["shirt", "kurta", "suit", "western_wear", "tshirt", "jeans", "sherwani", "dhoti", "blazer", "tracksuit", "hoodie"], "female": ["saree", "kurta", "suit", "salwar", "western_wear", "tshirt", "jeans", "lehenga", "gown", "skirt", "crop_top", "blouse"]}, "genderJewelryMapping": {"male": ["chain", "earrings", "pendant", "bracelet", "watch", "anklet", "payal", "toe_ring", "toe", "cufflinks", "kada", "waistband", "hip_chain", "kamarbandh", "nose_ring", "nose_pin", "nath", "nose", "noise"], "female": ["necklace", "earrings", "chain", "choker", "pendant", "bracelet", "watch", "bangles", "kada", "cufflinks", "waistband", "hip_chain", "kamarbandh", "nose_ring", "nose_pin", "nath", "nose", "noise", "anklet", "payal", "toe_ring", "toe", "maang_tikka", "matha_patti", "borla", "passa", "headband"]}, "garmentBgCompatibility": {"ghost": {"indoor": ["plain", "studio", "luxury"], "outdoor": []}, "model": {"indoor": ["plain", "studio", "festival", "luxury", "vintage", "modern_office"], "outdoor": ["traditional", "royal", "urban"]}, "shelf": {"indoor": ["plain", "studio", "luxury", "vintage", "modern_office"], "outdoor": []}, "folded": {"indoor": ["plain", "studio", "luxury", "vintage"], "outdoor": []}, "hanger": {"indoor": ["plain", "studio", "luxury", "vintage"], "outdoor": []}, "no_face": {"indoor": ["plain", "studio", "festival", "luxury", "vintage", "modern_office"], "outdoor": ["traditional", "royal", "urban"]}, "flat_lay": {"indoor": ["plain", "studio", "luxury", "vintage"], "outdoor": []}, "mannequin": {"indoor": ["plain", "studio", "festival", "luxury", "vintage", "modern_office"], "outdoor": ["traditional"]}, "shopwindow": {"indoor": ["plain", "studio", "luxury", "vintage", "modern_office", "festival"], "outdoor": ["urban"]}, "partial_face": {"indoor": ["plain", "studio", "festival", "luxury", "vintage", "modern_office"], "outdoor": ["traditional", "royal", "urban"]}}, "garmentCategoryMapping": {"top_wear": ["tshirt", "shirt", "crop_top", "blouse", "blazer", "hoodie"], "full_wear": ["saree", "kurta", "suit", "salwar", "western_wear", "lehenga", "gown", "sherwani", "dhoti", "tracksuit"], "bottom_wear": ["jeans", "skirt"]}, "garmentPosesByCategory": {"top_wear": ["top_upper_portrait", "top_standing_mid", "top_three_quarter", "top_shoulder_profile", "top_casual_cross", "top_front_direct"], "full_wear": ["standing_front", "standing_side", "standing_three_quarter", "walking_candid", "sitting_chair", "sitting_casual"], "bottom_wear": ["bottom_full_leg", "bottom_walking_step", "bottom_side_leg", "bottom_seated_cross", "bottom_3q_lower", "bottom_front_stance"], "no_face_top": ["no_face_top_chest_shoulders", "no_face_top_front_fit", "no_face_top_side_sleeve", "no_face_top_back_detail"], "no_face_full": ["no_face_full_body_crop", "no_face_torso_hips_drape", "no_face_walking_stride", "no_face_seated_outfit"], "no_face_bottom": ["no_face_bottom_waist_to_toe", "no_face_bottom_side_seam", "no_face_bottom_walking_stride", "no_face_bottom_seated_trouser"], "partial_face_top": ["partial_face_top_collar_crop", "partial_face_top_jawline_chest", "partial_face_top_side_profile", "partial_face_top_mid_torso"], "partial_face_full": ["partial_face_chin_torso", "partial_face_shoulder_profile", "partial_face_lips_mid", "partial_face_back_shoulder"], "partial_face_bottom": ["partial_face_bottom_waist_chest", "partial_face_bottom_hip_stride", "partial_face_bottom_seated_lap", "partial_face_bottom_side_profile"]}, "jewelryBgCompatibility": {"bust": {"indoor": ["plain", "studio", "luxury", "traditional", "wood", "velvet", "silk", "granite", "mirror"], "outdoor": ["beach"]}, "model": {"indoor": ["plain", "studio"], "outdoor": []}, "no_face": {"indoor": ["plain", "studio", "luxury", "silk", "mirror"], "outdoor": []}, "partial_face": {"indoor": ["plain", "studio", "luxury", "silk", "mirror"], "outdoor": []}}, "jewelryCategoryMapping": {"hip": ["waistband", "hip_chain", "kamarbandh"], "leg": ["anklet", "payal", "toe_ring", "toe"], "nose": ["nose_ring", "nose_pin", "nath", "nose", "noise"], "finger": [], "ear_wear": ["earrings"], "forehead": ["maang_tikka", "matha_patti", "borla", "passa", "headband"], "neck_ear": ["necklace", "chain", "choker", "pendant"], "wrist_ring": ["bracelet", "watch", "bangles", "kada", "cufflinks"], "accessories": []}, "jewelryPosesByCategory": {"hip": ["hip_waist_mid", "hip_hands_on_waist", "hip_royal_standing", "hip_side_turn", "hip_saree_drape", "hip_front_direct"], "leg": ["anklet_floor_cross_legged", "anklet_floor_legs_extended", "anklet_floor_kneeling_mehendi"], "nose": ["nose_close_profile", "nose_front_portrait", "nose_3q_headturn", "nose_bridal_veil", "nose_soft_smile", "nose_macro_focus"], "finger": ["finger_hand_gesture", "finger_chin_rest", "finger_hands_clasped", "finger_holding_prop", "finger_macro_ring", "finger_side_hand"], "ear_wear": ["side_ear_profile", "ear_hair_tuck", "ear_head_tilt", "ear_3q_face", "ear_front_balanced", "ear_over_shoulder"], "forehead": ["forehead_tikka_center", "forehead_mathapatti_frame", "forehead_3q_headturn", "forehead_bridal_veil", "forehead_side_passa", "forehead_front_portrait"], "neck_ear": ["neck_collarbone", "neck_chest_portrait", "neck_3q_shoulder", "neck_royal_gaze", "neck_front_direct", "neck_side_drape"], "wrist_ring": ["wrist_hand_display", "wrist_resting_lap", "wrist_cross_arms", "wrist_hand_chest", "wrist_side_arm", "wrist_gesture"], "accessories": ["acc_forehead_tikka", "acc_front_direct", "acc_3q_gaze", "acc_side_profile"], "no_face_ear": ["no_face_side_neck_ear_macro", "no_face_ear_nape_profile", "no_face_shoulder_ear_line"], "no_face_hip": ["no_face_waist_midriff_front", "no_face_hip_curve_side", "no_face_back_waist_drape"], "no_face_leg": ["no_face_anklet_stepping", "no_face_seated_feet_drape", "no_face_toe_ring_step"], "no_face_neck": ["no_face_neck_collarbone_drape", "no_face_decollete_torso", "no_face_throat_collarbone_macro"], "no_face_nose": ["no_face_side_nostril_neck", "no_face_chin_lips_nose"], "partial_face": ["partial_face_jawline_macro", "partial_face_lips_collarbone", "partial_face_cheek_ear_close", "partial_face_nose_lips_profile", "partial_face_chin_neck_drape", "partial_face_forehead_brows_crop"], "no_face_wrist": ["no_face_wrist_hand_waist", "no_face_forearm_cross_body", "no_face_hand_lap_drape"], "no_face_finger": ["no_face_finger_touching_hip", "no_face_interlocked_hands_chest", "no_face_finger_ring_lap"], "no_face_forehead": ["no_face_forehead_hairline_only", "no_face_top_crown_hair"], "partial_face_ear": ["partial_face_cheek_ear_close", "partial_face_jawline_macro", "partial_face_ear_neck_profile", "partial_face_hairline_ear_crop"], "partial_skin_hip": ["partial_skin_waist_hip_curve_macro", "partial_skin_navel_hip_drape", "partial_skin_lower_waist_profile"], "partial_skin_leg": ["partial_skin_ankle_foot_macro", "partial_skin_toes_instep_close", "partial_skin_heel_anklet_profile"], "partial_face_neck": ["partial_face_lips_collarbone", "partial_face_chin_neck_drape", "partial_face_jawline_decollete", "partial_face_neck_side_throat"], "partial_face_nose": ["partial_face_nose_lips_profile", "partial_face_nostril_cheek_macro", "partial_face_lips_nose_front"], "partial_skin_wrist": ["partial_skin_wrist_pulse_macro", "partial_skin_forearm_wrist_drape", "partial_skin_hand_wrist_profile"], "no_face_accessories": ["no_face_chest_shoulder_accessory", "no_face_arm_wrist_cuff"], "partial_skin_finger": ["partial_skin_finger_knuckle_macro", "partial_skin_hand_resting_skin", "partial_skin_interlocked_fingers"], "partial_face_forehead": ["partial_face_forehead_brows_crop", "partial_face_hairline_temple_macro", "partial_face_upper_bridge_forehead"], "partial_skin_accessories": ["partial_skin_chest_lapel_macro", "partial_skin_wrist_cuff_close"]}}	Complete option relationships, category grouping, bust display mounts, and background compatibility rules	\N	2026-10-04 18:32:24.541376+00
preset_colors	general	[{"hex": "#fdfbf7", "name": "Cream White"}, {"hex": "#2b2b2b", "name": "Soft Charcoal"}, {"hex": "#d1d9cf", "name": "Sage Green"}, {"hex": "#f0dfbd", "name": "Royal Gold"}, {"hex": "#d5e2eb", "name": "Powder Blue"}, {"hex": "#f2e1e4", "name": "Blush Pink"}, {"hex": "#dfc0b5", "name": "Terracotta"}]	Predefined solid studio background colors with hex codes	\N	2026-10-04 18:32:24.634649+00
simulated_mockups	general	{"garment": {"suit": {"ghost": "/showcase/showcase-garment-after.jpg", "model": {"male": "/showcase/hero-lehenga.jpg", "female": "/showcase/hero-saree.jpg"}, "hanger": "/showcase/showcase-garment-before.jpg", "mannequin": "/showcase/showcase-garment-before.jpg"}, "jeans": {"ghost": "/showcase/showcase-garment-after.jpg", "model": {"male": "/showcase/hero-lehenga.jpg", "female": "/showcase/hero-saree.jpg"}, "hanger": "/showcase/showcase-garment-before.jpg", "mannequin": "/showcase/showcase-garment-before.jpg"}, "kurta": {"ghost": "/showcase/showcase-garment-after.jpg", "model": {"male": "/showcase/hero-lehenga.jpg", "female": "/showcase/hero-saree.jpg"}, "hanger": "/showcase/showcase-garment-before.jpg", "mannequin": "/showcase/showcase-garment-before.jpg"}, "saree": {"ghost": "/showcase/hero-saree.jpg", "model": {"male": "/showcase/hero-lehenga.jpg", "female": "/showcase/hero-saree.jpg"}, "hanger": "/showcase/showcase-garment-before.jpg", "mannequin": "/showcase/showcase-garment-before.jpg"}, "shirt": {"ghost": "/showcase/showcase-garment-after.jpg", "model": {"male": "/showcase/hero-lehenga.jpg", "female": "/showcase/hero-saree.jpg"}, "hanger": "/showcase/showcase-garment-before.jpg", "mannequin": "/showcase/showcase-garment-before.jpg"}, "salwar": {"ghost": "/showcase/showcase-garment-after.jpg", "model": {"male": "/showcase/hero-lehenga.jpg", "female": "/showcase/hero-saree.jpg"}, "hanger": "/showcase/showcase-garment-before.jpg", "mannequin": "/showcase/showcase-garment-before.jpg"}, "tshirt": {"ghost": "/showcase/showcase-garment-after.jpg", "model": {"male": "/showcase/hero-lehenga.jpg", "female": "/showcase/hero-saree.jpg"}, "hanger": "/showcase/showcase-garment-before.jpg", "mannequin": "/showcase/showcase-garment-before.jpg"}, "western_wear": {"ghost": "/showcase/showcase-garment-after.jpg", "model": {"male": "/showcase/hero-lehenga.jpg", "female": "/showcase/hero-saree.jpg"}, "hanger": "/showcase/showcase-garment-before.jpg", "mannequin": "/showcase/showcase-garment-before.jpg"}}, "jewelry": {"ring": {"bust": {"head": "/showcase/hero-jewelry.jpg", "neck": "/showcase/hero-jewelry.jpg", "wrist": "/showcase/showcase-jewelry-before.jpg"}, "model": {"male": "/showcase/hero-jewelry.jpg", "female": "/showcase/hero-jewelry.jpg"}}, "chain": {"bust": {"head": "/showcase/showcase-jewelry-after.jpg", "neck": "/showcase/showcase-jewelry-after.jpg", "wrist": "/showcase/showcase-jewelry-before.jpg"}, "model": {"male": "/showcase/hero-jewelry.jpg", "female": "/showcase/showcase-jewelry-after.jpg"}}, "watch": {"bust": {"head": "/showcase/hero-jewelry.jpg", "neck": "/showcase/hero-jewelry.jpg", "wrist": "/showcase/showcase-jewelry-before.jpg"}, "model": {"male": "/showcase/hero-jewelry.jpg", "female": "/showcase/hero-jewelry.jpg"}}, "bracelet": {"bust": {"head": "/showcase/showcase-jewelry-after.jpg", "neck": "/showcase/showcase-jewelry-after.jpg", "wrist": "/showcase/showcase-jewelry-before.jpg"}, "model": {"male": "/showcase/hero-jewelry.jpg", "female": "/showcase/showcase-jewelry-after.jpg"}}, "earrings": {"bust": {"head": "/showcase/hero-jewelry.jpg", "neck": "/showcase/showcase-jewelry-after.jpg", "wrist": "/showcase/showcase-jewelry-before.jpg"}, "model": {"male": "/showcase/showcase-jewelry-after.jpg", "female": "/showcase/hero-jewelry.jpg"}}, "necklace": {"bust": {"head": "/showcase/showcase-jewelry-after.jpg", "neck": "/showcase/showcase-jewelry-after.jpg", "wrist": "/showcase/showcase-jewelry-before.jpg"}, "model": {"male": "/showcase/hero-jewelry.jpg", "female": "/showcase/showcase-jewelry-after.jpg"}}}}	High quality themed mockups of Indian garments and jewelry for preview and offline demonstration	\N	2026-10-04 18:32:24.808846+00
image_models	ai	[{"id": "gpt_image_2_5_sunburst", "desc": "OpenAI flagship high-fidelity studio image synthesis & editing model with exceptional photorealism, texture preservation & precise composition control", "name": "OpenAI GPT-Image-2.5 Sunburst (gpt-image-2.5-sunburst)", "unit": "image", "price": 0.08, "provider": "openai"}]	Configured AI image generation models and default provider pricing	\N	2026-10-04 18:32:24.894198+00
image_resolutions	pricing	{"gptImage": [{"id": "1024x1024", "name": "1024 x 1024 px (1K Square)", "labelEn": "1024 x 1024 px (1K Square)", "labelTe": "1024 x 1024 పిక్సెల్స్ (1K స్క్వేర్)", "multiplier": 1}, {"id": "1536x1024", "name": "1536 x 1024 px (1K Landscape)", "labelEn": "1536 x 1024 px (1K Landscape)", "labelTe": "1536 x 1024 పిక్సెల్స్ (1K ల్యాండ్‌స్కేప్)", "multiplier": 1}, {"id": "1024x1536", "name": "1024 x 1536 px (1K Portrait)", "labelEn": "1024 x 1536 px (1K Portrait)", "labelTe": "1024 x 1536 పిక్సెల్స్ (1K పోర్ట్రెయిట్)", "multiplier": 1}, {"id": "2048x2048", "name": "2048 x 2048 px (2K Square)", "labelEn": "2048 x 2048 px (2K Square)", "labelTe": "2048 x 2048 పిక్సెల్స్ (2K స్క్వేర్)", "multiplier": 1.5}, {"id": "2048x1152", "name": "2048 x 1152 px (2K Landscape)", "labelEn": "2048 x 1152 px (2K Landscape)", "labelTe": "2048 x 1152 పిక్సెల్స్ (2K ల్యాండ్‌స్కేప్)", "multiplier": 1.5}, {"id": "1152x2048", "name": "1152 x 2048 px (2K Portrait)", "labelEn": "1152 x 2048 px (2K Portrait)", "labelTe": "1152 x 2048 పిక్సెల్స్ (2K పోర్ట్రెయిట్)", "multiplier": 1.5}, {"id": "3840x2160", "name": "3840 x 2160 px (4K Landscape)", "labelEn": "3840 x 2160 px (4K Landscape)", "labelTe": "3840 x 2160 పిక్సెల్స్ (4K ల్యాండ్‌స్కేప్)", "multiplier": 2}, {"id": "2160x3840", "name": "2160 x 3840 px (4K Portrait)", "labelEn": "2160 x 3840 px (4K Portrait)", "labelTe": "2160 x 3840 పిక్సెల్స్ (4K పోర్ట్రెయిట్)", "multiplier": 2}, {"id": "3840x3840", "name": "3840 x 3840 px (4K Square)", "labelEn": "3840 x 3840 px (4K Square)", "labelTe": "3840 x 3840 పిక్సెల్స్ (4K స్క్వేర్)", "multiplier": 2}], "standard": [{"id": "1k", "name": "1024 x 1024 px (Standard HD)", "labelEn": "1024 x 1024 px (Standard HD)", "labelTe": "1024 x 1024 పిక్సెల్స్ (స్టాండర్డ్ HD)", "multiplier": 1}, {"id": "2k", "name": "2048 x 2048 px (Ultra HD / 2K)", "labelEn": "2048 x 2048 px (Ultra HD / 2K)", "labelTe": "2048 x 2048 పిక్సెల్స్ (అల్ట్రా HD / 2K)", "multiplier": 1.6}, {"id": "4k", "name": "4096 x 4096 px (Super Resolution / 4K)", "labelEn": "4096 x 4096 px (Super Resolution / 4K)", "labelTe": "4096 x 4096 పిక్సెల్స్ (సూపర్ రెజల్యూషన్ / 4K)", "multiplier": 2.6}]}	Resolution tiers, dimensions, and multiplier matrix	\N	2026-10-04 18:32:24.978832+00
pricing_matrix	pricing	{"rechargePacks": {"inr": [{"badge": null, "bonus": 20, "label": "+20 Bonus Credits", "amount": 200, "credits": 200}, {"badge": "Most Popular", "bonus": 100, "label": "+100 Bonus Credits", "amount": 500, "badgeTe": "అత్యంత ప్రజాదరణ", "credits": 500}, {"badge": "Pro Value", "bonus": 300, "label": "+300 Bonus Credits", "amount": 1000, "badgeTe": "ఉత్తమ విలువ", "credits": 1000}, {"badge": "Mega Pack", "bonus": 1000, "label": "+1000 Bonus Credits", "amount": 2500, "badgeTe": "మెగా ప్యాక్", "credits": 2500}], "usd": [{"badge": null, "bonus": 100, "label": "+100 Bonus Credits", "amount": 10, "credits": 850}, {"badge": "Most Popular", "bonus": 400, "label": "+400 Bonus Credits", "amount": 25, "badgeTe": "అత్యంత ప్రజాదరణ", "credits": 2125}, {"badge": "Pro Value", "bonus": 1000, "label": "+1000 Bonus Credits", "amount": 50, "badgeTe": "ఉత్తమ విలువ", "credits": 4250}, {"badge": "Mega Pack", "bonus": 2500, "label": "+2500 Bonus Credits", "amount": 100, "badgeTe": "మెగా ప్యాక్", "credits": 8500}]}, "creditSettings": {"pricingMode": "cost_plus_margin", "creditsPerInr": 1, "creditsPerUsd": 85, "costPerImageGenLow": 1, "costPerImageGenMed": 5, "autoCreditDeduction": true, "costPerImageGenHigh": 18, "lowBalanceThreshold": 5, "profitMarginPercent": 30}, "gptImagePricing": {"low": {"1024x1024": 0.006, "1024x1536": 0.005, "1536x1024": 0.005}, "high": {"1024x1024": 0.211, "1024x1536": 0.165, "1536x1024": 0.165}, "medium": {"1024x1024": 0.053, "1024x1536": 0.041, "1536x1024": 0.041}}}	Raw API cost matrix and studio credit pricing configuration	\N	2026-10-04 18:32:25.064225+00
ui_translations_en	general	{"no": "No", "ear": "Ear Model", "toe": "Toe Ring (Bichhiya)", "yes": "Yes", "bust": "Bust Display Mount", "gown": "Elegant Gown", "hand": "Hand Display", "head": "Head Mount", "kada": "Traditional Kada", "male": "Male", "nath": "Bridal Nath Nose Ring", "neck": "Neck Mount", "nose": "Nose Pin / Ring (Nath)", "ring": "Classic Ring", "suit": "Classic Suit", "ankle": "Ankle Mount", "borla": "Traditional Borla", "chain": "Elegant Chain", "dhoti": "Traditional Dhoti", "ghost": "Ghost Mannequin", "jeans": "Jeans", "kurta": "Kurta", "model": "Human Model", "noise": "Nose Pin / Ring (Nath)", "passa": "Elegant Jhumar / Passa", "payal": "Traditional Payal Anklet", "saree": "Saree", "shelf": "Retail Shelf", "shirt": "Premium Shirt", "skirt": "Stylish Skirt", "title": "Srushti AI", "watch": "Luxury Watch", "wrist": "Wrist Mount", "anklet": "Elegant Anklet (Payal)", "blazer": "Premium Blazer", "blouse": "Designer Blouse", "choker": "Premium Choker", "female": "Female", "folded": "Folded Display", "hanger": "Hanger", "hoodie": "Cozy Hoodie", "noFace": "Human Model (No Face)", "res_1k": "Standard HD (1024x1024)", "res_2k": "Ultra-HD 2K (2048x2048)", "res_4k": "Super-HD 4K (4096x4096)", "salwar": "Salwar Kameez", "square": "Square", "tshirt": "T-Shirt", "apiHelp": "Enter your personal OpenAI API key (starting with sk-). It is saved safely in your browser and is never shared.", "bangles": "Exquisite Bangles", "bg_silk": "Luxurious Silk", "bg_wood": "Wood Table", "estCost": "Estimated Cost per Photo", "lehenga": "Lehenga Choli", "no_face": "Human Model (No Face)", "pendant": "Classic Pendant", "saveKey": "Save Key", "apiLabel": "OpenAI API Key", "bg_beach": "Sunny Beach", "bg_plain": "Plain Background", "bg_river": "River (Water & Rock)", "bg_royal": "Royal Palace", "bg_urban": "Urban Street", "bodyPart": "Body Part Close-Up", "bracelet": "Designer Bracelet", "crop_top": "Crop Top", "earrings": "Earrings", "errNoKey": "Please sign in with your phone number to generate AI photos using your studio credits.", "flat_lay": "Flat Lay Display", "headband": "Hair Headband", "keySaved": "Key Saved Successfully!", "navAdmin": "Admin Panel", "necklace": "Necklace", "nose_pin": "Sparkling Nose Pin", "portrait": "Portrait", "priceCol": "Price (Reference)", "retryBtn": "Try Again", "shareBtn": "Share Photo", "sherwani": "Royal Sherwani", "subtitle": "Business to Brand", "toe_ring": "Designer Toe Ring (Bichhiya)", "useModel": "Put on Human Model?", "bg_garden": "Lush Garden", "bg_luxury": "Luxury Marble", "bg_mirror": "Reflective Mirror", "bg_nature": "Garden / Nature", "bg_studio": "Elegant Studio", "bg_velvet": "Velvet Texture", "body_part": "Body Part Close-Up", "cufflinks": "Luxury Cufflinks", "darkTheme": "Dark", "hip_chain": "Elegant Hip Chain", "landscape": "Landscape", "mannequin": "Mannequin Doll", "naturally": "Place Naturally", "nose_ring": "Designer Nose Ring", "poseLabel": "Model Pose / Camera Angle", "ratio_1_1": "Square 1:1", "ratio_3_4": "Classic 3:4", "ratio_4_3": "Tablet 4:3", "solitaire": "Diamond Solitaire Ring", "tracksuit": "Sporty Tracksuit", "waistband": "Royal Waistband (Kamarbandh)", "adminTitle": "Admin Panel", "bg_granite": "Polished Granite", "bg_vintage": "Vintage Interior", "finalLabel": "Final AI Photo", "generating": "Creating Photographic Magic...", "kamarbandh": "Traditional Kamarbandh", "lightTheme": "Light", "navBilling": "Admin Panel", "navGarment": "Garments", "navJewelry": "Jewelry", "ratio_16_9": "Wide Screen 16:9", "ratio_9_16": "Story / Reel 9:16", "shopwindow": "Shop Window", "thumb_ring": "Stylish Thumb Ring", "acc_3q_gaze": "3/4 Accessory Framing", "bg_festival": "Festival / Diwali", "bg_wet_sand": "Wet Sand", "bustDisplay": "Display Mount", "downloadBtn": "Save to Phone", "ear_3q_face": "3/4 Face Framing Angle", "finger_ring": "Solitaire Finger Ring", "genderLabel": "Model Gender", "generateBtn": "Create Photo", "maang_tikka": "Bridal Maang Tikka", "matha_patti": "Royal Matha Patti", "navSettings": "Profile", "partialFace": "Human Model(Partial Face)", "pricingNote": "Prices shown are Google's published baseline rates for reference. Real rates may vary.", "productType": "Product Type", "uploadTitle": "Product photo should be a clear front view with all details visible", "bgColorLabel": "Background Color", "billingTitle": "Admin Panel", "errGenFailed": "Failed to generate photo. Please check your internet connection or server status.", "garmentTitle": "Garment Photography", "jewelryTitle": "Jewelry Photography", "keyValidated": "API Key Saved Successfully!", "modelNameCol": "Model", "partial_face": "Human Model(Partial Face)", "pricingTitle": "OpenAI AI Model Reference Rates", "verifyGoogle": "Verify pricing on official Google AI pricing page", "western_wear": "Western Wear", "adminSubtitle": "Configure AI models, pricing, and API keys", "ear_hair_tuck": "Hair Tucked Behind Ear", "ear_head_tilt": "Gentle Head Tilt Profile", "hip_side_turn": "Side Hip Curve Angle", "hip_waist_mid": "Midsection Waist Focus", "originalLabel": "Original Photo", "region_finger": "Finger Stand", "resolutionCol": "Resolution", "settingsTitle": "User Profile", "sitting_chair": "Sitting on Chair", "standing_side": "Standing Side Profile", "validatingKey": "Saving Key...", "wrist_gesture": "Fluid Hand Gesture", "activeKeyInUse": "Using Saved Personal Key", "bg_traditional": "Traditional Indian", "errUploadFirst": "Please upload your product photo first!", "exportTabTitle": "Export Settings", "languageToggle": "తెలుగు", "sitting_casual": "Sitting Casually", "standing_front": "Standing Front Pose", "uploadSubtitle": "Drag photo here or tap to capture", "walking_candid": "Walking Candid Pose", "wrist_side_arm": "Side Arm Extension", "backgroundStyle": "Background Style", "billingSubtitle": "Configure AI models, pricing, and API keys", "bottom_3q_lower": "3/4 Lower Body Angle", "bottom_full_leg": "Waist-to-Ankle Shot", "bottom_side_leg": "Side Leg Profile", "freeTrialActive": "API Key Required", "garmentSubtitle": "Sarees, T-shirts, Jeans, and more", "hip_saree_drape": "Saree Draped Waistline", "jewelrySubtitle": "Necklaces, earrings, and rings", "neck_collarbone": "Neck & Collarbone Focus", "neck_royal_gaze": "Regal Royal Posture", "neck_side_drape": "Side Angle Drape", "nose_soft_smile": "Subtle Smile Close-Up", "resolutionLabel": "Export Resolution", "acc_front_direct": "Direct Accessory Portrait", "acc_side_profile": "Side Profile Accessory Shot", "anklet_both_feet": "Both Feet Draped Together", "anklet_side_foot": "Side Ankle & Heel Angle", "aspectRatioLabel": "Aspect Ratio", "bg_modern_office": "Modern Office", "finger_chin_rest": "Hand Resting on Chin", "finger_side_hand": "Side Profile Hand Placement", "hip_front_direct": "Direct Frontal Midsection", "neck_3q_shoulder": "3/4 Shoulder Angle", "nose_3q_headturn": "3/4 Head Turn Angle", "nose_bridal_veil": "Bridal Veil Side Angle", "nose_macro_focus": "Ultra Macro Nosepin", "orientationLabel": "Image Orientation", "presentationMode": "Presentation Mode", "settingsSubtitle": "Manage your profile details, theme, and preferences", "side_ear_profile": "Ear Profile & Jawline", "top_casual_cross": "Arms Crossed Pose", "top_front_direct": "Direct Front Chest Shot", "top_standing_mid": "Mid-Shot Standing", "wrist_cross_arms": "Crossed Arms Wrist Angle", "wrist_hand_chest": "Hand Placed Near Chest", "ear_over_shoulder": "Over-The-Shoulder Turn", "exportTabSubtitle": "Configure output photo aspect ratio and resolution", "finger_macro_ring": "Macro Ring Diamond Focus", "hand_face_gesture": "Hand-to-Face Gesture", "neck_front_direct": "Direct Front Neckline", "top_three_quarter": "3/4 Upper Body Angle", "wrist_resting_lap": "Resting Hand on Lap", "acc_forehead_tikka": "Forehead Maang Tikka Focus", "anklet_ankle_close": "Lower Leg & Ankle Focus", "anklet_seated_foot": "Seated Foot Display Pose", "ear_front_balanced": "Both Ears Frontal Shot", "hip_hands_on_waist": "Hands-on-Waist 3/4 Pose", "hip_royal_standing": "Regal Standing Waistline", "nose_close_profile": "Nostril Profile Focus", "settingsThemeLabel": "Choose Theme / థీమ్ ఎంచుకోండి", "three_quarter_gaze": "Three-Quarter Elegance", "top_upper_portrait": "Upper Body Portrait", "wrist_hand_display": "Wrist & Arm Pose", "anklet_step_forward": "Forward Step Motion", "bottom_front_stance": "Wide Stance Stride", "bottom_seated_cross": "Seated Leg Showcase", "bottom_walking_step": "Walking Step Motion", "enterKeyPlaceholder": "Paste your OpenAI API Key (e.g. sk-proj-...)", "finger_hand_gesture": "Hand & Finger Close-Up", "finger_holding_prop": "Delicate Hand Pose", "forehead_side_passa": "Side Temple Passa Focus", "keyValidationFailed": "Invalid Key", "neck_chest_portrait": "High Chest Portrait", "nose_front_portrait": "Direct Facial Portrait", "anklet_toering_focus": "Toe Ring & Ankle Focus", "finger_hands_clasped": "Hands Clasped Together", "forehead_3q_headturn": "3/4 Head Turn Angle", "forehead_bridal_veil": "Bridal Dupatta / Veil Frame", "top_shoulder_profile": "Shoulder & Collar Focus", "forehead_tikka_center": "Center Forehead Tikka Focus", "front_direct_portrait": "Direct Frontal Portrait", "no_face_seated_outfit": "Headless Seated Outfit", "no_face_toe_ring_step": "Toe Rings & Instep Close-Up (Feet Only)", "no_face_top_front_fit": "Direct Front Headless Fit", "partial_face_lips_mid": "Lips to Midsection", "settingsLanguageLabel": "Choose Language / భాష ఎంచుకోండి", "no_face_arm_wrist_cuff": "Arm & Cuff Accessory (No Head)", "no_face_chin_lips_nose": "Lower Face Nose & Lips Angle (No Upper Head)", "no_face_full_body_crop": "Headless Full Body Crop", "no_face_hand_lap_drape": "Hand & Wrist Draped on Lap (No Head)", "no_face_hip_curve_side": "Side Hip Curve & Waist Chain (No Head)", "no_face_top_crown_hair": "Top Crown & Headband View (No Face)", "no_face_walking_stride": "Headless Walking Stride", "standing_three_quarter": "Three-Quarter Standing", "forehead_front_portrait": "Direct Forehead Beauty Portrait", "no_face_anklet_stepping": "Anklet & Step Motion (Legs View, No Head)", "no_face_decollete_torso": "Décolletage & Torso (No Head)", "no_face_finger_ring_lap": "Rings on Hand Resting on Lap (No Head)", "no_face_top_back_detail": "Back Detail Headless View", "no_face_top_side_sleeve": "Side Sleeve Detail", "partial_face_chin_torso": "Chin to Torso Crop", "no_face_back_waist_drape": "Lower Back & Waistline View (No Head)", "no_face_bottom_side_seam": "Side Seam Fit View", "no_face_ear_nape_profile": "Ear & Nape Rear Profile", "no_face_torso_hips_drape": "Torso & Hips Drape Focus", "no_face_wrist_hand_waist": "Wrist & Hand Resting on Waist (No Head)", "anklet_floor_cross_legged": "Cross-Legged Floor Pose", "forehead_mathapatti_frame": "Full Hairline Matha Patti", "no_face_seated_feet_drape": "Seated Feet & Anklets View (No Head)", "no_face_shoulder_ear_line": "Earlobe to Shoulder Line (No Face)", "no_face_side_nostril_neck": "Side Nostril & Neck Angle (No Upper Face)", "anklet_floor_legs_extended": "Floor Seated Legs Extended", "no_face_forearm_cross_body": "Crossed Forearms over Midriff (No Head)", "partial_face_back_shoulder": "Over Back Shoulder Angle", "partial_face_jawline_macro": "Macro Jawline & Ear Profile", "partial_face_top_mid_torso": "Mid-Torso Top View", "no_face_bottom_waist_to_toe": "Waist-to-Toe Headless", "no_face_finger_touching_hip": "Hand Resting on Hip (No Head)", "no_face_side_neck_ear_macro": "Ear & Side Neck Angle (No Face)", "no_face_top_chest_shoulders": "Chest & Shoulders Headless", "no_face_waist_midriff_front": "Midriff & Navel Waistband View (Headless)", "partial_face_cheek_ear_close": "Cheekbone & Earlobe Macro", "partial_face_chin_neck_drape": "Chin & Neckline Drape Macro", "partial_face_lips_collarbone": "Macro Lips to Collarbone Crop", "partial_face_lips_nose_front": "Lower Face Lips & Nose Framing", "partial_face_top_collar_crop": "Collarbone & Neck Crop", "partial_skin_navel_hip_drape": "Navel & Midriff Skin Close-Up", "anklet_floor_kneeling_mehendi": "Floor Kneeling / Mehendi Pose", "no_face_bottom_seated_trouser": "Seated Trouser Fit", "no_face_bottom_walking_stride": "Walking Leg Stride", "no_face_neck_collarbone_drape": "Neck-to-Chest Headless Crop", "partial_face_ear_neck_profile": "Earlobe to Neck Profile", "partial_face_neck_side_throat": "Side Neck & Throat Skin Close-Up", "partial_face_shoulder_profile": "Shoulder Profile Angle", "partial_face_top_side_profile": "Side Profile Jaw Crop", "partial_skin_ankle_foot_macro": "Ankle Joint & Foot Skin Macro", "partial_skin_wrist_cuff_close": "Wrist & Cuff Skin Close-Up", "no_face_forehead_hairline_only": "Forehead & Hairline Crop (No Eyes/Face)", "partial_face_bottom_hip_stride": "Hip Stride Motion Crop", "partial_face_bottom_seated_lap": "Seated Lap Framing", "partial_face_hairline_ear_crop": "Hairline & Ear Framing", "partial_face_jawline_decollete": "Jawline & Décolletage Profile", "partial_face_nose_lips_profile": "Nose & Lips Profile Angle", "partial_face_top_jawline_chest": "Jawline to Chest Framing", "partial_skin_chest_lapel_macro": "Chest & Collarbone Skin Macro", "partial_skin_hand_resting_skin": "Resting Hand on Skin Profile", "partial_skin_toes_instep_close": "Toes & Instep Close-Up", "partial_skin_wrist_pulse_macro": "Wrist Pulse Point Skin Macro", "no_face_interlocked_hands_chest": "Folded Hands on Chest (No Face)", "no_face_throat_collarbone_macro": "Throat & Collarbone Centered", "partial_face_bottom_waist_chest": "Chest to Knee Framing", "partial_skin_hand_wrist_profile": "Hand Back & Wrist Joint Profile", "no_face_chest_shoulder_accessory": "Chest & Shoulder Accessory (No Face)", "partial_face_bottom_side_profile": "Side Lower Body Profile", "partial_face_forehead_brows_crop": "Forehead & Eyebrow Framing", "partial_face_nostril_cheek_macro": "Nostril & Cheekbone Macro", "partial_skin_forearm_wrist_drape": "Forearm & Wrist Close-Up", "partial_skin_heel_anklet_profile": "Heel & Anklet Profile Angle", "partial_skin_interlocked_fingers": "Fingers Close-Up Crop", "partial_skin_lower_waist_profile": "Lower Waist Skin Profile", "partial_skin_finger_knuckle_macro": "Finger Knuckle & Ring Macro", "partial_face_hairline_temple_macro": "Hairline & Temple Profile", "partial_face_upper_bridge_forehead": "Upper Bridge & Forehead Crop", "partial_skin_waist_hip_curve_macro": "Waist & Hip Curve Skin Macro"}	Complete English translation dictionary for all UI buttons, titles, errors, and labels	\N	2026-10-04 18:32:25.149464+00
ui_translations_te	general	{"no": "వద్దు", "ear": "చెవి భాగం", "toe": "మెట్టెలు (కాలినవేలు ఉంగరం)", "yes": "అవును", "bust": "ఆభరణాల స్టాండ్", "gown": "గౌన్", "hand": "చేతి భాగం", "head": "తల భాగం", "kada": "కడా / బ్రేస్‌లెట్", "male": "పురుషుడు", "nath": "పెళ్ళికూతురు నాథ్ (ముక్కు రింగ్)", "neck": "మెడ భాగం", "nose": "ముక్కు పుడక / ముక్కు రింగ్", "ring": "ఉంగరం (రింగ్)", "suit": "క్లాసిక్ సూట్", "ankle": "కాలి మడమ భాగం", "borla": "సాంప్రదాయ బొర్లా", "chain": "మెడ గొలుసు (చైన్)", "dhoti": "సాంప్రదాయ ధోతి", "ghost": "అదృశ్య బొమ్మ", "jeans": "జీన్స్", "kurta": "కుర్తా", "model": "మనిషి మోడల్", "noise": "ముక్కు పుడక / ముక్కు రింగ్", "passa": "ఝుమర్ / పస్సా", "payal": "సాంప్రదాయ పాయల్ పట్టీలు", "saree": "చీర", "shelf": "రిటైల్ షెల్ఫ్", "shirt": "ప్రీమియం షర్ట్", "skirt": "స్కార్ట్", "title": "Srushti AI", "watch": "చేతి గడియారం (వాచ్)", "wrist": "మణికట్టు భాగం", "anklet": "పట్టీలు (ఆంక్లెట్ / పాయల్)", "blazer": "బ్లేజర్", "blouse": "బ్లౌజ్", "choker": "చోకర్ హారం", "female": "స్త్రీ", "folded": "మడతపెట్టిన ప్రదర్శన", "hanger": "హ్యాంగర్ స్టాండ్", "hoodie": "హుడీ", "noFace": "మానవ మోడల్ (ముఖం లేకుండా)", "res_1k": "సాధారణ నాణ్యత HD (1024x1024)", "res_2k": "అధిక నాణ్యత 2K (2048x2048)", "res_4k": "అత్యంత స్పష్టత 4K (4096x4096)", "salwar": "సల్వార్ కమీజ్", "square": "చతురస్రం", "tshirt": "టీ-షర్ట్", "apiHelp": "మీ ఓపెన్ ఏఐ ఏపీఐ కీ (sk- తో ప్రారంభమయ్యేది) ఇక్కడ రాయండి. ఇది మీ బ్రౌజర్‌లో సురక్షితంగా ఉంటుంది.", "bangles": "గాజులు (బ్యాంగిల్స్)", "bg_silk": "పట్టు వస్త్రం (సిల్క్)", "bg_wood": "చెక్క బల్ల", "estCost": "ఒక ఫోటో తయారీ అంచనా ఖరీదు", "lehenga": "లెహంగా చోళీ", "no_face": "మానవ మోడల్ (ముఖం లేకుండా)", "pendant": "లాకెట్ / పెండెంట్", "saveKey": "కీని సేవ్ చేయి", "apiLabel": "ఓపెన్ ఏఐ ఏపీఐ కీ (OpenAI API Key)", "bg_beach": "బీచ్ వాతావరణం", "bg_plain": "సాధారణ రంగు", "bg_river": "నది (నీరు & రాయి)", "bg_royal": "రాజభవనం", "bg_urban": "నగర వీధి (అర్బన్)", "bodyPart": "శరీర భాగం (క్లోజప్ షాట్)", "bracelet": "చేతి కడియం (బ్రేస్లెట్)", "crop_top": "క్రాప్ టాప్", "earrings": "కమ్మలు (చెవి రింగులు)", "errNoKey": "మీ స్టూడియో క్రెడిట్లను ఉపయోగించి ఏఐ ఫోటోలు రూపొందించడానికి దయచేసి ముందుగా మీ ఫోన్ నంబర్‌తో సైన్ ఇన్ అవ్వండి.", "flat_lay": "ఫ్లాట్ లే డిజైన్", "headband": "తల హెడ్‌బ్యాండ్", "keySaved": "కీ సేవ్ చేయబడింది!", "navAdmin": "అడ్మిన్ ప్యానెల్", "necklace": "నెక్లెస్ / హారం", "nose_pin": "మెరిసే ముక్కు పుడక", "portrait": "నిలువు", "priceCol": "ధర (డాలర్లలో)", "retryBtn": "మళ్ళీ చేయి", "shareBtn": "షేర్ చేయి", "sherwani": "షేర్వాణీ", "subtitle": "Business to Brand", "toe_ring": "మెట్టెలు (బొటనవేలు ఉంగరం)", "useModel": "మనిషి మోడల్‌కు వేయాలా?", "bg_garden": "పూల తోట (గార్డెన్)", "bg_luxury": "లగ్జరీ మార్బుల్ నేల", "bg_mirror": "అద్దం ప్రతిబింబం", "bg_nature": "తోట / ప్రకృతి వాతావరణం", "bg_studio": "స్టూడియో లైటింగ్", "bg_velvet": "వెల్వెట్ బ్యాక్‌గ్రౌండ్", "body_part": "శరీర భాగం (క్లోజప్ షాట్)", "cufflinks": "కఫ్ లింకులు", "darkTheme": "డార్క్", "hip_chain": "నడుము గొలుసు (హిప్ చైన్)", "landscape": "అడ్డంగా", "mannequin": "బొమ్మ (మెనకిన్)", "naturally": "సహజంగా ఉంచండి (Place Naturally)", "nose_ring": "ముక్కు పుడక / రింగ్", "poseLabel": "మోడల్ పోజ్ / కెమెరా యాంగిల్", "ratio_1_1": "చదరం 1:1", "ratio_3_4": "క్లాసిక్ 3:4", "ratio_4_3": "టాబ్లెట్ 4:3", "solitaire": "సోలిటైర్ డైమండ్ రింగ్", "tracksuit": "ట్రాక్‌సూట్", "waistband": "వడ్డాణం (నడుము పట్టి)", "adminTitle": "అడ్మిన్ ప్యానెల్ (Admin Panel)", "bg_granite": "గ్రానైట్ నేల", "bg_vintage": "పాతకాలపు గది (వింటేజ్)", "finalLabel": "తయారైన ఏఐ ఫోటో", "generating": "అందమైన ఏఐ ఫోటో తయారవుతోంది...", "kamarbandh": "సాంప్రదాయ కమర్‌బంద్", "lightTheme": "లైట్", "navBilling": "అడ్మిన్ ప్యానెల్", "navGarment": "బట్టల ఫోటోలు", "navJewelry": "నగల ఫోటోలు", "ratio_16_9": "వెడల్పు స్క్రీన్ 16:9", "ratio_9_16": "రీల్ / స్టోరీ 9:16", "shopwindow": "షాప్ విండో", "thumb_ring": "బొటనవేలు ఉంగరం (థంబ్ రింగ్)", "acc_3q_gaze": "3/4 అలంకరణ యాంగిల్", "bg_festival": "పండుగ / దీపావళి వెలుగులు", "bg_wet_sand": "తడి ఇసుక (Wet Sand)", "bustDisplay": "డిస్ప్లే స్టాండ్ రకం", "downloadBtn": "ఫోన్‌లోకి డౌన్‌లోడ్ చేయి", "ear_3q_face": "3/4 చెవిపోగుల యాంగిల్", "finger_ring": "చేతి వేలు ఉంగరం (ఫింగర్ రింగ్)", "genderLabel": "మోడల్ లింగం", "generateBtn": "ఫోటో సృష్టించు", "maang_tikka": "పాపిడి బిళ్ళ (మాంగ్ తిక్కా)", "matha_patti": "రాయల్ మాతా పట్టీ", "navSettings": "ప్రొఫైల్", "partialFace": "మానవ మోడల్ (పాక్షిక ముఖం)", "pricingNote": "ఈ ధరలు కేవలం గూగుల్ ప్రచురించిన ప్రాథమిక వివరాలు మాత్రమే. అసలు ధరలు మారవచ్చు.", "productType": "వస్తువు రకం", "uploadTitle": "ప్రొడక్ట్ ఫోటో స్పష్టమైన ఫ్రంట్ వ్యూలో అన్ని వివరాలతో ఉండాలి", "bgColorLabel": "బ్యాక్‌గ్రౌండ్ రంగు", "billingTitle": "అడ్మిన్ ప్యానెల్ (Admin Panel)", "errGenFailed": "ఫోటో తయారుచేయడం కుదరలేదు. దయచేసి ఇంటర్నెట్ లేదా సర్వర్ కనెక్షన్‌ను సరిచూసుకోండి.", "garmentTitle": "బట్టల ఫోటోగ్రఫీ", "jewelryTitle": "నగల ఫోటోగ్రఫీ", "keyValidated": "ఏపీఐ కీ విజయవంతంగా సేవ్ చేయబడింది!", "modelNameCol": "మోడల్", "partial_face": "మానవ మోడల్ (పాక్షిక ముఖం)", "pricingTitle": "ఓపెన్ ఏఐ మోడల్ ధరల పట్టిక", "verifyGoogle": "గూగుల్ అధికారిక ధరల వెబ్‌సైట్‌లో సరిచూసుకోండి", "western_wear": "వెస్ట్రన్ వేర్", "adminSubtitle": "ఏఐ మోడల్ ధరలు మరియు ఏపీఐ అమరికలను నిర్వహించండి", "ear_hair_tuck": "జుట్టు వెనక్కి దువ్విన భంగిమ", "ear_head_tilt": "తల పక్కకి వాల్చిన భంగిమ", "hip_side_turn": "పక్కకి ఒరిగిన ఒంపు భంగిమ", "hip_waist_mid": "నడుము & వడ్డాణం క్లోజ్-అప్", "originalLabel": "అసలు ఫోటో", "region_finger": "వేలి భాగం", "resolutionCol": "రిజల్యూషన్", "settingsTitle": "యూజర్ ప్రొఫైల్ (Profile)", "sitting_chair": "కుర్చీపై కూర్చుని (సిట్టింగ్ పోజ్)", "standing_side": "పక్క చూపు నిలబడి (సైడ్ ప్రొఫైల్)", "validatingKey": "కీని సేవ్ చేస్తోంది...", "wrist_gesture": "సున్నితమైన చేతి కదలిక", "activeKeyInUse": "మీ వ్యక్తిగత కీ ఉపయోగించబడుతోంది", "bg_traditional": "భారతీయ సాంప్రదాయం", "errUploadFirst": "ముందుగా మీ వస్తువు ఫోటోను అప్‌లోడ్ చేయండి!", "exportTabTitle": "ఎగుమతి అమరికలు", "languageToggle": "English", "sitting_casual": "క్యాజువల్ గా కూర్చుని", "standing_front": "నిలబడిన ముఖచిత్రం (ఫ్రంట్ పోజ్)", "uploadSubtitle": "ఇక్కడ ఫోటోను వేయండి లేదా కెమెరా కోసం నొక్కండి", "walking_candid": "నడుస్తున్నట్లుగా (క్యాండిడ్ పోజ్)", "wrist_side_arm": "పక్క చేయి చాచిన భంగిమ", "backgroundStyle": "వెనుక బ్యాక్‌గ్రౌండ్ రకం", "billingSubtitle": "ఏఐ మోడల్ ధరలు మరియు ఏపీఐ అమరికలను నిర్వహించండి", "bottom_3q_lower": "3/4 క్రింది భాగం యాంగిల్", "bottom_full_leg": "నడుము నుండి కాళ్ళ వరకు షాట్", "bottom_side_leg": "పక్కకి కాళ్ళ భంగిమ", "freeTrialActive": "ఏపీఐ కీ అవసరం (API Key Required)", "garmentSubtitle": "చీరలు, టీ-షర్టులు, జీన్స్ మరిన్ని", "hip_saree_drape": "చీరపై వడ్డాణం కనిపించే భంగిమ", "jewelrySubtitle": "హారాలు, చెవి కమ్మలు, గాజులు", "neck_collarbone": "మెడ & కాలర్‌బోన్ ఫోకస్", "neck_royal_gaze": "రాజసం ఉట్టిపడే మెడ భంగిమ", "neck_side_drape": "పక్కకి తిరిగిన హారం భంగిమ", "nose_soft_smile": "చిరునవ్వుతో కూడిన ముక్కు పుడక షాట్", "resolutionLabel": "ఎగుమతి రిజల్యూషన్ (క్వాలిటీ)", "acc_front_direct": "నేరుగా అలంకరణ కనిపించే భంగిమ", "acc_side_profile": "పక్క ప్రొఫైల్ అలంకరణ షాట్", "anklet_both_feet": "రెండు కాళ్ళ పట్టీలు కనిపించే షాట్", "anklet_side_foot": "పక్క మడమ & పట్టీల యాంగిల్", "aspectRatioLabel": "యాస్పెక్ట్ రేషియో (పరిమాణం)", "bg_modern_office": "ఆధునిక ఆఫీస్", "finger_chin_rest": "గడ్డం కింద చేయి ఆనించిన భంగిమ", "finger_side_hand": "పక్క చేయి ఆనించిన భంగిమ", "hip_front_direct": "నేరుగా వడ్డాణం కనిపించే షాట్", "neck_3q_shoulder": "3/4 భుజం & మెడ కోణం", "nose_3q_headturn": "3/4 తల తిరిగిన నాథ్ భంగిమ", "nose_bridal_veil": "పెళ్ళికూతురు ముక్కు రింగ్ యాంగిల్", "nose_macro_focus": "అత్యంత క్లోజ్-అప్ ముక్కు పుడక", "orientationLabel": "చిత్రం ఓరియంటేషన్ / దిశ", "presentationMode": "ప్రదర్శన విధానం", "settingsSubtitle": "మీ ఖాతా వివరాలు, థీమ్ మరియు భాషల అమరికలు", "side_ear_profile": "చెవి ప్రొఫైల్ & దవడ లైన్", "top_casual_cross": "చేతులు కట్టుకున్న శైలి", "top_front_direct": "నేరుగా పైభాగం ఫోటో", "top_standing_mid": "నడుము వరకు నిలబడిన షాట్", "wrist_cross_arms": "చేతులు కట్టుకుని గాజులు చూపే షాట్", "wrist_hand_chest": "గుండె వద్ద చేయి ఉంచిన భంగిమ", "ear_over_shoulder": "భుజం పైనుండి చూసే భంగిమ", "exportTabSubtitle": "ఫైనల్ ఫోటో యొక్క సైజ్ మరియు క్వాలిటీ సెట్ చేసుకోండి", "finger_macro_ring": "ఉంగరం డైమండ్ ప్రస్ఫుటమైన షాట్", "hand_face_gesture": "చేతితో ముఖం తాకే భంగిమ", "neck_front_direct": "నేరుగా హారం కనిపించే భంగిమ", "top_three_quarter": "3/4 పైభాగం యాంగిల్", "wrist_resting_lap": "చేతిని హాయిగా ఆనించిన భంగిమ", "acc_forehead_tikka": "పాపిడి బిళ్ళ క్లోజ్-అప్", "anklet_ankle_close": "కాలు & పట్టీలు క్లోజ్-అప్", "anklet_seated_foot": "కూర్చుని పట్టీలు చూపే షాట్", "ear_front_balanced": "నేరుగా రెండు చెవులు కనిపించే షాట్", "hip_hands_on_waist": "నడుముపై చేతులు ఉంచిన 3/4 యాంగిల్", "hip_royal_standing": "రాజసపు నిలబడిన వడ్డాణం షాట్", "nose_close_profile": "ముక్కు పుడక క్లోజ్-అప్ ప్రొఫైల్", "settingsThemeLabel": "థీమ్ ఎంచుకోండి (Choose Theme)", "three_quarter_gaze": "మూడు వంతుల ముఖచిత్రం", "top_upper_portrait": "పైభాగం క్లోజ్ పోర్ట్రెయిట్", "wrist_hand_display": "మణికట్టు & చేతి భంగిమ", "anklet_step_forward": "అడుగు ముందుకు వేసిన పాయల్ భంగిమ", "bottom_front_stance": "వెడల్పుగా నిలబడిన భంగిమ", "bottom_seated_cross": "కూర్చుని కాళ్ళు కనిపించే షాట్", "bottom_walking_step": "నడుస్తున్న కాళ్ళ ఫోకస్", "enterKeyPlaceholder": "ఇక్కడ ఓపెన్ ఏఐ కీని పేస్ట్ చేయండి (ఉదా: sk-proj-...)", "finger_hand_gesture": "చేతి వేళ్ళు & ఉంగరం క్లోజ్-అప్", "finger_holding_prop": "సున్నితమైన చేతి ఉంగరం భంగిమ", "forehead_side_passa": "సైడ్ ఝుమర్ / పస్సా ప్రొఫైల్", "keyValidationFailed": "చెల్లని కీ (Invalid Key)", "neck_chest_portrait": "ఎద భాగం పోర్ట్రెయిట్", "nose_front_portrait": "ముఖం నేరుగా చూసే ముక్కు పుడక షాట్", "anklet_toering_focus": "మెట్టెలు & పట్టీల క్లోజ్-అప్", "finger_hands_clasped": "రెండు చేతులు కలిపిన ఉంగరాల షాట్", "forehead_3q_headturn": "3/4 తల తిరిగిన అలంకరణ భంగిమ", "forehead_bridal_veil": "పెళ్ళికూతురు ముసుగు హెడ్‌పీస్ యాంగిల్", "top_shoulder_profile": "భుజం & కొల్లార్ ఫోకస్", "forehead_tikka_center": "పాపిడి బిళ్ళ క్లోజ్-అప్", "front_direct_portrait": "నేరుగా నిలువు ముఖచిత్రం", "no_face_seated_outfit": "కూర్చున్న దుస్తుల ఫ్రేమ్", "no_face_toe_ring_step": "కాలి వేళ్ళు, మెట్టెల క్లోజప్", "no_face_top_front_fit": "ఫ్రంట్ ఫిట్ (తల లేకుండా)", "partial_face_lips_mid": "పెదవుల నుండి మధ్యభాగం", "settingsLanguageLabel": "భాషను మార్చుకోండి (Choose Language)", "no_face_arm_wrist_cuff": "చేయి, కఫ్ యాక్సెసరీ వ్యూ", "no_face_chin_lips_nose": "పెదవులు, ముక్కు కింద భాగం", "no_face_full_body_crop": "తల లేకుండా పూర్తి బాడీ క్రాప్", "no_face_hand_lap_drape": "తొడలపై ఉన్న మణికట్టు, చేతులు", "no_face_hip_curve_side": "ప్రక్క నడుము మలుపు వ్యూ (తల లేదు)", "no_face_top_crown_hair": "తల పైభాగం హేర్‌బ్యాండ్ వ్యూ", "no_face_walking_stride": "నడుస్తున్న స్ట్రైడ్ క్రాప్", "standing_three_quarter": "మూడు వంతుల నిలువు భంగిమ", "forehead_front_portrait": "నేరుగా పాపిడి అలంకరణ పోర్ట్రెయిట్", "no_face_anklet_stepping": "కాలి పట్టీ మరియు నడక స్టెప్ (కాళ్ళ వ్యూ)", "no_face_decollete_torso": "ఛాతీ మరియు డెకోలేటే ఫ్రేమ్ (తల లేదు)", "no_face_finger_ring_lap": "తొడపై అమర్చిన ఉంగరాల చేతి వ్యూ", "no_face_top_back_detail": "బ్యాక్ డిజైన్ (తల లేకుండా)", "no_face_top_side_sleeve": "సైడ్ స్లీవ్ డిజైన్", "partial_face_chin_torso": "చిన్ నుండి టోర్సో క్రాప్", "no_face_back_waist_drape": "వీపు కింది భాగం నడుము పట్టీ", "no_face_bottom_side_seam": "సైడ్ సీమ్ ఫిట్ వ్యూ", "no_face_ear_nape_profile": "చెవి, పిలక ప్రక్క ప్రొఫైల్", "no_face_torso_hips_drape": "టోర్సో & హిప్స్ డ్రేప్ ఫ్యాషన్", "no_face_wrist_hand_waist": "నడుముపై చేయి, మణికట్టు ఫ్రేమింగ్", "anklet_floor_cross_legged": "నేలపై క్రాస్-లెగ్డ్ కూర్చున్న భంగిమ", "forehead_mathapatti_frame": "మాతా పట్టీ పూర్తి హెయిర్‌లైన్ షాట్", "no_face_seated_feet_drape": "కూర్చున్న పాదాలు, పట్టీల వ్యూ", "no_face_shoulder_ear_line": "చెవి నుండి భుజం వరకు వ్యూ", "no_face_side_nostril_neck": "ముక్కురంధ్రం, మెడ యాంగిల్", "anklet_floor_legs_extended": "నేలపై కాళ్ళు చాపి కూర్చున్న భంగిమ", "no_face_forearm_cross_body": "పొట్ట వద్ద అడ్డంగా ఉన్న చేతులు", "partial_face_back_shoulder": "వెనుక భుజం కోణం", "partial_face_jawline_macro": "దవడ, చెవి మాక్రో ప్రొఫైల్", "partial_face_top_mid_torso": "మిడ్-టోర్సో టాప్ వ్యూ", "no_face_bottom_waist_to_toe": "నడుము నుండి కాళ్ళ వరకు", "no_face_finger_touching_hip": "నడుముపై వేళ్ళు మరియు ఉంగరం", "no_face_side_neck_ear_macro": "చెవి, ప్రక్క మెడ యాంగిల్ (ముఖం లేదు)", "no_face_top_chest_shoulders": "ఛాతీ & భుజాలు (తల లేకుండా)", "no_face_waist_midriff_front": "నడుము, బొడ్డు భాగం (హెడ్‌లెస్)", "partial_face_cheek_ear_close": "చెంప, చెవి లంబిక మాక్రో", "partial_face_chin_neck_drape": "గడ్డం, మెడ లైన్ క్లోజప్", "partial_face_lips_collarbone": "పెదవులు నుండి ఎముక వరకు మాక్రో", "partial_face_lips_nose_front": "కింది ముఖం, ముక్కు ఫ్రేమింగ్", "partial_face_top_collar_crop": "మెడ మరియు కాలర్‌బోన్ క్రాప్", "partial_skin_navel_hip_drape": "బొడ్డు, నడుము చర్మం క్లోజప్", "anklet_floor_kneeling_mehendi": "నేలపై మోకాళ్ళపై నమస్కార/మెహందీ భంగిమ", "no_face_bottom_seated_trouser": "కూర్చున్న ట్రౌజర్ ఫిట్", "no_face_bottom_walking_stride": "నడుస్తున్న కాలు స్ట్రైడ్", "no_face_neck_collarbone_drape": "గడ్డం కింద నుండి ఛాతీ దాకా ఫ్రేమింగ్", "partial_face_ear_neck_profile": "చెవి లంబిక నుండి మెడ ప్రొఫైల్", "partial_face_neck_side_throat": "ప్రక్క మెడ చర్మం మాక్రో", "partial_face_shoulder_profile": "భుజం ప్రొఫైల్ కోణం", "partial_face_top_side_profile": "సైడ్ ప్రొఫైల్ జా క్రాప్", "partial_skin_ankle_foot_macro": "మడమ, పాదం చర్మం మాక్రో", "partial_skin_wrist_cuff_close": "మణికట్టు, కఫ్ చర్మం క్లోజప్", "no_face_forehead_hairline_only": "నుదురు, పాపిడి వ్యూ (కళ్ళు లేవు)", "partial_face_bottom_hip_stride": "హిప్ స్ట్రైడ్ మోషన్ క్రాప్", "partial_face_bottom_seated_lap": "కూర్చున్న లాప్ ఫ్రేమింగ్", "partial_face_hairline_ear_crop": "జుట్టు పక్కన చెవి ఫ్రేమింగ్", "partial_face_jawline_decollete": "దవడ, ఛాతీ పైభాగ ప్రొఫైల్", "partial_face_nose_lips_profile": "ముక్కు, పెదవుల ప్రొఫైల్", "partial_face_top_jawline_chest": "దవడ నుండి ఛాతీ ఫ్రేమింగ్", "partial_skin_chest_lapel_macro": "ఛాతీ, ఎముక చర్మం మాక్రో", "partial_skin_hand_resting_skin": "చర్మంపై చేయి ప్రొఫైల్", "partial_skin_toes_instep_close": "కాలి వేళ్ళు, పాదం క్లోజప్", "partial_skin_wrist_pulse_macro": "చేతి మణికట్టు చర్మం మాక్రో", "no_face_interlocked_hands_chest": "ఛాతీపై మడిచిన చేతులు, వేళ్ళు", "no_face_throat_collarbone_macro": "మెడ, కాలర్‌బోన్ సెంటర్డ్ వ్యూ", "partial_face_bottom_waist_chest": "ఛాతీ నుండి మోకాలి ఫ్రేమింగ్", "partial_skin_hand_wrist_profile": "అరచేతి వెనుక ప్రొఫైల్", "no_face_chest_shoulder_accessory": "ఛాతీ, భుజాల యాక్సెసరీ వ్యూ", "partial_face_bottom_side_profile": "సైడ్ లోయర్ బాడీ ప్రొఫైల్", "partial_face_forehead_brows_crop": "నుదురు, కనుబొమ్మల ఫ్రేమింగ్", "partial_face_nostril_cheek_macro": "ముక్కురంధ్రం, చెంప మాక్రో", "partial_skin_forearm_wrist_drape": "మొచేయి, మణికట్టు క్లోజప్", "partial_skin_heel_anklet_profile": "మడమ, పట్టీ ప్రొఫైల్", "partial_skin_interlocked_fingers": "వేళ్ళ క్లోజప్ ఫ్రేమింగ్", "partial_skin_lower_waist_profile": "కింది నడుము చర్మం ప్రొఫైల్", "partial_skin_finger_knuckle_macro": "వేలి కణుపు, ఉంగరం మాక్రో", "partial_face_hairline_temple_macro": "పాపిడి, కణత ప్రొఫైల్", "partial_face_upper_bridge_forehead": "నుదురు పైభాగం మాక్రో", "partial_skin_waist_hip_curve_macro": "నడుము మలుపు చర్మం మాక్రో"}	Complete Telugu translation dictionary for all UI buttons, titles, errors, and labels	\N	2026-10-04 18:32:25.242238+00
landing_quotes	general	[{"en": {"text": "“You pick and craft wonderful products with care. We make sure they look like top showroom shoots so customers fall in love at first glance!”", "author": "Supporting Home Sellers & Resellers"}, "id": "quote-1", "te": {"text": "“మీరు ఎంతో ఇష్టపడి తెచ్చిన వస్తువులు సాధారణ ఫోటోలతో వెలవెలబోకూడదు. కస్టమర్లు చూడగానే 'వావ్ చాలా బాగుంది' అని మెచ్చేలా చేద్దాం!”", "author": "హోమ్ బిజినెస్ మిత్రులకు ఎల్లప్పుడూ తోడుగా"}}, {"en": {"text": "“You don't need lakhs in the bank or costly studio lights. Your hard work deserves to shine just like big fashion brands.”", "author": "For Local Boutiques & Crafters"}, "id": "quote-2", "te": {"text": "“స్టూడియోలకు వేలకు వేలు ఖర్చు పెట్టే పనేలేదు. మీ కష్టానికి తగ్గ అందమైన మోడల్ లుక్ ఇప్పుడు మీ చేతిలోని ఫోన్ లోనే!”", "author": "స్థానిక బోటిక్‌లు & షాపుల కోసం"}}, {"en": {"text": "“No more hesitation before sharing photos on WhatsApp or Instagram. Post with total pride, get instant trust, and close orders fast!”", "author": "More Trust • Happy Customers • Instant Orders"}, "id": "quote-3", "te": {"text": "“వాట్సాప్ స్టేటస్ లేదా ఇన్‌స్టాలో గర్వంగా పోస్ట్ చేయండి. ఫోటో చూసి కస్టమర్లు వెంటనే నమ్మకంతో ఆర్డర్ పెట్టేస్తారు.”", "author": "కస్టమర్ల నమ్మకం & వేగవంతమైన ఆర్డర్లు"}}]	Inspiring home business and seller quotes displayed in landing page QuoteSlider	\N	2026-10-04 18:32:25.34305+00
hero_slides	general	[{"id": "slide-dress", "image": "/showcase/tryons/3.png", "tagEn": "Professional Fashion Lighting", "tagTe": "ప్రొఫెషనల్ ఫ్యాషన్ లైటింగ్", "titleEn": "Designer Dress & Fashion Studio Shoot", "titleTe": "డిజైనర్ డ్రెస్ & ఫ్యాషన్ స్టూడియో షూట్", "fallback": "/showcase/hero-dress-fallback.jpg", "highlightEn": "Authentic Indian Model • 100% Studio Clarity", "highlightTe": "భారతీయ మోడల్ • పర్ఫెక్ట్ స్టూడియో క్వాలిటీ"}, {"id": "slide-watch", "image": "/showcase/tryons/10.png", "tagEn": "Luxury Product Lighting", "tagTe": "లగ్జరీ ప్రొడక్ట్ లైటింగ్", "titleEn": "Luxury Watch & Premium Product Shoot", "titleTe": "లగ్జరీ వాచ్ & ప్రీమియం ప్రొడక్ట్ షూట్", "fallback": "/showcase/hero-watch-fallback.jpg", "highlightEn": "Premium Details • Instant Catalog Ready", "highlightTe": "ప్రీమియం డిటైల్స్ • క్యాటలాగ్ రెడీ"}, {"id": "slide-saree", "image": "/showcase/tryons/3.png", "tagEn": "Heritage Studio Lighting", "tagTe": "హెరిటేజ్ స్టూడియో లైటింగ్", "titleEn": "Royal Kanjeevaram Silk Saree Shoot", "titleTe": "రాయల్ కాంచీపురం పట్టుచీరల స్టూడియో షూట్", "fallback": "/showcase/hero-saree-fallback.jpg", "highlightEn": "Authentic Indian Model • 100% Studio Clarity", "highlightTe": "భారతీయ మోడల్ • పర్ఫెక్ట్ స్టూడియో క్వాలిటీ"}]	Hero showcase carousel slides for landing page promotion	\N	2026-10-04 18:32:24.719395+00
face_matching_rules	fidelity	{"face_fidelity_instruction": "The reference image of the human model (second uploaded image) is for 100% FACE IDENTITY REPLICATION. Maintain identical facial structure, eyes, nose, lips, jawline, skin tone, and ethnic identity from the face reference image with zero morphing or substitution.", "allowed_presentation_modes": ["model", "partial_face"], "face_visibility_ui_title_en": "Select Human Model Face", "face_visibility_ui_title_te": "మానవ మోడల్ ముఖాన్ని ఎంచుకోండి", "enforce_100_percent_fidelity": true, "prohibited_presentation_modes": ["no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow", "bust", "body_part"]}	Face reference UI visibility rules and 100% face identity replication guardrails	\N	2026-10-04 18:32:24.37094+00
landing_showcase	general	{"tabs": [{"id": "saree", "label": {"en": "Saree", "te": "చీరలు"}, "thumb": "/items/saree.jpg"}, {"id": "dress", "label": {"en": "Dress", "te": "డ్రెస్"}, "thumb": "/items/gown.jpg"}, {"id": "shirt", "label": {"en": "Shirt", "te": "షర్ట్"}, "thumb": "/items/shirt.jpg"}, {"id": "watch", "label": {"en": "Watch", "te": "వాచ్"}, "thumb": "/items/watch.jpg"}, {"id": "earrings", "label": {"en": "Earrings", "te": "చెవి కమ్మలు"}, "thumb": "/items/earrings.jpg"}, {"id": "bangle", "label": {"en": "Bangle", "te": "గాజులు"}, "thumb": "/items/bangles.jpg"}, {"id": "jeans", "label": {"en": "Jeans", "te": "జీన్స్"}, "thumb": "/items/jeans.jpg"}, {"id": "trouser", "label": {"en": "Trouser", "te": "ట్రౌజర్"}, "thumb": "/items/suit.jpg"}, {"id": "necklace", "label": {"en": "Necklace", "te": "నెక్లెస్"}, "thumb": "/items/necklace.jpg"}, {"id": "chain", "label": {"en": "Chain", "te": "చైన్"}, "thumb": "/items/chain.jpg"}], "categories": ["saree", "dress", "shirt", "watch", "earrings", "bangle", "jeans", "trouser", "necklace", "chain"]}	Showcase tabs and catalog comparisons for home and landing page	\N	2026-10-04 18:32:25.430743+00
fidelity_directives	fidelity	{"highest_priority_rule": "EXACT REPLICATION OF INPUT PRODUCT DESIGN, FABRIC/MATERIAL, PATTERNS, LENGTH, AND SIZE REQUIRED", "mandatory_replications": ["Automatic detection and 1:1 application of the uploaded product's exact fabric, material, and surface luster", "Exact product design, artwork, motifs, prints, embroidery, and weave patterns replicated 1:1 in scale and position", "Exact garment length and cut (full length, knee-length, cropped, floor drape)", "Exact collar, neckline, and sleeve structure", "Buttons, zippers, pockets, and hardware in exact counts and positions"], "highest_priority_face_rule": "100% IDENTICAL HUMAN FACE IDENTITY REPLICATION REQUIRED - EXACT SAME PERSON PRESERVED", "mandatory_face_replications": ["Exact 1:1 reproduction of the reference human model face with 100% photographic fidelity", "Preserve identical bone structure, eye contour, iris color, nose profile, lip anatomy, jawline, skin tone, and facial landmarks", "Strictly zero facial morphing, zero generic AI face substitution, zero ethnic drift, and zero age shifting", "Seamless natural blend of the exact same person onto the generated body pose and outfit"], "face_replication_fidelity_score": 1}	Master AI product and face replication guardrails injected into all generated image prompts	\N	2026-10-04 18:32:24.279798+00
\.


--
-- Data for Name: usage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usage (id, user_id, workspace, item_type, credits_deducted, prompt, status, error_message, latency_ms, metadata, created_at, gender_target) FROM stdin;
14061b69-a1d7-4335-a68f-9ca3631f1d13	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	jewelry	necklace	1	{\n  "category": "jewelry",\n  "export_specifications": {\n    "canvas_aspect_ratio": "3:4",\n    "composition_orientation": "Portrait Vertical",\n    "export_resolution_tier": "1k",\n    "framing_and_cropping_guide": "Framed for vertical portrait ratio. Maintain elegant vertical alignment from shoulder/head to lower hem line or macro pose."\n  },\n  "product_info": {\n    "item_type": "Neckwear",\n    "type": "necklace",\n    "detailed_jewelry_description": "a breathtaking royal gold choker necklace with emeralds and pearls, elaborate traditional Indian jewelry masterwork",\n    "item_placement_and_fit": "The neckwear rests elegantly around the base of the neck or collarbone. It drapes symmetrically over the chest or skin with natural gravitational hang, reflecting light beautifully on the metal links and gemstones on the model's collarbone in the studio scene. The model wears ONLY this uploaded neckwear and strictly NO other jewelry, earrings, nose rings, bangles, or headpieces."\n  },\n  "presentation_setup": {\n    "mode": "model",\n    "visual_presentation_style": "an editorial fashion studio portrait of a regal African female model with glowing melanin skin, intense expressive eyes, elegant posture, soft key lighting, minimal grey backdrop, in a high chest beauty portrait framing neckwear over collarbone and upper chest (face fully shown or lower face framed cleanly above necklace)",\n    "model_details": {\n      "gender": "female",\n      "pose_type": "neck_chest_portrait",\n      "pose_details": "in a high chest beauty portrait framing neckwear over collarbone and upper chest (face fully shown or lower face framed cleanly above necklace)",\n      "camera_framing_and_angle": "High chest beauty portrait framing neckwear over collarbone and upper chest (face fully shown or lower face framed cleanly above necklace)",\n      "face_visibility_directive": "FULL FACE SHOWN: Human model face is fully visible in frame with complete facial features, clear expression, and full head framing according to selected pose perspective.",\n      "face_description": "an editorial fashion studio portrait of a regal African female model with glowing melanin skin, intense expressive eyes, elegant posture, soft key lighting, minimal grey backdrop",\n      "default_gender_look": "worn gracefully by a beautiful young Indian woman with a warm, confident commercial expression, with elegant hair bun, highlighting the fine details of the jewelry, warm classic lighting",\n      "face_reference_purpose_note": "Reference image of human model is for face reference purpose only. Same face identity preserved, but head rotation, body pose, camera angle, and expression are altered according to item type and selected Model Pose / Camera Angle. The model face can be fully shown or partially shown (e.g. cropped at lower face/chin, side profile, or lower body focus) according to the chosen Model Pose / Camera Angle."\n    }\n  },\n  "scene_environment": {\n    "background_style": "studio",\n    "background_description": "under crisp professional macro jewelry studio lighting, high contrast reflections, flawless metallic sparkle, magazine commercial shot",\n    "background_color_hex": null,\n    "background_color_name": null,\n    "lighting": "crisp professional macro jewelry studio lighting, high contrast reflections, flawless metallic sparkle, luxury dark marble highlights"\n  },\n  "artistic_style": {\n    "theme": "Commercial campaign and advertising jewelry photography",\n    "photography_style": "campaign",\n    "style_attributes": "Clean high-contrast promotional campaign lighting, commercial catalog focus, bold showcase of metal luster and gem brilliance, pristine studio look",\n    "quality_level": "authentic high-jewelry studio photography, intricate sparkling reflections, razor-sharp focus on gemstones, flawless polished metal texture, shot on Hasselblad H6D-100c medium format camera, high-end macro lens, razor-sharp depth of field, natural metal and gemstone lustre, authentic fine details, high-end editorial spread, crisp color-accurate, no artificial CGI glow, no plastic texture, international modeling agency comp card quality, shot on professional full-frame camera, 85mm f/1.4 lens, tack-sharp focus, crisp micro-detail on skin and fabric texture, color-accurate, magazine cover quality, no motion blur, no noise, no artifacts"\n  },\n  "fidelity_directives": {\n    "highest_priority_rule": "EXACT REPLICATION OF INPUT PRODUCT DESIGN, MATERIAL, PATTERNS, LENGTH, AND SIZE REQUIRED",\n    "auto_detect_material_and_metal_properties": "AUTOMATIC MATERIAL & METAL DETECTION: Automatically analyze and detect the material, metal type, surface finish, and gemstone properties of the uploaded product reference image (such as 22K/18K yellow gold, rose gold, antique matte gold, oxidized silver, sterling silver, platinum, rhodium, Kundan, Meenakari enamel, diamonds, pearls, rubies, emeralds, or glass beads), including its metallic luster, surface texture, opacity, and gemstone brilliance, and apply the exact same material properties to the generated output product.",\n    "single_item_isolation_rule": "STRICTLY NO OTHER JEWELRY ITEMS GENERATED EXCEPT UPLOADED INPUT ITEM",\n    "jewelry_open_closed_loop_rule": "Observe the jewelry first and determine whether it is closed or intentionally open. Keep the original design: do not close an open jewelry loop or open a closed one",\n    "single_item_instruction": "CRITICAL SINGLE ITEM DIRECTIVE: The final generated image MUST ONLY feature the exact uploaded input jewelry item (Neckwear / necklace). DO NOT generate, add, or synthesize ANY other jewelry items, ornaments, or accessories that were NOT present in the input reference image. For example, if the user uploaded a necklace, DO NOT add unrequested earrings, nose rings, bangles, rings, or maang tikka to the model or display; if the user uploaded earrings, DO NOT add an unrequested necklace or head ornaments; if the user uploaded a ring, DO NOT add unrequested bracelets or necklaces. The model's skin, ears, neck, wrists, fingers, nose, forehead, hair, and clothing must remain COMPLETELY BARE and devoid of any secondary or unuploaded jewelry.",\n    "core_instruction": "The final AI-generated image must EXACTLY REPLICATE and reproduce the input product (jewelry) shown in the reference image. Automatically detect and analyze the item's exact material, metal composition, polish, and gemstone properties, applying the same material characteristics to the generated output. The design, gemstone settings, intricate patterns, chain length, piece dimensions, physical size, and craftsmanship features must be 100% faithful and identical to the uploaded item. Do not generate a creative, inspired, redesigned, modified, or re-proportioned version of the product.",\n    "input_image_guideline": "The input image is the authentic reference of the jewelry product. Automatically detect and replicate its exact material/metal properties, design, pattern details, chain/necklace length, gemstone sizes, and overall dimensions precisely.",\n    "mandatory_replications": [\n      "Automatic detection and 1:1 application of the uploaded product's exact material/metal/gemstone properties (metal type, polish, surface texture, finish, metallic luster, gemstone brilliance, and transparency)",\n      "Observe the jewelry first and determine whether it is closed or intentionally open. Keep the original design: do not close an open jewelry loop or open a closed one",\n      "Strict 1:1 single-item focus: generate ONLY the uploaded input jewelry item (or exact pair if uploaded as a pair of earrings/bangles). Absolutely NO additional or unrequested jewelry items (no extra necklaces, earrings, rings, nose pins, waist chains, or headpieces) on the model or display stand",\n      "Exact product design, motif work, filigree, engraving, and intricate metal/stone patterns replicated 1:1",\n      "Exact length, drop length, thickness, and dimensions of the jewelry piece (e.g., choker vs long haram necklace, drop earring length)",\n      "Exact gemstone, diamond, and pearl size, count, cut, arrangement, color, and setting style",\n      "Exact metal type, color, finish (matte, high-polish, antique gold, rhodium, platinum) and reflective shine",\n      "Exact chain link pattern, clasp, hooks, hanging pearls, beads, or charm drops",\n      "Exact scale, proportions, thickness, and physical size relative to the body or display bust",\n      "Facets, light reflection, luster, and authentic raw material craftsmanship details"\n    ]\n  },\n  "exclusion_directives": {\n    "highest_priority_exclusion_rule": "STRICTLY NO PRICE TAGS, HANGTAGS, BRAND TAGS, COMPANY LOGOS, OR TEXT OVERLAYS",\n    "strict_no_extra_jewelry_rule": "STRICTLY PROHIBIT GENERATING UNREQUESTED SECONDARY JEWELRY",\n    "strict_no_extra_jewelry_instruction": "DO NOT add any extra jewelry pieces, accessories, or complementary ornaments. Only render the single uploaded product (or pair). The model's skin, ears, neck, wrists, fingers, nose, forehead, hair, and clothing must remain completely bare and free of any other unrequested jewelry or accessories.",\n    "instruction": "The output image must be a clean, pristine studio jewelry photograph completely FREE of price tags, store price stickers, barcode tags, paper hangtags, security tags, brand labels, company logos, store tags, watermarks, text labels, sale badges, or graphic overlays anywhere on the jewelry, display mount, or background. If the input reference image has any visible price tag, hanging paper tag, barcode sticker, or brand label attached to the product, digitally remove and omit it entirely, rendering the item clean and pristine."\n  },\n  "model_expression_directive": {\n    "highest_priority_expression_rule": "COMMERCIAL CAMPAIGN CONFIDENT EXPRESSION",\n    "instruction": "The model must have a warm, confident, approachable commercial expression suitable for advertising campaigns — a soft smile or gentle closed-mouth smile, poised and polished, like an international modeling agency campaign face. Avoid overly serious, cold, or moody editorial expressions."\n  },\n  "face_matching_directive": {\n    "highest_priority_rule": "HUMAN FACE IDENTITY REFERENCE ONLY - DYNAMIC POSE, ANGLE & HEAD ROTATION ALLOWED",\n    "instruction": "CRITICAL FACE REFERENCE DIRECTIVE: The reference image of the human model (second uploaded image) is for FACE IDENTITY REFERENCE PURPOSE ONLY. You MUST maintain the exact same face identity, facial features, facial structure, skin tone, eye shape, nose shape, hairstyle, and ethnic identity from the face reference image. However, the human head rotation, head turn angle, body pose, camera perspective, and expression CAN and SHOULD be altered/adapted dynamically according to the item type, framing, and selected Model Pose / Camera Angle."\n  }\n}	success	\N	19363	{"model": "gpt_image_2_5_sunburst", "quality": "low", "photoStyle": "campaign", "resolution": "1k", "aspectRatio": "3:4"}	2026-09-11 16:52:28.495303+00	\N
46216961-f762-44db-991c-54812925b1e6	570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	jewelry	necklace	1	{\n  "category": "jewelry",\n  "export_specifications": {\n    "canvas_aspect_ratio": "3:4",\n    "composition_orientation": "Portrait Vertical",\n    "export_resolution_tier": "1k",\n    "framing_and_cropping_guide": "Framed for vertical portrait ratio. Maintain elegant vertical alignment from shoulder/head to lower hem line or macro pose."\n  },\n  "product_info": {\n    "item_type": "Neckwear",\n    "type": "necklace",\n    "detailed_jewelry_description": "a breathtaking royal gold choker necklace with emeralds and pearls, elaborate traditional Indian jewelry masterwork",\n    "item_placement_and_fit": "The neckwear rests elegantly around the base of the neck or collarbone. It drapes symmetrically over the chest or skin with natural gravitational hang, reflecting light beautifully on the metal links and gemstones on the model's collarbone in the plain scene. The model wears ONLY this uploaded neckwear and strictly NO other jewelry, earrings, nose rings, bangles, or headpieces."\n  },\n  "presentation_setup": {\n    "mode": "model",\n    "visual_presentation_style": "an ultra-high-resolution close-up high-fashion editorial studio portrait of a striking Indian female model with intense gaze, razor-sharp jawline, glowing flawless skin, elegant facial symmetry, soft studio rim light, minimalist grey backdrop, in a high chest beauty portrait framing neckwear over collarbone and upper chest (face fully shown or lower face framed cleanly above necklace)",\n    "model_details": {\n      "gender": "female",\n      "pose_type": "neck_chest_portrait",\n      "pose_details": "in a high chest beauty portrait framing neckwear over collarbone and upper chest (face fully shown or lower face framed cleanly above necklace)",\n      "camera_framing_and_angle": "High chest beauty portrait framing neckwear over collarbone and upper chest (face fully shown or lower face framed cleanly above necklace)",\n      "face_visibility_directive": "FULL FACE SHOWN: Human model face is fully visible in frame with complete facial features, clear expression, and full head framing according to selected pose perspective.",\n      "face_description": "an ultra-high-resolution close-up high-fashion editorial studio portrait of a striking Indian female model with intense gaze, razor-sharp jawline, glowing flawless skin, elegant facial symmetry, soft studio rim light, minimalist grey backdrop",\n      "default_gender_look": "worn gracefully by a beautiful young Indian woman with a neutral high-fashion expression, never smiling, with elegant hair bun, highlighting the fine details of the jewelry, warm classic lighting",\n      "face_reference_purpose_note": "Reference image of human model is for face reference purpose only. Same face identity preserved, but head rotation, body pose, camera angle, and expression are altered according to item type and selected Model Pose / Camera Angle. The model face can be fully shown or partially shown (e.g. cropped at lower face/chin, side profile, or lower body focus) according to the chosen Model Pose / Camera Angle."\n    }\n  },\n  "scene_environment": {\n    "background_style": "plain",\n    "background_description": "against a solid minimalist clean plain background of royal gold with professional jewelry soft drop shadow",\n    "background_color_hex": "#f0dfbd",\n    "background_color_name": "royal gold",\n    "lighting": "crisp professional macro jewelry studio lighting, high contrast reflections, flawless metallic sparkle, luxury dark marble highlights"\n  },\n  "artistic_style": {\n    "theme": "Editorial macro jewelry photography",\n    "photography_style": "editorial",\n    "style_attributes": "Creative storytelling layout, artistic high-fashion model/bust interactions, dramatic close-up focal plays, luxurious vogue editorial framing",\n    "quality_level": "authentic high-jewelry studio photography, intricate sparkling reflections, razor-sharp focus on gemstones, flawless polished metal texture, shot on Hasselblad H6D-100c medium format camera, high-end macro lens, razor-sharp depth of field, natural metal and gemstone lustre, authentic fine details, high-end editorial spread, crisp color-accurate, no artificial CGI glow, no plastic texture, international modeling agency comp card quality, shot on professional full-frame camera, 85mm f/1.4 lens, tack-sharp focus, crisp micro-detail on skin and fabric texture, color-accurate, magazine cover quality, no motion blur, no noise, no artifacts"\n  },\n  "fidelity_directives": {\n    "highest_priority_rule": "EXACT REPLICATION OF INPUT PRODUCT DESIGN, MATERIAL, PATTERNS, LENGTH, AND SIZE REQUIRED",\n    "auto_detect_material_and_metal_properties": "AUTOMATIC MATERIAL & METAL DETECTION: Automatically analyze and detect the material, metal type, surface finish, and gemstone properties of the uploaded product reference image (such as 22K/18K yellow gold, rose gold, antique matte gold, oxidized silver, sterling silver, platinum, rhodium, Kundan, Meenakari enamel, diamonds, pearls, rubies, emeralds, or glass beads), including its metallic luster, surface texture, opacity, and gemstone brilliance, and apply the exact same material properties to the generated output product.",\n    "single_item_isolation_rule": "STRICTLY NO OTHER JEWELRY ITEMS GENERATED EXCEPT UPLOADED INPUT ITEM",\n    "jewelry_open_closed_loop_rule": "Observe the jewelry first and determine whether it is closed or intentionally open. Keep the original design: do not close an open jewelry loop or open a closed one",\n    "single_item_instruction": "CRITICAL SINGLE ITEM DIRECTIVE: The final generated image MUST ONLY feature the exact uploaded input jewelry item (Neckwear / necklace). DO NOT generate, add, or synthesize ANY other jewelry items, ornaments, or accessories that were NOT present in the input reference image. For example, if the user uploaded a necklace, DO NOT add unrequested earrings, nose rings, bangles, rings, or maang tikka to the model or display; if the user uploaded earrings, DO NOT add an unrequested necklace or head ornaments; if the user uploaded a ring, DO NOT add unrequested bracelets or necklaces. The model's skin, ears, neck, wrists, fingers, nose, forehead, hair, and clothing must remain COMPLETELY BARE and devoid of any secondary or unuploaded jewelry.",\n    "core_instruction": "The final AI-generated image must EXACTLY REPLICATE and reproduce the input product (jewelry) shown in the reference image. Automatically detect and analyze the item's exact material, metal composition, polish, and gemstone properties, applying the same material characteristics to the generated output. The design, gemstone settings, intricate patterns, chain length, piece dimensions, physical size, and craftsmanship features must be 100% faithful and identical to the uploaded item. Do not generate a creative, inspired, redesigned, modified, or re-proportioned version of the product.",\n    "input_image_guideline": "The input image is the authentic reference of the jewelry product. Automatically detect and replicate its exact material/metal properties, design, pattern details, chain/necklace length, gemstone sizes, and overall dimensions precisely.",\n    "mandatory_replications": [\n      "Automatic detection and 1:1 application of the uploaded product's exact material/metal/gemstone properties (metal type, polish, surface texture, finish, metallic luster, gemstone brilliance, and transparency)",\n      "Observe the jewelry first and determine whether it is closed or intentionally open. Keep the original design: do not close an open jewelry loop or open a closed one",\n      "Strict 1:1 single-item focus: generate ONLY the uploaded input jewelry item (or exact pair if uploaded as a pair of earrings/bangles). Absolutely NO additional or unrequested jewelry items (no extra necklaces, earrings, rings, nose pins, waist chains, or headpieces) on the model or display stand",\n      "Exact product design, motif work, filigree, engraving, and intricate metal/stone patterns replicated 1:1",\n      "Exact length, drop length, thickness, and dimensions of the jewelry piece (e.g., choker vs long haram necklace, drop earring length)",\n      "Exact gemstone, diamond, and pearl size, count, cut, arrangement, color, and setting style",\n      "Exact metal type, color, finish (matte, high-polish, antique gold, rhodium, platinum) and reflective shine",\n      "Exact chain link pattern, clasp, hooks, hanging pearls, beads, or charm drops",\n      "Exact scale, proportions, thickness, and physical size relative to the body or display bust",\n      "Facets, light reflection, luster, and authentic raw material craftsmanship details"\n    ]\n  },\n  "exclusion_directives": {\n    "highest_priority_exclusion_rule": "STRICTLY NO PRICE TAGS, HANGTAGS, BRAND TAGS, COMPANY LOGOS, OR TEXT OVERLAYS",\n    "strict_no_extra_jewelry_rule": "STRICTLY PROHIBIT GENERATING UNREQUESTED SECONDARY JEWELRY",\n    "strict_no_extra_jewelry_instruction": "DO NOT add any extra jewelry pieces, accessories, or complementary ornaments. Only render the single uploaded product (or pair). The model's skin, ears, neck, wrists, fingers, nose, forehead, hair, and clothing must remain completely bare and free of any other unrequested jewelry or accessories.",\n    "instruction": "The output image must be a clean, pristine studio jewelry photograph completely FREE of price tags, store price stickers, barcode tags, paper hangtags, security tags, brand labels, company logos, store tags, watermarks, text labels, sale badges, or graphic overlays anywhere on the jewelry, display mount, or background. If the input reference image has any visible price tag, hanging paper tag, barcode sticker, or brand label attached to the product, digitally remove and omit it entirely, rendering the item clean and pristine."\n  },\n  "model_expression_directive": {\n    "highest_priority_expression_rule": "HIGH-FASHION EDITORIAL NEUTRAL EXPRESSION",\n    "instruction": "The model must have a neutral, serious, high-fashion editorial expression. Never smiling. Calm, poised, intense gaze, like international runway/editorial models."\n  },\n  "face_matching_directive": {\n    "highest_priority_rule": "HUMAN FACE IDENTITY REFERENCE ONLY - DYNAMIC POSE, ANGLE & HEAD ROTATION ALLOWED",\n    "instruction": "CRITICAL FACE REFERENCE DIRECTIVE: The reference image of the human model (second uploaded image) is for FACE IDENTITY REFERENCE PURPOSE ONLY. You MUST maintain the exact same face identity, facial features, facial structure, skin tone, eye shape, nose shape, hairstyle, and ethnic identity from the face reference image. However, the human head rotation, head turn angle, body pose, camera perspective, and expression CAN and SHOULD be altered/adapted dynamically according to the item type, framing, and selected Model Pose / Camera Angle."\n  }\n}	success	\N	18192	{"model": "gpt_image_2_5_sunburst", "quality": "low", "photoStyle": "editorial", "resolution": "1k", "aspectRatio": "3:4"}	2026-09-11 19:00:26.329927+00	\N
00000000-0000-0000-0000-000000000010	00000000-0000-0000-0000-000000000002	garment	saree	1	Royal Kanjeevaram Silk Saree on Indian studio model with warm lighting	success	\N	1240	{"lighting": "Heritage Studio", "photoStyle": "editorial", "resolution": "2048x2048"}	2026-09-17 18:00:12.326147+00	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, phone, avatar_url, role, wallet_balance, is_active, created_at, updated_at, gender) FROM stdin;
00000000-0000-0000-0000-000000000002	+919999999999	\N	user	50	t	2026-09-18 18:00:12.326147+00	2026-09-18 18:00:12.326147+00	\N
00000000-0000-0000-0000-000000000001	+919876543210	\N	admin	1000	t	2026-09-18 18:00:12.326147+00	2026-10-03 19:01:59.624374+00	\N
570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1	+919059108434	\N	admin	1000	t	2026-09-11 05:59:47.743397+00	2026-10-04 18:32:05.622205+00	all
\.


--
-- Data for Name: wear_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wear_types (id, workspace, code, name_en, name_te, description, icon, display_order, is_active, metadata, created_at, updated_at) FROM stdin;
top_wear	garment	top_wear	Top Wear	పై దుస్తులు	Shirts, T-shirts, Kurtis, Blouses, Tops, Hoodies, Blazers	Shirt	1	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.118+00
bottom_wear	garment	bottom_wear	Bottom Wear	కింది దుస్తులు	Jeans, Trousers, Skirts, Pants, Trackpants	Scissors	2	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.208+00
full_wear	garment	full_wear	Full Wear	పూర్తి దుస్తులు	Dresses, Sarees, Suits, Jumpsuits, Gowns, Sherwanis, Dhotis	Sparkles	3	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.295+00
neck_wear	jewelry	neck_wear	Neck Wear	నెక్ వేర్	Necklaces, Chokers, Chains, Pendants, Mangalsutras	Gem	4	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.38+00
ear_wear	jewelry	ear_wear	Ear Wear	ఇయర్ వేర్	Earrings, Jhumkas, Studs, Drops, Hoops	Sparkle	5	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.464+00
wrist_wear	jewelry	wrist_wear	Wrist Wear	రిస్ట్ వేర్	Bangles, Bracelets, Kadas, Watches	Watch	6	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.548+00
hip_wear	jewelry	hip_wear	Hip Wear	హిప్ వేర్	Vaddanams, Waistbands, Kamarbands, Hip Chains	Shield	7	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.632+00
nose_wear	jewelry	nose_wear	Nose Wear	ముక్కుపుడక	Nose pins, Naths, Bridal Nose Rings	CircleDot	8	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.724+00
leg_wear	jewelry	leg_wear	Leg Wear	లెగ్ వేర్	Anklets, Payals, Toe rings	Footprints	9	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.809+00
forehead_wear	jewelry	forehead_wear	Forehead Wear	నుదురు ఆభరణాలు	Maang tikkas, Mathapattis, Borlas	Crown	10	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.893+00
other_wear	jewelry	other_wear	Other Wear	ఇతర ఆభరణాలు	Brooches, Rings, Accessories	Award	11	t	{}	2026-10-04 05:54:30.577557+00	2026-10-04 18:32:04.978+00
\.


--
-- Data for Name: workspaces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.workspaces (id, code, name_en, name_te, description, icon, display_order, is_active, metadata, created_at, updated_at) FROM stdin;
garment	garment	Garment Studio	దుస్తుల స్టూడియో	Apparel, sarees, lehengas, and westernwear photoshoot studio	Shirt	1	t	{}	2026-10-04 05:23:13.928376+00	2026-10-04 18:32:03.688+00
jewelry	jewelry	Jewelry Studio	నగల స్టూడియో	Precious jewelry, necklaces, earrings, and watches product studio	Gem	2	t	{}	2026-10-04 05:23:13.928376+00	2026-10-04 18:32:03.772+00
general	general	General Studio	సాధారణ స్టూడియో	General multipurpose photoshoot studio	Sparkles	3	t	{}	2026-10-04 05:23:13.928376+00	2026-10-04 18:32:03.858+00
all	all	All Workspaces	అన్ని స్టూడియోలు	Universal assets and presets applicable to both garment and jewelry	Globe	4	t	{}	2026-10-04 05:23:13.928376+00	2026-10-04 18:32:03.943+00
face	face	Face & Model Studio	మోడల్ ఫేస్ స్టూడియో	Model face generator and custom headshot workspace	ScanFace	5	t	{}	2026-10-04 05:23:13.928376+00	2026-10-04 18:32:04.032+00
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 3, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: backgrounds backgrounds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backgrounds
    ADD CONSTRAINT backgrounds_pkey PRIMARY KEY (id);


--
-- Name: business_categories business_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_categories
    ADD CONSTRAINT business_categories_pkey PRIMARY KEY (id);


--
-- Name: catalog_items catalog_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT catalog_items_pkey PRIMARY KEY (id);


--
-- Name: faces faces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faces
    ADD CONSTRAINT faces_pkey PRIMARY KEY (id);


--
-- Name: genders genders_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genders
    ADD CONSTRAINT genders_code_key UNIQUE (code);


--
-- Name: genders genders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.genders
    ADD CONSTRAINT genders_pkey PRIMARY KEY (id);


--
-- Name: otps otps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otps
    ADD CONSTRAINT otps_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payments payments_razorpay_order_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_razorpay_order_id_unique UNIQUE (razorpay_order_id);


--
-- Name: catalog_item_backgrounds pk_catalog_item_backgrounds; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_item_backgrounds
    ADD CONSTRAINT pk_catalog_item_backgrounds PRIMARY KEY (catalog_item_id, background_id);


--
-- Name: catalog_item_poses pk_catalog_item_poses; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_item_poses
    ADD CONSTRAINT pk_catalog_item_poses PRIMARY KEY (catalog_item_id, pose_id);


--
-- Name: catalog_item_presentations pk_catalog_item_presentations; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_item_presentations
    ADD CONSTRAINT pk_catalog_item_presentations PRIMARY KEY (catalog_item_id, presentation_id);


--
-- Name: poses poses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poses
    ADD CONSTRAINT poses_pkey PRIMARY KEY (id);


--
-- Name: presentations presentations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.presentations
    ADD CONSTRAINT presentations_pkey PRIMARY KEY (id);


--
-- Name: system_lookups system_lookups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_lookups
    ADD CONSTRAINT system_lookups_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (key);


--
-- Name: business_categories uq_business_categories_id_workspace; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_categories
    ADD CONSTRAINT uq_business_categories_id_workspace UNIQUE (id, workspace);


--
-- Name: wear_types uq_wear_types_id_workspace; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wear_types
    ADD CONSTRAINT uq_wear_types_id_workspace UNIQUE (id, workspace);


--
-- Name: usage usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage
    ADD CONSTRAINT usage_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_unique UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wear_types wear_types_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wear_types
    ADD CONSTRAINT wear_types_code_key UNIQUE (code);


--
-- Name: wear_types wear_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wear_types
    ADD CONSTRAINT wear_types_pkey PRIMARY KEY (id);


--
-- Name: workspaces workspaces_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_code_key UNIQUE (code);


--
-- Name: workspaces workspaces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workspaces
    ADD CONSTRAINT workspaces_pkey PRIMARY KEY (id);


--
-- Name: backgrounds_gender_target_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backgrounds_gender_target_idx ON public.backgrounds USING btree (gender_target);


--
-- Name: backgrounds_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backgrounds_is_active_idx ON public.backgrounds USING btree (is_active);


--
-- Name: backgrounds_sub_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backgrounds_sub_category_idx ON public.backgrounds USING btree (sub_category);


--
-- Name: backgrounds_wear_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backgrounds_wear_type_idx ON public.backgrounds USING btree (wear_type_id);


--
-- Name: backgrounds_workspace_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backgrounds_workspace_idx ON public.backgrounds USING btree (workspace);


--
-- Name: business_categories_gender_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX business_categories_gender_idx ON public.business_categories USING btree (gender_target);


--
-- Name: business_categories_workspace_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX business_categories_workspace_idx ON public.business_categories USING btree (workspace);


--
-- Name: cat_item_bg_bg_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cat_item_bg_bg_idx ON public.catalog_item_backgrounds USING btree (background_id);


--
-- Name: cat_item_bg_item_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cat_item_bg_item_idx ON public.catalog_item_backgrounds USING btree (catalog_item_id);


--
-- Name: cat_item_poses_item_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cat_item_poses_item_idx ON public.catalog_item_poses USING btree (catalog_item_id);


--
-- Name: cat_item_poses_pose_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cat_item_poses_pose_idx ON public.catalog_item_poses USING btree (pose_id);


--
-- Name: cat_item_pres_item_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cat_item_pres_item_idx ON public.catalog_item_presentations USING btree (catalog_item_id);


--
-- Name: cat_item_pres_pres_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cat_item_pres_pres_idx ON public.catalog_item_presentations USING btree (presentation_id);


--
-- Name: catalog_items_gender_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalog_items_gender_idx ON public.catalog_items USING btree (gender_target);


--
-- Name: catalog_items_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalog_items_is_active_idx ON public.catalog_items USING btree (is_active);


--
-- Name: catalog_items_wear_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalog_items_wear_type_idx ON public.catalog_items USING btree (wear_type);


--
-- Name: catalog_items_workspace_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX catalog_items_workspace_idx ON public.catalog_items USING btree (workspace);


--
-- Name: faces_gender_target_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX faces_gender_target_idx ON public.faces USING btree (gender_target);


--
-- Name: faces_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX faces_is_active_idx ON public.faces USING btree (is_active);


--
-- Name: faces_sub_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX faces_sub_category_idx ON public.faces USING btree (sub_category);


--
-- Name: faces_wear_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX faces_wear_type_idx ON public.faces USING btree (wear_type_id);


--
-- Name: faces_workspace_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX faces_workspace_idx ON public.faces USING btree (workspace);


--
-- Name: genders_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX genders_code_idx ON public.genders USING btree (code);


--
-- Name: genders_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX genders_is_active_idx ON public.genders USING btree (is_active);


--
-- Name: otps_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX otps_expires_at_idx ON public.otps USING btree (expires_at);


--
-- Name: otps_identifier_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX otps_identifier_idx ON public.otps USING btree (identifier);


--
-- Name: payments_razorpay_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_razorpay_order_id_idx ON public.payments USING btree (razorpay_order_id);


--
-- Name: payments_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_user_id_idx ON public.payments USING btree (user_id);


--
-- Name: poses_gender_target_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX poses_gender_target_idx ON public.poses USING btree (gender_target);


--
-- Name: poses_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX poses_is_active_idx ON public.poses USING btree (is_active);


--
-- Name: poses_sub_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX poses_sub_category_idx ON public.poses USING btree (sub_category);


--
-- Name: poses_wear_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX poses_wear_type_idx ON public.poses USING btree (wear_type_id);


--
-- Name: poses_workspace_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX poses_workspace_idx ON public.poses USING btree (workspace);


--
-- Name: presentations_gender_target_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX presentations_gender_target_idx ON public.presentations USING btree (gender_target);


--
-- Name: presentations_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX presentations_is_active_idx ON public.presentations USING btree (is_active);


--
-- Name: presentations_wear_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX presentations_wear_type_idx ON public.presentations USING btree (wear_type_id);


--
-- Name: presentations_workspace_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX presentations_workspace_idx ON public.presentations USING btree (workspace);


--
-- Name: system_lookups_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX system_lookups_code_idx ON public.system_lookups USING btree (code);


--
-- Name: system_lookups_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX system_lookups_is_active_idx ON public.system_lookups USING btree (is_active);


--
-- Name: system_lookups_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX system_lookups_type_idx ON public.system_lookups USING btree (type);


--
-- Name: system_settings_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX system_settings_category_idx ON public.system_settings USING btree (category);


--
-- Name: usage_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX usage_created_at_idx ON public.usage USING btree (created_at);


--
-- Name: usage_gender_target_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX usage_gender_target_idx ON public.usage USING btree (gender_target);


--
-- Name: usage_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX usage_user_id_idx ON public.usage USING btree (user_id);


--
-- Name: usage_workspace_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX usage_workspace_idx ON public.usage USING btree (workspace);


--
-- Name: users_gender_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_gender_idx ON public.users USING btree (gender);


--
-- Name: users_phone_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_phone_idx ON public.users USING btree (phone);


--
-- Name: wear_types_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wear_types_code_idx ON public.wear_types USING btree (code);


--
-- Name: wear_types_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wear_types_is_active_idx ON public.wear_types USING btree (is_active);


--
-- Name: wear_types_workspace_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX wear_types_workspace_idx ON public.wear_types USING btree (workspace);


--
-- Name: workspaces_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX workspaces_code_idx ON public.workspaces USING btree (code);


--
-- Name: workspaces_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX workspaces_is_active_idx ON public.workspaces USING btree (is_active);


--
-- Name: backgrounds set_backgrounds_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_backgrounds_updated_at BEFORE UPDATE ON public.backgrounds FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: business_categories set_business_categories_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_business_categories_updated_at BEFORE UPDATE ON public.business_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: catalog_items set_catalog_items_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_catalog_items_updated_at BEFORE UPDATE ON public.catalog_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: faces set_faces_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_faces_updated_at BEFORE UPDATE ON public.faces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: genders set_genders_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_genders_updated_at BEFORE UPDATE ON public.genders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: payments set_payments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: poses set_poses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_poses_updated_at BEFORE UPDATE ON public.poses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: presentations set_presentations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_presentations_updated_at BEFORE UPDATE ON public.presentations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: system_settings set_system_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users set_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: catalog_items catalog_items_business_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT catalog_items_business_category_id_fkey FOREIGN KEY (business_category_id) REFERENCES public.business_categories(id) ON DELETE SET NULL;


--
-- Name: backgrounds fk_backgrounds_gender_target; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backgrounds
    ADD CONSTRAINT fk_backgrounds_gender_target FOREIGN KEY (gender_target) REFERENCES public.genders(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: backgrounds fk_backgrounds_wear_type; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backgrounds
    ADD CONSTRAINT fk_backgrounds_wear_type FOREIGN KEY (wear_type_id) REFERENCES public.wear_types(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: backgrounds fk_backgrounds_workspace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backgrounds
    ADD CONSTRAINT fk_backgrounds_workspace FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: business_categories fk_business_categories_gender_target; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_categories
    ADD CONSTRAINT fk_business_categories_gender_target FOREIGN KEY (gender_target) REFERENCES public.genders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: business_categories fk_business_categories_workspace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.business_categories
    ADD CONSTRAINT fk_business_categories_workspace FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: catalog_item_backgrounds fk_cat_item_bg_bg; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_item_backgrounds
    ADD CONSTRAINT fk_cat_item_bg_bg FOREIGN KEY (background_id) REFERENCES public.backgrounds(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: catalog_item_backgrounds fk_cat_item_bg_item; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_item_backgrounds
    ADD CONSTRAINT fk_cat_item_bg_item FOREIGN KEY (catalog_item_id) REFERENCES public.catalog_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: catalog_item_poses fk_cat_item_poses_item; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_item_poses
    ADD CONSTRAINT fk_cat_item_poses_item FOREIGN KEY (catalog_item_id) REFERENCES public.catalog_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: catalog_item_poses fk_cat_item_poses_pose; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_item_poses
    ADD CONSTRAINT fk_cat_item_poses_pose FOREIGN KEY (pose_id) REFERENCES public.poses(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: catalog_item_presentations fk_cat_item_pres_item; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_item_presentations
    ADD CONSTRAINT fk_cat_item_pres_item FOREIGN KEY (catalog_item_id) REFERENCES public.catalog_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: catalog_item_presentations fk_cat_item_pres_pres; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_item_presentations
    ADD CONSTRAINT fk_cat_item_pres_pres FOREIGN KEY (presentation_id) REFERENCES public.presentations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: catalog_items fk_catalog_items_business_category_workspace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT fk_catalog_items_business_category_workspace FOREIGN KEY (business_category_id, workspace) REFERENCES public.business_categories(id, workspace) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: catalog_items fk_catalog_items_gender_target; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT fk_catalog_items_gender_target FOREIGN KEY (gender_target) REFERENCES public.genders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: catalog_items fk_catalog_items_wear_type; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT fk_catalog_items_wear_type FOREIGN KEY (wear_type) REFERENCES public.wear_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: catalog_items fk_catalog_items_wear_type_workspace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT fk_catalog_items_wear_type_workspace FOREIGN KEY (wear_type, workspace) REFERENCES public.wear_types(id, workspace) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: catalog_items fk_catalog_items_workspace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_items
    ADD CONSTRAINT fk_catalog_items_workspace FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: faces fk_faces_gender_target; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faces
    ADD CONSTRAINT fk_faces_gender_target FOREIGN KEY (gender_target) REFERENCES public.genders(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: faces fk_faces_wear_type; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faces
    ADD CONSTRAINT fk_faces_wear_type FOREIGN KEY (wear_type_id) REFERENCES public.wear_types(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: faces fk_faces_workspace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faces
    ADD CONSTRAINT fk_faces_workspace FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: poses fk_poses_gender_target; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poses
    ADD CONSTRAINT fk_poses_gender_target FOREIGN KEY (gender_target) REFERENCES public.genders(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: poses fk_poses_wear_type; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poses
    ADD CONSTRAINT fk_poses_wear_type FOREIGN KEY (wear_type_id) REFERENCES public.wear_types(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: poses fk_poses_workspace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poses
    ADD CONSTRAINT fk_poses_workspace FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: presentations fk_presentations_gender_target; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.presentations
    ADD CONSTRAINT fk_presentations_gender_target FOREIGN KEY (gender_target) REFERENCES public.genders(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;


--
-- Name: presentations fk_presentations_wear_type; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.presentations
    ADD CONSTRAINT fk_presentations_wear_type FOREIGN KEY (wear_type_id) REFERENCES public.wear_types(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: presentations fk_presentations_workspace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.presentations
    ADD CONSTRAINT fk_presentations_workspace FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: usage fk_usage_gender_target; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage
    ADD CONSTRAINT fk_usage_gender_target FOREIGN KEY (gender_target) REFERENCES public.genders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: usage fk_usage_workspace; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage
    ADD CONSTRAINT fk_usage_workspace FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users fk_users_gender; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_gender FOREIGN KEY (gender) REFERENCES public.genders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: system_settings system_settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: usage usage_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage
    ADD CONSTRAINT usage_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: wear_types wear_types_workspace_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wear_types
    ADD CONSTRAINT wear_types_workspace_fkey FOREIGN KEY (workspace) REFERENCES public.workspaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict DofamuMwYSD3XSECcIufG7J6WFfUeBeyr9U3apnfvbH97txKH252qEBOK7f29f1

