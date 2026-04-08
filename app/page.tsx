import AccreditationSection from "@/components/home/Accreditationsection";
import AYMFullPage from "@/components/home/Aymfullpage";
import ClassCampusAmenities from "@/components/home/Classcampusamenities";
import CoursesSection from "@/components/home/Coursessection";
import HomeaboutSection from "@/components/home/Homeaboutsection";
import HomepageSlider from "@/components/home/Homepageslider";
import HomeTestimonialsSection from "@/components/home/Hometestimonialssection";
import HowToReach from "@/components/home/Howtoreach";
import OurMission from "@/components/home/Ourmission";
import WhyAYMSection from "@/components/home/Whyaymsection";
import YogaCoursesTeachers from "@/components/home/Yogacoursesteachers";


export default function Home() {
  return (
    <>
      <HomepageSlider />
      <HomeaboutSection />
      <CoursesSection />
      <AccreditationSection />
      <YogaCoursesTeachers />
      <ClassCampusAmenities />
      <WhyAYMSection />
      <OurMission />
      <AYMFullPage />
      <HomeTestimonialsSection />
      <HowToReach />
    </>
  );
}
