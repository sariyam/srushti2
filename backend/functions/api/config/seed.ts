import { db, queryClient } from "./index";
import { users, genders, workspaces, wearTypes, businessCategories, catalogItems, faces, poses, presentations, backgrounds, systemSettings, systemLookups } from "./schema";
import { eq } from "drizzle-orm";
import { env } from "./env";
import path from "path";
import fs from "fs";
import { SEED_GENDERS } from "./seed_data/seed_genders";
import { SEED_WORKSPACES } from "./seed_data/seed_workspaces";
import { SEED_WEAR_TYPES } from "./seed_data/seed_wear_types";
import { SEED_FACES } from "./seed_data/seed_faces";
import { SEED_POSES } from "./seed_data/seed_poses";
import { SEED_BACKGROUNDS } from "./seed_data/seed_backgrounds";
import { SEED_PRESENTATIONS } from "./seed_data/seed_presentations";
import { SEED_SETTINGS } from "./seed_data/seed_settings";
import { SEED_LOOKUPS } from "./seed_data/seed_lookups";

async function runSeed() {
  console.log("🌱 Starting complete Srushti AI database seeding process...");

  try {
    // =========================================================================
    // 0. Seed Genders (Lookup Table: 'female', 'male', 'unisex', 'all')
    // =========================================================================
    console.log("🚻 Seeding Genders lookup table...");
    for (const g of SEED_GENDERS) {
      await db
        .insert(genders)
        .values(g)
        .onConflictDoUpdate({
          target: genders.id,
          set: {
            code: g.code,
            nameEn: g.nameEn,
            nameTe: g.nameTe,
            description: g.description,
            icon: g.icon,
            displayOrder: g.displayOrder,
            isActive: g.isActive,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`✅ Seeded ${SEED_GENDERS.length} Genders.`);

    // =========================================================================
    // 0.1 Seed Workspaces (Lookup Table: 'garment', 'jewelry', 'general', 'all', 'face')
    // =========================================================================
    console.log("🏢 Seeding Workspaces lookup table...");
    for (const w of SEED_WORKSPACES) {
      await db
        .insert(workspaces)
        .values(w)
        .onConflictDoUpdate({
          target: workspaces.id,
          set: {
            code: w.code,
            nameEn: w.nameEn,
            nameTe: w.nameTe,
            description: w.description,
            icon: w.icon,
            displayOrder: w.displayOrder,
            isActive: w.isActive,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`✅ Seeded ${SEED_WORKSPACES.length} Workspaces.`);

    // =========================================================================
    // 0.2 Seed Wear Types (Lookup Table: 'top_wear', 'bottom_wear', 'full_wear', etc.)
    // =========================================================================
    console.log("👔 Seeding Wear Types lookup table...");
    for (const wt of SEED_WEAR_TYPES) {
      await db
        .insert(wearTypes)
        .values(wt)
        .onConflictDoUpdate({
          target: wearTypes.id,
          set: {
            workspace: wt.workspace,
            code: wt.code,
            nameEn: wt.nameEn,
            nameTe: wt.nameTe,
            description: wt.description,
            icon: wt.icon,
            displayOrder: wt.displayOrder,
            isActive: wt.isActive,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`✅ Seeded ${SEED_WEAR_TYPES.length} Wear Types.`);

    // =========================================================================
    // 1. Seed / Upsert Admin User (Strict 2-Role System: 'user' | 'admin')
    // =========================================================================
    const adminPhone = env.SUPERADMIN_PHONE || "+919059108434";
    console.log(`🔐 Verifying Admin account for ${adminPhone}...`);

    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.phone, adminPhone))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log(`ℹ️ Admin already exists (ID: ${existingAdmin[0].id}). Updating role to 'admin'...`);
      await db
        .update(users)
        .set({
          role: "admin",
          gender: "all",
          walletBalance: Math.max(existingAdmin[0].walletBalance, 1000),
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingAdmin[0].id));
      console.log(`✅ Admin updated successfully.`);
    } else {
      console.log(`🚀 Creating new Admin user for ${adminPhone}...`);
      await db.insert(users).values({
        phone: adminPhone,
        role: "admin",
        gender: "all",
        walletBalance: 1000,
        isActive: true,
      });
      console.log(`🎉 Admin user created successfully.`);
    }

    // =========================================================================
    // 2. Seed Business Categories / Verticals
    // =========================================================================
    console.log("📦 Seeding Business Categories...");
    const businessesData = [
      {
        id: "garment_female",
        workspace: "garment" as const,
        genderTarget: "female" as const,
        nameEn: "Female Collection",
        nameTe: "మహిళల కలెక్షన్",
        icon: "Venus",
        displayOrder: 1,
        isActive: true,
      },
      {
        id: "garment_male",
        workspace: "garment" as const,
        genderTarget: "male" as const,
        nameEn: "Male Collection",
        nameTe: "పురుషుల కలెక్షన్",
        icon: "Mars",
        displayOrder: 2,
        isActive: true,
      },
      {
        id: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        nameEn: "Female Collection",
        nameTe: "మహిళల కలెక్షన్",
        icon: "Venus",
        displayOrder: 3,
        isActive: true,
      },
      {
        id: "jewelry_male",
        workspace: "jewelry" as const,
        genderTarget: "male" as const,
        nameEn: "Male Collection",
        nameTe: "పురుషుల కలెక్షన్",
        icon: "Mars",
        displayOrder: 4,
        isActive: true,
      },
    ];

    for (const b of businessesData) {
      await db
        .insert(businessCategories)
        .values(b)
        .onConflictDoUpdate({
          target: businessCategories.id,
          set: {
            workspace: b.workspace,
            genderTarget: b.genderTarget,
            nameEn: b.nameEn,
            nameTe: b.nameTe,
            icon: b.icon,
            displayOrder: b.displayOrder,
            isActive: b.isActive,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`✅ Seeded ${businessesData.length} Business Categories.`);

    // =========================================================================
    // 3. Seed Catalog Items (Garments & Jewelry with Prompt Directives)
    // =========================================================================
    console.log("👗 Seeding Catalog Items...");
    const catalogData = [
      // --- Female Garments ---
      {
        id: "saree",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "female" as const,
        wearType: "full_wear",
        nameEn: "Saree",
        nameTe: "చీర (Saree)",
        promptDirective: "a luxurious traditional Indian silk saree with exquisite border embroidery and ornate pallu craftsmanship",
        placementDirective: "The full-length garment drapes gracefully from the shoulder down to the ankles, showcasing authentic silk pleats and woven golden border.",
        displayOrder: 1,
        isActive: true,
      },
      {
        id: "lehenga",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "female" as const,
        wearType: "full_wear",
        nameEn: "Lehenga",
        nameTe: "లెహంగా (Lehenga)",
        promptDirective: "a stunning traditional bridal lehenga choli with heavy golden embroidery, flared skirt volume, and flowing dupatta",
        placementDirective: "The flared lehenga skirt rests comfortably at the waist flowing into full majestic volume down to the feet.",
        displayOrder: 2,
        isActive: true,
      },
      {
        id: "salwar",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "female" as const,
        wearType: "full_wear",
        nameEn: "Salwar Kameez",
        nameTe: "సల్వార్ కమీజ్ (Salwar)",
        promptDirective: "an elegant traditional salwar kameez suit with beautiful dupatta drape, delicate neck embroidery, and tailored trousers",
        placementDirective: "The tunic drapes naturally over the torso with tailored trousers and dupatta draped symmetrically over the shoulders.",
        displayOrder: 3,
        isActive: true,
      },
      {
        id: "gown",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "female" as const,
        wearType: "full_wear",
        nameEn: "Evening Gown",
        nameTe: "గౌను (Gown)",
        promptDirective: "a breathtaking, flowing modern evening gown with elegant fabric draping, structured bodice, and premium couture feel",
        placementDirective: "The gown fits smoothly through the bodice and cascades fluidly to a floor-sweeping hem.",
        displayOrder: 4,
        isActive: true,
      },
      {
        id: "skirt",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "female" as const,
        wearType: "bottom_wear",
        nameEn: "Flared Skirt",
        nameTe: "స్కర్ట్ (Skirt)",
        promptDirective: "a fashionable stylish casual flared skirt with subtle pleat details and beautiful textile print",
        placementDirective: "Sits cleanly at the waistline, draping naturally down to the calves with fluid motion.",
        displayOrder: 5,
        isActive: true,
      },
      {
        id: "crop_top",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "female" as const,
        wearType: "top_wear",
        nameEn: "Crop Top",
        nameTe: "క్రాప్ టాప్ (Crop Top)",
        promptDirective: "a trendy chic crop top with elegant neckline, modern silhouette and fine stitching",
        placementDirective: "Fits the upper torso cleanly, resting just above the waistline with crisp seams.",
        displayOrder: 6,
        isActive: true,
      },
      {
        id: "blouse",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "female" as const,
        wearType: "top_wear",
        nameEn: "Designer Blouse",
        nameTe: "బ్లౌజ్ (Blouse)",
        promptDirective: "an exquisitely embroidered designer Indian saree blouse with artistic back-neck patterns and zardozi embellishment",
        placementDirective: "Fits the chest, shoulders, and back snugly with tailored neckline and decorative piping.",
        displayOrder: 7,
        isActive: true,
      },

      // --- Male Garments ---
      {
        id: "shirt",
        businessCategoryId: "garment_male",
        workspace: "garment" as const,
        genderTarget: "male" as const,
        wearType: "top_wear",
        nameEn: "Button-Down Shirt",
        nameTe: "షర్టు (Shirt)",
        promptDirective: "a tailored premium casual cotton button-down shirt with elegant collar design and clean cuffs",
        placementDirective: "Fits cleanly over the upper torso, shoulders, and chest, displaying realistic fabric tension around collar and placket.",
        displayOrder: 8,
        isActive: true,
      },
      {
        id: "sherwani",
        businessCategoryId: "garment_male",
        workspace: "garment" as const,
        genderTarget: "male" as const,
        wearType: "full_wear",
        nameEn: "Royal Sherwani",
        nameTe: "షేర్వానీ (Sherwani)",
        promptDirective: "a magnificent royal Indian sherwani with intricate handwoven Zardozi embroidery, regal mandarin collar, wedding couture wear",
        placementDirective: "The long structured sherwani coat extends to the knees over churidar trousers with royal symmetrical buttons.",
        displayOrder: 9,
        isActive: true,
      },
      {
        id: "dhoti",
        businessCategoryId: "garment_male",
        workspace: "garment" as const,
        genderTarget: "male" as const,
        wearType: "bottom_wear",
        nameEn: "Traditional Dhoti",
        nameTe: "ధోతీ (Dhoti)",
        promptDirective: "a pristine traditional Indian dhoti paired elegantly with a rich ethnic silk border and crisp pleated wraps",
        placementDirective: "Wraps cleanly around the waist and legs with traditional center pleats draped down to the ankles.",
        displayOrder: 10,
        isActive: true,
      },
      {
        id: "blazer",
        businessCategoryId: "garment_male",
        workspace: "garment" as const,
        genderTarget: "male" as const,
        wearType: "top_wear",
        nameEn: "Slim Blazer",
        nameTe: "బ్లేజర్ (Blazer)",
        promptDirective: "a premium tailored modern slim-fit blazer with elegant fabric sheen and crisp notched lapels",
        placementDirective: "Drapes with tailored shoulder padding and structured chest silhouette over trousers.",
        displayOrder: 11,
        isActive: true,
      },
      {
        id: "tracksuit",
        businessCategoryId: "garment_male",
        workspace: "garment" as const,
        genderTarget: "male" as const,
        wearType: "full_wear",
        nameEn: "Athletic Tracksuit",
        nameTe: "ట్రాక్‌సూట్ (Tracksuit)",
        promptDirective: "a stylish modern athletic fleece tracksuit with precise fits and clean sporty panelling",
        placementDirective: "Complete two-piece coordinated set covering torso and legs in streamlined active silhouette.",
        displayOrder: 12,
        isActive: true,
      },
      {
        id: "hoodie",
        businessCategoryId: "garment_male",
        workspace: "garment" as const,
        genderTarget: "male" as const,
        wearType: "top_wear",
        nameEn: "Pullover Hoodie",
        nameTe: "హుడీ (Hoodie)",
        promptDirective: "a cozy premium organic cotton pullover hoodie with relaxed fit and soft luxurious textile finish",
        placementDirective: "Rests relaxed over the torso and hips with drawstring hood framing the neck.",
        displayOrder: 13,
        isActive: true,
      },

      // --- Unisex Garments ---
      {
        id: "kurta",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "unisex" as const,
        wearType: "full_wear",
        nameEn: "Ethnic Kurta",
        nameTe: "కుర్తా (Kurta)",
        promptDirective: "a traditional Indian premium cotton kurta with subtle elegant embroidery and side slits",
        placementDirective: "Drapes comfortably from shoulders down to knees with clean neckline and natural fabric fall.",
        displayOrder: 14,
        isActive: true,
      },
      {
        id: "suit",
        businessCategoryId: "garment_male",
        workspace: "garment" as const,
        genderTarget: "unisex" as const,
        wearType: "full_wear",
        nameEn: "Two-Piece Suit",
        nameTe: "సూట్ (Suit)",
        promptDirective: "a sharp handsome bespoke tailored classic two-piece suit with sleek lapels and matching trousers",
        placementDirective: "Structured tailored jacket and crisp trousers with clean vertical drape.",
        displayOrder: 15,
        isActive: true,
      },
      {
        id: "western_wear",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "unisex" as const,
        wearType: "full_wear",
        nameEn: "Western Ensemble",
        nameTe: "వెస్ట్రన్ వేర్ (Western Wear)",
        promptDirective: "a high-fashion chic western wear full outfit, sophisticated modern dress or contemporary co-ord apparel set with impeccable tailoring",
        placementDirective: "Fits and drapes seamlessly as a complete full-body outfit with modern tailored lines.",
        displayOrder: 16,
        isActive: true,
      },
      {
        id: "tshirt",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "unisex" as const,
        wearType: "top_wear",
        nameEn: "Crewneck T-Shirt",
        nameTe: "టీ-షర్టు (T-Shirt)",
        promptDirective: "a modern casual cotton t-shirt with great fit, ribbed crewneck, and clean soft texture",
        placementDirective: "Fits upper body cleanly, resting at the hips with natural sleeve drape.",
        displayOrder: 17,
        isActive: true,
      },
      {
        id: "jeans",
        businessCategoryId: "garment_female",
        workspace: "garment" as const,
        genderTarget: "unisex" as const,
        wearType: "bottom_wear",
        nameEn: "Denim Jeans",
        nameTe: "జీన్స్ (Jeans)",
        promptDirective: "a classic stylish denim jeans trouser with premium cotton texture, authentic washed indigo tone, and brass rivets",
        placementDirective: "Fits hips and legs naturally down to ankles with authentic five-pocket detailing.",
        displayOrder: 18,
        isActive: true,
      },

      // --- Jewelry Items ---
      {
        id: "necklace",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "neck_wear",
        nameEn: "Royal Necklace",
        nameTe: "నెక్లెస్ (Necklace)",
        promptDirective: "a breathtaking luxury Indian bridal necklace crafted with 22K yellow gold filigree and sparkling emerald stones",
        placementDirective: "Rests symmetrically around the collarbone and upper chest with gravitational hang.",
        displayOrder: 19,
        isActive: true,
      },
      {
        id: "earrings",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "ear_wear",
        nameEn: "Jhumka Earrings",
        nameTe: "చెవి కమ్మలు (Earrings)",
        promptDirective: "a pair of exquisite handcrafted traditional Indian jhumka earrings with pearl drops and intricate gold filigree",
        placementDirective: "Dangles gracefully from earlobes with authentic three-dimensional depth.",
        displayOrder: 20,
        isActive: true,
      },
      {
        id: "chain",
        businessCategoryId: "jewelry_male",
        workspace: "jewelry" as const,
        genderTarget: "unisex" as const,
        wearType: "neck_wear",
        nameEn: "Gold Chain",
        nameTe: "గొలుసు (Chain)",
        promptDirective: "a sleek, polished gold chain necklace with subtle reflective links and clean modern finish",
        placementDirective: "Drapes smoothly around the neck base over skin or collar.",
        displayOrder: 21,
        isActive: true,
      },
      {
        id: "choker",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "neck_wear",
        nameEn: "Polki Choker",
        nameTe: "చోకర్ (Choker)",
        promptDirective: "a majestic traditional royal choker necklace encrusted with uncut Polki diamonds and Kundan work",
        placementDirective: "Fits closely around the middle neck with multi-tiered gem rows.",
        displayOrder: 22,
        isActive: true,
      },
      {
        id: "pendant",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "unisex" as const,
        wearType: "neck_wear",
        nameEn: "Solitaire Pendant",
        nameTe: "లాకెట్ (Pendant)",
        promptDirective: "an elegant designer pendant set on a delicate gold chain with a brilliant centerpiece solitaire gemstone",
        placementDirective: "Centrally poised over the sternum with light-reflecting facets.",
        displayOrder: 23,
        isActive: true,
      },
      {
        id: "bangles",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "wrist_wear",
        nameEn: "Gold Bangles",
        nameTe: "గాజులు (Bangles)",
        promptDirective: "a set of traditional royal Indian gold bangles with delicate filigree engraving and ruby accents",
        placementDirective: "Worn snugly on wrist and lower forearm with metallic luster.",
        displayOrder: 24,
        isActive: true,
      },
      {
        id: "ring",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "unisex" as const,
        wearType: "wrist_wear",
        nameEn: "Solitaire Ring",
        nameTe: "ఉంగరం (Ring)",
        promptDirective: "an exquisite solitaire gemstone ring with a brilliant-cut diamond mounted on a polished platinum band",
        placementDirective: "Fitted securely on the finger with pristine contact shadows and prong clarity.",
        displayOrder: 25,
        isActive: true,
      },
      {
        id: "nose_ring",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "nose_wear",
        nameEn: "Bridal Nath",
        nameTe: "ముక్కుపుడక (Nose Ring)",
        promptDirective: "a delicate traditional Indian nose ring (nath) with fine gold wirework and dangling pearl accents",
        placementDirective: "Positioned delicately on the side of the nostril aligned with facial profile.",
        displayOrder: 26,
        isActive: true,
      },
      {
        id: "waistband",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "hip_wear",
        nameEn: "Kamarbandh",
        nameTe: "వడ్డాణం (Waistband)",
        promptDirective: "a majestic royal Indian kamarbandh (waist chain) with ornate gold filigree and dangling pearl drops",
        placementDirective: "Wrapped gracefully around waist/hips over apparel.",
        displayOrder: 27,
        isActive: true,
      },
      {
        id: "payal",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "leg_wear",
        nameEn: "Silver Payal",
        nameTe: "పట్టీలు (Payal)",
        promptDirective: "a pair of traditional Indian silver anklets (payal) with delicate ghungroo bells and filigree links",
        placementDirective: "Draped gracefully around the ankle bone resting on the foot.",
        displayOrder: 28,
        isActive: true,
      },
      {
        id: "toe_ring",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "leg_wear",
        nameEn: "Toe Ring",
        nameTe: "మెట్టెలు (Toe Ring)",
        promptDirective: "a pair of exquisite traditional Indian silver toe rings (bichhiya) with fine carved floral motifs",
        placementDirective: "Fitted cleanly on the second toe in an intimate foot macro pose.",
        displayOrder: 29,
        isActive: true,
      },
      {
        id: "maang_tikka",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "forehead_wear",
        nameEn: "Maang Tikka",
        nameTe: "పాపిడి బిళ్ళ (Maang Tikka)",
        promptDirective: "a stunning traditional Indian maang tikka resting along the hair parting with pearls and Kundan work",
        placementDirective: "Suspended in the center of the forehead along the hairline.",
        displayOrder: 30,
        isActive: true,
      },
      {
        id: "matha_patti",
        businessCategoryId: "jewelry_female",
        workspace: "jewelry" as const,
        genderTarget: "female" as const,
        wearType: "forehead_wear",
        nameEn: "Matha Patti",
        nameTe: "మథాపట్టీ (Matha Patti)",
        promptDirective: "an elaborate royal bridal matha patti headpiece with multiple pearl strands framing the forehead",
        placementDirective: "Framing both sides of the forehead hairline down to the ears.",
        displayOrder: 31,
        isActive: true,
      },
      {
        id: "watch",
        businessCategoryId: "jewelry_male",
        workspace: "jewelry" as const,
        genderTarget: "unisex" as const,
        wearType: "wrist_wear",
        nameEn: "Chronograph Watch",
        nameTe: "చేతి గడియారం (Watch)",
        promptDirective: "a luxury chronograph wristwatch with polished stainless steel bezel, sapphire glass, and textured leather strap",
        placementDirective: "Fitted around the wrist above the wrist bone with metallic shine.",
        displayOrder: 32,
        isActive: true,
      },
      {
        id: "kada",
        businessCategoryId: "jewelry_male",
        workspace: "jewelry" as const,
        genderTarget: "male" as const,
        wearType: "wrist_wear",
        nameEn: "Royal Kada",
        nameTe: "కడా (Kada)",
        promptDirective: "a bold traditional solid silver or gold Kada bracelet with etched patterns and masculine polish",
        placementDirective: "Worn snugly on the forearm or wrist with substantial metallic thickness.",
        displayOrder: 33,
        isActive: true,
      },
      {
        id: "brooch",
        businessCategoryId: "jewelry_male",
        workspace: "jewelry" as const,
        genderTarget: "unisex" as const,
        wearType: "other_wear",
        nameEn: "Gemstone Brooch",
        nameTe: "బ్రూచ్ (Brooch)",
        promptDirective: "an ornate royal jewel brooch with sparkling gemstones and antique gold craftsmanship",
        placementDirective: "Pinned cleanly to the left chest lapel or sherwani chest.",
        displayOrder: 34,
        isActive: true,
      },
    ];

    function inferPresetWearTypeId(subCategory?: string | null): string | null {
      if (!subCategory) return null;
      if (subCategory === "full_wear") return "full_wear";
      if (subCategory === "top_wear") return "top_wear";
      if (subCategory === "bottom_wear") return "bottom_wear";
      if (subCategory === "neck_ear" || subCategory === "neckwear") return "neck_wear";
      if (subCategory === "ear_wear") return "ear_wear";
      if (subCategory === "wrist_ring" || subCategory === "wrist") return "wrist_wear";
      if (subCategory === "hip") return "hip_wear";
      if (subCategory === "nose") return "nose_wear";
      if (subCategory === "leg") return "leg_wear";
      if (subCategory === "forehead") return "forehead_wear";
      if (subCategory === "finger") return "wrist_wear";
      return null;
    }

    for (const item of catalogData) {
      await db
        .insert(catalogItems)
        .values(item)
        .onConflictDoUpdate({
          target: catalogItems.id,
          set: {
            businessCategoryId: item.businessCategoryId,
            wearType: item.wearType,
            workspace: item.workspace,
            genderTarget: item.genderTarget,
            nameEn: item.nameEn,
            nameTe: item.nameTe,
            promptDirective: item.promptDirective,
            placementDirective: item.placementDirective,
            displayOrder: item.displayOrder,
            isActive: item.isActive,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`✅ Seeded ${catalogData.length} Catalog Items.`);

    // =========================================================================
    // 4. Seed Studio Presets into 4 Separate Tables (Faces, Poses, Presentations, Backgrounds)
    // =========================================================================
    console.log("🎨 Seeding 4 Separate Tables (Faces, Poses, Presentations, Backgrounds)...");

    // 4a. Seed Model Faces (faces)
    console.log("  👤 Seeding Faces table...");
    for (const f of SEED_FACES) {
      await db
        .insert(faces)
        .values({
          id: f.id,
          workspace: f.workspace,
          genderTarget: (f.metadata as any)?.gender === "male" ? "male" : "female",
          wearTypeId: null,
          subCategory: f.subCategory,
          nameEn: f.nameEn,
          nameTe: f.nameTe,
          promptDirective: f.promptDirective,
          previewImageUrl: f.previewImageUrl,
          storagePath: f.storagePath,
          thumbnailUrl: null,
          displayOrder: f.displayOrder,
          isActive: f.isActive,
          metadata: f.metadata || {},
        })
        .onConflictDoUpdate({
          target: faces.id,
          set: {
            workspace: f.workspace,
            genderTarget: (f.metadata as any)?.gender === "male" ? "male" : "female",
            wearTypeId: null,
            subCategory: f.subCategory,
            nameEn: f.nameEn,
            nameTe: f.nameTe,
            promptDirective: f.promptDirective,
            previewImageUrl: f.previewImageUrl,
            storagePath: f.storagePath,
            displayOrder: f.displayOrder,
            isActive: f.isActive,
            metadata: f.metadata || {},
            updatedAt: new Date(),
          },
        });
    }
    console.log(`  ✅ Seeded ${SEED_FACES.length} Faces.`);

    // 4b. Seed Poses (poses)
    console.log("  🕺 Seeding Poses table...");
    for (const p of SEED_POSES) {
      const wearTypeId = inferPresetWearTypeId(p.subCategory);
      await db
        .insert(poses)
        .values({
          id: p.id,
          workspace: p.workspace,
          genderTarget: "all",
          wearTypeId,
          subCategory: p.subCategory,
          nameEn: p.nameEn,
          nameTe: p.nameTe,
          promptDirective: p.promptDirective,
          cameraFraming: p.cameraFraming,
          faceVisibilityRule: p.faceVisibilityRule,
          thumbnailUrl: null,
          displayOrder: p.displayOrder,
          isActive: p.isActive,
          metadata: {},
        })
        .onConflictDoUpdate({
          target: poses.id,
          set: {
            workspace: p.workspace,
            genderTarget: "all",
            wearTypeId,
            subCategory: p.subCategory,
            nameEn: p.nameEn,
            nameTe: p.nameTe,
            promptDirective: p.promptDirective,
            cameraFraming: p.cameraFraming,
            faceVisibilityRule: p.faceVisibilityRule,
            displayOrder: p.displayOrder,
            isActive: p.isActive,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`  ✅ Seeded ${SEED_POSES.length} Poses.`);

    // 4c. Seed Presentations (presentations)
    console.log("  💎 Seeding Presentations table...");
    for (const pr of SEED_PRESENTATIONS) {
      await db
        .insert(presentations)
        .values({
          id: pr.id,
          workspace: pr.workspace,
          genderTarget: "all",
          wearTypeId: null,
          subCategory: null,
          nameEn: pr.nameEn,
          nameTe: pr.nameTe,
          promptDirective: pr.promptDirective,
          cameraFraming: null,
          faceVisibilityRule: pr.faceVisibilityRule || (pr.id === "model" ? "full_face" : pr.id === "partial_face" ? "partial_face" : "no_face"),
          thumbnailUrl: null,
          displayOrder: pr.displayOrder,
          isActive: pr.isActive,
          metadata: pr.metadata || {},
        })
        .onConflictDoUpdate({
          target: presentations.id,
          set: {
            workspace: pr.workspace,
            genderTarget: "all",
            nameEn: pr.nameEn,
            nameTe: pr.nameTe,
            promptDirective: pr.promptDirective,
            faceVisibilityRule: pr.faceVisibilityRule || (pr.id === "model" ? "full_face" : pr.id === "partial_face" ? "partial_face" : "no_face"),
            displayOrder: pr.displayOrder,
            isActive: pr.isActive,
            metadata: pr.metadata || {},
            updatedAt: new Date(),
          },
        });
    }
    console.log(`  ✅ Seeded ${SEED_PRESENTATIONS.length} Presentations.`);

    // 4d. Seed Backgrounds (backgrounds)
    console.log("  🌄 Seeding Backgrounds table...");
    for (const b of SEED_BACKGROUNDS) {
      await db
        .insert(backgrounds)
        .values({
          id: b.id,
          workspace: b.workspace,
          genderTarget: "all",
          wearTypeId: null,
          subCategory: b.subCategory,
          nameEn: b.nameEn,
          nameTe: b.nameTe,
          promptDirective: b.promptDirective,
          colorHex: b.colorHex || null,
          thumbnailUrl: null,
          displayOrder: b.displayOrder,
          isActive: b.isActive,
          metadata: {},
        })
        .onConflictDoUpdate({
          target: backgrounds.id,
          set: {
            workspace: b.workspace,
            genderTarget: "all",
            subCategory: b.subCategory,
            nameEn: b.nameEn,
            nameTe: b.nameTe,
            promptDirective: b.promptDirective,
            colorHex: b.colorHex || null,
            displayOrder: b.displayOrder,
            isActive: b.isActive,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`  ✅ Seeded ${SEED_BACKGROUNDS.length} Backgrounds.`);

    // =========================================================================
    // 5. Seed System Settings (AI Gateways, Fidelity Guardrails, Option Mappings, UI Config)
    // =========================================================================
    console.log("⚙️ Seeding System Settings (Gateways, Option Mappings, Translations, Mockups)...");
    const baseSettingsData = [
      {
        key: "ai_gateway",
        category: "ai" as const,
        value: {
          defaultModel: "gpt-image-2.5-sunburst",
          fallbackModel: "gemini-2.5-flash-image",
          temperature: 0.7,
          timeoutMs: 60000,
          provider: "OpenAI Managed Gateway",
        },
        description: "AI Model Routing, Gateway fallbacks, and execution parameters",
      },
      {
        key: "pricing_rules",
        category: "pricing" as const,
        value: {
          freeSignupCredits: 10,
          resolutionTiers: {
            "1k": 1,
            "2k": 2,
            "4k": 4,
          },
          aspectRatioMultipliers: {
            "1:1": 1.0,
            "3:4": 1.0,
            "9:16": 1.0,
            "16:9": 1.0,
          },
          packs: [
            { id: "starter", name: "Starter Pack", credits: 50, priceInPaise: 9900 },
            { id: "pro", name: "Pro Studio Pack", credits: 200, priceInPaise: 29900 },
            { id: "enterprise", name: "Brand Enterprise Pack", credits: 1000, priceInPaise: 99900 },
          ],
        },
        description: "Credit costs per photoshoot resolution, aspect ratio, and Razorpay recharge packs",
      },
      {
        key: "fidelity_directives",
        category: "fidelity" as const,
        value: {
          highest_priority_rule: "EXACT REPLICATION OF INPUT PRODUCT DESIGN, FABRIC/MATERIAL, PATTERNS, LENGTH, AND SIZE REQUIRED",
          highest_priority_face_rule: "100% IDENTICAL HUMAN FACE IDENTITY REPLICATION REQUIRED - EXACT SAME PERSON PRESERVED",
          face_replication_fidelity_score: 1.0,
          mandatory_replications: [
            "Automatic detection and 1:1 application of the uploaded product's exact fabric, material, and surface luster",
            "Exact product design, artwork, motifs, prints, embroidery, and weave patterns replicated 1:1 in scale and position",
            "Exact garment length and cut (full length, knee-length, cropped, floor drape)",
            "Exact collar, neckline, and sleeve structure",
            "Buttons, zippers, pockets, and hardware in exact counts and positions",
          ],
          mandatory_face_replications: [
            "Exact 1:1 reproduction of the reference human model face with 100% photographic fidelity",
            "Preserve identical bone structure, eye contour, iris color, nose profile, lip anatomy, jawline, skin tone, and facial landmarks",
            "Strictly zero facial morphing, zero generic AI face substitution, zero ethnic drift, and zero age shifting",
            "Seamless natural blend of the exact same person onto the generated body pose and outfit",
          ],
        },
        description: "Master AI product and face replication guardrails injected into all generated image prompts",
      },
      {
        key: "face_matching_rules",
        category: "fidelity" as const,
        value: {
          enforce_100_percent_fidelity: true,
          allowed_presentation_modes: ["model", "partial_face"],
          prohibited_presentation_modes: ["no_face", "mannequin", "hanger", "ghost", "flat_lay", "folded", "shelf", "shopwindow", "bust", "body_part"],
          face_visibility_ui_title_en: "Select Human Model Face",
          face_visibility_ui_title_te: "మానవ మోడల్ ముఖాన్ని ఎంచుకోండి",
          face_fidelity_instruction: "The reference image of the human model (second uploaded image) is for 100% FACE IDENTITY REPLICATION. Maintain identical facial structure, eyes, nose, lips, jawline, skin tone, and ethnic identity from the face reference image with zero morphing or substitution.",
        },
        description: "Face reference UI visibility rules and 100% face identity replication guardrails",
      },
      {
        key: "negative_exclusions",
        category: "fidelity" as const,
        value: {
          highest_priority_exclusion_rule: "STRICTLY NO PRICE TAGS, HANGTAGS, BRAND TAGS, COMPANY LOGOS, OR TEXT OVERLAYS",
          prohibitions: [
            "Strictly no price tags, barcode stickers, brand logos, company watermarks, or sale badges",
            "Strictly no unrequested secondary jewelry or accessories on the model's body",
            "Strictly no CGI plastic textures, fake glossy skin smoothing, or artificial wax figures",
            "Strictly no distorted fingers, extra limbs, or anatomy mutations",
          ],
        },
        description: "Exclusion directives and negative prompts preventing unwanted artifacts",
      },
    ];

    const allSettings = [...baseSettingsData, ...SEED_SETTINGS];

    for (const setting of allSettings) {
      await db
        .insert(systemSettings)
        .values(setting)
        .onConflictDoUpdate({
          target: systemSettings.key,
          set: {
            category: setting.category,
            value: setting.value,
            description: setting.description,
            updatedAt: new Date(),
          },
        });
    }
    console.log(`✅ Seeded ${allSettings.length} System Settings.`);

    // =========================================================================
    // 6. Seed System Lookups (Background Types, Genders, Garment & Jewelry Categories)
    // =========================================================================
    console.log("📑 Seeding System Lookups (Background Types, Genders, Garments & Jewelry)...");
    for (const lookup of SEED_LOOKUPS) {
      await db
        .insert(systemLookups)
        .values({
          id: lookup.id,
          type: lookup.type,
          code: lookup.code,
          nameEn: lookup.nameEn,
          nameTe: lookup.nameTe,
          description: lookup.description,
          icon: lookup.icon,
          displayOrder: lookup.displayOrder,
          isActive: lookup.isActive,
          metadata: lookup.metadata || {},
        })
        .onConflictDoUpdate({
          target: systemLookups.id,
          set: {
            type: lookup.type,
            code: lookup.code,
            nameEn: lookup.nameEn,
            nameTe: lookup.nameTe,
            description: lookup.description,
            icon: lookup.icon,
            displayOrder: lookup.displayOrder,
            isActive: lookup.isActive,
            metadata: lookup.metadata || {},
            updatedAt: new Date(),
          },
        });
    }
    console.log(`✅ Seeded ${SEED_LOOKUPS.length} System Lookups successfully.`);

    console.log("🎉 All database seeding completed successfully!");
  } catch (error: any) {
    console.error("❌ Failed to complete database seeding:", error.message || error);
    process.exit(1);
  } finally {
    await queryClient.end();
  }
}

runSeed();
