import Image from "next/image";

export function Header() {
  return (
    <header>
      <div className="bg-black w-full">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Image
              src="/magalu-logo.png"
              alt="Magalu"
              width={120}
              height={32}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      <div
        className="h-[5px] w-full"
        style={{
          background:
            "linear-gradient(90deg, yellow, orange, red, indigo, violet, blue, green)",
        }}
      />
    </header>
  );
}
