'use client';

import React, { Fragment, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { createTripBookingSchema } from '@/libs/validations/trips';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import type { RidePostType } from '@/app/community/types';

interface TripBookingModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly ride: RidePostType;
}

export default function TripBookingModal({ isOpen, onClose, ride }: TripBookingModalProps) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState(ride.departure_date);
  const [pickupTime, setPickupTime] = useState(ride.departure_time.slice(0, 5));
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Client-side validation
      createTripBookingSchema.parse({
        ride_id: ride.id,
        pickup_location: pickupLocation,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        passenger_notes: notes || undefined,
      });

      const res = await fetch('/api/trips/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ride_id: ride.id,
          pickup_location: pickupLocation,
          pickup_date: pickupDate,
          pickup_time: pickupTime,
          passenger_notes: notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle server-side Zod issues or string error
        if (Array.isArray(data.error)) {
          // Assuming data.error is an array of issues (ZodIssue[])
          throw new TypeError(data.error[0].message || 'Validation failed');
        }
        throw new Error(data.error || 'Failed to book ride');
      }

      onClose();
      // Optional: Trigger a refresh or toast
      toast.success('Request sent successfully!');
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Request to Join Ride
                </DialogTitle>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="pickup-location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Pickup Location
                    </label>
                    <input
                      id="pickup-location"
                      type="text"
                      required
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 sm:text-sm px-3 py-2 border"
                      placeholder="e.g. 123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="pickup-date"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Date
                      </label>
                      <input
                        id="pickup-date"
                        type="date"
                        required
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 sm:text-sm px-3 py-2 border"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="pickup-time"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Time
                      </label>
                      <input
                        id="pickup-time"
                        type="time"
                        required
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 sm:text-sm px-3 py-2 border"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="passenger-notes"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Notes for Driver (Optional)
                    </label>
                    <textarea
                      id="passenger-notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 sm:text-sm px-3 py-2 border"
                      placeholder="Any flexible timing, luggage info, etc."
                    />
                  </div>

                  {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
                    >
                      {isSubmitting ? 'Sending Request...' : 'Send Request'}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
