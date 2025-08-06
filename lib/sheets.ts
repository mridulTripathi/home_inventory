import { InventoryItem } from './types';

const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzC4vQFLC2wI0D1wN9wUGwAQBQf1EX-0vAJ2hZCeq-Yuqr0sNutLWyWd2UEzSBYqLUZZw/exec';

export async function fetchInventoryData(): Promise<InventoryItem[]> {
  const res = await fetch(`${SHEET_API_URL}?action=read`);
  return res.json();
}

export async function addItemToSheet(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  const res = await fetch(`${SHEET_API_URL}?action=add`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function updateItem(item: InventoryItem): Promise<void> {
  await fetch(`${SHEET_API_URL}?action=update`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}
