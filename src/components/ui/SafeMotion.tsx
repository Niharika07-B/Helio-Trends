'use client';

import { useState, useEffect } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface SafeMotionProps extends MotionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SafeMotionDiv({ children, fallback, ...motionProps }: SafeMotionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div {...(motionProps as any)}>{fallback || children}</div>;
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}

export function SafeMotionSpan({ children, fallback, ...motionProps }: SafeMotionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span {...(motionProps as any)}>{fallback || children}</span>;
  }

  return <motion.span {...motionProps}>{children}</motion.span>;
}