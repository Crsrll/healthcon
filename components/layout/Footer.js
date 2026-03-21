export default function Footer() {
  return (
    <footer className="bg-white-800 text-black py-4 mt-auto">
      <div className="container mx-auto text-center text-black-300">
        &copy; {new Date().getFullYear()} Healthcon. All rights reserved.
      </div>
    </footer>
  );
}