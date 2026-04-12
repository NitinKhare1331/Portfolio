"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import Timeline from "./Timeline";
import TestimonialContent from "./TestimonialContent";

const testimonials = [
  {
    id: 1,
    quote: "Not only did PragetX Softwares execute their tasks well and on time, but they also provided reliable consulting support and were always available to help. The team exhibited a high level of attention to detail and a genuine dedication to delivering accurate, high-quality work.",
    authorName: "Mahdi Heraki",
    authorTitle: "Information Specialist - DW",
    authorImageUrl: "/people/mahdi-heraki.svg",
  },
  {
    id: 2,
    quote: "Hello PragetX team, Really happy with their work, very cooperative, excellent UI designs they have done for my application, really worthwhile and happy choosing this company",
    authorName: "Vinay Kumar",
    authorTitle: "Founder & CEO - Infinity Talks",
    authorImageUrl: "/portfolio/infiniti-talks/vinay-kumar.jpg",
  },
  {
    id: 3,
    quote: "PragetX has provided expertise and professional project management on high level. Design, Build, Implementation, UAT done as requested. Issue Fixing after UAT was done very fast. The team delivered exceeding quality, on time with perfect communication skills.",
    authorName: "Michael Kohlert",
    authorTitle: "Founder & CEO - The Integrated",
    authorImageUrl: "/people/michael-kohlert.jpg",
  },
  {
    id: 4,
    quote: "Highly recommend. I think their strong point is communication. They do follow you in your project and that is priceless. We hired this agency for a redesign of a corporate site in europe. They work on budget and deliver on time. Thanks",
    authorName: "Carlos Rosales",
    authorTitle: "Co-Founder - Zdc Studio",
    authorImageUrl: "/people/carlos-rosales.jpg",
  },
  {
    id: 5,
    quote: "We came across Pragtex through one of our Developer first to fix some IOS related Bugs but over a period of time based on our interaction with the team we found them very skilled, proactive, professional, agile, and open to discussing issues to find the right solutions economically.",
    authorName: "Neeraj Gala",
    authorTitle: "Co-Founder & CEO - UrNest AirBnB of Cloud Kitchen",
    authorImageUrl: "/people/neeraj-gala.jpg",
  },
  {
    id: 6,
    quote: "Team was professional and understood the requirements well. They were responsive and deliver the app as I desired. Surely recommended to you.",
    authorName: "Alex Nee",
    authorTitle: "Founder & CEO - Sun Teame Pte Ltd",
    authorImageUrl: "/people/alex-nee.jpg",
  },
  {
    id: 7,
    quote: "PragetX Softwares has successfully launched the app and made it available for users to download. The team works hard to achieve milestones and promptly addresses any queries, concerns, or requests. Moreover, they're very receptive to feedback, personable, and flexible in making changes.",
    authorName: "D. Noel Keshwar",
    authorTitle: "Founder & App Designer - 1Creative.Studio",
    authorImageUrl: "/people/noel-keshwar.png",
  },
  {
    id: 8,
    quote: "PragetX Softwares's output received excellent reviews during the test phase. They conducted online meetings to ensure a smooth project. Their commitment to achieving the best results was impressive.",
    authorName: "Archana",
    authorTitle: "Founder - School Owls",
    authorImageUrl: "/people/archana.png",
  },
  {
    id: 9,
    quote: "PragetX technologies have delivered excellence in both performance and service in the development of Alpha1 Radio App. Their commitment to client satisfaction is evident in every aspect of the app's functionality and user experience.",
    authorName: "Israel Adeyemi",
    authorTitle: "Human Resource/Operations - Alpha One Foundation",
    authorImageUrl: "/people/Israel_Adeyemi.svg",
  },
  {
    id: 10,
    quote: "Deliverables were on point and the critiques/inputs were taken very constructively by the team. Communication was on point and on time. Will definitely keep working and collaborating with them.",
    authorName: "Ujjal Hafila",
    authorTitle: "Product and Experience Designer - Wooqer",
    authorImageUrl: "/people/Ujjal_Hafila.svg",
  },
  {
    id: 11,
    quote: "PragetX is a great trustworthy tech company with a compassionate sense toward clients. We worked together on a few projects and their team delivered great work.",
    authorName: "Anu Ravi",
    authorTitle: "Vice President - Urolime Technologies Pvt Ltd",
    authorImageUrl: "/people/Anu_Ravi.svg",
  },
  {
    id: 12,
    quote: "The task I gave them was done precisely with all of my requirements and they did a fantastic job. They also kept me updated on every step of my work process. The team was very humble and friendly.",
    authorName: "Kunal Choudhary",
    authorTitle: "Managing Director - Choudhary Tour & Travels",
    authorImageUrl: "/people/kunal_choudhary.svg",
  },
  {
    id: 13,
    quote: "I worked with multiple people at PragetX and found them to be professional and flexible on requirements. I would definitely recommend them for startups who are looking at getting things done quickly in a cost effective manner.",
    authorName: "Viraj Damani",
    authorTitle: "COO & Head of Growth Strategy - Tru Performance Inc",
    authorImageUrl: "/people/Viraj_Damani.svg",
  },
];

