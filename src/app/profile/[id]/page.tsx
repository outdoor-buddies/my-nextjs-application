/**
 * Page that displays a details page of the Profile
 */

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Row, Col, Container, Image } from 'react-bootstrap';
import DeleteButtonProfile from '@/components/DeleteButtonProfile';

interface ProfilesDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProfilesDetailsPage = async ({
  params,
}: ProfilesDetailsPageProps) => {
  const { id } = await params;

  const session = await auth();

  const profile = await prisma.profile.findUnique({
    where: {
      id,
    },
  });

  if (!profile) {
    notFound();
  }

  const isOwner = String(session?.user?.id) === profile.userId;

  /*checks to see if the image can load properly, if it can load, then
  it uses that image, if it cannot load properly then it loads a 'fallback' image*/
  const getValidImageUrl = (url: string | null | undefined, fallback: string) => {
    if (!url) return fallback;
    if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return fallback;
  };

  //does this for both the profile picture image (profile.image) and the description image (profile.descimage)
  const profileImageSrc = getValidImageUrl(profile.image, '/images/default-image-user.jpg');
  const descImageSrc = getValidImageUrl(profile.descimage, '/images/default-descimage.png');

  return (
    <main>
      <Container className="mt-5">
        <Row className="align-items-center mb-4">
          <Col xs={3} className="d-flex justify-content-start">
            <Image
              src={profileImageSrc} 
              alt={profile.name} 
              className="profile-details-pfp rounded-circle" 
            />
          </Col>

          <Col xs={6} className="text-center">
            <h1 className="m-0">{profile.name}</h1>
          </Col>

          <Col xs={3} className="d-flex justify-content-end">
            {isOwner && (
              <Link href={`/profile/edit/${profile.id}`} className="btn page-button">
                Edit Profile
              </Link>
            )}
          </Col>
        </Row>

        <div className="d-flex gap-4 mt-3">
          <p>
            <strong>Status:</strong> {profile.summary}
          </p>
        </div>
        <div>
          <p>
            <strong>Group:</strong> {profile.groupname || 'None'}
          </p>
        </div>
        <hr />

        <p>{profile.description}</p>

        {profile.descimage && (
          <div className="text-center mb-4">
            <Image 
              src={descImageSrc}
              alt={`${profile.name} Description`} 
              className="img-fluid rounded profile-details-desc" 
            />
          </div>
        )}

        <div className="d-flex justify-content-end mb-4">
          {isOwner && <DeleteButtonProfile profileId={profile.id} />}
        </div>
      </Container>
    </main>
  );
};

export default ProfilesDetailsPage;
