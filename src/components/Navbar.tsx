/**
 * The Navbar Component, which appears at the top of all pages
 * Rendered by the App Layout component.
 */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import Link from 'next/link';

const NavBar: React.FC = () => {

  export const dynamic = 'force-dynamic';
  
  const { data: session, status } = useSession();
  const pathName = usePathname();

  if (status === 'loading') return null;

  const currentUser = session?.user?.email;

  const profileLink = session?.user?.profileId 
    ? `/profile/${session.user.profileId}` 
    : '/profile/add';

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/" className="navbar-side">
          <Image src="/images/oblogo-final.png" alt="Outdoor Buddies Logo" width={150} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mx-auto justify-content-center align-items-center text-white gap-3 text-white">
            <Nav.Link as={Link} id="events-nav" href="/announcements" active={pathName === '/announcements'} className="px-4 navbar-main-link">
              Announcements
            </Nav.Link>
            <span className="navbar-divider">|</span>
            <Nav.Link as={Link} id="hike-rec-nav" href="/hikes" active={pathName === '/hikes'} className="px-4 navbar-main-link">
              Hikes
            </Nav.Link>
            <span className="navbar-divider">|</span>
            <Nav.Link as={Link} id="groups-nav" href="/groups" active={pathName === '/groups'} className="px-4 navbar-main-link">
              Groups
            </Nav.Link>
            <span className="navbar-divider">|</span>
            <Nav.Link as={Link} id="profiles-nav" href="/profile" active={pathName === '/profile'} className="px-4 navbar-main-link">
              Profiles
            </Nav.Link>
          </Nav>
          <Nav className="navbar-side justify-content-end">
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="profile-nav" as={Link} href={profileLink}>
                  <PersonFill />
                  View Profile
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-out" as={Link} href="/api/auth/signout">
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" as={Link} href="/auth/signin">
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" as={Link} href="/auth/signup">
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
