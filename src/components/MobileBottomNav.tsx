function MobileBottomNav() {
  return (
    <>
      <section className="fixed bottom-0 left-0 w-full bg-gray-300 border-t flex justify-between md:hidden px-4 py-3 z-50">
        <button className="flex-1 text-center text-sm text-gray-700 hover:text-blue-500">
          Home
        </button>
        <button className="flex-1 text-center text-sm text-gray-700 hover:text-blue-500">
          Search
        </button>
        <button className="flex-1 text-center text-sm text-gray-700 hover:text-blue-500">
          Alerts
        </button>
        <button className="flex-1 text-center text-sm text-gray-700 hover:text-blue-500">
          Profile
        </button>
      </section>
    </>
  );
}

export default MobileBottomNav;
