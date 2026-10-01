import { Suspense } from "react";
import dynamic from "next/dynamic";
import HomeaboutSection from "@/components/home/Homeaboutsection";
import HomepageSlider from "@/components/home/Homepageslider";
import HomeaboutSkeleton from "@/components/home/HomeaboutSkeleton";
import { homepageJsonLd } from "@/lib/seo/homepage-schema";
import bgMobile from "@/assets/images/backgroundimage/510x1739.webp";
import bgXs from "@/assets/images/backgroundimage/360x2080.webp";

// Below-the-fold sections: lazy, taaki unki JS/CSS initial load se hat jaye
const CoursesSection = dynamic(() => import("@/components/home/Coursessection"));
const AccreditationSection = dynamic(
  () => import("@/components/home/Accreditationsection")
);
const YogaCoursesTeachers = dynamic(
  () => import("@/components/home/Yogacoursesteachers")
);
const ClassCampusAmenities = dynamic(
  () => import("@/components/home/Classcampusamenities")
);
const WhyAYMSection = dynamic(() => import("@/components/home/Whyaymsection"));
const OurMission = dynamic(() => import("@/components/home/Ourmission"));
const AYMFullPage = dynamic(() => import("@/components/home/Aymfullpage"));
const BlogSection = dynamic(() => import("@/components/home/BlogSection"));
const HomeTestimonialsSection = dynamic(
  () => import("@/components/home/Hometestimonialssection")
);
const HowToReach = dynamic(() => import("@/components/home/Howtoreach"));

interface Slide {
  _id: string;
  bannerName: string;
  link: string;
  image: string;
}

async function getBanners(): Promise<Slide[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Server-side banner fetch error:", error);
    return [];
  }
}

export default async function Home() {
  const initialSlides = await getBanners();

  return (
    <>
      {/* LCP fix: CSS background image ko HTML se preload karo */}
      <link
        rel="preload"
        as="image"
        href={bgMobile.src}
        media="(min-width: 361px) and (max-width: 540px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={bgXs.src}
        media="(max-width: 360px)"
        fetchPriority="high"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <HomepageSlider initialSlides={initialSlides} />

      <Suspense fallback={<HomeaboutSkeleton />}>
        <HomeaboutSection />
      </Suspense>
      <CoursesSection />
      <AccreditationSection />
      <YogaCoursesTeachers />
      <ClassCampusAmenities />
      <WhyAYMSection />
      <OurMission />
      <AYMFullPage />
      <BlogSection />
      <HomeTestimonialsSection />
      <HowToReach />
    </>
  );
}