function DesktopBottomBar() {
    const year = new Date().getFullYear();
  
    return (
      <div className="text-center text-gray-500 py-4 text-sm border-t border-gray-200 bg-white">
        Dompet Juara &copy; {year}
      </div>
    );
  }
  
  export default DesktopBottomBar;