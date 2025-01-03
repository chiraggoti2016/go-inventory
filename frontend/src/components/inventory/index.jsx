import { useEffect, useState } from 'react';
import {
  DeleteItem,
  CreateItem,
  UpdateItem,
  GetItems,
} from '../../../wailsjs/go/main/App';
import InventoryAddEdit from './InventoryAddEdit';
import InventoryList from './InventoryList';

const InventoryContainer = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

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

  const onSubmit = async (values) => {
    try {
      if (editingItem) {
        await UpdateItem(JSON.stringify({ ...values, id: editingItem.id }));
      } else {
        await CreateItem(JSON.stringify(values));
      }

      setEditingItem(null);
      loadItems();
    } catch (error) {
      console.error('Error saving item:', error);
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

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleCancel = () => {
    setEditingItem(null);
  };

  return (
    <div className="p-4">
      <InventoryAddEdit
        editingItem={editingItem}
        loadItems={loadItems}
        setEditingItem={setEditingItem}
        handleCancel={handleCancel}
        onSubmit={onSubmit}
      />

      <InventoryList
        items={items}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default InventoryContainer;
