import Callout from './Callout';

const safetyItems = [
  'Always meet in public places initially',
  "Verify the driver's car and license plate before getting in",
  'Share your trip details with a friend or family member',
  "Trust your instincts - if something feels wrong, don't proceed",
  'Keep emergency contact information handy',
  'Agree on costs and payment methods before the trip',
  'Report any concerning behavior to RideShareTahoe support',
];

/**
 * Displays a quick safety reminder list for users and guests.
 */
export default function SafetyChecklist() {
  return (
    <Callout tone="red" title="✅ Quick Safety Checklist">
      <ul className="list-disc list-inside space-y-1">
        {safetyItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Callout>
  );
}
