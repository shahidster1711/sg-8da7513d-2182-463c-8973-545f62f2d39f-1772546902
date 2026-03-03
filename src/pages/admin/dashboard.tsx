import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Ban, ShieldAlert, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Listing, Profile, Report } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    reports: 0,
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // Simple admin check - in production this should be robust RLS/Claims
  const ADMIN_EMAILS = ["admin@andamanbazaar.com"];

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    if (!session || !ADMIN_EMAILS.includes(session.user.email || "")) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this page",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    await Promise.all([fetchStats(), fetchListings(), fetchUsers(), fetchReports()]);
    setLoading(false);
  }

  async function fetchStats() {
    const { count: usersCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    
    const { count: listingsCount } = await supabase
      .from("listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const { count: reportsCount } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });

    setStats({
      users: usersCount || 0,
      listings: listingsCount || 0,
      reports: reportsCount || 0,
    });
  }

  async function fetchListings() {
    const { data } = await supabase
      .from("listings")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false })
      .limit(50);
    setListings((data as unknown as Listing[]) || []);
  }

  async function fetchUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setUsers(data || []);
  }

  async function fetchReports() {
    const { data } = await supabase
      .from("reports")
      .select(`
        *,
        listings(title, id),
        reporter:profiles!reports_reporter_id_fkey(email)
      `)
      .order("created_at", { ascending: false });
    setReports(data || []);
  }

  async function handleDeleteListing(id: string) {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    const { error } = await supabase.from("listings").delete().eq("id", id);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Listing deleted" });
      fetchListings();
      fetchReports();
    }
  }

  if (loading) return <div className="p-8 text-center">Loading admin dashboard...</div>;

  return (
    <>
      <SEO title="Admin Dashboard - AndamanBazaar" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Site
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Active Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.listings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.reports}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="listings">
            <TabsList>
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="reports">
                Reports
                {stats.reports > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {stats.reports}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listings">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.title}</TableCell>
                        <TableCell>₹{listing.price}</TableCell>
                        <TableCell>{listing.category}</TableCell>
                        <TableCell>
                          <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteListing(listing.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.location || '-'}</TableCell>
                        <TableCell>
                          {user.is_verified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Listing</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.listings?.title || 'Unknown Listing'}
                        </TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>{report.reporter?.email}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/listings/${report.listing_id}`)}
                            >
                              View
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteListing(report.listing_id)}
                            >
                              Delete Listing
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}