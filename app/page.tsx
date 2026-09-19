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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <HomepageSlider />
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