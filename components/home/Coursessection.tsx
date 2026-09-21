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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses-section`, {
      cache: "no-store", // seats real-time chahiye isliye har request pe fresh data
    });
    const data = await res.json();
    return data.data ?? [];
  } catch (err) {
    console.error("Server-side courses fetch failed", err);
    return [];
  }
}

export default async function CoursesSection() {
  const initialCourses = await getCourses();
  return <CoursesSectionClient initialCourses={initialCourses} />;
}