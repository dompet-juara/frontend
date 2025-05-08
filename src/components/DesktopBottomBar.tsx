function DesktopBottomBar() {
    const year = new Date().getFullYear();
  
    return (
      <div className="text-center text-muted py-3">
        Dompet Jaura © {year}
      </div>
    );
  }
  
  export default DesktopBottomBar;
  