"use client";

import { Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NextPage } from "next";
import apiRequest from "@/lib/apiRequest";
import toast from "react-hot-toast";
import { useState } from "react";
import { useTranslations } from "next-intl";

const ContactPage: NextPage = () => {
  const t = useTranslations("contact");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      const res = await apiRequest.post("/messages", formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send message.");
    }
  };

  return (
    <section
      className="flex flex-col lg:flex-row justify-center items-start gap-10 p-4 sm:p-6 md:p-8 bg-[#150d23] text-[#fbd9ad]"
      id="contact"
    >
      <div className="flex-1 w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          {t("title")}
        </h1>
        <p className="mb-6 text-base sm:text-lg">
          Have a question or want to work together? Let’s talk.
        </p>
        <Button
          asChild
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 hover:bg-blue-700 transition-colors mb-6"
        >
          <a
            href="mailto:priyanshumandloi91@gmail.com"
            target="_blank"
            aria-label="Hire Me"
          >
            {t("email")}
          </a>
        </Button>

        <div className="w-full h-64 sm:h-80 md:h-60 rounded-lg overflow-hidden border-4 border-[#fbd9ad]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d363.1980633694347!2d75.28516982732123!3d22.12008239575678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39620dea88edb639%3A0x94fae9d3ec56fb83!2sRam%20Mandir%20Brahamangoan!5e1!3m2!1sen!2sbd!4v1697909489850!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            title="Contact Map"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="flex-1 w-full max-w-xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-6 w-full"
        >
          <div className="w-full">
            <label htmlFor="name" className="block mb-1 font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#150d23] border-2 border-[#fbd9ad] text-[#fbd9ad] placeholder-[#fbd9ad] focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#150d23] border-2 border-[#fbd9ad] text-[#fbd9ad] placeholder-[#fbd9ad] focus:outline-none"
            />
          </div>

          <div className="w-full">
            <label htmlFor="message" className="block mb-1 font-semibold">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Enter message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#150d23] border-2 border-[#fbd9ad] text-[#fbd9ad] placeholder-[#fbd9ad] focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="self-start px-6 py-3 bg-[#fbd9ad] text-[#742586] font-bold rounded-full flex items-center gap-2 hover:opacity-90 transition"
          >
            Submit <Send className="-rotate-12" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
