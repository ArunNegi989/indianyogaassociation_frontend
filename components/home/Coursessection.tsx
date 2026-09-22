import api from "@/lib/api";
import CoursesSectionClient from "./Coursessectionclient";

interface CourseLink {
  label: string;
  href: string;
}

interface Course {
  _id: string;
  image: string;
  imageAlt: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  links: CourseLink[];
  enrollHref: string;
  exploreLabel: string;
  exploreHref: string;
  priceUSD: string;
  totalSeats: number;
  availableSeats: number;
  order: number;
}

async function getCourses(): Promise<Course[]> {
  try {
    const res = await api.get("/courses-section"); // baseURL me /api already included hai
    return res.data?.data ?? [];
  } catch (err: any) {
    if (err.response) {
      console.error(
        `Courses fetch failed with status ${err.response.status} — URL: ${err.config?.baseURL}${err.config?.url}`
      );
    } else if (err.request) {
      console.error(
        "No response from server — backend down ya unreachable ho sakta hai:",
        err.message
      );
    } else {
      console.error("Server-side courses fetch failed:", err.message);
    }
    return [];
  }
}

export default async function CoursesSection() {
  const initialCourses = await getCourses();
  return <CoursesSectionClient initialCourses={initialCourses} />;
}