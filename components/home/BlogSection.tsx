"use client";
import React, { useState, useEffect } from "react";
import styles from "../../assets/style/Home/BlogSection.module.css";
import api from "@/lib/api";
import Link from "next/link";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  date: string;
  author?: string;
  slug: string;
}

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs/get-all");
        const allBlogs = res.data.data ?? [];
        // Filter published blogs and get latest 4
        const publishedBlogs = allBlogs
          .filter((blog: any) => blog.status === "Published")
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4);
        setBlogs(publishedBlogs);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.a} />
        <div className={styles.container}>
          <div className={styles.blogGrid}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: "380px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(90deg, #fdf0dc 25%, #ffe8c2 50%, #fdf0dc 75%)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}
          </div>
        </div>
        <div className={styles.bottomBorder} />
      </section>
    );
  }

  if (!blogs.length) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.a} />
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.superTitle}>Wisdom & Insights</p>
          <h2 className={styles.mainTitle}>
            Latest Blog Posts &amp; Articles
          </h2>
          <div className={styles.omDivider}>
            <span className={styles.dividerLine} />
            <span className={styles.omSymbol}>ॐ</span>
            <span className={styles.dividerLine} />
          </div>
        </div>

        {/* Blog Grid */}
        <div className={styles.blogGrid}>
          {blogs.map((blog, idx) => (
            <article key={blog._id} className={styles.blogCard}>
              {/* Image Container */}
              <div className={styles.imageContainer}>
                <img
                  src={getImageUrl(blog.coverImage)}
                  alt={blog.title}
                  className={styles.blogImage}
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.onerror = null;
                    t.style.background =
                      "linear-gradient(135deg, #fdf0dc 0%, #ffe8c2 100%)";
                  }}
                />
                <div className={styles.imageOverlay} />
                <div className={styles.categoryBadge}>{blog.category}</div>
              </div>

              {/* Content */}
              <div className={styles.content}>
                <span className={styles.date}>{formatDate(blog.date)}</span>
                <div className={styles.metaInfo}>                  
                  {blog.author && (                    
                    <span className={styles.author}>{blog.author}</span>
                  )}
                </div>

                <h3 className={styles.blogTitle}>{blog.title}</h3>

                <p className={styles.excerpt}>{blog.excerpt}</p>

                <Link href={`/blog/${blog.slug}`} className={styles.readMore}>
                  Read More
                  <span className={styles.arrow}>→</span>
                </Link>
              </div>

              {/* Decorative corner */}
              <div className={styles.cornerDecor} />
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className={styles.viewAllContainer}>
          <Link href="/blog/aym-yoga-blog" className={styles.viewAllBtn}>
            View All Articles
          </Link>
        </div>
      </div>
      <div className={styles.bottomBorder} />
    </section>
  );
};

export default BlogSection;
