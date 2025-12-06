'use client';

import { useRouter } from 'next/navigation';
import HeroSection from '@/components/landing/HeroSection';
import InfoGridSection from '@/components/landing/InfoGridSection';
import StoriesSection from '@/components/landing/StoriesSection';
import ClosingCta from '@/components/landing/ClosingCta';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <HeroSection />
      <InfoGridSection
        title="Why RideShareTahoe?"
        description="We are more than just a carpool app. We are a community dedicated to making Tahoe accessible and sustainable."
        backgroundClass="bg-white"
        sectionTextClass="text-slate-900"
        cardClassName="bg-slate-50 border border-slate-200 rounded-4xl shadow-xl p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-slate-900"
        descriptionClassName="text-base text-slate-700 leading-relaxed"
        summaryClassName="text-lg text-slate-600 max-w-3xl mx-auto"
        items={[
          {
            icon: '🛡️',
            title: 'Verified Profiles',
            description:
              'Trust is our currency. All members are verified with social profiles and community reviews.',
          },
          {
            icon: '💰',
            title: 'Transparent Pricing',
            description:
              'Fair cost sharing. Drivers set the price, but we cap it to ensure it remains a cost-sharing community, not a taxi service.',
          },
          {
            icon: '🌱',
            title: 'Eco-Friendly',
            description:
              'Every shared ride takes a car off the road. Help protect the environment we all love.',
          },
        ]}
        cta={{
          label: 'Learn More',
          onClick: () => router.push('/how-to-use'),
        }}
      />
      <StoriesSection
        heading="Community Stories"
        stories={[
          {
            quote: 'Be our first storyteller!!',
            author: 'You',
          },
          {
            quote: 'Be our second storyteller!',
            author: 'You',
          },
          {
            quote: 'Be our third storyteller!',
            author: 'You',
          },
        ]}
        cta={{
          label: 'Read More Stories',
          onClick: () => router.push('/our-story'),
        }}
      />
      <ClosingCta
        title="Ready to hit the slopes?"
        subtitle="Join thousands of Bay Area skiers and snowboarders today."
        primary={{
          label: 'Join Now',
          onClick: () => router.push('/community'),
        }}
      />
    </main>
  );
}
