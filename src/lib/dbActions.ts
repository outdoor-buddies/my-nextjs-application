'use server';

import { Difficulty, Commitment } from '@prisma/client';
import { auth } from '@/lib/auth';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}

/**
 * Adds a new group to the database.
 * @param group, an object with the following properties:
 * - name
 * - image
 * - members
 * - maxmembers
 * - intensity
 * - description
*/
export async function addGroup(group: {
    name: string;
    image: string;
    members: number;
    maxmembers?: number | null;
    intensity: Commitment;
    description: string;
	userId: string;
  }) {
  
  const session = await auth();
  
  if (!session || !session.user?.id) {
    throw new Error("You must be logged in to create a group.");
  }
    const newGroup = await prisma.group.create({
      data: {
        name: group.name,
        image: group.image,
        members: group.members,
        maxmembers: group.maxmembers ?? null,
        intensity: group.intensity,
        description: group.description ?? null,
        userId: group.userId,
      },
    });

    return newGroup;
}

/**
 * Edits an existing group to the database.
 * @param group, an object with the following properties:
 * - id
 * - name
 * - image
 * - members
 * - maxmembers
 * - intensity
 * - description
*/
export async function editGroup(group: {
    id: string;
    name: string;
    image: string; 
    members: number;
    maxmembers?: number | null;
    intensity: string;
    description: string;
  }) {
  await prisma.group.update({
    where: { id: group.id },
    data: {
      name: group.name,
      image: group.image,
      members: group.members,
      maxmembers: group.maxmembers ?? null,
      intensity: group.intensity,
      description: group.description ?? null,
    },
  });
  redirect(`/groups/${group.id}`);
}

/**
 * Deletes an existing group from the database.
 * @param id, the group id
*/
export async function deleteGroup(id: string) {

	await prisma.group.delete({
		where: { id },
	});

	revalidatePath('/groups');
  redirect('/groups');
}

/**
 * Adds a new profile to the database.
 * @param profile, an object with the following properties:
 * - name
 * - image
 * - description
 * - groupname
 * - summary
 * - descimage
 * - userId
*/
export async function addProfile(profile: {
    name: string;
    image: string;
    description: string;
    groupname?: string | null;
    summary: string;
    descimage?: string | null;
    userId: string;
  }) {
  const existingProfile = await prisma.profile.findFirst({
    where: { userId: profile.userId },
  });

  if (existingProfile) {
    throw new Error('PROFILE_EXISTS');
  }
  const newProfile = await prisma.profile.create({
    data: {
      name: profile.name,
      image: profile.image,
      description: profile.description,
      groupname: profile.groupname ?? null,
      summary: profile.summary,
      descimage: profile.descimage ?? null,
      userId: profile.userId,
    },
  });
  return newProfile;
}

/**
 * Edits an existing profile to the database.
 * @param profile, an object with the following properties:
 * - id
 * - name
 * - image
 * - description
 * - groupname
 * - summary
 * - descimage
 * - userId
*/
export async function editProfile(profile: {
    id: string;
    name: string;
    image: string;
    description: string;
    groupname?: string | null;
    summary: string;
    descimage?: string | null;
  }) {
  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      name: profile.name,
      image: profile.image,
      description: profile.description,
      groupname: profile.groupname ?? null,
      summary: profile.summary,
      descimage: profile.descimage ?? null,
    },
  });
}

/**
 * Deletes an existing profile from the database.
 * @param id, the profile id
*/
export async function deleteProfile(id: string) {
	await prisma.profile.delete({
		where: { id },
	});

	revalidatePath('/profile');
	redirect('/profile');
}

/**
 * Adds a new note to the database.
 * @param note, an object with the following properties:
 * - title
 * - description
 * - userId
 * - groupId
*/
export async function addNote(note: {
    title: string;
    description: string;
    userId: string;
    groupId: string;
  }) {
    console.log("addNote server action was triggered with:", note);
  try {
  const newNote = await prisma.note.create({
    data: {
      title: note.title,
      description: note.description,
      userId: note.userId,
      groupId: note.groupId,
    },
  });
  console.log("Successfully created post in DB:", newNote);
  return newNote;
  } catch (err) {
    console.error("Prisma error during note creation:", err);
    throw err;
  }
}

