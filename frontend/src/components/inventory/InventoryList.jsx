import { useEffect, useState } from 'react';
import { Card, Button, Table, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DeleteItem, GetItems } from '../../../wailsjs/go/main/App';

const InventoryList = ({}) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await GetItems();
      setItems(JSON.parse(response));
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await DeleteItem(id.toString());
      loadItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Container>
      <Card>
        <Card.Header>Inventory Items</Card.Header>
        <Card.Body>
          <Link to="/add">Add New Item</Link>
          <Table responsive="sm" striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.category}</td>
                  <td>
                    <Link to={`/edit/${item.id}`}>Edit</Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};
InventoryList.displayName = 'InventoryList';

export { InventoryList };
export default InventoryList;
