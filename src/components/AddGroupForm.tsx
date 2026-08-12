/**
 * @fileoverview AddGroupForm component where User can create a Group
 * This file handles User inputs for Group creation
 */

'use client';

import { useSession } from 'next-auth/react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { redirect, useRouter } from 'next/navigation';
import swal from 'sweetalert';
import { Button, Card, Col, Container, Form, Row, Image } from 'react-bootstrap';

import { Commitment } from '@prisma/client';
import { addGroup } from '@/lib/dbActions';
import { AddGroupSchema, AddGroupFormData } from '@/lib/validationSchemas';
import LoadingSpinner from '@/components/LoadingSpinner';

const AddGroupForm: React.FC = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddGroupSchema),
    defaultValues: {
      name: '',
      image: '',
      members: 0,
      maxmembers: null,
      intensity: '' as Commitment,
      description: '',
    },
  });

  const watchedImage = useWatch({
    control,
    name: 'image',
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const onSubmit = async (data: AddGroupFormData) => {

    if (!session?.user?.id) {
      console.error('User is not logged in or user ID is missing.');
      return;
    }

    try {
      const newGroup = await addGroup({
        name: data.name,
        image: data.image,
        members: Number(data.members),
        maxmembers: data.maxmembers ? Number(data.maxmembers) : null,
        intensity: data.intensity,
        description: data.description,
        userId: session.user.id,
      });

      await update();

      await swal('Success', 'Your group has been created', 'success', {
        timer: 2000,
      });

      reset();
      router.push(`/groups/${newGroup.id}`);
      router.refresh();

    } catch (error) {
      console.error('Failed to save group:', error);
      swal('Error', 'Something went wrong while creating the group.', 'error');
    }
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={6}>
          <div className="text-center mb-4 title-font">
            <h2>Create Group</h2>
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
                  <Form.Label htmlFor="members">Members</Form.Label>
                  <input
                    id="members"
                    type="number"
                    {...register('members')}
                    className={`form-control bg-white ${errors.members ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.members?.message}</div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="maxmembers">Max Members</Form.Label>
                  <input
                    id="maxmembers"
                    type="number"
                    {...register('maxmembers')}
                    className={`form-control bg-white ${errors.maxmembers ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.maxmembers?.message}</div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="commitment">
                    Commitment
                  </Form.Label>

                  <Form.Select id="commitment" {...register('intensity')}
                    className={`form-control bg-white ${errors.intensity ? 'is-invalid' : ''}`}>
                    <option value="">Select commitment level...</option>
                    <option value="Casual">Casual</option>
                    <option value="Sometimes_Casual">Sometimes Casual, Sometimes Moderate</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Sometimes_Moderate">Sometimes Moderate, Sometimes Serious</option>
                    <option value="Serious">Serious</option>
                  </Form.Select>
                  <div className="invalid-feedback">{errors.intensity?.message}</div>
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

export default AddGroupForm;