/**
 * Deletes an existing note from the database.
 * @param id, the note id
*/
export async function deleteNote(id: string) {
  const deletedNote = await prisma.note.delete({
    where: { id },
  });
  redirect(`/groups/${deletedNote.groupId}/forum`);
}

/**
 * Adds a new event to the database.
 * @param event, an object with the following properties:
 * - title
 * - description
 * - date
*/
export async function addEvent(event: {
    title: string;
    description: string;
    date: Date;
  }) {
  await prisma.event.create({
    data: {
      title: event.title,
      description: event.description,
      date: event.date,
    },
  });
  redirect('/announcements');
}

/**
 * Edits an existing profile to the database.
 * @param event, an object with the following properties:
 * - id
 * - title
 * - description
 * - date
*/
export async function editEvent(event: {
    id: string;
    title: string;
    description: string;
    date: Date;
  }) {
  await prisma.event.update({
    where: { id: event.id },
    data: {
      title: event.title,
      description: event.description,
      date: event.date,
    },
  });
  redirect('/announcements');
}

/**
 * Deletes an existing event from the database.
 * @param id, the event id
*/
export async function deleteEvent(id: string) {
  await prisma.event.delete({
    where: { id },
  });
  redirect('/announcements');
}

/**
 * Adds a new trail to the database.
 * @param trail, an object with the following properties:
 * - name
 * - location
 * - description
 * - difficulty
 * - distance
 * - image
*/
export async function addHike(trail: {
    name: string;
    location: string;
    description: string;
    difficulty: Difficulty;
    distance: number;
    image: string
  }) {
  await prisma.trail.create({
    data: {
      name: trail.name,
      location: trail.location,
      description: trail.description,
      difficulty: trail.difficulty,
      distance: trail.distance,
      image: trail.image,
    },
  });
  redirect('/hikes');
}

/**
 * Edits an existing trail to the database.
 * @param trail, an object with the following properties:
 * - id
 * - name
 * - location
 * - description
 * - difficulty
 * - distance
 * - image
*/
export async function editHike(trail: {
    id: string;
    name: string;
    location: string;
    description: string;
    difficulty: Difficulty;
    distance: number;
    image: string
  }) {
  await prisma.trail.update({
    where: { id: trail.id },
    data: {
      name: trail.name,
      location: trail.location,
      description: trail.description,
      difficulty: trail.difficulty,
      distance: trail.distance,
      image: trail.image,
    },
  });
  redirect('/hikes');
}

/**
 * Deletes an existing trail from the database.
 * @param id, the trail id
*/
export async function deleteHike(id: string) {
  await prisma.trail.delete({
    where: { id },
  });
  redirect('/hikes');
}

/**
 * Gets all trails from the database.
 */
export async function getTrails() {
  return prisma.trail.findMany();
}

/**
 * Gets all events from the database.
 */
export async function getEvents() {
  return prisma.event.findMany();
}

/**
 * Gets all groups from the database.
 */
export async function getGroups() {
  return prisma.group.findMany();
}

/**
 * Gets all profiles from the database.
 */
export async function getProfiles() {
  return prisma.profile.findMany();
}

/**
 * Searches for trails based on a search term.
 * @param searchTerm, the term to search for.
 * @returns a list of trails matching the search term in name, location, and description.
 */
export async function searchTrails(searchTerm: string) {
  return prisma.trail.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          location: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    },
  });
}

/**
 * Searches for groups based on a search term.
 * @param searchTerm, the term to search for.
 * @returns a list of groups matching the search term in name and description.
 */
export async function searchGroups(searchTerm: string) {
  return prisma.group.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    },
  });
}

/**
 * Searches for profiles based on a search term.
 * @param searchTerm, the term to search for.
 * @returns a list of profiles matching the search term in name, summary, description, and groupname.
 */
export async function searchProfiles(searchTerm: string) {
  return prisma.profile.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          summary: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          groupname: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ],
    },
  });
}
