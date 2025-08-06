'use client';

import { useEffect, useState } from 'react';
import ItemCard from '@/../components/ItemCard';
import AddItemForm from '@/../components/AddItemForm';
import SearchBar from '@/../components/SearchBar';
import FilterSortControls from '@/../components/FilterSortControls';
import { fetchInventoryData, updateItem } from '@/../lib/sheets';
import { InventoryItem } from '@/../lib/types';

export default function Home() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'expiry' | 'name'>('expiry');

  useEffect(() => {
    fetchInventoryData().then(setItems);
  }, []);

  const filteredItems = items
    .filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === '' || item.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'expiry') {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const handleUpdate = (updatedItem: InventoryItem) => {
    updateItem(updatedItem).then(() => {
      setItems(items => items.map(i => i.id === updatedItem.id ? updatedItem : i));
    });
  };

  return (
    <main className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🏠 Home Inventory Tracker</h1>
      <AddItemForm onAdd={item => setItems([item, ...items])} />
      <SearchBar value={search} onChange={setSearch} />
      <FilterSortControls
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <div className="space-y-4 mt-4">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} onUpdate={handleUpdate} />
        ))}
      </div>
    </main>
  );
}
