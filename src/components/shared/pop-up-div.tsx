'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type PopProps = {
    children?: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
};

export default function PopUp({ children, delay = 0, duration = 0.2, className }: PopProps) {
    return (
        <motion.div
            className={className}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration,
                delay,
                type: 'spring',
                stiffness: 100,
                damping: 12,
            }}
        >
            {children}
        </motion.div>
    );
}
