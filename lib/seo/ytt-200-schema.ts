export const ytt200JsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "HealthClub"],
      "@id": "https://www.indianyogaassociation.com/#organization",
      "name": "Indian Yoga Association",
      "url": "https://www.indianyogaassociation.com/",
      "image": "https://www.indianyogaassociation.com/images/200-hour-yoga-teacher-training-course-rishikesh.webp",
      "telephone": "+91-7500277709",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Upper Tapovan",
        "addressLocality": "Rishikesh",
        "addressRegion": "Uttarakhand",
        "postalCode": "249192",
        "addressCountry": "IN"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": 30.130187, "longitude": 78.323056 },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "06:00",
        "closes": "21:00"
      },
      "sameAs": ["https://www.instagram.com/indianyogaassociation/"]
    },
    {
      "@type": "WebPage",
      "@id": "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html#webpage",
      "url": "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html",
      "name": "200 Hour Yoga Teacher Training in Rishikesh",
      "description": "A residential 200-hour yoga teacher training course in Rishikesh covering Hatha Yoga, Ashtanga Vinyasa, pranayama, meditation, anatomy, philosophy, alignment and teaching methodology.",
      "isPartOf": { "@id": "https://www.indianyogaassociation.com/#website" },
      "about": { "@id": "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html#course" },
      "breadcrumb": { "@id": "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html#breadcrumb" }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.indianyogaassociation.com/#website",
      "url": "https://www.indianyogaassociation.com/",
      "name": "Indian Yoga Association",
      "publisher": { "@id": "https://www.indianyogaassociation.com/#organization" },
      "inLanguage": "en"
    },
    {
      "@type": "Course",
      "@id": "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html#course",
      "url": "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html",
      "name": "200 Hour Yoga Teacher Training in Rishikesh",
      "description": "A residential 200-hour yoga teacher training course in Rishikesh covering Hatha Yoga, Ashtanga Vinyasa, pranayama, meditation, anatomy, philosophy, alignment and teaching methodology.",
      "image": "https://www.indianyogaassociation.com/images/200-hour-yoga-teacher-training-course-rishikesh.webp",
      "provider": { "@id": "https://www.indianyogaassociation.com/#organization" },
      "educationalLevel": "Beginner to intermediate",
      "courseMode": "onsite",
      "inLanguage": ["en", "hi"],
      "timeRequired": "PT200H",
      "occupationalCredentialAwarded": "200 Hour Yoga Teacher Training Certificate",
      "offers": {
        "@type": "AggregateOffer",
        "url": "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html",
        "priceCurrency": "USD",
        "lowPrice": 749,
        "highPrice": 1099,
        "offerCount": 3,
        "availability": "https://schema.org/InStock"
      },
      "hasCourseInstance": [
        { "@type": "CourseInstance", "name": "October 2026 – 200 Hour Yoga Teacher Training", "startDate": "2026-10-03", "endDate": "2026-10-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "November 2026 – 200 Hour Yoga Teacher Training", "startDate": "2026-11-03", "endDate": "2026-11-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "December 2026 – 200 Hour Yoga Teacher Training", "startDate": "2026-12-03", "endDate": "2026-12-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "January 2027 – 200 Hour Yoga Teacher Training", "startDate": "2027-01-05", "endDate": "2027-01-29", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "February 2027 – 200 Hour Yoga Teacher Training", "startDate": "2027-02-03", "endDate": "2027-02-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "March 2027 – 200 Hour Yoga Teacher Training", "startDate": "2027-03-03", "endDate": "2027-03-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "April 2027 – 200 Hour Yoga Teacher Training", "startDate": "2027-04-03", "endDate": "2027-04-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "May 2027 – 200 Hour Yoga Teacher Training", "startDate": "2027-05-03", "endDate": "2027-05-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "June 2027 – 200 Hour Yoga Teacher Training", "startDate": "2027-06-03", "endDate": "2027-06-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "July 2027 – 200 Hour Yoga Teacher Training", "startDate": "2027-07-03", "endDate": "2027-07-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "August 2027 – 200 Hour Yoga Teacher Training", "startDate": "2027-08-03", "endDate": "2027-08-27", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.indianyogaassociation.com/" },
        { "@type": "ListItem", "position": 2, "name": "200 Hour Yoga Teacher Training in Rishikesh", "item": "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html" }
      ]
    }
  ]
};