const AUTOPLAY_MS = 4000;

const TestimonialsSection = memo(function TestimonialsSection() {
  const data = useMemo(() => testimonials, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const hoveredRef = useRef(false);
  const intervalRef = useRef(null);

  const startTimer = useCallback((goNext) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!hoveredRef.current) goNext();
    }, AUTOPLAY_MS);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex(prev => prev + 1);
  }, []);

  useEffect(() => {
    startTimer(goNext);
    return () => clearInterval(intervalRef.current);
  }, [goNext, startTimer]);

  const handleSelect = useCallback((absIdx) => {
    setActiveIndex(absIdx);
    startTimer(() => setActiveIndex(prev => prev + 1));
  }, [startTimer]);

  const handleMouseEnter = useCallback(() => { hoveredRef.current = true; }, []);
  const handleMouseLeave = useCallback(() => { hoveredRef.current = false; }, []);

  return (
    <section
      className="relative w-full bg-gray-50 py-20 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Customer Reviews"
    >
      <div className="relative max-w-5xl mx-auto px-6">

        {/* ── Green geometric block (sits behind + to the left of the card) ── */}
        <div
          className="absolute bg-green-700 rounded-sm"
          style={{
            top: -16,
            left: -32,
            width: "38%",
            bottom: -16,
            // clip the top-right corner diagonally
            clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
          }}
          aria-hidden="true"
        />

        {/* ── White card ─────────────────────────────────────────────────── */}
        <div
          className="relative z-10 bg-white rounded-2xl shadow-xl overflow-hidden"
          style={{ minHeight: 340 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex flex-col md:flex-row min-h-[340px]">

            {/* LEFT / TOP: Title + Timeline */}
            <div className="flex flex-col px-6 md:px-8 py-8 items-center md:items-start w-full md:w-[310px] shrink-0">
              {/* Heading */}
              <div className="mb-6 w-full text-center md:text-left">
                <div className="w-8 h-0.5 bg-green-600 rounded-full mb-2 mx-auto md:mx-0" />
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  Customer Reviews
                </h2>
              </div>

              {/* Timeline */}
              <div className="w-full flex justify-center pb-4 md:pb-0 overflow-visible">
                <Timeline
                  testimonials={data}
                  activeIndex={activeIndex}
                  onSelect={handleSelect}
                />
              </div>
            </div>

            {/* Divider */}
            {/* <div className="hidden md:block w-px bg-gray-100 self-stretch my-8" aria-hidden="true" /> */}
            {/* <div className="md:hidden h-px bg-gray-100 w-full mb-4" aria-hidden="true" /> */}

            {/* RIGHT / BOTTOM: Quote content */}
            <div className="flex-1 overflow-hidden px-6 md:px-8 pb-8 md:py-8 h-[320px] md:h-auto">
              <TestimonialContent testimonial={data[((activeIndex % data.length) + data.length) % data.length]} />
            </div>
          </div>
        </div>

        {/* ── Dot navigation ──────────────────────────────────────────────── */}
        <div
          className="relative z-10 flex justify-center gap-2 mt-5"
          role="tablist"
          aria-label="Testimonial navigation"
        >
          {data.map((t, i) => {
            const currentMod = ((activeIndex % data.length) + data.length) % data.length;
            const isSelected = i === currentMod;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isSelected}
                aria-label={`Go to review ${i + 1}`}
                onClick={() => {
                  let diff = i - currentMod;
                  // If jump is more than half the array, go the shorter way around
                  if (diff > data.length / 2) diff -= data.length;
                  if (diff < -data.length / 2) diff += data.length;
                  handleSelect(activeIndex + diff);
                }}
                className="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                style={{
                  width: isSelected ? 20 : 8,
                  height: 8,
                  background: isSelected ? "#15803d" : "#d1d5db",
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default TestimonialsSection;
