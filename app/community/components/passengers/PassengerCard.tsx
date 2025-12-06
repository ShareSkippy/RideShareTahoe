import React from 'react';
import { ProfileType } from '../../types';
import { BaseProfileCard } from '../common/BaseProfileCard';

interface PassengerCardProps {
  readonly profile: ProfileType;
}

export default function PassengerCard({
  profile,
}: Readonly<Omit<PassengerCardProps, 'onMessage'>>) {
  const { bio } = profile;

  return (
    <BaseProfileCard profile={profile}>
      {/* Bio */}
      {bio && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3">{bio}</p>
        </div>
      )}
    </BaseProfileCard>
  );
}
