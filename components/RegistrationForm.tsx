'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, RegistrationFormData } from '@/lib/validation';
import Button from './ui/Button';
import Card from './ui/Card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        if (isJson) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Registration failed');
        } else {
          throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
        }
      }

      if (!isJson) {
        throw new Error('Invalid response format');
      }

      const result = await response.json();
      router.push('/quiz');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <motion.h2
        className="text-3xl font-bold text-white mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Start Your Journey
      </motion.h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <label htmlFor="name" className="block text-[#E0E0E0] mb-2 font-medium">
            Name
          </label>
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 rounded-xl bg-[#0A2540] border-2 border-[#00FF88]/30 text-white placeholder-[#666] focus:outline-none focus:border-[#00FF88] transition-all"
              placeholder="Enter your name"
            />
          </motion.div>
          <AnimatePresence>
            {errors.name && (
              <motion.p
                className="mt-1 text-sm text-[#FF6B6B]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {errors.name.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <label htmlFor="email" className="block text-[#E0E0E0] mb-2 font-medium">
            Email
          </label>
          <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 rounded-xl bg-[#0A2540] border-2 border-[#00FF88]/30 text-white placeholder-[#666] focus:outline-none focus:border-[#00FF88] transition-all"
              placeholder="Enter your email"
            />
          </motion.div>
          <AnimatePresence>
            {errors.email && (
              <motion.p
                className="mt-1 text-sm text-[#FF6B6B]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {errors.email.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="p-3 rounded-xl bg-[#FF6B6B]/20 border border-[#FF6B6B] text-[#FF6B6B] text-sm"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Starting Game...' : 'Start Game'}
          </Button>
        </motion.div>
      </form>
    </Card>
  );
}

