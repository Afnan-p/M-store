import React from "react";
import { Link } from "react-router-dom";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[82vh] sm:min-h-[85vh] lg:h-screen lg:min-h-[100dvh] w-full overflow-hidden bg-[#FAF9F6] border-b border-zinc-200/60 flex flex-col justify-between">

      {/* =====================================================
          SOFT AMBIENT BACKGROUND GLOW (BEHIND PNG PRODUCT)
      ====================================================== */}
      <div
        className="
          absolute
          right-[5%] lg:right-[8%]
          bottom-[2%] lg:bottom-[4%]
          w-[320px] sm:w-[460px] lg:w-[560px]
          h-[320px] sm:h-[460px] lg:h-[560px]
          rounded-full
          bg-[radial-gradient(circle,rgba(245,230,210,0.45)_0%,rgba(250,249,246,0)_70%)]
          pointer-events-none
          z-0
        "
      />

      {/* =====================================================
          DESKTOP RIGHT SIDE TRANSPARENT PRODUCT PNG IMAGE (SCALED UP LARGER - ONLY IMAGE)
      ====================================================== */}
      <div className="hidden lg:flex absolute right-0 bottom-0 top-28 lg:top-28 xl:top-24 w-[52%] xl:w-[56%] items-end justify-end pr-4 xl:pr-8 pointer-events-none z-10">
        <img
          src="/images/hero-object.png"
          alt="M Store iPhone 16 Pro"
          className="w-full h-auto max-h-[90%] lg:max-h-[92%] xl:max-h-[95%] object-contain object-right-bottom scale-100 lg:scale-[1.05] xl:scale-[1.12] origin-bottom-right transition-transform duration-300 drop-shadow-[0_22px_55px_rgba(0,0,0,0.12)]"
        />
      </div>

      {/* =====================================================
          HERO CONTENT CONTAINER (SHIFTED DOWNWARDS)
      ====================================================== */}
      <div
        className="
          relative z-20
          mx-auto flex flex-col lg:flex-row flex-1
          w-full max-w-[1800px]
          items-center justify-between
          px-5 sm:px-[6.5vw]
          pt-16 sm:pt-24 lg:pt-24
          pb-2 lg:pb-4
        "
      >

        {/* =================================================
            LEFT CONTENT (EYEBROW, TITLE, DESCRIPTION, CTA) - MOVED UPWARDS
        ================================================== */}
        <div
          className="
            relative z-20
            w-full
            max-w-[620px]
            lg:w-[48%]
            xl:w-[45%]
            text-left
            pt-2 sm:pt-4 lg:pt-0
          "
        >

          {/* EYEBROW */}
          <div
            className="
              mb-4 sm:mb-6 flex items-center gap-2.5
              text-[11px] font-extrabold
              tracking-[0.22em] text-[#E50914]
              uppercase
            "
          >
            <span className="h-[2px] w-10 bg-[#E50914]" />
            NEW · PRE-OWNED · ACCESSORIES
          </div>


          {/* TITLE */}
          <h1
            className="
              text-[44px]
              font-black
              leading-[0.95]
              tracking-tight
              text-zinc-950
              sm:text-[66px]
              lg:text-[76px]
              xl:text-[86px]
            "
          >
            More Than Just

            <span className="block text-[#E50914]">
              iPhones.
            </span>
          </h1>


          {/* DESCRIPTION */}
          <p
            className="
              mt-5 sm:mt-6 max-w-[490px]
              text-[15px] sm:text-[18px]
              leading-[1.55]
              text-zinc-600
              font-medium
            "
          >
            Curated iPhones. Trusted quality. A premium
            destination for new, pre-owned and genuine
            Apple essentials.
          </p>


          {/* CTA BUTTON */}
          <Link
            to="/iphones"
            className="
              mt-6 sm:mt-8 inline-flex h-[54px] sm:h-[56px]
              min-w-[210px] sm:min-w-[220px]
              items-center justify-center
              gap-4
              rounded-full
              bg-[#E50914]
              px-8
              text-[15px]
              font-bold text-white
              shadow-[0_12px_28px_rgba(229,9,20,0.3)]
              transition-all
              hover:-translate-y-1
              hover:bg-red-700
              active:scale-95
            "
          >
            <span>Shop iPhones</span>
            <span className="text-xl">→</span>
          </Link>


          {/* BOTTOM LINE */}
          <div
            className="
              mt-10 sm:mt-14
              hidden sm:flex items-center gap-4
              text-[9.5px]
              font-extrabold
              tracking-[0.22em]
              text-zinc-400
              uppercase
            "
          >
            <span className="h-px w-14 bg-zinc-300" />

            APPLE FOR A BRIGHTER TOMORROW

            <span className="h-px w-14 bg-zinc-300" />
          </div>

        </div>

        {/* =================================================
            MOBILE / TABLET TRANSPARENT PRODUCT PNG SHOWCASE
        ================================================== */}
        <div className="w-full mt-6 sm:mt-8 mb-2 flex flex-col items-center justify-end lg:hidden z-20">
          <img
            src="/images/hero-object.png"
            alt="M Store iPhone 16 Pro"
            className="w-full max-w-[310px] sm:max-w-[400px] h-auto object-contain scale-105 sm:scale-110 drop-shadow-[0_15px_35px_rgba(0,0,0,0.12)]"
          />
          <div
            className="
              mt-6 flex sm:hidden items-center justify-center gap-3
              text-[9px]
              font-extrabold
              tracking-[0.2em]
              text-zinc-400
              uppercase
            "
          >
            <span className="h-px w-10 bg-zinc-300" />
            APPLE FOR A BRIGHTER TOMORROW
            <span className="h-px w-10 bg-zinc-300" />
          </div>
        </div>

      </div>

    </section>
  );
};

export default Hero;