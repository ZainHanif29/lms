import React from "react";
import { Menu, School } from "lucide-react";
import { Button } from "./ui/button";
import DarkMode from "@/DarkMode";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop Navbar */}
      <DesktopNavbar />
      {/* Mobile Navbar */}
      <MobileNavbar />
    </div>
  );
};

export default Navbar;

const DesktopNavbar = () => {
  const user = true;

  return (
    <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <School size={30} />
        <h1 className="hidden md:block font-extrabold text-2xl">E-Learning</h1>
      </div>
      {/* dark mode & user icons*/}
      <div className="flex items-center gap-8">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>My Learning</DropdownMenuItem>
              <DropdownMenuItem>Edit Profile</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline">Login</Button>
            <Button>Signup</Button>
          </div>
        )}
        <DarkMode />
      </div>
    </div>
  );
};

const MobileNavbar = () => {
  const role = "instructor";

  return (
    <>
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <School size={30} />
          <h1 className="text-2xl">E-Learning</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full bg-gray-200 hover:bg-gray-200"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col w-full">
            <SheetHeader className="flex flex-row items-center justify-between mt-2">
              <SheetTitle>E-Learning</SheetTitle>
              <DarkMode />
            </SheetHeader>
            <DropdownMenuSeparator className="mr-2" />
            <nav className="flex flex-col space-y-4">
              <span>My Learning</span>
              <span>Edit Profile</span>
              <p>Log out</p>
            </nav>
            {role === "instructor" && (
              <SheetFooter>
                <SheetClose asChild>
                  <Button className="w-full" type="submit">DashBoard</Button>
                </SheetClose>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
