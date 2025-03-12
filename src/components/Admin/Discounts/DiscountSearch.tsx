
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DiscountSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  filterCategory?: string;
  setFilterCategory?: (value: string) => void;
}

const DiscountSearch: React.FC<DiscountSearchProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search discount codes..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Discounts</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
        
        {setFilterCategory && (
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="living">Living Room</SelectItem>
              <SelectItem value="dining">Dining</SelectItem>
              <SelectItem value="bedroom">Bedroom</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="outdoor">Outdoor</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default DiscountSearch;
