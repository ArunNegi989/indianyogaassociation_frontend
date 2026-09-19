export const ytt500JsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "HealthClub"],
      "@id": "https://www.indianyogaassociation.com/#organization",
      "name": "Indian Yoga Association",
      "url": "https://www.indianyogaassociation.com/",
      "image": "https://www.indianyogaassociation.com/images/Experience-the-vedic-tradition-for-500-hour.jpg",
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
      "sameAs": ["https://www.instagram.com/indianyogaassociation/"]
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
      "@type": "WebPage",
      "@id": "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html#webpage",
      "url": "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html",
      "name": "500 Hour Yoga Teacher Training Course in Rishikesh",
      "description": "A residential 500-hour yoga teacher training course in Rishikesh combining foundational and advanced training in Hatha Yoga, Ashtanga Yoga, multi-style yoga, anatomy, philosophy, pranayama, meditation and teaching methodology.",
      "isPartOf": { "@id": "https://www.indianyogaassociation.com/#website" },
      "about": { "@id": "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html#course" },
      "breadcrumb": { "@id": "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html#breadcrumb" }
    },
    {
      "@type": "Course",
      "@id": "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html#course",
      "url": "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html",
      "name": "500 Hour Yoga Teacher Training Course in Rishikesh",
      "description": "A residential 500-hour yoga teacher training course in Rishikesh combining foundational and advanced training in Hatha Yoga, Ashtanga Yoga, multi-style yoga, anatomy, philosophy, pranayama, meditation and teaching methodology.",
      "image": "https://www.indianyogaassociation.com/images/Experience-the-vedic-tradition-for-500-hour.jpg",
      "provider": { "@id": "https://www.indianyogaassociation.com/#organization" },
      "educationalLevel": "Beginner to advanced",
      "courseMode": "onsite",
      "inLanguage": ["en", "hi"],
      "timeRequired": "PT500H",
      "occupationalCredentialAwarded": "500 Hour Yoga Teacher Training Certificate",
      "offers": {
        "@type": "Offer",
        "url": "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html",
        "price": 1649,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "hasCourseInstance": [
        { "@type": "CourseInstance", "name": "October–November 2026 – 500 Hour Yoga Teacher Training", "startDate": "2026-10-03", "endDate": "2026-11-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "November–December 2026 – 500 Hour Yoga Teacher Training", "startDate": "2026-11-03", "endDate": "2026-12-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "December 2026–January 2027 – 500 Hour Yoga Teacher Training", "startDate": "2026-12-03", "endDate": "2027-01-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "January–February 2027 – 500 Hour Yoga Teacher Training", "startDate": "2027-01-05", "endDate": "2027-02-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "February–March 2027 – 500 Hour Yoga Teacher Training", "startDate": "2027-02-03", "endDate": "2027-03-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "March–April 2027 – 500 Hour Yoga Teacher Training", "startDate": "2027-03-03", "endDate": "2027-04-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "April–May 2027 – 500 Hour Yoga Teacher Training", "startDate": "2027-04-03", "endDate": "2027-05-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "May–June 2027 – 500 Hour Yoga Teacher Training", "startDate": "2027-05-03", "endDate": "2027-06-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "June–July 2027 – 500 Hour Yoga Teacher Training", "startDate": "2027-06-03", "endDate": "2027-07-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } },
        { "@type": "CourseInstance", "name": "July–August 2027 – 500 Hour Yoga Teacher Training", "startDate": "2027-07-03", "endDate": "2027-08-28", "courseMode": "onsite", "location": { "@id": "https://www.indianyogaassociation.com/#organization" } }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.indianyogaassociation.com/" },
        { "@type": "ListItem", "position": 2, "name": "500 Hour Yoga Teacher Training Course in Rishikesh", "item": "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html" }
      ]
    }
  ]
};