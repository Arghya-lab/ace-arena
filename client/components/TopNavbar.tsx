import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import SocketConnectSignal from "./SocketConnectSignal";
import ThemeSwitch from "./ThemeSwitch";
import { Button } from "./ui/button";
import { TypographyH4 } from "./ui/typography";

function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-[55px] max-w-screen-2xl items-center justify-between">
        <Link href="/home" className="flex items-center gap-2">
          <Image
            src="/favicon-32x32.png"
            alt="Ace Arena"
            className="h-8 w-8"
            height={48}
            width={48}
          />
          <TypographyH4 className="font-semibold">Ace Arena</TypographyH4>
        </Link>
        <div className="flex items-center gap-3">
          <SocketConnectSignal />
          <ThemeSwitch />
          <SignedOut>
            <Button variant="ghost">
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <div className="flex h-8 w-8 items-center justify-center">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
