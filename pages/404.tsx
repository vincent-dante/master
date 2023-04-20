import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto py-5 px-3 text-gray-700 lg:px-10 xl:px-20">
      <h1 className="my-5 text-center">404 - Page Not Found</h1>
      <div className="text-center">
        <Link href="/">
          <span className="background-secondary mb-5 rounded-md px-2 py-1 text-white">
            Go back home
          </span>
        </Link>
      </div>
    </div>
  );
}
