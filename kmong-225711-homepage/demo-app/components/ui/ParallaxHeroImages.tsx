'use client';

import React from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

/**
 * Hero Parallax — Aceternity UI (reference: https://ui.aceternity.com/components/hero-parallax)
 * Verbatim demo structure. Content = product list (title, link, thumbnail).
 */
export interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

export default function HeroParallax({
  products,
  headerTitle,
  headerSubtitle,
}: {
  products: Product[];
  headerTitle?: React.ReactNode;
  headerSubtitle?: React.ReactNode;
}) {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

  return (
    <div
      ref={ref}
      className="h-[200vh] md:h-[300vh] py-20 md:py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header headerTitle={headerTitle} headerSubtitle={headerSubtitle} />
      <motion.div style={{ rotateX, rotateZ, translateY, opacity }}>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 md:space-x-20 mb-6 md:mb-20">
          {firstRow.map(product => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-6 md:mb-20 space-x-6 md:space-x-20">
          {secondRow.map(product => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 md:space-x-20">
          {thirdRow.map(product => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function Header({ headerTitle, headerSubtitle }: { headerTitle?: React.ReactNode; headerSubtitle?: React.ReactNode }) {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
        {headerTitle ?? (<>Technology<br /> that delivers.</>)}
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200">
        {headerSubtitle ?? '비즈니스의 가능성을 기술로 실현합니다. 복잡한 문제를 단순하고 우아한 솔루션으로 전환합니다.'}
      </p>
    </div>
  );
}

function ProductCard({ product, translate }: { product: Product; translate: MotionValue<number> }) {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product h-60 w-[16rem] md:h-96 md:w-[30rem] relative shrink-0"
    >
      <a href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-lg"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none rounded-lg" />
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-bold" style={{ fontFamily: 'var(--font-display)' }}>
        {product.title}
      </h2>
    </motion.div>
  );
}
