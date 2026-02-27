"use client";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import styles from "../assets/style/WhatsappButton.module.css";

const WhatsappButton: React.FC = () => {
  const phoneNumber: string = "918476898395";
  const message: string =
    "Hello, I want to know more about your traning course.";

  const whatsappUrl: string = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappFloat}
    >
      <FaWhatsapp className={styles.icon} />
    </a>
  );
};

export default WhatsappButton;
