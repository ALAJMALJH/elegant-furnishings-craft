
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Boxes, 
  Search, 
  SlidersHorizontal, 
  MoveVertical,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCollectionsManager } from '@/components/Admin/Products/ProductCollectionsManager';

const CollectionsPage = () => {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Helmet>
        <title>Collections Management | Admin Panel</title>
      </Helmet>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Collections Management</h1>
            <p className="text-muted-foreground">
              Create and manage your product collections
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Activity Logs
            </Button>
            <Button variant="outline" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Suggestions
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <MoveVertical className="mr-2 h-4 w-4" />
            Reorder
          </Button>
          {selectedCollections.length > 0 && (
            <Button variant="outline" size="sm">
              <Boxes className="mr-2 h-4 w-4" />
              Bulk Actions ({selectedCollections.length})
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Collections</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="auto">Auto-Generated</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Product Collections</CardTitle>
                <CardDescription>
                  Manage your product collections and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductCollectionsManager 
                  selectedCollections={selectedCollections}
                  onCollectionsChange={setSelectedCollections}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="featured">
            <Card>
              <CardHeader>
                <CardTitle>Featured Collections</CardTitle>
                <CardDescription>
                  Collections that are highlighted on your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-10 text-center text-muted-foreground">
                  Featured collections functionality coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="seasonal">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Collections</CardTitle>
                <CardDescription>
                  Time-limited collections for special seasons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-10 text-center text-muted-foreground">
                  Seasonal collections functionality coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="auto">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Generated Collections</CardTitle>
                <CardDescription>
                  Collections automatically generated by rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-10 text-center text-muted-foreground">
                  Auto-generated collections functionality coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CollectionsPage;
