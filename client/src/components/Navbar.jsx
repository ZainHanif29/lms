import React, { useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User logout.");
      navigate("/login");
    }
  }, [isSuccess]);
  const logoutHandler = async () => {
    await logoutUser();
  };

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop Navbar */}
      <DesktopNavbar logoutHandler={logoutHandler} user={user} />
      {/* Mobile Navbar */}
      <MobileNavbar logoutHandler={logoutHandler} user={user} />
    </div>
  );
};

export default Navbar;

const DesktopNavbar = ({ logoutHandler, user }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <School size={30} />
        <Link to="/">
          <h1 className="hidden md:block font-extrabold text-2xl">
            E-Learning
          </h1>
        </Link>
      </div>
      {/* dark mode & user icons*/}
      <div className="flex items-center gap-8">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={user?.photoUrl || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="my-learning">My Learning</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="profile">Edit Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logoutHandler}>
                Log out
              </DropdownMenuItem>
              {user?.role == "instructor" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to="admin">Dashboard</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/login")}>Signup</Button>
          </div>
        )}
        <DarkMode />
      </div>
    </div>
  );
};

const MobileNavbar = ({ logoutHandler, user }) => {
  return (
    <>
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <div className="flex items-center gap-2">
          <School size={30} />
          <Link to="/">
            <h1 className="text-2xl">E-Learning</h1>
          </Link>
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
              <span>
                <Link to="my-learning">My Learning</Link>
              </span>
              <span>
                <Link to="profile">Edit Profile</Link>
              </span>
              <p onClick={logoutHandler}>Log out</p>
            </nav>
            {user?.role == "instructor" && (
              <SheetFooter>
                <SheetClose asChild>
                  <Link to="admin">
                    <Button className="w-full" type="submit">
                      DashBoard
                    </Button>
                  </Link>
                </SheetClose>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
