/**
 * @fileoverview EditGroupForm component where User can edit a Group
 * This file handles User inputs for Group revision
 */

'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { InferType } from 'yup';
import { redirect } from 'next/navigation';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

import { Group, Commitment } from '@prisma/client';
import { editGroup } from '@/lib/dbActions';
import { EditGroupSchema } from '@/lib/validationSchemas';
import LoadingSpinner from '@/components/LoadingSpinner';

type EditGroupFormData = InferType<typeof EditGroupSchema>;

interface EditGroupFormProps {
  groupData: Group;
}

const EditGroupForm: React.FC<EditGroupFormProps> = ({ groupData }) => {
  const { data: session, status } = useSession();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditGroupSchema),
    defaultValues: {
      id: groupData.id,
      name: groupData.name,
      image: groupData.image,
      members: groupData.members,
      maxmembers: groupData.maxmembers ?? null,
      intensity: groupData.intensity as Commitment,
      description: groupData.description ?? '',
    },
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const onSubmit = async (data: EditGroupFormData, groupData: Group) => {
    if (!session?.user?.id) {
      console.error('User is not logged in or user ID is missing.');
      return;
    }

    await editGroup({
      id: groupData.id,
      name: data.name,
      image: data.image,
      members: data.members,
      maxmembers: data.maxmembers ?? null,
      intensity: data.intensity,
      description: data.description ?? '',
    });
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <h2 className="text-center title-font">
            Edit Group
          </h2>

          <Card className="bg-white">
            <Card.Body>
              <Form onSubmit={handleSubmit((data) => onSubmit(data, groupData))}>
                
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
                  <Form.Label htmlFor="image">Image URL</Form.Label>
                  <input
                    id="image"
                    type="text"
                    {...register('image')}
                    className={`form-control bg-white ${errors.image ? 'is-invalid' : ''}`}
                  />
                  <div className="invalid-feedback">{errors.image?.message}</div>
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
                  <Form.Label htmlFor="maxmembers">Maximum Members</Form.Label>
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

export default EditGroupForm;
