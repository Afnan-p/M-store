import React from "react";
import { Link } from "react-router-dom";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[82vh] sm:min-h-[85vh] lg:h-screen lg:min-h-[100dvh] w-full overflow-hidden bg-[#FAF9F6] border-b border-zinc-200/60 flex flex-col justify-between">

      {/* =====================================================
          SOFT AMBIENT BACKGROUND GLOW (100% SEAMLESS BLEND - NO HARD CIRCLE)
      ====================================================== */}
      <div
        className="
          absolute
          right-0
          bottom-0
          w-[60%]
          h-full
          bg-[radial-gradient(circle_at_75%_70%,rgba(245,230,210,0.35)_0%,rgba(250,249,246,0)_70%)]
          pointer-events-none
          z-0
        "
      />

      {/* =====================================================
          DESKTOP RIGHT SIDE TRANSPARENT PRODUCT PNG IMAGE (SCALED DOWN SLIGHTLY - 20px REDUCED)
      ====================================================== */}
      <div className="hidden lg:flex absolute right-0 bottom-0 top-[144px] lg:top-[144px] xl:top-[128px] w-[50%] xl:w-[54%] items-end justify-end pr-4 xl:pr-8 pointer-events-none z-10">
        <img
          src="/images/hero-object.png"
          alt="M Store iPhone 16 Pro"
          className="w-full h-auto max-h-[86%] lg:max-h-[88%] xl:max-h-[92%] object-contain object-right-bottom scale-95 lg:scale-[1.0] xl:scale-[1.06] origin-bottom-right transition-transform duration-300 drop-shadow-[0_22px_55px_rgba(0,0,0,0.12)]"
        />
      </div>

      {/* =====================================================
          HERO CONTENT CONTAINER (REDUCED 8px GAP BELOW NAVBAR)
      ====================================================== */}
      <div
        className="
          relative z-20
          mx-auto flex flex-col lg:flex-row flex-1
          w-full max-w-[1800px]
          items-center justify-between
          px-5 sm:px-[6.5vw]
          pt-[128px] sm:pt-[144px] lg:pt-[128px]
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
              mb-3.5 sm:mb-6 flex items-center gap-2.5
              text-[10px] sm:text-[11px] font-extrabold
              tracking-[0.22em] text-[#E50914]
              uppercase
              animate-hero-text-smooth apple-delay-0
            "
          >
            <span className="h-[2px] w-8 sm:w-10 bg-[#E50914]" />
            NEW · PRE-OWNED · ACCESSORIES
          </div>


          {/* TITLE */}
          <h1
            className="
              font-ds-quilter
              text-[39px]
              font-semibold sm:font-bold
              leading-[1.0] sm:leading-[0.98]
              tracking-tight
              text-zinc-950
              sm:text-[54px]
              lg:text-[62px]
              xl:text-[70px]
              animate-hero-text-smooth apple-delay-150
            "
          >
            More Than Just

            <span className="block text-[#E50914] font-semibold sm:font-bold">
              iPhones.
            </span>
          </h1>


          {/* DESCRIPTION */}
          <p
            className="
              mt-4 sm:mt-6 max-w-[490px]
              text-[14px] sm:text-[16px]
              leading-[1.55]
              text-zinc-600
              font-medium
              animate-hero-text-smooth apple-delay-300
            "
          >
            Curated iPhones. Trusted quality. A premium
            destination for new, pre-owned and genuine
            Apple essentials.
          </p>


          {/* CTA BUTTON (REDUCED CURVE TO ROUNDED-XL) */}
          <Link
            to="/iphones"
            className="
              mt-5 sm:mt-7 inline-flex h-[42px] sm:h-[52px]
              min-w-[155px] sm:min-w-[200px]
              items-center justify-center
              gap-2 sm:gap-3.5
              rounded-xl
              bg-[#E50914]
              px-5 sm:px-7
              text-xs sm:text-[14px]
              font-bold text-white
              shadow-[0_10px_24px_rgba(229,9,20,0.28)]
              transition-all
              hover:-translate-y-1
              hover:bg-red-700
              active:scale-95
              cursor-pointer
              relative z-30
              animate-hero-text-smooth apple-delay-450
            "
          >
            <span>Shop iPhones</span>
            <span className="text-sm sm:text-lg">→</span>
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
              animate-hero-text-smooth apple-delay-600
            "
          >
            <span className="h-px w-14 bg-zinc-300" />

            APPLE FOR A BRIGHTER TOMORROW

            <span className="h-px w-14 bg-zinc-300" />
          </div>

        </div>

        {/* =================================================
            MOBILE / TABLET TRANSPARENT PRODUCT PNG SHOWCASE (REDUCED BY 4px)
        ================================================== */}
        <div className="w-full mt-6 sm:mt-8 mb-2 flex flex-col items-center justify-end lg:hidden z-20">
          <img
            src="/images/hero-object.png"
            alt="M Store iPhone 16 Pro"
            className="w-full max-w-[326px] sm:max-w-[426px] h-auto object-contain scale-[1.04] sm:scale-105 drop-shadow-[0_15px_35px_rgba(0,0,0,0.12)] transition-transform duration-300"
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