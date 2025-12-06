import Link from 'next/link';
import { getSEOTags } from '@/libs/seo';
import config from '@/config';
import LEGAL from '@/lib/legal';

export const metadata = getSEOTags({
  title: `Terms and Conditions | ${config.appName}`,
  canonicalUrlRelative: '/tos',
});

const TOS = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">Terms and Conditions for {config.appName}</h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 text-sm"
          style={{ fontFamily: 'sans-serif' }}
        >
          {`Last Updated: December 2, 2025

Welcome to RideShareTahoe!

These Terms of Service ("Terms") govern your use of the RideShareTahoe website at https://ridesharetahoe.com ("Website") and the services provided by RideShareTahoe. By using our Website and services, you agree to these Terms.

1. Definitions

${LEGAL.termsDefinitions}

2. Description of RideShareTahoe

RideShareTahoe is a community platform that connects drivers and passengers for rideshare trips between the Bay Area and Lake Tahoe. Our service facilitates cost-sharing and carpooling within the community.

3. User Responsibilities and Safety

3.1 Driver Responsibilities: Drivers are responsible for the safety and operation of their vehicles. All vehicles must be properly insured, registered, and maintained. Drivers must possess a valid driver's license.

3.2 Passenger Responsibilities: Passengers agree to be respectful of the driver's vehicle and rules. Passengers must contribute to shared costs as agreed upon.

3.3 Liability: RideShareTahoe is not responsible for any injuries, damages, or incidents that occur during trips arranged through our platform. We do not verify insurance or driver history.

4. User Conduct and Community Guidelines

4.1 Respectful Behavior: Users must treat all community members with respect and kindness. Harassment, discrimination, or inappropriate behavior will not be tolerated.

4.2 Accurate Information: Users must provide accurate information about themselves, their vehicles, and their trip details.

4.3 Non-Commercial Use: The platform is for cost-sharing carpools, not for commercial taxi or ride-hailing services (like Uber/Lyft). Drivers may not profit from rides, only share costs.

5. User Data and Privacy

We collect and store user data, including name, email, location, and trip information, as necessary to provide our services. For details on how we handle your data, please refer to our Privacy Policy at https://ridesharetahoe.com/privacy-policy.

6. Prohibited Activities

Users may not:
- Use the platform for any illegal activities
- Share inappropriate or offensive content
- Attempt to access other users' accounts
- Use automated systems to interact with the platform
- Violate any applicable laws or regulations

7. Account Termination

We reserve the right to suspend or terminate accounts that violate these Terms or engage in inappropriate behavior.

8. Governing Law

These Terms are governed by the laws of ${LEGAL.contact.jurisdiction}.

9. Updates to the Terms

We may update these Terms from time to time. Users will be notified of any changes via email.

10. Contact Information

For any questions or concerns regarding these Terms of Service, please contact us at:

Legal/Contact:
RideShareTahoe
Email: ${LEGAL.contact.legal}
Support: ${LEGAL.contact.support}
Jurisdiction: ${LEGAL.contact.jurisdiction}

Thank you for being part of the RideShareTahoe community!`}
        </pre>
      </div>
    </main>
  );
};

export default TOS;
