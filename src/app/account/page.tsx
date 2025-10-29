"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function AccountPage() {
  // Mock user data for demonstration
  const user = {
    displayName: 'PlayerOne'
  };
  const loading = false;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    // This part is for when user is not logged in, you can redirect or show a login message
     return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <p>Please log in to view your account.</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Welcome Back, {user.displayName || 'Player'}!</h1>
        <p className="text-muted-foreground">Manage your account, view orders, and curate your wishlist.</p>
      </header>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                A list of your past purchases.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
               <div className="text-center py-16 text-muted-foreground">
                 <p>You have not placed any orders yet.</p>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="wishlist">
           <Card>
            <CardHeader>
              <CardTitle>Wishlist</CardTitle>
              <CardDescription>
                Your saved games. Get ready for your next adventure!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
               <div className="text-center py-16 text-muted-foreground">
                 <p>Your wishlist is empty. Start exploring!</p>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
