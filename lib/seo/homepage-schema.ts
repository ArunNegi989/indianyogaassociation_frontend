export const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "HealthClub"],
      "@id": "https://www.indianyogaassociation.com/#organization",
      name: "Indian Yoga Association",
      alternateName: "Indian Association for Yoga and Meditation",
      url: "https://www.indianyogaassociation.com/",
      logo: {
        "@type": "ImageObject",
        "@id": "https://www.indianyogaassociation.com/#logo",
        url: "https://www.indianyogaassociation.com/images/logo.png",
        contentUrl: "https://www.indianyogaassociation.com/images/logo.png",
        caption: "Indian Yoga Association",
      },
      image: { "@id": "https://www.indianyogaassociation.com/#logo" },
      description:
        "Indian Yoga Association is a yoga teacher training school in Rishikesh offering residential 100, 200, 300 and 500-hour yoga teacher training courses, yoga retreats and wellness programs.",
      foundingDate: "2005",
      founder: { "@type": "Person", name: "Yogi Chetan Mahesh" },
      telephone: "+91-7500277709",
      email: "info@indianyogaassociation.com",
      priceRange: "$$",
      currenciesAccepted: "USD, INR",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Upper Tapovan, Tapovan",
        addressLocality: "Rishikesh",
        addressRegion: "Uttarakhand",
        postalCode: "249192",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 30.130187,
        longitude: 78.323056,
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "admissions and customer support",
        telephone: "+91-7500277709",
        email: "info@indianyogaassociation.com",
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: ["https://www.instagram.com/indianyogaassociation/"],
      knowsAbout: [
        "Yoga teacher training",
        "Hatha Yoga",
        "Ashtanga Vinyasa Yoga",
        "Pranayama",
        "Meditation",
        "Yoga anatomy",
        "Yoga philosophy",
        "Yoga teaching methodology",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.indianyogaassociation.com/#website",
      url: "https://www.indianyogaassociation.com/",
      name: "Indian Yoga Association",
      description:
        "Yoga teacher training courses and yoga retreats in Rishikesh, India.",
      publisher: {
        "@id": "https://www.indianyogaassociation.com/#organization",
      },
      inLanguage: "en",
    },
    {
      "@type": "WebPage",
      "@id": "https://www.indianyogaassociation.com/#webpage",
      url: "https://www.indianyogaassociation.com/",
      name: "Yoga Teacher Training in Rishikesh - Indian Yoga Association",
      description:
        "Join certified residential yoga teacher training in Rishikesh with 100, 200, 300 and 500-hour courses covering Hatha Yoga, Ashtanga Vinyasa, pranayama, meditation, anatomy, philosophy and teaching methodology.",
      isPartOf: { "@id": "https://www.indianyogaassociation.com/#website" },
      about: { "@id": "https://www.indianyogaassociation.com/#organization" },
      mainEntity: {
        "@id": "https://www.indianyogaassociation.com/#course-list",
      },
      inLanguage: "en",
    },
    {
      "@type": "ItemList",
      "@id": "https://www.indianyogaassociation.com/#course-list",
      name: "Yoga Teacher Training Courses in Rishikesh",
      numberOfItems: 4,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Course",
            name: "100 Hour Yoga Teacher Training in Rishikesh",
            description:
              "A short residential foundation course in Rishikesh covering Hatha Yoga, Ashtanga Vinyasa, pranayama, meditation, philosophy, anatomy and introductory teaching practice.",
            url: "https://www.indianyogaassociation.com/100-hour-yoga-teacher-training-in-rishikesh.html",
            provider: {
              "@id": "https://www.indianyogaassociation.com/#organization",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Course",
            name: "200 Hour Yoga Teacher Training in Rishikesh",
            description:
              "A residential foundation-level yoga teacher training course covering Hatha Yoga, Ashtanga Vinyasa, pranayama, meditation, anatomy, philosophy, alignment and teaching methodology.",
            url: "https://www.indianyogaassociation.com/200-hour-yoga-teacher-training-rishikesh.html",
            provider: {
              "@id": "https://www.indianyogaassociation.com/#organization",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "Course",
            name: "300 Hour Yoga Teacher Training in Rishikesh",
            description:
              "An advanced residential yoga teacher training course covering multi-style yoga, advanced alignment, teaching methodology, anatomy, philosophy, pranayama and meditation.",
            url: "https://www.indianyogaassociation.com/300-hours-yoga-teacher-training-rishikesh.html",
            provider: {
              "@id": "https://www.indianyogaassociation.com/#organization",
            },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "Course",
            name: "500 Hour Yoga Teacher Training Course in Rishikesh",
            description:
              "A residential beginner-to-advanced program combining 200-hour foundation training and 300-hour advanced yoga teacher training in Rishikesh.",
            url: "https://www.indianyogaassociation.com/500-hour-yoga-teacher-training-india.html",
            provider: {
              "@id": "https://www.indianyogaassociation.com/#organization",
            },
          },
        },
      ],
    },
  ],
};
