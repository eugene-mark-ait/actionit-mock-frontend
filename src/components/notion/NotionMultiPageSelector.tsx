import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, FileText, Calendar, CheckCircle2, Plus, X, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { searchNotionPages } from '@/lib/notion-api';

interface NotionPage {
  id: string;
  title: string;
  url?: string;
  created_time?: string;
  last_edited_time?: string;
  properties?: any;
}

interface NotionPageMapping {
  id: string;
  page: NotionPage;
  type: 'default' | 'additional';
  meetingLink?: string;
  lastScanned?: string;
}

interface NotionMultiPageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMappings: (mappings: NotionPageMapping[]) => void;
  currentMappings: NotionPageMapping[];
}

export const NotionMultiPageSelector: React.FC<NotionMultiPageSelectorProps> = ({
  isOpen,
  onClose,
  onSaveMappings,
  currentMappings
}) => {
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [filteredPages, setFilteredPages] = useState<NotionPage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState<NotionPage | null>(null);
  const [mappings, setMappings] = useState<NotionPageMapping[]>(currentMappings);
  const [activeTab, setActiveTab] = useState('default');
  const { toast } = useToast();
  const { user } = useAuth();

  // Load pages when component mounts
  useEffect(() => {
    if (isOpen) {
      loadPages();
    }
  }, [isOpen]);

  // Filter pages based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPages(pages);
    } else {
      const filtered = pages.filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPages(filtered);
    }
  }, [searchQuery, pages]);

  const loadPages = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to load Notion pages.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const pagesLoaded = await searchNotionPages(user.id);
      setPages(pagesLoaded);
      setFilteredPages(pagesLoaded);
    } catch (error) {
      toast({
        title: "Failed to load pages",
        description: "Could not fetch your Notion pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setFilteredPages(pages);
      return;
    }

    setLoading(true);
    try {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      // Import searchNotionPages from notion-api
      const { searchNotionPages } = await import('@/lib/notion-api');
      const searchResults = await searchNotionPages(user.id, searchQuery);
      setFilteredPages(searchResults);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Could not search your Notion pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = (page: NotionPage) => {
    setSelectedPage(page);
  };

  const handleAddMapping = () => {
    if (selectedPage) {
      const newMapping: NotionPageMapping = {
        id: `${selectedPage.id}-${Date.now()}`,
        page: selectedPage,
        type: activeTab as 'default' | 'additional',
        lastScanned: new Date().toISOString()
      };
      
      setMappings(prev => [...prev, newMapping]);
      setSelectedPage(null);
      
      toast({
        title: "Page added",
        description: `"${selectedPage.title}" added as ${activeTab} page`,
      });
    }
  };

  const handleRemoveMapping = (mappingId: string) => {
    setMappings(prev => prev.filter(m => m.id !== mappingId));
  };

  const handleSaveMappings = () => {
    onSaveMappings(mappings);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDefaultMapping = () => mappings.find(m => m.type === 'default');
  const getAdditionalMappings = () => mappings.filter(m => m.type === 'additional');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configure Notion Pages
          </DialogTitle>
          <DialogDescription>
            Set up your default page for meeting analysis and additional pages for specific meetings.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="default">Default Page</TabsTrigger>
            <TabsTrigger value="additional">Additional Pages</TabsTrigger>
          </TabsList>

          <TabsContent value="default" className="flex-1 flex flex-col mt-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Default Meeting Analysis Page</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This page will receive all meeting analysis results by default.
              </p>
              
              {getDefaultMapping() && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{getDefaultMapping()?.page.title}</span>
                        <Badge variant="default">Default</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMapping(getDefaultMapping()!.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Search Section */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {/* Pages List */}
            <div className="flex-1 overflow-y-auto">
              {loading && pages.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading your Notion pages...</span>
                </div>
              ) : filteredPages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No pages found matching your search.' : 'No pages available.'}
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredPages.map((page) => (
                    <Card 
                      key={page.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedPage?.id === page.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSelectPage(page)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <h3 className="font-medium truncate">{page.title || 'Untitled Page'}</h3>
                              {selectedPage?.id === page.id && (
                                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Last edited: {formatDate(page.last_edited_time)}</span>
                              </div>
                              {page.parent.type === 'database_id' && (
                                <Badge variant="secondary" className="text-xs">
                                  Database Page
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {selectedPage && (
              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleAddMapping} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Set as Default Page
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="additional" className="flex-1 flex flex-col mt-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Additional Pages for Specific Meetings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These pages will be used for meetings that contain specific meeting links.
              </p>
              
              {getAdditionalMappings().length > 0 && (
                <div className="space-y-2 mb-4">
                  {getAdditionalMappings().map((mapping) => (
                    <Card key={mapping.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">{mapping.page.title}</span>
                            <Badge variant="secondary">Additional</Badge>
                            {mapping.meetingLink && (
                              <Badge variant="outline" className="text-xs">
                                Link: {mapping.meetingLink.substring(0, 30)}...
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMapping(mapping.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Search Section for Additional Pages */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>

            {/* Pages List for Additional Pages */}
            <div className="flex-1 overflow-y-auto">
              {loading && pages.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading your Notion pages...</span>
                </div>
              ) : filteredPages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No pages found matching your search.' : 'No pages available.'}
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredPages.map((page) => (
                    <Card 
                      key={page.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedPage?.id === page.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSelectPage(page)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <h3 className="font-medium truncate">{page.title || 'Untitled Page'}</h3>
                              {selectedPage?.id === page.id && (
                                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Last edited: {formatDate(page.last_edited_time)}</span>
                              </div>
                              {page.parent.type === 'database_id' && (
                                <Badge variant="secondary" className="text-xs">
                                  Database Page
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {selectedPage && (
              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleAddMapping} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add as Additional Page
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveMappings}
            disabled={mappings.length === 0}
            className="btn-primary"
          >
            Save Configuration ({mappings.length} pages)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
