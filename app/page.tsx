import AccreditationSection from "@/components/home/Accreditationsection";
import AYMFullPage from "@/components/home/Aymfullpage";
import BlogSection from "@/components/home/BlogSection";
import ClassCampusAmenities from "@/components/home/Classcampusamenities";
import CoursesSection from "@/components/home/Coursessection";
import HomeaboutSection from "@/components/home/Homeaboutsection";
import HomepageSlider from "@/components/home/Homepageslider";
import HomeTestimonialsSection from "@/components/home/Hometestimonialssection";
import HowToReach from "@/components/home/Howtoreach";
import OurMission from "@/components/home/Ourmission";
import WhyAYMSection from "@/components/home/Whyaymsection";
import YogaCoursesTeachers from "@/components/home/Yogacoursesteachers";
import { homepageJsonLd } from "@/lib/seo/homepage-schema";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <HomepageSlider initialSlides={initialSlides} />
      <HomeaboutSection />
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