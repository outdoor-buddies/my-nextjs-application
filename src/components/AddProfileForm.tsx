/**
 * @fileoverview AddProfileForm component where Users can create a Profile
 * This file handles User inputs for Profile creation
 * Users can only create one Profile
 */

'use client';

import { useSession } from 'next-auth/react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { redirect, useRouter } from 'next/navigation';
import swal from 'sweetalert';
import { Button, Card, Col, Container, Form, Row, Image } from 'react-bootstrap';

import { addProfile } from '@/lib/dbActions';
import { AddProfileSchema, AddProfileFormData } from '@/lib/validationSchemas';
import LoadingSpinner from '@/components/LoadingSpinner';

const AddProfileForm: React.FC = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddProfileFormData>({
    resolver: yupResolver(AddProfileSchema),
    defaultValues: {
      name: '',
      image: '',
      summary: '',
      description: '',
      groupname: null,
      descimage: null,
    },
  });

  const watchedImage = useWatch({
    control,
    name: 'image',
  });

  const watchedDescImage = useWatch({
    control,
    name: 'descimage',
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const onSubmit = async (data: AddProfileFormData) => {

    const userId = session?.user?.id ? String(session.user.id) : undefined;

    if (!userId) {
      swal('Error', 'Unable to identify current user. Please sign in again.', 'error');
      return;
    }

    try {
      const newProfile = await addProfile({
        name: data.name,
        image: data.image,
        description: data.description,
        groupname: data.groupname ?? null,
        summary: data.summary,
        descimage: data.descimage ?? null,
        userId: userId, // Linked to the authenticated user!
      });

      await update();

      await swal('Success', 'Your profile has been created', 'success', {
        timer: 2000,
      });

      reset();
      router.push(`/profile/${newProfile.id}`);
      router.refresh();
    } catch (error) {
      console.error('Failed to create profile:', error);
      
      if (error instanceof Error) {
        if (error.message === 'PROFILE_EXISTS') {
          swal(
            'Profile Already Exists',
            'You already have a profile linked to this account.',
            'warning'
          );
        } else {
          swal('Error', error.message, 'error');
        }
      } else {
        swal('Error', 'An unexpected error occurred.', 'error');
      }
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={6}>
          <div className="text-center mb-4 title-font">
            <h2>Create Profile</h2>
          </div>
          <Card className="bg-white">
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="name">Name</Form.Label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className={`form-control bg-white ${errors.name ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="image">Image URL (please use a square image)</Form.Label>
                  <input
                  id="image"
                    type="text"
                    {...register('image')}
                    className={`form-control bg-white ${errors.image ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.image?.message}</div>
                  {watchedImage && (
                    <div className="mt-3 text-center">
                      <Image 
                        src={watchedImage} 
                        alt="Profile Preview" 
                        roundedCircle 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                        onLoad={(e) => (e.currentTarget.style.display = 'inline-block')}
                      />
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="summary">Status</Form.Label>
                  <input
                  id="summary"
                    type="text"
                    {...register('summary')}
                    className={`form-control bg-white ${errors.summary ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.summary?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="description">Description</Form.Label>
                  <textarea
                  id="description"
                    {...register('description')}
                    className={`form-control bg-white ${errors.description ? 'is-invalid' : ''}`}
                    rows={3}
                  />
                  <div className="invalid-feedback">{errors.description?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="descimage">Description Image URL</Form.Label>
                  <input
                    id="descimage"
                    type="text"
                    {...register('descimage')}
                    className={`form-control bg-white ${errors.descimage ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.descimage?.message}</div>
                  {watchedDescImage && (
                    <div className="mt-3 text-center">
                      <Image 
                        src={watchedDescImage} 
                        alt="Description Preview" 
                        fluid 
                        style={{ maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                        onLoad={(e) => (e.currentTarget.style.display = 'inline-block')}
                      />
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="groupname">Group Name</Form.Label>
                  <input
                    id="groupname"
                    type="text"
                    {...register('groupname')}
                    className={`form-control bg-white ${errors.groupname ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.groupname?.message}</div>
                </Form.Group>

                <Row className="pt-3">
                  <Col>
                    <Button type="submit" className="page-button">
                      Submit
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="button"
                      onClick={() => reset()}
                      variant="warning"
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProfileForm;
