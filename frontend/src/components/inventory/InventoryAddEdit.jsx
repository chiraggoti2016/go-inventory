import { Card, Col, Row, Button, Form } from 'react-bootstrap';
// import Form from 'react-bootstrap/Form';
import * as formik from 'formik';
// import { Formik, Form as FormikForm, Field as Form.Control } from 'formik';
import * as yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  CreateItem,
  GetItemByID,
  UpdateItem,
} from '../../../wailsjs/go/main/App';

const InventoryAddEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingItem, setEditingItem] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category: '',
  });

  const { Formik } = formik;
  const formikRef = useRef();

  const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string().required(),
    quantity: yup.string().required(),
    price: yup.string().required(),
    category: yup.string().required(),
  });

  useEffect(() => {
    if (id) {
      // Simulate fetching data for edit
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const result = await GetItemByID(parseInt(id));
      setEditingItem(result);
    } catch (error) {
      console.error('Error loading item:', error);
    }
  };

  const FormikOnSubmit = (values) => {
    onSubmit({ ...values });
    // Reset form after successful submission
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  const onSubmit = async (values) => {
    try {
      if (editingItem) {
        await UpdateItem(JSON.stringify({ ...values, id: editingItem.id }));
      } else {
        await CreateItem(JSON.stringify(values));
      }

      setEditingItem(null);
      navigate('/');
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    navigate('/');
  };
  console.log('id', id);
  return (
    <Card className="mb-6">
      <Card.Header>{editingItem ? 'Edit Item' : 'Add New Item'}</Card.Header>
      <Card.Body>
        {editingItem || id === undefined ? (
          <Formik
            innerRef={formikRef}
            validationSchema={schema}
            onSubmit={FormikOnSubmit}
            initialValues={editingItem}
            enableReinitialize
          >
            {({
              isSubmitting,
              handleSubmit,
              resetForm,
              handleChange,
              values,
              touched,
              errors,
            }) => (
              <Form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="validationFormikName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      isValid={touched.name && !errors.name}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormikDescription"
                  >
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      isValid={touched.description && !errors.description}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormikQuantity"
                  >
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="text"
                      name="quantity"
                      value={values.quantity}
                      onChange={handleChange}
                      isValid={touched.quantity && !errors.quantity}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.quantity}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="4" controlId="validationFormikPrice">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      isValid={touched.price && !errors.price}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.price}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormikCategory"
                  >
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      isValid={touched.category && !errors.category}
                    />

                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Form.Group className="mb-3">
                  <Button type="submit" disabled={isSubmitting}>
                    {editingItem ? 'Update' : 'Add'} Item
                  </Button>
                  {editingItem && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleCancel();
                        resetForm();
                      }}
                      className="ml-2"
                    >
                      Cancel
                    </Button>
                  )}
                </Form.Group>
              </Form>
            )}
          </Formik>
        ) : (
          <>...Loading</>
        )}
      </Card.Body>
    </Card>
  );
};
InventoryAddEdit.displayName = 'InventoryAddEdit';

export { InventoryAddEdit };
export default InventoryAddEdit;
