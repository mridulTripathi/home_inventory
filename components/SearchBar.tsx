type Props = {
    value: string;
    onChange: (val: string) => void;
  };
  
  export default function SearchBar({ value, onChange }: Props) {
    return (
      <input
        className="w-full p-2 border rounded"
        placeholder="🔍 Search items by name..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    );
  }
  