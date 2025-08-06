type Props = {
    category: string;
    onCategoryChange: (val: string) => void;
    sortBy: 'expiry' | 'name';
    onSortChange: (val: 'expiry' | 'name') => void;
  };
  
  export default function FilterSortControls({ category, onCategoryChange, sortBy, onSortChange }: Props) {
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        <input
          className="border p-2 rounded"
          placeholder="Filter by category"
          value={category}
          onChange={e => onCategoryChange(e.target.value)}
        />
        <select className="border p-2 rounded" value={sortBy} onChange={e => onSortChange(e.target.value as 'expiry' | 'name')}>
          <option value="expiry">Sort by Expiry</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>
    );
  }
  